import { Media, MediaMimeGroup } from '@/interface/media'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import { MEDIA_LIB_ALLOWED_MIME_TYPES } from '@/components/media-library/MEDIA_LIB_ALLOWED_MIME_TYPES'

export interface ProcessedFile {
  uuid: string
  name: string
  type: string
  mimeGroup: MediaMimeGroup
  publicUrl: string
  encodedData?: string // For PDFs that need base64 encoding for AI analysis
  size: number
}

/**
 * Check if a file type is valid for AI agent processing
 * Only images and PDFs are supported
 */
function isValidAgentFileType(mimeType: string): boolean {
  // Must be in allowed media library types
  if (!MEDIA_LIB_ALLOWED_MIME_TYPES.includes(mimeType)) {
    return false
  }

  // Exclude archive types
  const archiveTypes = ['zip', 'rar', 'tar', 'gzip', '7z']
  if (archiveTypes.some((archiveType) => mimeType.includes(archiveType))) {
    return false
  }

  // Exclude video and audio types (cannot be meaningfully processed by agents)
  if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
    return false
  }

  // Only allow images and PDFs
  return mimeType.startsWith('image/') || mimeType === 'application/pdf'
}

/**
 * Process files for OpenRouter agents
 * - Images: Store public URL for direct access
 * - PDFs: Store both public URL and base64 encoded data for OpenRouter processing
 * - Other file types: Filtered out with warning
 */
export async function processFilesForAgents(files: File[]): Promise<ProcessedFile[]> {
  const processedFiles: ProcessedFile[] = []
  const mediaStore = useMediaStore.getState()

  for (const file of files) {
    try {
      // Validate file type for agent processing
      if (!isValidAgentFileType(file.type)) {
        console.warn(
          `Skipping file ${file.name}: File type '${file.type}' is not supported. Only images and PDFs can be processed by AI agents.`
        )
        continue
      }

      // Upload file to media library
      const formData = new FormData()
      formData.append('file', file, file.name)

      const uploadResponse = await mediaStore.upload(formData, undefined, {
        showSuccessToast: false,
        throwOnError: true
      })

      if (uploadResponse.ok && uploadResponse.data?.medium) {
        const medium: Media = uploadResponse.data.medium
        const mimeGroup = getMimeGroup(file.type)

        const processedFile: ProcessedFile = {
          uuid: medium.uuid,
          name: medium.name,
          type: file.type,
          mimeGroup,
          publicUrl: medium.path,
          size: file.size
        }

        // For PDFs, encode the data for AI analysis
        if (mimeGroup === MediaMimeGroup.document) {
          processedFile.encodedData = await encodeFileToBase64(file)
        }

        processedFiles.push(processedFile)
      }
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error)
      throw error // Fail the entire operation instead of continuing
    }
  }

  return processedFiles
}

/**
 * Encode file to base64 for OpenRouter
 */
async function encodeFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Get MIME group from MIME type
 * Now only handles images and PDFs
 */
function getMimeGroup(mimeType: string): MediaMimeGroup {
  // Check if the MIME type is allowed for agents
  if (!isValidAgentFileType(mimeType)) {
    throw new Error(
      `File type '${mimeType}' is not supported. Only images and PDFs can be processed by AI agents.`
    )
  }

  if (mimeType.startsWith('image/')) {
    return MediaMimeGroup.image
  }

  // Only PDF documents are allowed
  if (mimeType === 'application/pdf') {
    return MediaMimeGroup.document
  }

  // This should never be reached due to validation above
  throw new Error(`Unexpected file type: ${mimeType}`)
}

/**
 * Build OpenRouter message content with processed files
 */
export function buildMessageContentWithFiles(
  textContent: string,
  processedFiles: ProcessedFile[]
): any[] {
  const content: any[] = [
    {
      type: 'text',
      text: textContent
    }
  ]

  for (const file of processedFiles) {
    if (file.mimeGroup === MediaMimeGroup.image) {
      // For images, use the public URL directly
      content.push({
        type: 'image_url',
        image_url: {
          url: file.publicUrl
        }
      })
    } else if (file.mimeGroup === MediaMimeGroup.document) {
      // For PDFs, include the base64 content (guaranteed to exist)
      content.push({
        type: 'file',
        file: {
          filename: file.name,
          file_data: `data:${file.type};base64,${file.encodedData}`
        }
      })
    }
  }

  return content
}
