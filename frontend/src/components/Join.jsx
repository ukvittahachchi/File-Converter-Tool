import { useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Avatar,
  useTheme,
  Fade,
  Slide
} from '@mui/material';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';

const Join = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        pt: 8,
        pb: 6,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        <Container maxWidth="sm">
          <Slide direction="down" in={true} timeout={500}>
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: 4,
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
              p: 4,
              textAlign: 'center'
            }}>
              <Avatar sx={{ 
                mx: 'auto', 
                mb: 2, 
                bgcolor: theme.palette.primary.main,
                width: 60,
                height: 60
              }}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              
              <Typography variant="h4" component="h1" sx={{ 
                mb: 3,
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Join Zynvert
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Create your account to unlock all features
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '& fieldset': {
                            borderColor: '#e2e8f0'
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.light
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '& fieldset': {
                            borderColor: '#e2e8f0'
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.light
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '& fieldset': {
                            borderColor: '#e2e8f0'
                          },
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.light
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: 16,
                    fontWeight: 700,
                    textTransform: 'none',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)',
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  Sign Up
                </Button>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  By signing up, you agree to our{' '}
                  <Link to="/terms" style={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600
                  }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600
                  }}>
                    Privacy Policy
                  </Link>
                </Typography>
              </Box>
              
              <Divider sx={{ my: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#e2e8f0',
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: 'rgba(66, 133, 244, 0.04)'
                    }
                  }}
                >
                  Google
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#e2e8f0',
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: 'rgba(59, 89, 152, 0.04)'
                    }
                  }}
                >
                  Facebook
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<AppleIcon />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#e2e8f0',
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  Apple
                </Button>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 4 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600
                }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Slide>
        </Container>
      </Box>
    </Fade>
  );
};

export default Join;