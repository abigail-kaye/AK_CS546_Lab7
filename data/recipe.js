const uuidv4 = require('uuid/v4');

async function main() {
  const connection = await MongoClient.connect(settings.mongoConfig.serverUrl);
  const db = await connection.db(settings.mongoConfig.database);
  const recipeCollection = db.collection("lab7");

  exports.getAllRecipies = async () => {
    return await recipeCollection.find().toArray();
  };

  exports.getRecipe = async id => {
    if (id === undefined) throw "You must provide an ID";
    const recipe = await recipeCollection.findOne({ _id: id });

    if (!recipe) {
      throw "Could not find recipe with id of " + id;
    }
    return recipe;
  };

  exports.makeRecipe = async (title, ingredients, steps) => {
    return {
      _id: uuidv4(),
      title: title,
      ingredients : [ingredients],
      steps: [steps]
    };
  };

  // exports.addIngredient = async (recipe, name, amount) => {
  //   const newIngredient = {
  //     name: name,
  //     amount: amount,
  //   };
  //   recipe.ingredients.push(newIngredient);
  // };

  exports.findByTitle = async title => {
    if (!title) throw "You must provide a title";

    return await recipeCollection
      .find({ "recipe title": title })
      .toArray();
  };

  exports.findByIngredients = async potentialIngredients => {
    if (!potentialIngredients)
      throw "You must provide an array of potentially matching ingredient";

    return await recipeCollection
      .find({ ingredients: { $in: potentialIngredients } })
      .toArray();
  };

  exports.updateRecipe = async (id, updatedRecipe) => {
    const updatedRecipeData = {};

    if (updatedRecipe.title) {
      updatedRecipe.title = updatedRecipe.title;
    }

    if (updatedRecipe.instructions) {
      updatedRecipeData.instructions = updatedRecipe.instructions;
    }
    
    if (updatedRecipe.steps) {
      updatedRecipeData.steps = updatedRecipe.steps;
    }

    let updateCommand = {
      $set: updatedRecipeData
    };
    const query = {
      _id: id
    };
    await recipeCollection.updateOne(query, updateCommand);

    return await exports.getRecipe(id);
  };
  
  exports.renameID = async (oldID, newID) => {
    if (oldID === undefined) return Promise.reject("No old id provided");
    if (newID === undefined) return Promise.reject("No new id provided");

    let findRecipe = getRecipe(oldID);
    findRecipe._id = newID;

    return await exports.getRecipe(newID);
  };
 

  exports.removeRecipe = async id => {
    if (id === undefined) return Promise.reject("No id provided");
    const deletionInfo = await recipeCollection.removeOne({ _id: id});
    if (deletionInfo.deletedCount === 0){
      throw `Could not delete recipe with id of ${id}`;
    }
  };
}

main();