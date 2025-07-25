const sharp = require('sharp')
const path = require('path')
const libre = require('libreoffice-convert')
const { PDFDocument } = require('pdf-lib')
libre.convertAsync = require('util').promisify(libre.convert)

// Conversion strategies
const conversionStrategies = {
  // Image conversions
  image: async (buffer, targetFormat) => {
    return sharp(buffer)
      .toFormat(targetFormat)
      .toBuffer()
  },

  // DOC/DOCX to PDF
  document: async (buffer) => {
    return new Promise((resolve, reject) => {
      libre.convertAsync(buffer, '.pdf', undefined, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  },

  // Generic PDF operations (placeholder for future extensions)
  pdf: async (buffer) => {
    return buffer // Pass-through for now
  }
}

const getFileCategory = (ext) => {
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff']
  const documentExts = ['doc', 'docx', 'odt']
  const pdfExts = ['pdf']

  if (imageExts.includes(ext)) return 'image'
  if (documentExts.includes(ext)) return 'document'
  if (pdfExts.includes(ext)) return 'pdf'
  return null
}

const convertFile = async (file, targetFormat) => {
  const inputExt = path.extname(file.name).toLowerCase().substring(1)
  const category = getFileCategory(inputExt)
  
  if (!category) {
    throw new Error('Unsupported file type')
  }

  try {
    switch (category) {
      case 'image':
        if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(targetFormat)) {
          throw new Error('Unsupported target image format')
        }
        return await conversionStrategies.image(file.data, targetFormat)

      case 'document':
        if (targetFormat !== 'pdf') {
          throw new Error('Documents can only be converted to PDF')
        }
        return await conversionStrategies.document(file.data)

      default:
        throw new Error('Conversion not supported for this file type')
    }
  } catch (error) {
    console.error(`Conversion error (${category}):`, error)
    throw new Error(`Conversion failed: ${error.message}`)
  }
}

module.exports = { convertFile }