import express from "express";
import { validate } from "../../validator/zodValidator.js";
import { userZodSchema } from "../../validator/schema/userZodSchema.js";
import { createUser, toggleFollowController, getUserProfile } from "../../controller/userController.js";
import cloudinaryUploader from "../../middlewares/multerUploader.js";
import { isLoggedIn } from "../../middlewares/authMiddlewares.js";

const router = express.Router();

// Create a new user
router.post(
  "/",
  cloudinaryUploader("profile").single("profilePicture"),
  validate(userZodSchema),
  createUser
);

// Toggle follow/unfollow
router.post("/follow/:targetUser/toggle", isLoggedIn, toggleFollowController);

// Get profile of a specific user by ID
router.get("/:userId", isLoggedIn, getUserProfile);

// ✅ New route to get currently logged-in user
router.get("/me", isLoggedIn, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user, // comes from isLoggedIn middleware
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
