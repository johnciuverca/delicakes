const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the main folder
app.use(express.static(path.join(__dirname, '../mainUI/src')));

// Serve images from assets folder
app.use('/assets', express.static(path.join(__dirname, '../mainUI/assets')));

// Serve the main page
app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../mainUI/src/index.html'));
});

// API routes
app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
});
