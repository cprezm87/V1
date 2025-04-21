/**
 * Compresses an image data URL to reduce its size
 * @param dataUrl The original data URL
 * @param maxWidth Maximum width of the compressed image
 * @param maxHeight Maximum height of the compressed image
 * @param quality Compression quality (0-1)
 * @returns A promise that resolves to the compressed data URL
 */
export const compressImageDataUrl = (
  dataUrl: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas")

        // Calculate new dimensions
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round(height * (maxWidth / width))
            width = maxWidth
          } else {
            width = Math.round(width * (maxHeight / height))
            height = maxHeight
          }
        }

        // Set canvas dimensions and draw image
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // Get compressed image
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image for compression"))
      }

      img.src = dataUrl
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Checks if a string is likely to be a data URL
 * @param str The string to check
 * @returns True if the string appears to be a data URL
 */
export const isDataUrl = (str: string): boolean => {
  return str?.startsWith("data:")
}

/**
 * Estimates the size of a string in bytes
 * @param str The string to measure
 * @returns The approximate size in bytes
 */
export const estimateStringSize = (str: string): number => {
  return new Blob([str]).size
}

/**
 * Truncates a data URL to a maximum length
 * @param dataUrl The data URL to truncate
 * @param maxLength Maximum length in characters
 * @returns The truncated data URL
 */
export const truncateDataUrl = (dataUrl: string, maxLength = 1000): string => {
  if (!dataUrl || dataUrl.length <= maxLength) return dataUrl

  // Keep the metadata part intact
  const metaEndIndex = dataUrl.indexOf(",") + 1
  const metadata = dataUrl.substring(0, metaEndIndex)

  // Truncate the data part
  const availableLength = maxLength - metadata.length - 12 // 12 for "[truncated]"
  const truncated = dataUrl.substring(metaEndIndex, metaEndIndex + availableLength)

  return metadata + truncated + "[truncated]"
}
