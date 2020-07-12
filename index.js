require('dotenv').config();
// Libraries
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const session = require("client-sessions");


// routes
const auth = require("./routes/auth.js");
const users = require("./routes/users");
const recipes = require("./routes/recipes");


// app settings and config
const app = express();
const port =process.env.PORT || "4000";
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms"));


const corsConfig = {
    origin: true,
    credentials: true,
  };
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// app.use(cors());


app.use(
    session({
        cookieName: "session",
        secret: "PandaCookie",
        duration: 24*1000*3600,
        activeDuration: 0,
        cookie: {
            httpOnly: false
        }
    })
);

app.get("/alive",(req,res) => {
    res.send("Alive");
});


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
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


