const { response } = require("express");
const express = require("express");
const Joi = require("joi");

const app = express();

const joi = require("joi");

const multer = require("multer");

app.use(express.static("public"));

app.use(express.json());

const upload = multer({dest:__dirname + "/public/images"});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let foods = [
    {id:1 , name:"Hot Dog", description: "Weiner on a bun", review:"Super yummy!", rating: "5/10", condiments:["chili", "cheese", "mayo"],},
    {id:2, name:"Hamburger", description:"Patty with condiments in a bun", review:"Wack!", rating: "8/10", condiments:["cheese", "mayo", "mustard"],},
    {id:3, name:"Pizza", description:"Bread with melted cheese", review:"So delicious!", rating: "9/10", condiments:["cheese", "sausage", "olives"],}
]

app.get("/api/foods", (req, res) => {
    res.send(foods);
});

app.post("/api/foods", upload.single("img"), (req, res) => {
    console.log(req.body);
    const result = validateFood(req.body);

    if(!result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const food = {
        id: foods.length+1,
        name: req.body.name,
        description: req.body.description,
        review: req.body.review,
        rating: req.body.rating,
        condiments: req.body.condiments.split(","),
    }

    foods.push(food);
    res.send(food);
});

const validateFood = (food) => {
    const schema = Joi.object({
        id : Joi.allow(" "),
        name: Joi.string().min(3).required,
        description: Joi.string().min(3).required,
        rating: joi.allow(" "),
    });

    return schema.validate(food);
}

app.listen(3000, () =>{
    console.log("Im listening");
}); 