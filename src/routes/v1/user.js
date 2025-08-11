import express from 'express'
import { validate } from '../../validator/zodValidator.js';
import { userZodSchema } from '../../validator/schema/userZodSchema.js';
import createUser from '../../controller/userController.js';
import cloudinaryUploader from '../../middlewares/multerUploader.js';

const router = express.Router();

router.post('/', cloudinaryUploader('profile').single('profilePicture'), validate(userZodSchema), createUser);

export default router