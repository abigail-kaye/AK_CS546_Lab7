const uuidv4 = require('uuid/v4');

async function main() {
  const connection = await MongoClient.connect(settings.mongoConfig.serverUrl);
  const db = await connection.db(settings.mongoConfig.database);
  const recipeCollection = db.collection("advancedMovies");

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
      ingredients: ingredients,
      steps: steps
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


/*const mongoCollections = require("../config/mongoCollections");
const recipe = mongoCollections.recipe;
const uuid = require("node-uuid");


const exportedMethods = {
  async getAllPosts() {
    const recipeCollection = await posts();
    return await recipeCollection.find({}).toArray();
  },
  async getPostsByTag(tag) {
    if (!tag) throw "No tag provided";

    const recipeCollection = await posts();
    return await recipeCollection.find({ tags: tag }).toArray();
  },
  async getPostById(id) {
    const recipeCollection = await posts();
    const recipe = await recipeCollection.findOne({ _id: id });

    if (!recipe) throw "Recipe not found";
    return recipe;
  },
  async addPost(title, body, tags, posterId) {
    if (typeof title !== "string") throw "No title provided";
    if (typeof body !== "string") throw "I aint got nobody!";

    if (!Array.isArray(tags)) {
      tags = [];
    }

    const recipeCollection = await posts();

    const userThatPosted = await users.getUserById(posterId);

    const newPost = {
      title: title,
      body: body,
      poster: {
        id: posterId,
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`
      },
      tags: tags,
      _id: uuid.v4()
    };

    const newInsertInformation = await recipeCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;
    return await this.getPostById(newId);
  },
  async removePost(id) {
    const recipeCollection = await posts();
    const deletionInfo = await recipeCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
  },
  async updatePost(id, updatedPost) {
    const recipeCollection = await posts();

    const updatedPostData = {};

    if (updatedPost.tags) {
      updatedPostData.tags = updatedPost.tags;
    }

    if (updatedPost.title) {
      updatedPostData.title = updatedPost.title;
    }

    if (updatedPost.body) {
      updatedPostData.body = updatedPost.body;
    }

    let updateCommand = {
      $set: updatedPostData
    };
    const query = {
      _id: id
    };
    await recipeCollection.updateOne(query, updateCommand);

    return await this.getPostById(id);
  },
  async renameTag(oldTag, newTag) {
    let findDocuments = {
      tags: oldTag
    };

    let firstUpdate = {
      $pull: oldTag
    };

    let secondUpdate = {
      $addToSet: newTag
    };

    const recipeCollection = await posts();
    await recipeCollection.updateMany(findDocuments, firstUpdate);
    await recipeCollection.updateMany(findDocuments, secondUpdate);

    return await this.getPostsByTag(newTag);
  }
};

module.exports = exportedMethods;
*/