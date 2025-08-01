import express from "express";

const articleRouter = express.Router();

//get all articles by default
articleRouter.get("/", getAllArticles);

//get article by id
articleRouter.get("/:slug", getArticleBySlug);
//get all tags
articleRouter.get("/tags", getTags);

//authentication required routes
//articleRouter.use(authenticateToken);
//create article
articleRouter.post("/", createArticle);
// Get all articles that are favorited and followed by a user with pagination
articleRouter.get("/feed", getFeedArticles);
//update current user article
articleRouter.put("/:slug", updateArticle);

//delete current user article
articleRouter.delete("/:slug", deleteArticle);

// //get all user's articles with pagination
// articleRouter.get("/user/:id", getUserArticles);

// //get all articles by author
// articleRouter.get("/author/:id", getArticlesByAuthor);

// add user's comment routes
articleRouter.post("/:slug/comments", addComment);

//get all comments for an article with pagination
articleRouter.get("/:slug/comments", getCommentsForArticle);

//update comment
articleRouter.put("/:slug/comments/:commentId", updateComment);

//get favaourite count for an article
// articleRouter.get("/:slug/favorite", getFavoriteCountForArticle);
//add user's favorite routes
articleRouter.post("/:slug/favorite", favoriteArticle);
//delete user's favorite
articleRouter.delete("/:slug/favorite", deleteFavorite);

export default articleRouter;
