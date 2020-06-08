
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


async function getUsersFromDb(){
    let users = await db_util.execQuery("SELECT username, userPassword FROM dbo.Users");
    return users;
}

async function getSpecificUserFromDb(username){
    let user = await db_util.execQuery("SELECT username,user_id,userPassword FROM dbo.Users WHERE username='"+username+"'");
    return user;
}

async function getSpecificUserFromDbwithid(id){
    let user = await db_util.execQuery("SELECT username,user_id,userPassword FROM dbo.Users WHERE user_id='"+id+"'");
    return user;
}

async function userFound(users,username){
    if (users.find((x) => x.userName === username)) {
        throw { status: 409, message: "Username taken" };
    }
    return;
}

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

async function registerNewUserInDb(req,hash_password){
    await DButils.execQuery(`INSERT INTO dbo.Users (username, firstname, lastname, country, userPassword, email, photoUser) VALUES ('${req.body.userName}', '${req.body.firstname}','${req.body.lastname}','${req.body.country}', '${hash_password}', '${req.body.email}','${req.body.linkimage}')`);
}

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

exports.registerNewUserInDb = registerNewUserInDb;

exports.checkPasswordandhash = checkPasswordandhash;

exports.getSpecificUserFromDb = getSpecificUserFromDb;

exports.getSpecificUserFromDbwithid = getSpecificUserFromDbwithid;
