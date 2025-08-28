import { useManagerStore } from '../hooks/useManagerStore'
import { useSiteStore } from '../hooks/useSiteStore'
import { useMediaStore } from '../hooks/useMediaStore'
import { useBuilderStore } from '../hooks/useBuilderStore'
import { appendDataToFormData } from './appendDataToFormData'

// eslint-disable-next-line no-unused-vars
type OperationFunction = (payload: any, targetUuid?: string, customUrl?: string) => Promise<any>

// Standard options for assistant operations
const ASSISTANT_OPTIONS = {
  throwOnError: true,
  showSuccessToast: false // Don't show success toasts for assistant operations
}

// Operation map structure: operationType -> targetType -> function
export const assistantOperationMap: Record<string, Record<string, OperationFunction>> = {
  CREATE: {
    // eslint-disable-next-line no-unused-vars
    ENTRY: async (payload: any, targetUuid?: string, customUrl?: string) => {
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'POST')
      await useManagerStore.getState().addEntry(formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    PAGE: async (payload: any, targetUuid?: string, customUrl?: string) => {
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'POST')
      await useSiteStore.getState().createPage(formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    PAGE_CONTENT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useBuilderStore.getState().syncSections(payload, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    NAVIGATION: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useSiteStore
        .getState()
        .addNavigation(JSON.stringify(payload), customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    NAVIGATION_ITEM: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useSiteStore.getState().addNavigationItem(payload, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    REDIRECT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'POST')
      await useSiteStore.getState().addRedirect(formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    }
  },
  UPDATE: {
    ENTRY: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for ENTRY UPDATE')
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'PUT')
      await useManagerStore
        .getState()
        .updateEntry(targetUuid, formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    ENTRY_CONTENT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useManagerStore.getState().syncContent(payload, false, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    PAGE: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for PAGE UPDATE')
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'PUT')
      await useSiteStore.getState().updatePage(formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    PAGE_CONTENT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useBuilderStore.getState().syncContent(payload, false, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    NAVIGATION: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for NAVIGATION UPDATE')
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'PUT')
      await useSiteStore
        .getState()
        .updateNavigation(targetUuid, formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    NAVIGATION_ITEM: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for NAVIGATION_ITEM UPDATE')
      await useSiteStore
        .getState()
        .updateNavigationItem(targetUuid, payload, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    REDIRECT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for REDIRECT UPDATE')
      const formData = new FormData()
      appendDataToFormData(payload, formData, 'PUT')
      await useSiteStore
        .getState()
        .updateRedirect(targetUuid, formData, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    }
  },
  DELETE: {
    // eslint-disable-next-line no-unused-vars
    ENTRY: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for ENTRY DELETE')
      await useManagerStore.getState().deleteEntry(targetUuid, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    PAGE: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for PAGE DELETE')
      await useSiteStore.getState().deletePage(targetUuid, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    PAGE_CONTENT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useBuilderStore.getState().syncSections(payload, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    NAVIGATION: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for NAVIGATION DELETE')
      await useSiteStore.getState().deleteNavigation(targetUuid, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    NAVIGATION_ITEM: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for NAVIGATION_ITEM DELETE')
      await useSiteStore.getState().deleteNavigationItem(targetUuid, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    MEDIUM: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for MEDIA DELETE')
      await useMediaStore.getState().delete(targetUuid, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    },
    // eslint-disable-next-line no-unused-vars
    REDIRECT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      if (!targetUuid) throw new Error('targetUuid is required for REDIRECT DELETE')
      await useSiteStore.getState().deleteRedirect(targetUuid, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    }
  },
  ORDER: {
    // eslint-disable-next-line no-unused-vars
    ENTRY: async (payload: any, targetUuid?: string, customUrl?: string) => {
      const result = await useManagerStore
        .getState()
        .syncEntries(payload, customUrl, ASSISTANT_OPTIONS)
      if (!result.ok) {
        throw new Error(result.message || 'Reorder entries failed')
      }
      return result
    },
    // eslint-disable-next-line no-unused-vars
    PAGE_CONTENT: async (payload: any, targetUuid?: string, customUrl?: string) => {
      await useBuilderStore.getState().syncSections(payload, customUrl, ASSISTANT_OPTIONS)
      return { success: true }
    }
  }
}

// Helper function to execute an operation
export const executeOperation = async (
  operationType: string,
  targetType: string,
  payload: any,
  targetUuid?: string,
  customUrl?: string
): Promise<any> => {
  try {
    const operationMap = assistantOperationMap[operationType]
    if (!operationMap) {
      const error = `Unknown operation type: ${operationType}`
      console.error(error)
      throw new Error(`Operation not supported`)
    }

    const operation = operationMap[targetType]
    if (!operation) {
      const error = `Unknown target type: ${targetType} for operation: ${operationType}`
      console.error(error)
      throw new Error(`Operation not available for this resource type`)
    }
    //console.log(operationType, targetType, targetUuid, payload)
    return await operation(payload, targetUuid, customUrl)
  } catch (error) {
    console.error('Operation execution failed:', {
      operationType,
      targetType,
      targetUuid,
      error: error instanceof Error ? error.message : error
    })

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Operation failed. Please try again.')
  }
}
