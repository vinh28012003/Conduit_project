import { prisma } from "../../database/database.js";

export const favoriteArticle = async (req, res) => {
  const { slug } = req.params;
  const user = req.user;
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  const isFavourite = article.isFavourite;
  if (isFavourite) {
    return res.status(400).json({ message: "Article already favourited" });
  }
  try {
    await prisma.article.update({
      where: { id: article.id },
      data: {
        isFavourite: true,
        favoriteCount: { increment: 1 },
      },
    });
    await prisma.favourite.create({
      data: {
        userId: user.id,
        articleId: article.id,
      },
    });
    res.status(200).json({ message: "Article favourited successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteFavorite = async (req, res) => {
  const { slug } = req.params;
  const user = req.user;
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  const isFavourite = article.isFavourite;
  if (!isFavourite) {
    return res.status(400).json({ message: "Article not favourited" });
  }
  try {
    await prisma.article.update({
      where: { id: article.id },
      data: {
        isFavourite: false,
        favoriteCount: { decrement: 1 },
      },
    });
    await prisma.favourite.delete({
      where: { userId_articleId: { userId: user.id, articleId: article.id } },
    });
    res.status(200).json({ message: "Article unfavourited successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
