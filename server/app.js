var express = require("express"),
    fetch = require('node-fetch'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    mongo = require('mongodb'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    cors = require('cors'),
    path = require('path'),
    multer = require('multer'),
    FormData = require('form-data');
require('dotenv').config();
var app = express();
app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: "Recipes",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000 // max login session is 1 hour
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

// Middleware to check if there is currently an authenticated user
function isAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(404).json({ 'message': 'not logged in' });
    }
}

// Set up db connection string
var pw = process.env.pw;
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://admin:" + pw + "@recipes-rcffv.mongodb.net/recipes?retryWrites=true&w=majority";

var google_redirect;
if (process.env.development == 'true') {
    google_redirect = "http://localhost:8000/api/auth/google/callback"
} else {
    google_redirect = "http://ec2-13-59-8-125.us-east-2.compute.amazonaws.com/api/auth/google/callback"
}

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: google_redirect
},
    function (accessToken, refreshToken, profile, done) {
        const client = new MongoClient(uri, { poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            const collection = client.db("recipes").collection("users");
            collection.findOne({ googleId: profile.id })
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        collection.insertOne({ googleId: profile.id, name: profile.name, recipeIDs: new Array() })
                            .then(u => {
                                console.log(u.ops[0]);
                                return done(null, u.ops[0]);
                            })
                    }
                }).then(() => {
                    client.close();
                })
        })
    }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// routes
// Adds a recipe to the current user if one is authenticated. Recipe is passed in the req.body
app.post("/addRecipe", isAuthenticated, function (req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("users");
        const userID = new mongo.ObjectID(req.user._id);
        collection.findOneAndUpdate({ _id: userID }, { $push: { recipeIDs: req.body.recipe } }, { returnOriginal: false }).then((r) => {
            req.logIn(r.value, err => {
                if (err) { return next(err); }
                res.json({ "message": 'success', user: r.value });
            });
        }).then(() => {
            client.close();
        }).catch(err => {
            res.status(402).json({ "message": 'fail' });
        });
    });
});

// Removes a recipe from a user's list
app.post('/api/removeRecipe', isAuthenticated, function (req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("users");
        const userID = new mongo.ObjectID(req.user._id);
        collection.findOneAndUpdate({ _id: userID }, { $pull: { recipeIDs: req.body.recipe } }, { returnOriginal: false })
            .then((r) => {
                req.logIn(r.value, err => {
                    if (err) { return next(err); }
                    res.json({ "message": 'success', user: r.value });
                });
            }).then(() => {
                client.close();
            }).catch(err => {
                res.status(402).json({ "message": 'fail' });
            });
    });
});

function parseNutrition(ingredients, servings) {
    var nutrition = {
        nutrients: [
            {
                "title": "Calories",
                "amount": 0,
                "unit": "cal"
            },
            {
                "title": "Fat",
                "amount": 0,
                "unit": "g"
            },
            {
                "title": "Saturated Fat",
                "amount": 0,
                "unit": "g"
            },
            {
                "title": "Carbohydrates",
                "amount": 0,
                "unit": "g"
            },
            {
                "title": "Net Carbohydrates",
                "amount": 0,
                "unit": "g"
            },
            {
                "title": "Sugar",
                "amount": 0,
                "unit": "g"
            },
            {
                "title": "Cholesterol",
                "amount": 0,
                "unit": "mg"
            },
            {
                "title": "Sodium",
                "amount": 0,
                "unit": "mg"
            },
            {
                "title": "Protein",
                "amount": 0,
                "unit": "g"
            },
        ]
    } 
    ingredients.forEach(ingredient => {
        nutrition.nutrients.forEach((nutrient, i) => {
            nutrient.amount += ingredient.nutrition.nutrients[i].amount;
        });
    });
    nutrition.nutrients.forEach(nutrient => {
        nutrient.amount = Math.round(nutrient.amount / servings);
    })
    return nutrition;
}

app.post('/api/createRecipe', isAuthenticated, multer({storage: multer.memoryStorage()}).single('image'), function (req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(async err => {
        var formData = new FormData();
        formData.append("image", req.file.buffer )
        const imgurResponse = await fetch('https://api.imgur.com/3/image', {
            method: 'post',
            headers: {
                "Authorization": `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
            body: formData
        })
        const imgurBody = await imgurResponse.json();
        var ingredients = [];
        var formBody = `ingredientList=${encodeURIComponent(req.body.ingredients)}&servings=${encodeURIComponent(req.body.servings)}&includeNutrition=true`;
        const response = await fetch('https://api.spoonacular.com/recipes/parseIngredients?apiKey=b4eb8132e6de41dbae752d1fd776be77', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formBody,
        })
        const body = await response.json();
        body.forEach((ingredient) => {
            ingredients.push({
                "name": ingredient.originalName,
                "unit": ingredient.unit,
                "image": `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`,
            })
        })
        const collection = client.db("recipes").collection("recipes");
        const userID = new mongo.ObjectID(req.user._id);
        var newRecipe = {
            userID: userID,
            title: req.body.title,
            readyInMinutes: req.body.time,
            servings: req.body.servings,
            ingredients: ingredients,
            instructions: req.body.instructions,
            image: imgurBody.data.link,
            nutrition: parseNutrition(body, req.body.servings),
            id: req.body.title.substring(0,5) + Date.now().toString(),
            summary: req.body.summary
        }
        collection.insertOne(newRecipe)
            .then(r => {
                console.log('success creating recipe')
                if (process.env.development == 'true') {
                    res.redirect('http://localhost:3000/profile')
                } else {
                    res.redirect('/profile')
                }
            })
            .then(() => {
                client.close();
            }).catch(e => {
                console.log('error creating recipe: ' + e);
                res.json({ message: 'fail' });
            });
    });
});

app.get('/api/getUserRecipes', isAuthenticated, function (req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("recipes");
        const userID = new mongo.ObjectID(req.user._id);
        collection.find({ userID: userID }).toArray(function (e, result) {
            if (e) {
                return res.json({ message: 'fail' });
            }
            res.json(result);
            client.close();
        })
    });
})

// Logout route
app.get('/api/logout', (req, res) => {
    req.logout();
    res.json({ message: "successfully logged out" });
});

// Returns the user if there is one logged in
app.get('/api/auth/login/success', function (req, res) {
    if (req.user) {
        res.json({
            success: true,
            message: "successfully authenticated user",
            user: req.user,
        });
    }
})
// GET /api/auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /api/auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }), function (req, res) {
        if (process.env.development == 'true') {
            res.redirect('http://localhost:3000/profile');
        } else {
            res.redirect('/profile');
        }
    }
);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

var PORT = 8000;

// start server
app.listen(PORT, '0.0.0.0', function () {
    console.log("listening on port 8000");
})
