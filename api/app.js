require('dotenv-flow').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const models = require('./models');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, `/uploads`)));
console.log(`Uploads directory set to: ${path.join(__dirname, `/uploads`)}`);


app.use('/', indexRouter);

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

let port = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') ? 3000 : 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`${process.env.TITLE} listening on ${port}!`);
});

module.exports = app;
