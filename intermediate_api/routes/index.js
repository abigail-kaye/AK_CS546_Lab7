const recipeRoutes = require("./recipe");

const constructorMethod = app => {
  app.use("/recipe", recipeRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
