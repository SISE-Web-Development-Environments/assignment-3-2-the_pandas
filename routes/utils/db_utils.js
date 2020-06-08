require("dotenv").config();
const sql = require("mssql");

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

exports.updateUserandRecipe = async function (RecipeID,UserID){
    await this.execQuery(`INSERT INTO dbo.UserRecipes (userID, recipeID, Viewed, Saved) VALUES ('${UserID}', '${RecipeID}','1','0')`);
}

exports.updateSaveRecipe = async function (RecipeID,UserID){
  await this.execQuery(`update dbo.UserRecipes SET Saved='1' where userID='${UserID}' and  recipeID='${RecipeID}'`);
}


exports.checkUserandRecipe = async function (RecipeID,UserID){
  let stats = {};
  stats.Viewed = false;
  stats.Saved = false;
  let Results = await this.execQuery(`select Viewed,Saved from dbo.UserRecipes where userID='${UserID}' and recipeID='${RecipeID}'`);
  console.log("betsim");
  if (Results.length == 0)
    return stats;
  else {

  }
}

exports.updateUserLastSeenRecipes = async function (RecipeID,UserID){
  await this.execQuery(`delete from dbo.Watched_Recipes where user_id='${UserID}' and recipe_id=${RecipeID}`);
  await this.execQuery(`INSERT INTO dbo.Watched_Recipes(recipe_id, user_id) VALUES ('${RecipeID}', '${UserID}');`);
}

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

exports.createNewRecipe = async function (recipe_params){
  await this.execQuery(`INSERT INTO dbo.personalRecipes (user_id, Title, recipeImage, recipeTime, Likes, isVegan,
      isVeryHealthy, isVegetarian, isGlutenFree, Instructions, ingredients, numOfMeals) 
      VALUES ('${recipe_params.username}', '${recipe_params.title}','${recipe_params.image}',
      '${recipe_params.readyInMinutes}', '${recipe_params.likes}', '${recipe_params.vegan}',
      '${recipe_params.healthScore}', '${recipe_params.vegetarian}', '${recipe_params.glutenFree}',
      '${recipe_params.instructions}', '${recipe_params.extendedIngredients}', '${recipe_params.servings}')`);
}