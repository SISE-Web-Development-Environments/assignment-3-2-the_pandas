const axios = require("axios");
const recipes_api_url = "https://api.spoonacular.com/recipes";
// const apikey = "apiKey=7392cc556233474799505cda45d21c03";
// const apikey = "apiKey=9a41196304c94b8687afe011fc6657da";
// const apikey = "apiKey=618963d05679493090e36fd363e7a0f1";
const apikey = "apiKey=918ea6a0e4f643abbae00da33223e48e";
var db_util = require("./db_utils");


function extractQueriesParams(query_params,search_params) {
   const params_list = ["diet","cuisine","intolerance"];
   params_list.forEach((param) =>{
       if(query_params[param]) {
           search_params[param] = query_params[param];
       }
   });
   console.log(search_params);
};

async function searchForRecipes(search_params) {
    let search_response = await axios.get(
           `${recipes_api_url}/search?${apikey}`,
    {
        params: search_params,
    }
    );
    const recipe_id_list = extractSearchResultsIds(search_response);
    console.log(recipe_id_list);
    let info_array = await getRecipeInfo(recipe_id_list);
    console.log("info array: ",info_array);
    return info_array;

 };

 async function getRecipeInfo(recipe_id_list) {
    let promises = [];
    recipe_id_list.map((id) => promises.push(axios.get(recipes_api_url+"/"+id+"/information?"+apikey)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 async function getLastSeenRecipes(user_id) {
    let lastSeenRecipes= await db_util.execQuery(`SELECT top 3 recipe_id FROM dbo.Watched_Recipes WHERE user_id = '${user_id}' ORDER BY time DESC`);
    let promises = [];
    lastSeenRecipes.map((id) => promises.push(axios.get(recipes_api_url+"/"+id.recipe_id+"/information?"+apikey)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 async function getFavoriteRecipes(user_id) {
    let FavRecipes= await db_util.execQuery(`SELECT recipeID FROM dbo.UserRecipes WHERE userID='${user_id}' and Saved='1'`);
    let promises = [];
    FavRecipes.map((FavRecipe) => promises.push(axios.get(recipes_api_url+"/"+FavRecipe.recipeID+"/information?"+apikey)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 async function getRandomRecipeInfo(search_params) {
    let info_response = await axios.get(
        `${recipes_api_url}/random?${apikey}`,
        {
            params: search_params,
        }
    );
    relevantRecipeData = extractRandomRelevantRecipeData(info_response.data.recipes);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 async function getLastSeenRecipes(user_id) {
    let lastSeenRecipes= await db_util.execQuery(`SELECT top 3 recipe_id FROM dbo.Watched_Recipes WHERE user_id = '${user_id}' ORDER BY time DESC`);
    let promises = [];
    lastSeenRecipes.map((id) => promises.push(axios.get(recipes_api_url+"/"+id.recipe_id+"/information?"+apikey)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 async function getFavoriteRecipes(user_id) {
    let FavRecipes= await db_util.execQuery(`SELECT recipeID FROM dbo.UserRecipes WHERE userID='${user_id}' and Saved='1'`);
    let promises = [];
    FavRecipes.map((FavRecipe) => promises.push(axios.get(recipes_api_url+"/"+FavRecipe.recipeID+"/information?"+apikey)));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractRelevantRecipeData(info_response);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 async function getFullRecipeInfo(recipe_id) {
    let promises = [];
    promises.push(axios.get(recipes_api_url+"/"+recipe_id.recipeid+"/information?"+apikey));
    let info_response = await Promise.all(promises);
    relevantRecipeData = extractFullRecipeData(info_response);
    console.log("returned recipes:"+relevantRecipeData);
    return relevantRecipeData;
 };

 function extractRelevantRecipeData(Recipes_info) {
    return Recipes_info.map((recipeInfo) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipeInfo.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan, 
            glutenFree: glutenFree,
            image: image,
        };
    });
 }

 function extractRandomRelevantRecipeData(Recipes_info) {
    return Recipes_info.map((recipeInfo) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipeInfo;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan, 
            glutenFree: glutenFree,
            image: image,
        };
    });
 }

 
 function extractFullRecipeData(Recipes_info) {
    return Recipes_info.map((recipeInfo) => {
        const {
            id,
            title,
            readyInMinutes,
            servings,
            pricePerServing,
            healthScore,
            cheap,
            analyzedInstructions,
            extendedIngredients,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipeInfo.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            servings: servings,
            pricePerServing: pricePerServing,
            healthScore: healthScore,
            cheap: cheap,
            instructions: analyzedInstructions,
            JsonIngredients: getIngredientNamesAndAmounts(extendedIngredients),
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan, 
            glutenFree: glutenFree,
            image: image,
        };
    });
 }
 
//  function getinstructions(instructions){
//     return instructions.map((instructions) => {
//         const {
//             original,
//         } = instructions;
//         return {
//             NameAndAmount: original,
//         };
//     });
// }


 function getIngredientNamesAndAmounts(JsonIngredients){
    return JsonIngredients.map((ingrediant_info) => {
        const {
            original,
        } = ingrediant_info;
        return {
            NameAndAmount: original,
        };
    });
}

 async function promiseAll(func, param_list) {
    let promises = [];
    param_list.map((param) => promises.push(func(param)));
    let info_response = await Promise.all(promises);
    console.log("info_response: "+info_response);
    return info_response;
 };
 
 function extractSearchResultsIds(search_response) {
    let recipes = search_response.data.results;
    recipes_id_list = [];
    recipes.map((recipe) => {
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}


exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastSeenRecipes = getLastSeenRecipes;
exports.getRandomRecipeInfo = getRandomRecipeInfo;
exports.getFullRecipeInfo = getFullRecipeInfo;
exports.SearchForRecipes = searchForRecipes;
exports.extractQuerieParams = extractQueriesParams;