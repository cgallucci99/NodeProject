var express = require("express"),
    fetch = require('node-fetch');
var app = express();
app.set('view engine', 'ejs');

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

app.listen(3000, '0.0.0.0', function() {
    console.log("listening on port 3000");
})
