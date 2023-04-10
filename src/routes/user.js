const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.get("/chat_log", authController.protect, userController.chatLog);
module.exports = router;