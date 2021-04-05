const express = require("express");
const PostController = require("../controllers/post");
const middleware_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/add-post/", [middleware_auth.ensureAuth], PostController.addPost);

api.get("/get-posts/", PostController.getPosts);

api.get("/get-post/:url", PostController.getPost);

api.put(
  "/update-post/:id",
  [middleware_auth.ensureAuth],
  PostController.updatePost
);

api.delete(
  "/delete-post/:id",
  [middleware_auth.ensureAuth],
  PostController.deletePost
);

module.exports = api;
