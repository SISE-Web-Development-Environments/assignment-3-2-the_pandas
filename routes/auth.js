var express = require("express");
var router = express.Router();
var db_util = require("./utils/db_utils");

const { v1: uuidv1 } = require("uuid");
const bcrypt = require("bcryptjs");
const auth_util = require("./utils/auth_utils");

module.exports = router;

// post-> register as a new user
router.post("/register", async function (req, res) {
  let user_data = req.body;
  let user = await auth_util.getSpecificUserFromDb(user_data.userName);
  if (user.length == 1)
    res
      .sendStatus(400)
      .statusMessage(
        "Username already exists. Login or use a different username."
      );
  else {
    try {
      let HashPass = await auth_util.checkPasswordandhash(
        user_data.password,
        user_data.confirmedPassword
      );
      db_util.registerNewUserInDb(req, HashPass);
      res.sendStatus(201);
    } catch (error) {
      res.sendStatus(404);
    }
  }
});

router.post("/login", async function (req, res) {
  let userName = req.body.userName;
  let pass = req.body.password;
  try {
    let user = await auth_util.attemptLogin(userName, pass);
    req.session.user_id = user[0].user_id;
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});
