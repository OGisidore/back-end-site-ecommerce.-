var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require("./routes/product.route")
var postRouter = require("./routes/post.route")
var userRouter = require("./routes/user.route")
var categoryRouter = require("./routes/category.route")
var cors = require('cors');


var app = express();


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.DATABASE); 
}

 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
// app.use(express.json({ limit: '10mb' })); // Par exemple, 10 Mo
// app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
  
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }

//   next();
// });

// app.get('/', (req, res) => {
//   res.send('CORS is configured manually!');
// });

// app.listen(5000, () => {
//   console.log('Server running on port 500');
// });
var corsOptions = {
  origin: 'http://localhost:3000', // Autoriser uniquement ce domaine
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRouter)
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)
app.use('/api/categories', categoryRouter)


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
  res.json({
    'error' : err.message                 
  })
});

module.exports = app;
