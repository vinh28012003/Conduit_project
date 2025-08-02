import express from "express";
import { getUserProfile } from "../controllers/user/ProfileController.js";
import {
  followUser,
  unfollowUser,
} from "../controllers/user/FollowController.js";

//authentication required routes
//profileRouter.use(authenticateToken);
const profileRouter = express.Router();
//get user profile
profileRouter.get("/:username", getUserProfile);

// Follow and unfollow routes
profileRouter.post("/:username/follow", followUser);
profileRouter.delete("/:username/follow", unfollowUser);
export default profileRouter;
