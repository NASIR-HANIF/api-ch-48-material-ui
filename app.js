const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const multer = require("multer");
const Multer = multer();

const notesRouter = require('./routes/notes');
const usersRouter = require('./routes/users');
const forgotRouter = require('./routes/forgot');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const verifyTokenRouter = require('./routes/verify-token');
const revenueUpdatesRouter = require('./routes/revenue-updates');
const dummyRouter = require('./routes/dummy');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const allowedOrigins = [
  '*',
  'https://localhost:8000',
];

// Function to check if the origin is allowed
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use('/notes', notesRouter);
app.use("/dummy",dummyRouter);
app.use('/users', usersRouter);
app.use('/signup',Multer.none(),signupRouter);
app.use('/login',Multer.none(),loginRouter);
app.use('/forgot-password',Multer.none(),forgotRouter);
app.use('/logout',logoutRouter);
app.use('/verify-token',verifyTokenRouter);
app.use('/revenue-updates',revenueUpdatesRouter);


// Home route
app.get("/", (req, res) => {
  res.status(200).send({ message: "welcome mui dashboard" });
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
  res.render('error');
});

module.exports = app;
