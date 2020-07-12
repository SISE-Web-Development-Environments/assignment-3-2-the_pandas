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
    var checkifexists = await this.execQuery(`select * from dbo.UserRecipes where userID = '${UserID}' and recipeID='${RecipeID}'`);
    if (checkifexists.length == 0)
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
  console.log("checking recipe for Userid:"+UserID);
  if (Results.length == 0)
    return stats;
  else {

  }
}

exports.updateUserLastSeenRecipes = async function (RecipeID,UserID){
  await this.execQuery(`delete from dbo.Watched_Recipes where user_id='${UserID}' and recipe_id=${RecipeID}`);
  await this.execQuery(`INSERT INTO dbo.Watched_Recipes(recipe_id, user_id) VALUES ('${RecipeID}', '${UserID}');`);
}

exports.updateSaveRecipe = async function (RecipeID,UserID){
  await this.execQuery(`update dbo.UserRecipes SET Saved='1' where userID='${UserID}' and  recipeID='${RecipeID}'`);
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
  var personalRecipes = await this.execQuery(`select Title from dbo.personalRecipes where user_id='${userID}'`);
  return personalRecipes;
}

exports.updateUserLastSeenRecipes = async function (RecipeID,UserID){
  await this.execQuery(`delete from dbo.Watched_Recipes where user_id='${UserID}' and recipe_id=${RecipeID}`);
  await this.execQuery(`INSERT INTO dbo.Watched_Recipes(recipe_id, user_id) VALUES ('${RecipeID}', '${UserID}');`);
}

// create a new user in database (user table) 
exports.registerNewUserInDb = async function (req,hash_password){
  await this.execQuery(`INSERT INTO dbo.Users (username, firstname, lastname, country, userPassword,
        email, photoUser) VALUES ('${req.body.userName}', '${req.body.firstName}','${req.body.lastName}'
        ,'${req.body.country}', '${hash_password}', '${req.body.email}','${req.body.linkimage}')`);
}

//create a new family recipe and insert it to the familyRecipes table
exports.createNewFamilyRecipe = async function (recipe_params){
  await this.execQuery(`INSERT INTO dbo.familyRecipes (user_id, Title, owner, periodOfTime, 
      Instructions, ingredients, recipeImage) 
      VALUES ('${recipe_params.username}', '${recipe_params.title}','${recipe_params.owner}',
      '${recipe_params.periodOfTime}', '${recipe_params.instructions}', '${recipe_params.extendedIngredients}',
      '${recipe_params.image}')`);
}

//gets recipes from familyRecipes table
exports.getFamilyRecipes = async function (userID){
  var familyRecipes = await this.execQuery(`select Title, owner, from dbo.familyRecipes where user_id='${userID}'`);
  return familyRecipes;
}