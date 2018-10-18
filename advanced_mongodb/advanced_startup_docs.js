const MongoClient = require("mongodb").MongoClient,
  settings = require("./config.js"),
  Guid = require("guid");

async function runSetup() {
  const connection = await MongoClient.connect(settings.mongoConfig.serverUrl);
  const db = await connection.db(settings.mongoConfig.database);

  try {
    // We can recover from this; if it can't drop the collection, it's because
    await db.collection("advancedMovies").drop();
  } catch (e) {
    // the collection does not exist yet!
  }

  const recipeCollection = await db.collection("advancedMovies");
  let docId = 0;

  const makeRecipe = function(title) {
    return {
      _id: docId++,
      title: title,
      ingredients: [],
      steps: []
    };
  };

  const addIngredient = function(recipe, name, amount) {
    const newIngredient = {
      _id: Guid.create().toString(),
      name: name,
      amount: amount,
    };
    recipe.ingredients.push(newIngredient);
  };

  const listOfRecipes = [];

  const friedEgg = makeRecipe("Fried egg");
  friedEgg.steps.push(
    "First, crack the egg",
  "Next, forget the pan",
  "Thrid, go out and buy fried eggs"
  );
  addIngredient(
    friedEgg,
    "egg",
    "2"
  );
  addIngredient(friedEgg, "Olive oil", "2 tbsp");

  listOfRecipes.push(friedEgg);

  await recipeCollection.insertMany(listOfRecipes);

  return await recipeCollection.find().toArray();
}

// By exporting a function, we can run
exports = module.exports = runSetup;
