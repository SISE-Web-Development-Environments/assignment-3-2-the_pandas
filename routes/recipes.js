const express = require("express");
const router = express.Router();
const Searcher = require("./utils/Search")
const db_util = require("./utils/db_utils")


router.use((req,res,next) => {
   console.log("Recipes Route");
   next();
});

//get -> 3 random recipes
router.get("/",(req,res) => {
    console.log("getting 3 random recipes");
    search_params = {};
    search_params.number = 3;
    Searcher.getRandomRecipeInfo(search_params)
    .then((info_array) => {
        // db_util.checkUserandRecipe(info_array[0].id,req.session.user_id);
        return db_util.checkUserandRecipe(info_array,req.session.user_id)
    }).then((Recipes) => {
        res.send(Recipes);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//get -> search recipe by query and number of returned results
router.get("/search/query/:searchQuery/amount/:num",(req,res) => {
    const {searchQuery,num} = req.params;
    search_params = {};
    search_params.query = searchQuery;
    search_params.number = num;
    search_params.instructionsRequired = true;
    console.log(req.query);
    Searcher.extractQuerieParams(req.query,search_params);
    Searcher.SearchForRecipes(search_params)
    .then((info_array) => {
        res.send(info_array);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//get -> get information on a recipe by recipe ID
router.get("/search/:recipeid",(req,res) => {
    const recipeid = req.params;
    let recipetoget = {};
    recipetoget.id = recipeid;
    recipetoget.instructionsRequired = true;
    console.log(req.query);
    console.log("fetching a recipe for userid:"+req.session.user_id);
    Searcher.getFullRecipeInfo(recipetoget.id)
    .then((info_array) => {
        db_util.updateUserandRecipe(recipetoget.id.recipeid,req.session.user_id)
        db_util.updateUserLastSeenRecipes(recipetoget.id.recipeid,req.session.user_id)
        res.send(info_array);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//post -> create a new recipe
router.post("/newRecipe",(req,res) => {
    console.log("im uploading a new recipe");
    recipe_params = {};
    recipe_params.username = req.session.user_id;
    recipe_params.title = req.body.title;
    recipe_params.readyInMinutes = req.body.readyInMinutes;
    recipe_params.image = req.body.image;
    recipe_params.likes = 0;
    recipe_params.vegan = req.body.vegan;
    recipe_params.healthScore = req.body.healthScore;
    recipe_params.vegetarian = req.body.vegetarian;
    recipe_params.glutenFree = req.body.glutenFree;
    recipe_params.instructions = req.body.instructions;
    recipe_params.extendedIngredients = req.body.extendedIngredients;
    recipe_params.servings = req.body.servings;
    db_util.createNewRecipe(recipe_params).then(()=> {
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//get-> function that gets the users personal recipes
router.get("/getMyPersonalRecipes",(req,res) => {
    console.log("im getting your personal recipes");
    let user_id = req.session.user_id;
    let result = db_util.getPersonalRecipes(user_id)
    .then((result) => {
        if (result.length > 0)
            res.send(result);
        else{
            console.log("you have no personal recipes");
            res.sendStatus(200);
        }
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//post -> create a new family recipe
router.post("/newFamilyRecipe",(req,res) => {
    console.log("im uploading a new family recipe");
    recipe_params = {};
    recipe_params.username = req.session.user_id;
    recipe_params.title = req.body.title;
    recipe_params.owner = req.body.owner;
    recipe_params.image = req.body.image;
    recipe_params.periodOfTime = req.body.periodOfTime;
    recipe_params.instructions = req.body.instructions;
    recipe_params.extendedIngredients = req.body.extendedIngredients;
    db_util.createNewFamilyRecipe(recipe_params).then(()=> {
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//get-> function that gets the users family recipes
router.get("/getMyFamilyRecipes",(req,res) => {
    console.log("im getting your family recipes");
    let user_id = req.session.user_id;
    let result = db_util.getFamilyRecipes(user_id)
    .then((result) => {
        if (result.length > 0)
            res.send(result);
        else{
            console.log("you have no family recipes");
            res.sendStatus(200);
        }
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});



module.exports = router;
