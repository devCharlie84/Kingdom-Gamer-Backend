const moment = require("moment");

const Posts = [];

// const Post = {
//   id: null,
//   url: "",
//   title: "",
//   content: "",
//   description: "",
//   date: ""
// };

function addPost(req, res) {
  const Post = {};
  const { url, title, content, description, date } = req.body;

  if (!url || !title || !content || !description) {
    res
      .status(404)
      .send({ code: 404, message: "Todos los campos son obligatorios." });
  } else {
    Post.id = Posts.length + 1;
    Post.url = url;
    Post.title = title;
    Post.content = content;
    Post.description = description;
    Post.date = moment.unix;

    res.status(201).send({ code: 201, Post: Post });
    Posts.push(Post);
  }
}

function getPosts(req, res) {
  if (Posts.length === 0) {
    res
      .status(404)
      .send({ code: 404, message: "No se ha encontrado ningún Post" });
  } else {
    res.status(200).send({ code: 200, Posts });
  }
}

function updatePost(req, res) {
  const { id } = req.params;
  let postData = req.body;

  let post = Posts.find((post) => post.id == id);

  if (!post) {
    res.status(404).send({ code: 404, message: "No se encontro ningún Post" });
  } else {
    if (
      !postData.url ||
      !postData.title ||
      !postData.content ||
      !postData.description
    ) {
      res
        .status(404)
        .send({ code: 404, message: "Todos los campos son obligatorios" });
    } else {
      const index = Posts.indexOf(post);
      Posts[index].url = postData.url;
      Posts[index].title = postData.title;
      Posts[index].content = postData.content;
      Posts[index].description = postData.description;
      res.status(204).send({
        code: 204,
        message: `Se ha actualizado el Post ${post.title}`,
      });
    }
  }
}

function deletePost(req, res) {
  const { id } = req.params;
  let post = Posts.find((post) => post.id == id);

  if (!post) {
    res.status(404).send({ code: 404, message: "No se encontro ningún Post" });
  } else {
    const index = Posts.indexOf(post);
    Posts.splice(index, 1);
    res
      .status(204)
      .send({ code: 204, message: `Se ha eliminado el Post ${post.title}` });
  }
}

function getPost(req, res) {
  const { id } = req.params;
  let post = Posts.find((post) => post.id == id);

  if (!post) {
    res.status(404).send({ code: 404, message: "No se encontro ningún Post" });
  } else {
    res.status(200).send({ code: 200, post });
  }
}

module.exports = {
  addPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
};
