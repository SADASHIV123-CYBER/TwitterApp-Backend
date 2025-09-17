import express from 'express';
import cors from 'cors';
import serverConfig from './src/config/serverConfig.js';
import connectDB from './src/config/dbConfig.js';
import morgan from 'morgan';
import apiRouter from './src/routes/apiRouter.js';
import cookieParser from 'cookie-parser';

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
    "http://localhost:5173",
    "https://yourfrontend.onrender.com" // production frontend
];

// Enable CORS
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // allow REST clients like Postman
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error("Not allowed by CORS"), false);
        }
        return callback(null, true);
    },
    credentials: true, // allow cookies
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
