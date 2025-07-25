import { CircularProgress } from '@mui/material'

export default function LoadingSpinner({ size = 40, thickness = 4 }) {
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      my: 4
    }}>
      <CircularProgress size={size} thickness={thickness} />
    </Box>
  )
}