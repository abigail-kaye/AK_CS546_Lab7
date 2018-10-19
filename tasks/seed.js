const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const recipe = data.recipe;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  await recipe.addRecipe(
      "Fried eggs",
      [],
      []
  );
//   await posts.addPost("Hello, class!", "Today we are creating a blog!", [], id);
//   await posts.addPost(
//     "Using the seed",
//     "We use the seed to have some initial data so we can just focus on servers this week",
//     [],
//     id
//   );

//   await posts.addPost(
//     "Using routes",
//     "The purpose of today is to simply look at some GET routes",
//     [],
//     id
//   );
  console.log("Done seeding database");
  await db.close();
}

main();
