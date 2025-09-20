import express from "express";
import { validate } from "../../validator/zodValidator.js";
import { userZodSchema } from "../../validator/schema/userZodSchema.js";
import { createUser, toggleFollowController, getUserProfile } from "../../controller/userController.js";
import cloudinaryUploader from "../../middlewares/multerUploader.js";
import { isLoggedIn } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

router.post(
  "/",
  cloudinaryUploader("profile").single("profilePicture"),
  validate(userZodSchema),
  createUser
);

router.post("/follow/:targetUser/toggle", isLoggedIn, toggleFollowController);
router.post("/follow/:targetUser", isLoggedIn, toggleFollowController);

router.get("/:userId", isLoggedIn, getUserProfile);

router.get("/me", isLoggedIn, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
