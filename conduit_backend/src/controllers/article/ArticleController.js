import { prisma } from "../../database/database.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findUnique({
      where: { slug },
    });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//get all articles with pagination
export const getAllArticles = async (req, res) => {
  try {
    const { tag, author, favorited, limit = 20, offset = 0 } = req.query;

    // Convert limit and offset to integers and validate
    const parsedLimit = Math.min(parseInt(limit) || 20, 20); // Max 100 articles
    const parsedOffset = parseInt(offset) || 0;

    // Build dynamic where clause
    const whereClause = {};

    // Filter by tag
    if (tag) {
      whereClause.articleTagRelations = {
        some: {
          tag: {
            name: {
              equals: tag,
              mode: "insensitive", // Case-insensitive search
            },
          },
        },
      };
    }

    // Filter by author username
    if (author) {
      whereClause.author = {
        username: {
          equals: author,
          mode: "insensitive",
        },
      };
    }

    // Filter by user who favorited the articles
    if (favorited) {
      whereClause.favourites = {
        some: {
          user: {
            username: {
              equals: favorited,
              mode: "insensitive",
            },
          },
        },
      };
    }

    // Execute the query
    const articles = await prisma.article.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            bio: true,
            avatar: true,
          },
        },
        articleTagRelations: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            favourites: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recent articles first
      },
      skip: parsedOffset,
      take: parsedLimit,
    });

    // Get total count for pagination metadata
    const totalCount = await prisma.article.count({
      where: whereClause,
    });

    // Transform the response to match API documentation format
    const transformedArticles = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: {
        id: article.author.id,
        username: article.author.username,
        bio: article.author.bio,
        avatar: article.author.avatar,
      },
      tags: article.articleTagRelations.map((relation) => ({
        id: relation.tag.id,
        name: relation.tag.name,
      })),
      favoritesCount: article._count.favourites,
      commentsCount: article._count.comments,
      // Note: favorited status would require authentication to determine
      // if current user has favorited this article
      favorited: false, // TODO: Implement when authentication is added
    }));

    // Calculate pagination metadata
    const hasMore = parsedOffset + parsedLimit < totalCount;
    const totalPages = Math.ceil(totalCount / parsedLimit);
    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;

    // Return response
    res.status(200).json({
      articles: transformedArticles,
      articlesCount: transformedArticles.length,
      totalCount,
      hasMore,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
        currentPage,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);

    // Handle specific error types
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Resource not found",
        message: "The requested resource could not be found",
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch articles",
    });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, description, body, tagList } = req.body;
    const article = await prisma.article.create({
      data: { title, description, body, tagList },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, body, tagList } = req.body;
    const article = await prisma.article.update({
      where: { slug },
      data: { title, description, body, tagList },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteArticle = async (req, res) => {
  try {
    const { slug } = req.params;
    await prisma.article.delete({ where: { slug } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getFeedArticles = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const parsedOffset = parseInt(offset) || 0;
    const followedUsers = await prisma.follow.findMany({
      where: {
        followerId: req.user.id,
      },
    });
    const articles = await prisma.article.findMany({
      where: {
        authorId: {
          in: followedUsers.map((follow) => follow.followingId),
        },
      },
      include: {
        author: {
          select: {
            username: true,
            bio: true,
            avatar: true,
            following: true,
          },
        },
        articleTagRelations: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        tag: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: parsedOffset,
      take: parsedLimit,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
