import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material'; // Add this import
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import About from './components/About';
import Join from './components/Join';
import Bgimage from './components/Bgimage';

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<FileUploader />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          <Route path="Bgimage" element={<Bgimage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;