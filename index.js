const express = require('express');
const serverConfig = require('./src/config/serverConfig');
const connectDB = require('./src/config/dbConfig');
const morgan = require('morgan');

const app = express();

// app.use(cookieParser())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded( {extended: true} ));
app.use(morgan('dev'))

app.listen(serverConfig.PORT, async () => {
    await connectDB();
    console.log(`Server started at port ${serverConfig.PORT}`);
    
})