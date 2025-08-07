import mongoose from "mongoose";
// import DB_URL  from "./serverConfig.js";
import serverConfig from "./serverConfig.js";

async function connectDB() {
  try {
    await mongoose.connect(serverConfig.DB_URL);
    console.log("Successfully connected to the DB");
  } catch (error) {
    console.log(error);
    console.log("Not able to connect DB");
  }
}

export default connectDB;
