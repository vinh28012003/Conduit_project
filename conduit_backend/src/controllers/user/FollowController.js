import { prisma } from "../../database/database.js";

export const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { currentUserId } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = user.isFollowing;
    if (isFollowing) {
      return res.status(400).json({ message: "User already followed" });
    }
    await prisma.user.update({
      where: { id: user.id },
    });
    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { currentUserId } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = user.isFollowing;
    if (!isFollowing) {
      return res.status(400).json({ message: "User not followed" });
    }
    await prisma.follow.delete({
      where: {
        followerId_followingId: { followerId: currentUserId, followingId: user.id },
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { isFollowing: false },
    });
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
