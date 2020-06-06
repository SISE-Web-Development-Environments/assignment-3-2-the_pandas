// Libraries
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");

// routes
const auth = require("./routes/auth.js");
const users = require("./routes/users");
const recipes = require("./routes/recipes");


// app settings and config
const app = express();
const port = 4000;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms"));

app.use(
    session({
        cookieName: "session",
        secret: "PandaCookie",
        duration: 24*1000*3600,
        activeDuration: 0,
    })
);

app.get("/alive",(req,res) => {
    res.send("Alive");
});

//routing
app.use("/users",users);
app.use("/recipes",recipes);
app.use(auth);

//default router
app.use((req,res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log('Example app listening on port '+port+'!');
});


