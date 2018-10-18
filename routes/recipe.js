const express = require("express");
const router = express.Router();
const data = require("../data");
const recipeData = data.recipe;

router.get("/:id", async (req, res) => {
  try {
    const recipe = await postData.getRecipe(req.params.id);
    res.json(recipe);
  } catch (e) {
    res.status(404).json({ error: "Recipe not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const recipeList = await recipeData.getAllRecipies();
    res.json(recipeList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  const rawRecipeData = req.body;
  try {
    const { title, ingredients, steps} = rawRecipeData;
    const newRecipe = await recipeData.makeRecipe(title, ingredients, steps);

    res.json(newRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


router.put("/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    await recipeData.getRecipe(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }

  try {
    const updatedRecipe = await recipeData.renameID(req.params.id, updatedData);
    res.json(updatedRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch("/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    await recipeData.getRecipe(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Recipe not found" });
  }

  try {
    const updatedRecipe = await recipeData.updateRecipe(req.params.id, updatedData);
    res.json(updatedRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await recipeData.getRecipe(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Recipe not found" });
  }
  try {
    await recipeData.removeRecipe(req.params.id);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;