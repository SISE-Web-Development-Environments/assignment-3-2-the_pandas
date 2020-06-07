
var saltRounds = 14;
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");

const axios = require("axios");
const CryptoJS = require("crypto-js");
require("dotenv").config();

var db_util = require("./db_utils")
const bcrypt = require("bcrypt");

//gets all users from database(users table)
async function getUsersFromDb(){
    let users = await db_util.execQuery("SELECT username, userPassword FROM dbo.Users");
    return users;
}

//gets specific user from users table
async function getSpecificUserFromDb(username){
    let user = await db_util.execQuery("SELECT username,user_id,userPassword FROM dbo.Users WHERE username='"+username+"'");
    return user;
}

//checks if a username already exists in the database
async function userFound(users,username){
    if (users.find((x) => x.userName === username)) {
        throw { status: 409, message: "Username taken" };
    }
    return;
}

//checks if the login password matches the hashed password
function checkPasswordandhash(password, confirmedPassword){
    if (password === confirmedPassword) {
        let hash_password = bcrypt.hashSync(
            password,
            saltRounds
        );
        return hash_password;
    }
    else{
        return null;
    }
}

//login function
async function attemptLogin(username, password){
    let users = await getUsersFromDb();
    if (!users.find((x) => x.username === username))
        throw { status: 401, message: "Username or Password incorrect" };
    let user = await getSpecificUserFromDb(username);
    let DBpass = user[0].userPassword;
    if (!bcrypt.compareSync(password, DBpass)) {
        throw { status: 401, message: "Username or Password incorrect" };
    }
    return user;
}

exports.attemptLogin = attemptLogin;

exports.getUsersFromDb = getUsersFromDb;

exports.userFound = userFound;

exports.checkPasswordandhash = checkPasswordandhash;

exports.getSpecificUserFromDb = getSpecificUserFromDb;
