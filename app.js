var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userModelRouter = require('./routes/userModel');
var feedbackRouter = require('./routes/feedback');
var swapReqRouter = require('./routes/swapReq');

var app = express();

// Connect to MongoDB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/userModel', userModelRouter);
app.use('/feedback', feedbackRouter);
app.use('/swapReq', swapReqRouter);

// JWT Authentication middleware for protected routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.redirect('/login');
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
};

// Page Routes
app.get('/home', async (req, res) => {
  try {
    const User = require('./Models/User');
    const users = await User.find({ isPublicProfile: true }).select('-password -email').limit(20);
    res.render('home', { 
      title: 'Home',
      users: users
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('home', { 
      title: 'Home',
      users: []
    });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'Login'
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', { 
    title: 'Sign Up'
  });
});

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const User = require('./Models/User');
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.redirect('/login');
    }
    res.render('profile', { 
      title: 'Profile',
      user: user
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.redirect('/login');
  }
});

app.get('/requests', authenticateToken, (req, res) => {
  res.render('requests', { 
    title: 'Requests'
  });
});

app.get('/send-request', authenticateToken, (req, res) => {
  res.render('send-request', { 
    title: 'Send Request'
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { 
    title: 'Error',
    message: err.message || 'Something went wrong',
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
