import express from 'express'
import { validate } from '../../validator/zodValidator.js';
import { userZodSchema } from '../../validator/schema/userZodSchema.js';
import createUser from '../../controller/userController.js';
import cloudinaryUploader from '../../middlewares/multerUploader.js';

const router = express.Router();

router.post('/', validate(userZodSchema), cloudinaryUploader('profile').single('profilePicture'), createUser);

export default router