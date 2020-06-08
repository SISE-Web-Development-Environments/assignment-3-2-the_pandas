var express = require("express");
var router = express.Router();
var db_util = require("./utils/db_utils")

const { v1:uuidv1 } = require("uuid");
const bcrypt = require("bcryptjs");
const auth_util = require("./utils/auth_utils");

// router.use((req,res,next) => {
//     if(req.body.email && req.body.password) {
//         next();
//     }
//     else
//         res.sendStatus(401);
// });

module.exports = router;

// post-> register as a new user
router.post("/register", async function(req, res){
    let user_data = req.body;
    let user = await auth_util.getSpecificUserFromDb(user_data.userName);
    if(user.length==1)
        res.send("Username already exists. Login or use a different Email address or username.");
    else{
        try {
            let HashPass = await auth_util.checkPasswordandhash(user_data.password,user_data.confirmedPassword);
            db_util.registerNewUserInDb(req,HashPass);
            res.sendStatus(201);
          } catch (error) {
            res.sendStatus(404);
          } 
    }
    });

// post-> login  function
router.post("/login",async function(req, res){
    let userName = req.body.userName;
    let pass = req.body.password;
    try {
        let user = await auth_util.attemptLogin(userName,pass)
        req.session.user_id = user[0].user_id;
        res.status(200).send({ message: "login succeeded", success: true });
      } catch (error) {
        console.log(error);
        res.sendStatus(404);
      } 
    });

// post-> logout
router.post("/Logout", function (req, res) {
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.send({ success: true, message: "logout succeeded" });
});


