// const uuidv4 = require('uuid/v4');

//   const connection = await MongoClient.connect(settings.mongoConfig.serverUrl);
//   const db = await connection.db(settings.mongoConfig.database);
//   const recipeCollection = db.collection("lab7");

const mongoCollections = require("../config/mongoCollections");
const recipe = mongoCollections.recipe;
const uuid = require("node-uuid");

const exportedMethods = {
  async getAllRecipies() {
    const recipeCollection = await recipe();
    return await recipeCollection.find().toArray();
  },

  async getRecipe(id) {
    if (id === undefined) throw "You must provide an ID";
    const recipeCollection = await recipe();
    const recipeR = await recipeCollection.findOne({ _id: id });
    if (!recipeR)
      throw  "Recipe not found";
    return recipeR;
  },

  async addRecipe(title, ing, steps) {
    if (typeof title !== "string") throw "No title provided";
    if (!ing) throw "No ingredients provided";
    if (!Array.isArray(steps)) {
      steps = [];
    }

    const recipeCollection = await recipe();
    const newRecipe = {
      _id: uuid.v4(),
      title: title,
      ingredients : {
        name: ing.name,
        amount: ing.amount
      },
      steps: steps
    };
    const newInsertInformation = await recipeCollection.insertOne(newRecipe);
    const newId = newInsertInformation.insertedId;
    return await this.getRecipe(newId);
  },

  // module.exports.addIngredient = async (recipe, name, amount) => {
  //   const newIngredient = {
  //     name: name,
  //     amount: amount,
  //   };
  //   recipe.ingredients.push(newIngredient);
  // };


   async updateRecipe(id, updatedRecipe) {
    const recipeCollection = await recipe();
    const updatedRecipeData = {};

    if (updatedRecipe.title) {
      updatedRecipeData.title = updatedRecipe.title;
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

    return await this.getRecipe(id);
  },
  
  async renameID(id, updatedRecipe) {
    if (id === undefined) return Promise.reject("No id provided");
    let oldID = id;
    this.removeRecipe(id);
    let newRecipe = this.addRecipe(updatedRecipe.title,updatedRecipe.instructions,updatedRecipe.steps);
    newRecipe._id = oldID;

    return await this.getRecipe(id);
  },
 

  async removeRecipe(id) {
    if (!id) throw "You must provide an id to search for";

    const recipeCollection = await recipe();
    const deletionInfo = await recipeCollection.removeOne({ _id: id });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete recipe with id of ${id}`;
    }
  }
};
module.exports = exportedMethods;