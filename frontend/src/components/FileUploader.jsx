import { useState, useMemo, useEffect } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useDropzone } from 'react-dropzone'
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardMedia,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function FileUploader() {
  const theme = useTheme()
  const [file, setFile] = useState(null)
  const [targetFormat, setTargetFormat] = useState('png')
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const [conversionComplete, setConversionComplete] = useState(false)

  const filePreview = useMemo(() => {
    if (!file) return null
    
    const url = URL.createObjectURL(file)
    const isImage = file.type.startsWith('image/')
    const isPDF = file.type === 'application/pdf'
    const isDoc = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)

    return {
      url,
      type: isImage ? 'image' : isPDF ? 'pdf' : isDoc ? 'doc' : 'other',
      cleanup: () => URL.revokeObjectURL(url)
    }
  }, [file])

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: acceptedFiles => {
      if (filePreview) filePreview.cleanup()
      setFile(acceptedFiles[0])
      setDownloadUrl(null)
      setError(null)
      setValidationError(null)
      setConversionComplete(false)
    },
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setValidationError('File is too large (max 10MB)')
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setValidationError('File type not supported')
      }
      setSnackbarOpen(true)
    }
  })

  const supportedFormats = {
    'image/jpeg': ['png', 'jpg', 'webp', 'gif'],
    'image/png': ['jpg', 'png', 'webp', 'gif'],
    'image/gif': ['png', 'jpg', 'webp'],
    'image/webp': ['png', 'jpg', 'gif'],
    'application/pdf': ['pdf'],
    'application/msword': ['pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['pdf']
  }

  const availableTargetFormats = file ? 
    (supportedFormats[file.type] || ['pdf']) : 
    ['png']

  const handleConvert = async () => {
    if (!file) return
    
    setIsConverting(true)
    setProgress(0)
    setError(null)
    setConversionComplete(false)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('targetFormat', targetFormat)

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev))
      }, 300)

      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.userMessage || errorData.error || 'Conversion failed')
      }

      clearInterval(interval)
      setProgress(100)

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setDownloadUrl(url)
      setConversionComplete(true)
    } catch (err) {
      console.error('Conversion error:', err)
      let errorMsg = err.message
      if (err.message.includes('Failed to fetch')) {
        errorMsg = 'Server unavailable. Please try again later.'
      }
      setError(errorMsg)
      setSnackbarOpen(true)
    } finally {
      setIsConverting(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (filePreview) filePreview.cleanup()
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
    }
  }, [filePreview, downloadUrl])

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          color: theme.palette.primary.main,
          textAlign: 'center',
          fontWeight: 600
        }}
      >
        File Converter
      </Typography>

      <Card 
        variant="outlined" 
        sx={{ 
          p: 3,
          borderRadius: 4,
          boxShadow: theme.shadows[3],
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box 
          {...getRootProps()} 
          sx={{ 
            p: 4, 
            border: '2px dashed', 
            borderColor: theme.palette.primary.main,
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: theme.palette.action.hover,
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.action.selected
            }
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="h6">Drag & drop a file here</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            or click to browse your files
          </Typography>
          <Typography variant="caption" color="text.secondary" mt={2} display="block">
            Supported formats: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX (max 10MB)
          </Typography>
        </Box>

        {fileRejections.length > 0 && (
          <Alert 
            severity="error" 
            sx={{ mt: 2 }}
            onClose={() => setValidationError(null)}
          >
            {validationError || 'File was rejected'}
          </Alert>
        )}

        {file && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected File: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
            </Typography>

            {filePreview && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview:
                </Typography>
                {filePreview.type === 'image' && (
                  <CardMedia
                    component="img"
                    image={filePreview.url}
                    alt="File preview"
                    sx={{ 
                      maxHeight: 200,
                      width: 'auto',
                      mx: 'auto',
                      borderRadius: 1,
                      boxShadow: theme.shadows[2]
                    }}
                  />
                )}
                {filePreview.type === 'pdf' && (
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover' }}>
                    <Typography variant="h6">PDF File</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {file.name}
                    </Typography>
                  </Card>
                )}
                {filePreview.type === 'doc' && (
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'action.hover' }}>
                    <Typography variant="h6">Document File</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {file.name}
                    </Typography>
                  </Card>
                )}
              </Box>
            )}

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Convert to</InputLabel>
              <Select
                value={targetFormat}
                label="Convert to"
                onChange={(e) => setTargetFormat(e.target.value)}
                disabled={isConverting}
              >
                {availableTargetFormats.map(format => (
                  <MenuItem key={format} value={format}>
                    {format.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isConverting && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  color="secondary"
                />
                <Typography 
                  variant="caption" 
                  display="block" 
                  textAlign="center"
                  color="text.secondary"
                >
                  Converting... {progress}%
                </Typography>
              </Box>
            )}

            {conversionComplete && (
              <Alert 
                icon={<CheckCircleIcon fontSize="inherit" />}
                severity="success"
                sx={{ mb: 2 }}
              >
                Conversion complete!
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleConvert}
              disabled={!file || isConverting}
              size="large"
              startIcon={isConverting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                py: 1.5,
                fontWeight: 600,
                '&:disabled': {
                  backgroundColor: theme.palette.action.disabledBackground
                }
              }}
            >
              {isConverting ? 'Converting...' : 'Convert File'}
            </Button>

            {downloadUrl && (
              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  fontWeight: 600,
                  color: 'success.main',
                  borderColor: 'success.main',
                  '&:hover': {
                    borderColor: 'success.dark'
                  }
                }}
                href={downloadUrl}
                download={`converted.${targetFormat}`}
                startIcon={<CheckCircleIcon />}
              >
                Download Converted File
              </Button>
            )}
          </Box>
        )}
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}