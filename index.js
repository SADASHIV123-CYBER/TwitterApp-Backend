import express from 'express'
import serverConfig from './src/config/serverConfig.js';
// import connectDB from './src/config/dbConfig.js';
import connectDB from './src/config/dbConfig.js'
import morgan from 'morgan';
import apiRouter from './src/routes/apiRouter.js'
import cookieParser from 'cookie-parser';
const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded( {extended: true} ));
app.use(morgan('dev'))


app.use('/api', apiRouter)

app.get('/ping', (req, res) => {
    return res.json({
        message: "pong"
    })
})

app.listen(serverConfig.PORT, async () => {
    await connectDB();
    console.log(`Server started at port ${serverConfig.PORT}`);
    
})