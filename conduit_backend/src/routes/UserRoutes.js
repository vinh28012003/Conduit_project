import express from "express";
import {
  // loginUser,
  // registerUser,
  // logoutUser,
  // forgotPassword,
  // resetPassword,
  // verifyEmail,
  updateUser,
  getCurrentUserById,
} from "../controllers/user/UserController.js";
const userRouter = express.Router();

// // Authentication routes
// userRouter.post("/login", loginUser);
// userRouter.post("/register", registerUser);

// //authentication required routes
// //userRouter.use(authenticateToken);
// userRouter.post("/logout", logoutUser);
// userRouter.post("/forgot-password", forgotPassword);
// userRouter.post("/reset-password", resetPassword);
// userRouter.post("/verify-email", verifyEmail);

//update current user profile
userRouter.put("/", updateUser);

//get current user by id
userRouter.get("/", getCurrentUserById);

export default userRouter;
