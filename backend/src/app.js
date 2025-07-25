const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const convertRoutes = require('./routes/convert');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true
}));

// Routes
app.use('/api/convert', convertRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

module.exports = app;