const express = require("express");
const router = express.Router();
const Searcher = require("./utils/Search")
const db_util = require("./utils/db_utils")


router.use((req,res,next) => {
   console.log("Recipes Route");
   next();
});

router.get("/",(req,res) => {
    console.log("getting 3 random recipes");
    search_params = {};
    search_params.number = 3;
    Searcher.getRandomRecipeInfo(search_params)
    .then((info_array) => {
        db_util.checkUserandRecipe(info_array[0].id,req.session.user_id)
        res.send(info_array);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

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
//res.send(info_array)

router.get("/search/:recipeid",(req,res) => {
    const recipeid = req.params;
    let recipetoget = {};
    recipetoget.id = recipeid;
    recipetoget.instructionsRequired = true;
    console.log(req.query);
    Searcher.getFullRecipeInfo(recipetoget.id)
    .then((info_array) => {
        db_util.updateUserandRecipe(recipetoget.id.recipeid,req.session.user_id)
        res.send(info_array);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});


module.exports = router;
