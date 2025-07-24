const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const visitRouter = require('./routes/visitRoutes');
const userRouter = require('./routes/userRoutes');
const ruleRouter = require('./routes/ruleRoutes');
const authRouter = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
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
app.use('/api/v1/rule', authMiddleware, ruleRouter);
app.use('/api/v1/visit', authMiddleware, visitRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = app;
