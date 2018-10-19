const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const recipe = data.recipe;

async function main() {
    try {
        const db = await dbConnection();
        await db.dropDatabase();

        await recipe.addRecipe(
            "Fried eggs",
            {
                "name": "eggs",
                "amount": "2"
            },
            []
        );
        console.log("Done seeding database");
        await db.serverConfig.close();
    }
    catch (e) {
        console.log(e);
    }
}

main();
