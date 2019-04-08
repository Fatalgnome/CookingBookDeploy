const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
var http = require('http').Server(app);
var io = require('socket.io')(http);
/****** Configuration *****/
const port = (process.env.PORT || 8080);
var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/Recipe';
mongoose.connect(dbUrl, (error) => {
    console.log('mongo connect', error)
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'console error:'));
db.once('open', function () {
    console.log('We are connected!');
});


// Additional headers to avoid triggering CORS security errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});

/****** Data *****/
let recipeSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    ingredients: [String],
    prep_time: Number,
    total_time: Number
});

let Recipe = mongoose.model('recipe', recipeSchema);

const data = [
    new Recipe({
        title: "Pizza",
        description: "Pizza is nice",
        ingredients: ['cheese', 'tomato', 'onion'],
        prep_time: 20,
        total_time: 30
    }),
    new Recipe({
        title: "Vegetable Quiche",
        description: "Nice with shredded zucchini",
        ingredients: ['cheese', 'zucchini', 'onion'],
        prep_time: 30,
        total_time: 90
    }),
    new Recipe({
        title: "Baked Potato with Fried Eggs",
        description: "Served with bakes beans",
        ingredients: ['potato', 'beans', 'egg'],
        prep_time: 10,
        total_time: 70
    }),
];

/****** Helper functions *****/
function getRecipeFromId(id) {
    return data.find((elm) => elm.id === Number(id));
}

function filterByIngredient(ingredient) {
    return data.filter((elm) => elm.ingredients.includes(ingredient))

}

function findNextId() {
    const reducer = (acc, curr) => Math.max(acc, curr);
    let nextId = data.map(el => el.id).reduce(reducer) + 1;
    return nextId;
}

/****** Routes *****/
// TODO: Create route handlers!
// get all recipes

app.get('/api/recipes', (req, res) => {
    Recipes.find({}, (error, recipes));
    res.send(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    data.map((data) => {
        if (data.id === id) {
            return res.status(200).send({
                success: 'true',
                message: 'recipe retrieved successfully',
                data,
            });
        }
    });
});

app.get('/api/recipes/:ingredient', function(req, res) {
    var ingredient = req.params.ingredients;
    /*filterByIngredient(ingredient, function (error, rece) {
        
    })*/
    data.map((data) => {
        if (filterByIngredient(ingredient)) {
            return res.status(200).send({
                success: 'true',
                message: 'recipe retrieved successfully',
                data,
            });
        }
    });
});

app.post('/api/recipes' ,(req, res) => {
    res.json({msg: `You have posted this data: ${req.body.data}`});
    let newRecipe = new Recipe(
        {
        title: req.body.title,
        description:req.body.description,
        ingredients: req.body.ingredients,
        prep_time: req.body.prep_time,
        total_time: req.body.total_time
        });

    newRecipe.save((error,recipe) =>{
        if(error){return console.log(error);}
        else{console.log("Recipe Saved", recipe);}
    });



    data.push(req.body);

    res.json({
        msg: `You have posted this data: ${req.body.title}`,
        newRecipe: newRecipe});
});

/*var server = http.listen(port, () => {
    console.log(`Server is running on ${port}`, server.address().port)
});*/

app.listen(port, () => console.log(`Cooking API running on port ${port}!`));

