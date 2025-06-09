const express = require('express');
const morgan = require('morgan');

const visitRouter = require('./routes/visitRoutes');
const userRouter = require('./routes/userRoutes');
const ruleRouter = require('./routes/ruleRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/rule', ruleRouter);
app.use('/api/v1/visit', visitRouter);
app.use('/api/v1/user', userRouter);

module.exports = app;
