require("dotenv").config();
const sql = require("mssql");

//configurations for azure server 
const config = {
  user: process.env.ServerUsername,
  password: process.env.password,
  server: process.env.ServerName,
  database: process.env.database,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

//updates recipe&user table whether a user viewed it or saved it in his favorites (needs to adjust the save part)
exports.updateUserandRecipe = async function (RecipeID,UserID){
    await this.execQuery(`INSERT INTO dbo.UserRecipes (userID, recipeID, Viewed, Saved) VALUES ('${UserID}', '${RecipeID}','1','0')`);
}

//retrives a table which can be used to know whether the user viewed or saved a certain recipe
exports.checkUserandRecipe = async function (RecipeID,UserID){
  let stats = {};
  stats.Viewed = false;
  stats.Saved = false;
  let Results = await this.execQuery(`select Viewed,Saved from dbo.UserRecipes where userID='${UserID}' and recipeID='${RecipeID}'`);
  if (Results.length == 0)
    return stats;
  else {
    
  }
}

//function to excecute queries
exports.execQuery = async function (query) {
  var pool = undefined;
  var result = undefined;
  try {
    pool = await sql.connect(config);
    result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) pool.close();
  }
};

//create a new recipe and insert it to the personalRecipes table
exports.createNewRecipe = async function (recipe_params){
  await this.execQuery(`INSERT INTO dbo.personalRecipes (user_id, Title, recipeImage, recipeTime, Likes, isVegan,
      isVeryHealthy, isVegetarian, isGlutenFree, Instructions, ingredients, numOfMeals) 
      VALUES ('${recipe_params.username}', '${recipe_params.title}','${recipe_params.image}',
      '${recipe_params.readyInMinutes}', '${recipe_params.likes}', '${recipe_params.vegan}',
      '${recipe_params.healthScore}', '${recipe_params.vegetarian}', '${recipe_params.glutenFree}',
      '${recipe_params.instructions}', '${recipe_params.extendedIngredients}', '${recipe_params.servings}')`);
}

//gets recipes from personalRecipes table
exports.getPersonalRecipes = async function (userID){
  let personalRecipes = await this.execQuery(`select Title from dbo.personalRecipes where user_id='${userID}'`);
  return personalRecipes;
}

// create a new user in database (user table) 
exports.registerNewUserInDb = async function (req,hash_password){
  await this.execQuery(`INSERT INTO dbo.Users (username, firstname, lastname, country, userPassword,
        email, photoUser) VALUES ('${req.body.userName}', '${req.body.firstName}','${req.body.lastName}'
        ,'${req.body.country}', '${hash_password}', '${req.body.email}','${req.body.linkimage}')`);
}