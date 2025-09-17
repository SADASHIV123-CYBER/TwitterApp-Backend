import express from "express";
import { isLoggedIn } from "../../middlewares/authMiddlewares.js";

const verifyRouter = express.Router();

router.get("/verify", isLoggedIn, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default verifyRouter;
