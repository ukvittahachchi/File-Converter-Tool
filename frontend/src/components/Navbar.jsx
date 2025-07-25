import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider,
  Grow,
  Slide,
  Fade,
  Avatar,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [convertAnchorEl, setConvertAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConvertMenuOpen = (event) => {
    setConvertAnchorEl(event.currentTarget);
  };

  const handleConvertMenuClose = () => {
    setConvertAnchorEl(null);
  };

  // Add scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  return (
    <Slide direction="down" in={!isScrolled} mountOnEnter unmountOnExit>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          color: '#2d3748',
          boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
          py: 1,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          maxWidth: 'xl',
          mx: 'auto',
          width: '100%',
          px: { xs: 2, md: 6 }
        }}>
          {/* Left side - Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src="/logo.png" // Replace with your logo path
              alt="Zynvert Logo"
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                animation: `${pulse} 4s infinite`,
                '&:hover': {
                  transform: 'rotate(15deg)',
                  transition: 'transform 0.3s ease'
                }
              }}
            />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{
                fontWeight: 800,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: -0.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                }
              }}
            >
              Zynvert
            </Typography>

            {!isMobile && (
              <Button
                color="inherit"
                endIcon={<ExpandMoreIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />}
                onClick={handleConvertMenuOpen}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#4a5568',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'transparent',
                    '& svg': {
                      transform: 'rotate(180deg)'
                    }
                  }
                }}
              >
                Tools
              </Button>
            )}
          </Box>

          {/* Right side - Navigation */}
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  color: '#4a5568',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s ease'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 3,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                TransitionComponent={Grow}
              >
                <MenuItem 
                  onClick={handleMenuClose} 
                  component={Link} 
                  to="/"
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                      transform: 'translateX(5px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Home
                </MenuItem>
                <MenuItem 
                  onClick={handleConvertMenuOpen}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                      transform: 'translateX(5px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Tools <ExpandMoreIcon fontSize="small" sx={{ ml: 'auto' }} />
                </MenuItem>
                <Menu
                  anchorEl={convertAnchorEl}
                  open={Boolean(convertAnchorEl)}
                  onClose={handleConvertMenuClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  PaperProps={{
                    sx: {
                      ml: 0.5,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      borderRadius: 3
                    }
                  }}
                  TransitionComponent={Grow}
                >
                  <MenuItem 
                    onClick={handleConvertMenuClose}
                    sx={{ 
                      py: 1.5, 
                      minWidth: 180,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected
                      }
                    }}
                  >
                    PDF Tools
                  </MenuItem>
                  <MenuItem 
                    onClick={handleConvertMenuClose}
                    sx={{ 
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected
                      }
                    }}
                  >
                    Image Tools
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem 
                    onClick={handleConvertMenuClose}
                    sx={{ 
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected
                      }
                    }}
                  >
                    Video Tools
                  </MenuItem>
                </Menu>
                <MenuItem 
                  onClick={handleMenuClose} 
                  component={Link} 
                  to="/about"
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                      transform: 'translateX(5px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  About
                </MenuItem>
                <MenuItem 
                  onClick={handleMenuClose} 
                  component={Link} 
                  to="/join"
                  sx={{ 
                    py: 1.5, 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      transform: 'translateX(5px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Join Now
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Menu
                anchorEl={convertAnchorEl}
                open={Boolean(convertAnchorEl)}
                onClose={handleConvertMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 2,
                    minWidth: 220,
                    borderRadius: 3,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                TransitionComponent={Grow}
              >
                <MenuItem 
                  onClick={handleConvertMenuClose}
                  sx={{ 
                    py: 1.5, 
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                      paddingLeft: '20px',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  PDF Tools
                </MenuItem>
                <MenuItem 
                  onClick={handleConvertMenuClose}
                  sx={{ 
                    py: 1.5, 
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                      paddingLeft: '20px',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Image Tools
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem 
                  onClick={handleConvertMenuClose}
                  sx={{ 
                    py: 1.5, 
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                      paddingLeft: '20px',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Video Tools
                </MenuItem>
              </Menu>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/about"
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#4a5568',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'transparent',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                About
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/join"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: 15,
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
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
                Join Now
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default Navbar;