import express from 'express';
import cors from 'cors';
import serverConfig from './src/config/serverConfig.js';
import connectDB from './src/config/dbConfig.js';
import morgan from 'morgan';
import apiRouter from './src/routes/apiRouter.js';
import cookieParser from 'cookie-parser';

const app = express();

// Allowed frontend URLs
app.use(cors({
  origin: 'http://localhost:5173', // frontend dev URL
  credentials: true,               // important for cookies
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

// Health check
app.get('/ping', (req, res) => {
    return res.json({ message: "pong" });
});

// Start server
app.listen(serverConfig.PORT, async () => {
    await connectDB();
    console.log(`Server started at port ${serverConfig.PORT}`);
});
