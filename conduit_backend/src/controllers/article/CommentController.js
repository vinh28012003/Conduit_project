import { prisma } from "../../database/database.js";

export const createComment = async (req, res) => {
  const { slug } = req.params;
  const { comment } = req.body;
  const user = req.user;
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  try {
    const newComment = await prisma.comment.create({
      data: {
        body: comment,
        articleId: article.id,
        authorId: user.id,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentsForArticle = async (req, res) => {
  const { slug } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  const parsedLimit = Math.min(parseInt(limit) || 20, 20);
  const parsedOffset = parseInt(offset) || 0;
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: article.id },
      orderBy: { createdAt: "desc" },
      skip: parsedOffset,
      take: parsedLimit,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateComment = async (req, res) => {
  const { slug, commentId } = req.params;
  const { commentBody } = req.body;
  const user = req.user;
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.authorId !== user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { body: commentBody },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteComment = async (req, res) => {
  const { slug, commentId } = req.params;
  const user = req.user;
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.authorId !== user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
