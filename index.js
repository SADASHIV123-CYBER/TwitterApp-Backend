// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './src/config/dbConfig.js';
import apiRouter from './src/routes/apiRouter.js';
import serverConfig from './src/config/serverConfig.js';

const app = express();

// disable etag to avoid 304 responses for API endpoints
app.disable('etag');

// Always send headers to prevent caching (helps avoid 304)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// ✅ CORS: allow both local + deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://twitter-app-frontend-taupe.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // allow cookies across origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

// Health check
app.get('/ping', (req, res) => {
  return res.json({ message: 'pong' });
});

// Start server
app.listen(serverConfig.PORT, async () => {
  await connectDB();
  console.log(
    `Server started at port ${serverConfig.PORT}  NODE_ENV=${process.env.NODE_ENV}`
  );
});
