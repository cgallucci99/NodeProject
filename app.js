var express = require("express"),
    fetch = require('node-fetch'),
    bodyParser = require('body-parser'),
    fs = require('fs');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

var pw = config.pw;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:"+pw+"@recipes-rcffv.mongodb.net/recipes?retryWrites=true&w=majority";


app.get('/', (req, res) => {
  res.render('index');
})

app.get("/search", function(req, res) {
    fetch('https://api.spoonacular.com/recipes/search?query='+req.query.search+'&number=5&apiKey=62db462a6cb442368aa7f2cb1af3a615')
    .then(response => response.json())
    .then(body => {
        res.render('search', {results: body.results});
    })
    .catch(err => {
        res.send('oops, there was an error')
        console.log(err);
    });
});

app.post("/addRecipe", function(req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("recipes");
        collection.insertOne({user:req.body.user, recipeID:req.body.recipe}, function (err, r) {
            if (err) {
                console.log(err)
                res.send('fail');
            }
            else {
                console.log(r.result.n);
                res.send('success');
            }
        });
        client.close();
    });
    //   res.send('sucess');
})

app.listen(3000, '0.0.0.0', function() {
    console.log("listening on port 3000");
})
