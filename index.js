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

/* ---------- Helpers ---------- */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://twitter-app-frontend-taupe.vercel.app',
  // add other frontend origins you use
];

function originIsAllowed(origin) {
  if (!origin) return false; // e.g. curl/postman may send no origin
  if (allowedOrigins.includes(origin)) return true;
  // allow localhost variants more flexibly during development
  if (process.env.NODE_ENV !== 'production' && /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/.test(origin)) {
    return true;
  }
  return false;
}

/* ---------- Middleware ---------- */
// disable etag to avoid 304
app.disable('etag');

// Prevent caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// CORS - must be before routes
app.use(
  cors({
    origin: (origin, callback) => {
      // log origin for debugging
      // console.log(`[CORS] request origin:`, origin);
      if (!origin) {
        // no origin (curl/postman) -> allow (or change to false if you want to block)
        return callback(null, true);
      }
      if (originIsAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // important to allow cookies
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
app.get('/ping', (req, res) => res.json({ message: 'pong' }));

// Start server
app.listen(serverConfig.PORT, async () => {
  await connectDB();
  console.log(`Server started at port ${serverConfig.PORT}  NODE_ENV=${process.env.NODE_ENV}`);
});
