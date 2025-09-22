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

// Allowed frontends (add any other hosts you use)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://twitter-app-frontend-taupe.vercel.app',
  // add more if needed
];

function originIsAllowed(origin) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  // allow localhost variants in non-production
  if (process.env.NODE_ENV !== 'production' && /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/.test(origin)) {
    return true;
  }
  return false;
}

app.disable('etag');

// Prevent caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// CORS (must be before routes)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (originIsAllowed(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,             // ✅ required to send cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'], // ✅ expose Set-Cookie for debugging if needed
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// debug middleware (temporary — remove after debugging)
app.use('/api', (req, res, next) => {
  // log origin and incoming cookies for debugging only
  // console.log('[DEBUG] origin:', req.headers.origin, 'cookies:', req.cookies);
  next();
});

app.use('/api', apiRouter);

app.get('/ping', (req, res) => res.json({ message: 'pong' }));

app.listen(serverConfig.PORT, async () => {
  await connectDB();
  console.log(`Server started at port ${serverConfig.PORT}  NODE_ENV=${process.env.NODE_ENV}`);
});
