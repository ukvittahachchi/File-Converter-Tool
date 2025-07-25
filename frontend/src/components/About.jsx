import { Box, Typography, Container } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        About File Converter Pro
      </Typography>
      <Typography paragraph>
        Our tool helps you convert files between different formats quickly and easily.
      </Typography>
      <Typography paragraph>
        Supported conversions: Images (JPG, PNG, GIF, WEBP), Documents (DOC/DOCX to PDF)
      </Typography>
    </Container>
  );
};

export default About;