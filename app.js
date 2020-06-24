var express     = require("express"),
    fetch       = require('node-fetch'),
    bodyParser  = require('body-parser'),
    passport    = require('passport'),
    session     = require('express-session'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();
var app = express();
app.set('view engine', 'ejs');
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

function isAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// connect db
var pw = process.env.pw;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:"+pw+"@recipes-rcffv.mongodb.net/recipes?retryWrites=true&w=majority";

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const client = new MongoClient(uri,{poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
    client.connect(err => {
      const collection = client.db("recipes").collection("users");
      collection.findOne({ googleId: profile.id})
      .then(user => {
        if (user) {
            return done(null, user);
        } else {
            collection.insertOne({ googleId: profile.id, name: profile.name })
            .then(u => {
                return done (null, u);
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
})

app.get('/profile/', isAuthenticated, (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("recipes").collection("recipes");
        collection.findOne({_id:req.user._id})
        .then(user => {
            res.render('profile', {user:req.user});
        })

        // collection.findOne({user:req.params.user}, (err, foundUser) => {
        //     if(err) {
        //         console.log(err);
        //         res.send('error')
        //     } else {
        //         console.log(foundUser);
        //         res.send(foundUser);
        //     }
        // });
        // client.close();
    });
})

app.get('/login', function(req, res) {
    res.render('login');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/');
});


// api routes
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
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

// start server
app.listen(3000, '0.0.0.0', function() {
    console.log("listening on port 3000");
})
