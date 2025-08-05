const { default: mongoose } = require("mongoose");
const { DB_URL } = require("./serverConfig");
// const serverConfig = require("./serverConfig");

async function connectDB() {
    try {
        await mongoose.connect(DB_URL);
        console.log("Successfully connected to the DB");
        
    } catch (error) {
        console.log(error);
        console.log("Not able to connect DB");
    }
}

module.exports = connectDB