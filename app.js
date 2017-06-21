const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const config = require('./config/database')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

//DB stuff
mongoose.connect(config.database)
let db = mongoose.connection

//checking connection
db.on('open', ()=>{
  console.log('Connected')
})

//checking for db errors
db.on('error', function(err){
  console.log(err)
})


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3',
  resave: true,
  saveUninitialized: true
}))

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//passport config
require('./config/passport')(passport)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next)=>{
   res.locals.user = req.user || null
   next()
})


let index = require('./routes/index');
let talent = require('./routes/talent');
let company = require('./routes/company');
let thanks = require('./routes/thanks');
let admin = require('./routes/admin');

app.use('/', index);
app.use('/talent', talent);
app.use('/company', company);
app.use('/thanks', thanks);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
