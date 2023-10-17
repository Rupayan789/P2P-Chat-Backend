const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/index");
const {
  getFirebaseUid,
  getAuthToken,
} = require("../middlewares/auth.middleware");

router.post("/login", [getAuthToken, getFirebaseUid], authController.loginUser);

router.post(
  "/signup",
  [getAuthToken, getFirebaseUid],
  authController.signUpUser
);

router.get(
  "/users",
  [getAuthToken, getFirebaseUid],
  authController.getAllUsers
);

module.exports = router;
