const MongoClient = require("mongodb").MongoClient,
  runStartup = require("./advanced_startup_docs.js"),
  settings = require("./config.js");

async function main() {
  const allRecipies = await runStartup();
  console.log(
    "After the advanced document setup has been complete, we have the following movies:"
  );
  console.log(allRecipies);

  const connection = await MongoClient.connect(settings.mongoConfig.serverUrl);
  const db = await connection.db(settings.mongoConfig.database);
  const recipeCollection = db.collection("advancedMovies");

  // simple stuff
  exports.getallRecipies = async () => {
    return await recipeCollection.find().toArray();
  };

  // more simple stuff
  exports.getRecipe = async id => {
    if (id === undefined) throw "You must provide an ID";
    const recipe = await recipeCollection.findOne({ _id: id });

    if (!recipe) {
      throw "Could not find movie with id of " + id;
    }
    return recipe;
  };

  // =================
  // Advanced finding
  // =================

  // We can query on subdocuments very easily
  exports.findByTitle = async title => {
    if (!title) throw "You must provide a director name";

    // to query on a subdocument field, just provide the path to the field as a string key;
    // so when you have {info: {director: someName}}, just find on {"info.director": someName}
    return await recipeCollection
      .find({ "recipe title": title })
      .toArray();
  };

  // For demonstration purposes, let's take an array of ratings and search by that
  exports.findByIngredients = async potentialIngredients => {
    if (!potentialIngredients)
      throw "You must provide an array of potentially matching ratings";

    // ie, passing [3.2, 5] would find movies that have a rating field with 3.2 or 5
    return await recipeCollection
      .find({ ingredients: { $in: potentialIngredients } })
      .toArray();
  };

  // =================
  // Advanced Updating
  // =================

  exports.updateTitle = async (id, newTitle) => {
    if (id === undefined) throw "No id provided";
    if (!newTitle) throw "No title provided";

    // we use $set to update only the fields specified
    await recipeCollection.update({ _id: id }, { $set: { title: newTitle } });
    return await exports.getRecipe(id);
  };

  exports.updateIngredients = function(id, newIngredient, newAmount) {
    if (id === undefined) return Promise.reject("No id provided");
    if (!newIngredient) return Promise.reject("No newIngredient provided");
    if (!newAmount) return Promise.reject("No newAmount provided");

    // we use $set to update only the fields specified
    return recipeCollection
      .update({ _id: id }, { $set: { instructions: {newIngredient : newAmount}}})
      .then(function() {
        return exports.getRecipe(id);
      });
  };
  

  exports.replaceID = function(id,title,ingredients,steps){
    if (id === undefinited) return Promise.reject("No id provided");
    if (!title) return Promise.reject("No title provided");
    if (!ingredients) return Promise.reject("No ingredients provided");
    if (!steps) return Promise.reject("No steps provided");

    const updatedRecipe = {
      title: title,
      ingredients: ingredients,
      steps: steps
    };

    const updatedInfo = await recipeCollection.updateOne({_id:id}, updatedRecipe);
    if (updatedInfo.modifiedCount === 0){
      throw "Could not update recpe successfully";
    }
    return await exports.replaceID(id,title,ingredients,steps);

  }

  exports.removeRecipe = function(id) {
    if (id === undefined) return Promise.reject("No id provided");
    const deletionInfo = await recipeCollection.removeOne({ _id: id});
    if (deletionInfo.deletedCount === 0){
      throw `Could not delete recipe with id of ${id}`;
    }
  };
}

main();


  // =================
  // Array based querying
  // =================

  /*
  exports.findByCast = function(name) {
    if (!name)
      return Promise.reject("You must provide a name for the cast member");

    return recipeCollection.find({ cast: name }).toArray();
  };

  exports.findByReviewerName = function(reviewerName) {
    if (!reviewerName)
      return Promise.reject("You must provide a name for the reviewer");

    // pass 'Phil' or 'Sallie' to find multiple matches, or 'Definitely Not Leo' to find a suspicious review.
    return recipeCollection.find({ "reviews.reviewer": reviewerName }).toArray();
    // alternatively, we can pass an entire document describing our subdocument in our array using $elemMatch
    //            return recipeCollection.find({ "reviews": { $elemMatch: { "reviewer": reviewerName } } }).toArray();
  };

  // =================
  // Updating arrays
  // =================

  exports.addCastMemberIfNotExists = function(id, newCastMember) {
    if (id === undefined) return Promise.reject("No id provided");
    if (newCastMember === undefined)
      return Promise.reject("no newCastMember provided");

    // if our new cast member is already listed, this will be ignored
    // Try it out -- add Matthew McConaughey
    return recipeCollection
      .update({ _id: id }, { $addToSet: { cast: newCastMember } })
      .then(function() {
        return exports.getRecipe(id);
      });
  };

  exports.addCastMemberAllowDuplicates = function(id, newCastMember) {
    if (id === undefined) return Promise.reject("No id provided");
    if (newCastMember === undefined)
      return Promise.reject("no newCastMember provided");

    // if our new cast member is already listed, we will be left with 2 copies of them
    // Try this a few times. Remember, you can never have enough Matthew McConaughey
    return recipeCollection
      .update({ _id: id }, { $push: { cast: newCastMember } })
      .then(function() {
        return exports.getRecipe(id);
      });
  };

  exports.popLastCastMember = function(id) {
    if (id === undefined) return Promise.reject("No id provided");

    // removes last
    return recipeCollection
      .update({ _id: id }, { $pop: { cast: 1 } })
      .then(function() {
        return exports.getRecipe(id);
      });
  };

  exports.popFirstCastMember = function(id) {
    if (id === undefined) return Promise.reject("No id provided");

    // removes first
    return recipeCollection
      .update({ _id: id }, { $pop: { cast: -1 } })
      .then(function() {
        return exports.getRecipe(id);
      });
  };

  // We can also remove based on value, or by matching fields the same way we can query for documents
  exports.removeCastMember = function(id, memberToRemove) {
    if (id === undefined) return Promise.reject("No id provided");
    if (!memberToRemove) return Promise.reject("No memberToRemove provided");

    // removes all matching array entry; remember, if you add
    // you can use $pullAll to pull multiple entries
    return recipeCollection
      .update({ _id: id }, { $pull: { cast: memberToRemove } })
      .then(function() {
        return exports.getRecipe(id);
      });
  };

  exports.removeReview = function(id, reviewId) {
    if (id === undefined) return Promise.reject("No id provided");
    if (!reviewId) return Promise.reject("No reviewId provided");

    return recipeCollection
      .update({ _id: id }, { $pull: { reviews: { _id: reviewId } } })
      .then(function() {
        return exports.getRecipe(id);
      });
  };
  */

