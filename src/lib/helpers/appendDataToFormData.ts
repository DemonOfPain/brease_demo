export const appendDataToFormData = (
  data: any,
  formData: FormData,
  reqMethod: 'PUT' | 'PATCH' | 'POST' | 'DELETE',
  options?: {
    arrayFormat?: 'brackets' | 'json'
  }
) => {
  if (reqMethod) {
    formData.append('_method', reqMethod)
  }
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value, value.name)
    } else if (value instanceof FileList) {
      // Append all files from FileList
      Array.from(value).forEach((file, index) => {
        formData.append(`${key}[${index}]`, file, file.name)
      })
    } else if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0')
    } else if (Array.isArray(value) && options?.arrayFormat === 'brackets') {
      // Handle arrays with [] notation
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item))
      })
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      // Convert null to empty string, otherwise convert to String
      formData.append(key, value === null ? '' : String(value))
    }
  })
}
