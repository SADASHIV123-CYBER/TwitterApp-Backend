import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
import path from 'path'

function cloudinaryUploader(folderName) {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (re, file) => {
            const folderPath = `${folderName.trim()}`
            const fileExtension = path.extname(file.originalname).substring(1);
            const publidId = `${file.fieldname}-${Date.now()}`

            return {
                folder: folderPath,
                public_id: publidId,
                format: fileExtension
            }
        }
    });

    function fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
        }
    }

    return multer({
        storage: storage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })
}

export default cloudinaryUploader