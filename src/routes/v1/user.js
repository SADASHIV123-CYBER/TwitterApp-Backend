import express from 'express'
import { validate } from '../../validator/zodValidator.js';
import { userZodSchema } from '../../validator/schema/userZodSchema.js';
import {createUser, toggleFollowController} from '../../controller/userController.js';
import cloudinaryUploader from '../../middlewares/multerUploader.js';
import { isLoggedIn } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/', cloudinaryUploader('profile').single('profilePicture'), validate(userZodSchema), createUser);

// router.post('/:userId/follow/:targetUser/toggle',isLoggedIn, toggleFollowController);
router.post('/follow/:targetUser/toggle', isLoggedIn, toggleFollowController);

export default router