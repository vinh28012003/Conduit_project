import { prisma } from "../../database/database.js";

export const getCurrentUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, bio, image } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { username, email, password, bio, image },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
