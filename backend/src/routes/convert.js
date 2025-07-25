const express = require('express')
const router = express.Router()
const { convertFile } = require('../utils/filehandler')
const path = require('path')

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

router.post('/', async (req, res) => {
  try {
    // Validate file exists
    if (!req.files || !req.files.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        userMessage: 'Please select a file to convert'
      })
    }

    const { targetFormat } = req.body
    const file = req.files.file

    // Validate file type
    if (!SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Unsupported file type',
        userMessage: `File type ${file.mimetype} is not supported`,
        supportedTypes: SUPPORTED_MIME_TYPES
      })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File too large',
        userMessage: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        maxSize: MAX_FILE_SIZE
      })
    }

    // Validate target format
    const ext = path.extname(file.name).toLowerCase().substring(1)
    if (ext === targetFormat) {
      return res.status(400).json({
        error: 'Same target format',
        userMessage: 'Source and target formats are the same'
      })
    }

    const convertedFile = await convertFile(file, targetFormat)
    
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename=converted.${targetFormat}`)
    res.send(convertedFile)
  } catch (error) {
    console.error('Conversion error:', error)
    
    const userMessage = error.message.includes('Unsupported') 
      ? error.message 
      : 'Failed to convert file. Please try again.'
      
    res.status(500).json({ 
      error: error.message,
      userMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

module.exports = router