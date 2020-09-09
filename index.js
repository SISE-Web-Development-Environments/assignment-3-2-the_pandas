// Libraries
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require('dotenv').config();
const session = require("client-sessions");


// routes
const auth = require("./routes/auth.js");
const users = require("./routes/users");
const recipes = require("./routes/recipes");

//ToDelete -----------------------------------------
const Zoo = require("./routes/Zoo");
// -------------------------------------------------

// app settings and config
const app = express();
const port =process.env.PORT || "4000";

// app.use(cors());
const corsConfig = {
    origin: true,
    credentials: true,
  };
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms"));





app.use(
    session({
        cookieName: "session",
        secret: "PandaCookie",
        duration: 24*1000*3600,
        activeDuration: 0,
        cookie: {
            httpOnly: false,
            ephemeral: true
        }
    })
);

app.get("/alive",(req,res) => {
    res.send("Alive");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('Origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

//routing
app.use("/users",users);
app.use("/recipes",recipes);
app.use("/Zoo",Zoo);
app.use(auth);

//default router
app.use((req,res) => {
    res.sendStatus(404);
});


app.listen(port, () => {
    console.log('Example app listening on port '+port+'!');
});


