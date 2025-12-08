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


// const expenseTrackerStatic = express.static(path.join(__dirname, '../expense-tracker/src'));
const expenseTrackerStatic = express.static(path.join(__dirname, '../expense-tracker/src'));

// Serve static files from the expense-tracker folder (CSS, JS, etc.)
app.use('/expense-tracker', (req, res, next) => {
      // res.redirect('/login');
      const authHeader = req.headers['x-auth-token'] || req.headers['authorization'];

      if (authHeader && authHeader === 'my-secret-token') {
            // User is authorized, serve the expense tracker
            expenseTrackerStatic(req, res, next);
      } else {
            // User is not authorized, redirect to login
            res.redirect('/login');
      }
});

// Serve login page     
app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, '../mainUI/src/pages/login.html'));
});

// API routes
// app.get('/api/health', (req, res) => {
//       res.json({ status: 'ok', message: 'Server is running' });
// });

// Start server
app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
});
