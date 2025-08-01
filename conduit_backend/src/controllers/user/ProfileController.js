import { prisma } from "../../database/database.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const userById = await prisma.user.findUnique({
      where: { username },
      select: {
        image: true,
        username: true,
        email: true,
        bio: true,
        isFollowing: true,
      },
    });

    if (!userById) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
