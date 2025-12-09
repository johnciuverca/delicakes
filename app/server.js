const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const knownCredentials = new Map([
      ['admin', '0000'],
      ['audit', '0000']
]);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the main folder
app.use(express.static(path.join(__dirname, '../mainUI/src')));

// Serve images from assets folder
app.use('/assets', express.static(path.join(__dirname, '../mainUI/assets')));

// Serve the main page
app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../mainUI/src/index.html'));
});


// const expenseTrackerStatic = express.static(path.join(__dirname, '../expense-tracker/src'));
const getExpenseTracker = express.static(path.join(__dirname, '../expense-tracker/src'));
const authCookie = '123-fake-auth-cookie';

app.post('/expense-tracker', (req, res) => {
      const reqAuthCookie = req.cookies ? req.cookies['auth'] : null;
      if (reqAuthCookie === authCookie) {
            res.status(200).json({
                  authCookie: authCookie
            })
            return;
      }

      const role = req.body.role;
      const inputPassword = req.body.psw;
      const realPassword = knownCredentials.get(role);

      if (inputPassword && inputPassword === realPassword) {
            res.status(200).json({
                  authCookie: authCookie
            })

            // Set auth cookie
            // res.cookie('auth', authCookie, { httpOnly: true });
            // getExpenseTracker(req, res, next);
      } else {
            // res.status(401).redirect('/login');
            res.status(401).json({ message: 'Unauthorized' });
            return;
      }
});

// Serve static files from the expense-tracker folder (CSS, JS, etc.)
app.use('/expense-tracker', (req, res, next) => {
      const reqAuthCookie = req.cookies ? req.cookies['auth'] : null;
      if (reqAuthCookie === authCookie) {
            getExpenseTracker(req, res, next);
            return;
      }
      res.redirect('/login');
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
