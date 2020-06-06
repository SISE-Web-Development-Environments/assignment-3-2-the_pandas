var express = require("express");
var router = express.Router();

router.use((req,res,next) => {
    if(req.session && req.session.id) {
        const id = req.session.id;
        const user = checkIDinDB(id);
        if(user){
            req.user = user;
            next();
        }
    }
res.sendStatus(401);
});

router.get("/recipeInfo/{ids}",(req,res) => {
    const ids =JSON.parse( req.params.ids);
    const user_name = req.user;
    console.log(ids,user_name);
    const userRecipesData= getUserInfoOnRecipes(user_name, ids);
    res.send(userRecipesData);
});

module.exports = router;
