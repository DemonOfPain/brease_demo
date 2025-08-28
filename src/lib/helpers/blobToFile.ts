export const blobToFile = (blob: Blob, fileName: string, fileType: string): File => {
  return new File([blob], `${fileName}.${fileType.split('/')[1]}`, {
    lastModified: Date.now(),
    type: fileType
  })
}
