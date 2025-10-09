const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
// const {
//   validateSignUp,
//   validateLogin,
//   validateChangePassword,
//   validateUpdate,
// } = require("../validation/validater");
//Import userModel
const {
  userRegistration,
  verifyEmail,
  userLogin,
  changePassword,
  resetPassword,
  updateUser,
  viewProfile,
} = require("../controllers/userController");

//Route level Middleware
router.use("/change-password", checkUserAuth);
router.use("/update", checkUserAuth);
router.use("/profile", checkUserAuth);

//Public Routes
router.post("/register", userRegistration);
router.post("/login", userLogin);

//Protected Routes
router.post("/change-password", changePassword);
router.put("/update", updateUser);
router.get("/profile", viewProfile);

module.exports = router;
