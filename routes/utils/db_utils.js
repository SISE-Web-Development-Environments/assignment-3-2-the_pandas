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
