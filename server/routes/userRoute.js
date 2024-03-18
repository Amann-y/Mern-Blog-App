const express = require("express");
const {
  registerController,
  loginController,
  loggedUserController,
  sendUserPasswordResetEmailController,
  userPasswordResetController,
  changeUserPasswordController
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/send-reset-password-email", sendUserPasswordResetEmailController);
router.post("/reset-password/:id/:token", userPasswordResetController);

// private routes
router.get("/loggeduser", authMiddleware, loggedUserController);
router.post("/changepassword", authMiddleware, changeUserPasswordController)

module.exports = router;
