import { useState, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
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
  useTheme,
  Fade,
  Grow,
  Slide,
  Zoom,
  Paper,
  Avatar
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, CloudUpload, InsertDriveFile, PictureAsPdf, Description } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function FileUploader() {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('png');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const filePreview = useMemo(() => {
    if (!file) return null;
    
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const isDoc = [
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.type);

    return {
      url,
      type: isImage ? 'image' : isPDF ? 'pdf' : isDoc ? 'doc' : 'other',
      cleanup: () => URL.revokeObjectURL(url)
    };
  }, [file]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: acceptedFiles => {
      if (filePreview) filePreview.cleanup();
      setFile(acceptedFiles[0]);
      setDownloadUrl(null);
      setError(null);
      setValidationError(null);
      setConversionComplete(false);
    },
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setValidationError('File is too large (max 10MB)');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setValidationError('File type not supported');
      }
      setSnackbarOpen(true);
    }
  });

  const supportedFormats = {
    'image/jpeg': ['png', 'jpg', 'webp', 'gif'],
    'image/png': ['jpg', 'png', 'webp', 'gif'],
    'image/gif': ['png', 'jpg', 'webp'],
    'image/webp': ['png', 'jpg', 'gif'],
    'application/pdf': ['pdf'],
    'application/msword': ['pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['pdf']
  };

  const availableTargetFormats = file ? 
    (supportedFormats[file.type] || ['pdf']) : 
    ['png'];

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    setProgress(0);
    setError(null);
    setConversionComplete(false);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setProgress(100);

      // In a real app, you would get the blob from the API response
      const blob = new Blob([file], { type: file.type });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setConversionComplete(true);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message || 'Conversion failed');
      setSnackbarOpen(true);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    return () => {
      if (filePreview) filePreview.cleanup();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [filePreview, downloadUrl]);

  const FileIcon = ({ type }) => {
    switch(type) {
      case 'pdf': return <PictureAsPdf sx={{ fontSize: 60, color: theme.palette.error.main }} />;
      case 'doc': return <Description sx={{ fontSize: 60, color: theme.palette.info.main }} />;
      default: return <InsertDriveFile sx={{ fontSize: 60, color: theme.palette.text.secondary }} />;
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: { xs: 2, md: 4 },
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`
    }}>
      <Grow in={true} timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              letterSpacing: '1px'
            }}
          >
            File Converter
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Transform your files effortlessly with our lightning-fast conversion tool
          </Typography>
        </Box>
      </Grow>

      <Slide in={true} direction="up" timeout={500}>
        <Card 
          variant="outlined" 
          sx={{ 
            p: 3,
            borderRadius: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)' 
              : 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
            border: 'none',
            position: 'relative',
            overflow: 'visible',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: 'inherit',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              zIndex: -1,
              opacity: 0,
              transition: 'opacity 0.3s ease'
            },
            '&:hover:before': {
              opacity: 0.3
            }
          }}
        >
          <Box 
            {...getRootProps()} 
            sx={{ 
              p: 4, 
              border: '2px dashed', 
              borderColor: isHovered ? theme.palette.primary.main : theme.palette.divider,
              borderRadius: 3,
              textAlign: 'center',
              cursor: 'pointer',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <input {...getInputProps()} />
            <Zoom in={!file} timeout={500}>
              <Box>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    animation: `${float} 3s ease-in-out infinite`
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Drag & drop files here
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  or click to browse your files
                </Typography>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    display: 'inline-block', 
                    px: 2, 
                    py: 1, 
                    borderRadius: 20,
                    background: theme.palette.action.selected,
                    animation: `${pulse} 2s infinite`
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Supported: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX
                  </Typography>
                </Paper>
              </Box>
            </Zoom>
          </Box>

          {fileRejections.length > 0 && (
            <Fade in={fileRejections.length > 0}>
              <Alert 
                severity="error" 
                sx={{ mt: 2, borderRadius: 3 }}
                onClose={() => setValidationError(null)}
              >
                {validationError || 'File was rejected'}
              </Alert>
            </Fade>
          )}

          {file && (
            <Fade in={!!file}>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    mr: 2,
                    background: theme.palette.action.selected
                  }}>
                    {filePreview?.type === 'image' ? (
                      <CardMedia
                        component="img"
                        image={filePreview.url}
                        alt="File preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <FileIcon type={filePreview?.type} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(file.size / 1024)} KB
                    </Typography>
                  </Box>
                </Box>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Convert to</InputLabel>
                  <Select
                    value={targetFormat}
                    label="Convert to"
                    onChange={(e) => setTargetFormat(e.target.value)}
                    disabled={isConverting}
                    sx={{
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
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
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        mb: 1
                      }}
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
                  <Zoom in={conversionComplete}>
                    <Alert 
                      icon={<CheckCircleIcon fontSize="inherit" />}
                      severity="success"
                      sx={{ 
                        mb: 2,
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.success.light}`
                      }}
                    >
                      Conversion complete! Ready to download.
                    </Alert>
                  </Zoom>
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
                    fontWeight: 700,
                    borderRadius: 3,
                    fontSize: 16,
                    letterSpacing: '0.5px',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    },
                    '&:disabled': {
                      background: theme.palette.action.disabledBackground
                    }
                  }}
                >
                  {isConverting ? 'Converting...' : 'Convert Now'}
                </Button>

                {downloadUrl && (
                  <Zoom in={!!downloadUrl}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        mt: 2,
                        py: 1.5,
                        fontWeight: 700,
                        borderRadius: 3,
                        fontSize: 16,
                        letterSpacing: '0.5px',
                        background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                          background: `linear-gradient(45deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                      href={downloadUrl}
                      download={`converted.${targetFormat}`}
                      startIcon={<CheckCircleIcon />}
                    >
                      Download Converted File
                    </Button>
                  </Zoom>
                )}
              </Box>
            </Fade>
          )}
        </Card>
      </Slide>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          {error || 'Operation completed successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
}