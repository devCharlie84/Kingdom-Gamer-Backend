const express = require("express");
const PostController = require("../controllers/post");

const api = express.Router();

api.post("/add-post", PostController.addPost);

api.get("/get-posts", PostController.getPosts);

api.get("/get-post/:id", PostController.getPost);

api.put("/update-post/:id", PostController.updatePost);

api.delete("/delete-post/:id", PostController.deletePost);

module.exports = api;
