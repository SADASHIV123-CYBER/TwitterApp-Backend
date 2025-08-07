import dotenv from 'dotenv'
dotenv.config()

export default {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}

// export const PORT = process.env.PORT
// export const DB_URL = process.env.DB_URL
// export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
// export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
// export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET