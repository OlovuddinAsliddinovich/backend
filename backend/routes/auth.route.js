const express = require("express");
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 16 }),
  authController.register
);
router.get("/activation/:id", authController.activation);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.get("/get-users", authMiddleware, authController.getUsers);
router.post("/forgot-password", authController.forgotPassword);
router.put("/recovery-account", authController.recoveryAccount);

module.exports = router;
