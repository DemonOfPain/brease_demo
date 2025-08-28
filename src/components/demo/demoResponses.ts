export type DemoTrigger = 'semantic_search' | 'document_upload' | 'preview' | 'page_rename' | 'seo_update' | 'script_embed' | 'remove_content' | null

interface DemoResponse {
  trigger: DemoTrigger
  message: string
  changes?: any
}

const responses: Record<string, DemoResponse> = {
  semantic_search: {
    trigger: 'semantic_search',
    message: 'I found several matches for "John Doe" in your content. I\'m using semantic search to find the most relevant results even with variations in naming:',
    changes: {
      type: 'content_update',
      confidence: 0.95
    }
  },
  
  document_upload: {
    trigger: 'document_upload',
    message: 'I\'ll help you create a new page from your document. I\'ll convert your document into a single page with multiple content sections that will be added to your current site. You can upload Word documents, PDFs, or other text files.',
    changes: {
      type: 'page_creation'
    }
  },
  
  page_rename: {
    trigger: 'page_rename',
    message: 'I found the page you want to rename. Let me update the page name and URL for you.',
    changes: {
      type: 'page_rename'
    }
  },
  
  seo_update: {
    trigger: 'seo_update',
    message: 'I\'ll update the SEO settings for your page. This includes the page title, meta description, and keywords.',
    changes: {
      type: 'seo_update'
    }
  },
  
  script_embed: {
    trigger: 'script_embed',
    message: 'I\'ll add the tracking code to your site. This will be embedded in the appropriate section of your site template.',
    changes: {
      type: 'script_embed'
    }
  },
  
  remove_content: {
    trigger: 'remove_content',
    message: 'I found the content you want to remove. Let me show you what will be deleted:',
    changes: {
      type: 'content_removal'
    }
  },
  
  preview: {
    trigger: 'preview',
    message: 'Opening preview of pending changes...',
    changes: null
  }
}

export function getDemoResponse(input: string): DemoResponse | null {
  const lowerInput = input.toLowerCase()
  
  // Check for content removal triggers
  if (
    lowerInput.includes('remove') && 
    (lowerInput.includes('john') || lowerInput.includes('team') || lowerInput.includes('member'))
  ) {
    return responses.remove_content
  }
  
  // Check for semantic search triggers
  if (
    (lowerInput.includes('change') || lowerInput.includes('update')) && 
    (lowerInput.includes('john') || lowerInput.includes('bio') || lowerInput.includes('description'))
  ) {
    return responses.semantic_search
  }
  
  // Check for page rename triggers
  if (
    (lowerInput.includes('rename') && lowerInput.includes('contact')) ||
    (lowerInput.includes('change') && lowerInput.includes('contact') && lowerInput.includes('page')) ||
    lowerInput.includes('get in touch')
  ) {
    return responses.page_rename
  }
  
  // Check for SEO triggers
  if (
    lowerInput.includes('seo') || 
    lowerInput.includes('meta') ||
    lowerInput.includes('page title') ||
    lowerInput.includes('description')
  ) {
    return responses.seo_update
  }
  
  // Check for script embedding triggers
  if (
    lowerInput.includes('google analytics') || 
    lowerInput.includes('tracking') ||
    lowerInput.includes('script') ||
    lowerInput.includes('embed')
  ) {
    return responses.script_embed
  }
  
  // Check for document upload triggers
  if (
    lowerInput.includes('upload') || 
    lowerInput.includes('document') ||
    lowerInput.includes('create page from')
  ) {
    return responses.document_upload
  }
  
  // Check for preview triggers
  if (lowerInput.includes('preview') || lowerInput.includes('show changes')) {
    return responses.preview
  }
  
  return null
}