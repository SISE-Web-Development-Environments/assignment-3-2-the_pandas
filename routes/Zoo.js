var express = require("express");
var router = express.Router();


router.get("/:CageID",(req,res) => {
    const CageID = req.params;
    let Cage1 = {};
    Cage1.Animalone = Lion;
    Cage1.Animaltwo = Tiger;
    let Cage2 = {};
    Cage2.Animalone = Giraffe;
    Cage2.Animalone = Ostrich;
    if(CageID==1){
        res.send(Cage1);
    }
    else if(CageID == 2) {
        res.send(Cage2);
    }
    else {
        res.sendStatus(500);
    }
});

router.get("/",(req,res) => {
    let Cages = {};
    Cages.Cage1 = 1;
    Cages.Cage2 = 2;
    res.send(Cages);
});

module.exports = router;
