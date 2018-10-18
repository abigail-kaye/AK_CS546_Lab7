const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get("/recipes/:id", async (req, res) => {
  try {
    const post = await postData.getPostById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }
});

router.get("/recipes", async (req, res) => {
  try {
    const postList = await postData.getAllPosts();
    res.json(postList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/recipes", async (req, res) => {
  const blogPostData = req.body;
  try {
    const { title, body, tags, posterId } = blogPostData;
    const newPost = await postData.addPost(title, body, tags, posterId);

    res.json(newPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put("/recipes/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }

  try {
    const updatedPost = await postData.updatePost(req.params.id, updatedData);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch("/recipes/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }

  try {
    const updatedPost = await postData.renameTag(req.params.id, updatedData);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/recipes/:id", async (req, res) => {
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }
  try {
    await postData.removePost(req.params.id);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;