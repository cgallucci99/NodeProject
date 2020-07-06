var express = require("express"),
    // fetch       = require('node-fetch'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    mongo = require('mongodb'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    cors = require('cors'),
    path = require('path'),
    multer = require('multer');
require('dotenv').config();
var app = express();
app.use(express.static(path.join(__dirname, '/build')));
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

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

app.post('/api/createRecipe', isAuthenticated, function (req, res) {
    var img = req.body.image;
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.json({ message: 'fail', why: req.fileValidationError })
        } else if (err instanceof multer.MulterError) {
            return res.json({ message: 'fail', why: err })
        } else if (err) {
            return res.json({ message: 'fail', why: err })
        }
        img = req.file.path;
    });
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("recipes");
        const userID = new mongo.ObjectID(req.user._id);
        var newRecipe = {
            userID: userID,
            title: req.body.title,
            time: req.body.time,
            servings: req.body.servings,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            image: img
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

app.get('/api/getUserRecipes', isAuthenticated, function(req, res) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("recipes");
        const userID = new mongo.ObjectID(req.user._id);
        collection.find({userID: userID}).toArray(function(e, result) {
            if (e) {
                return res.json({message: 'fail'});
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
