var express = require("express");
var router = express.Router();
const Searcher = require("./utils/Search")
const auth_util = require("./utils/auth_utils");
const db_util = require("./utils/db_utils")

router.use((req,res,next) => {
    if(req.session.user_id) {
        const id = req.session.user_id;
        const user = auth_util.getSpecificUserFromDbwithid(id);
        if(user){
            next();
        }
    }
    else{
        res.sendStatus(401);
    }
});

//get -> get information on a recipe by recipe ID
router.get("/Favorite/:recipeid",(req,res) => {
    const recipeid = req.params;
    let RecipeToSave = recipeid;
    db_util.updateSaveRecipe(RecipeToSave.recipeid, req.session.user_id)
    .then(() => {
        res.send({Message: "Saved Recipe as Favorite"});
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

//get -> get information on a recipe by recipe ID
router.get("/getFavorites",(req,res) => {
    const id = req.session.user_id;
    Searcher.getFavoriteRecipes(id)
    .then((info_array) => {
        res.send(info_array);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

router.get("/recipeInfo/{ids}",(req,res) => {
    const ids =JSON.parse( req.params.ids);
    const user_name = req.user;
    console.log(ids,user_name);
    const userRecipesData= getUserInfoOnRecipes(user_name, ids);
    res.send(userRecipesData);
});

router.get("/lastWatched/",(req,res) => {
    const id = req.session.user_id;
    Searcher.getLastSeenRecipes(id)
    .then((info_array) => {
        res.send(info_array);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

module.exports = router;
