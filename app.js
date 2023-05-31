require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongooose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const findOrCreate = require('mongoose-findorcreate')

const app = express()


app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
  secret: "This is a test!",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
})

userSchema.plugin(passportLocalMongooose)
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(function(user, done) {
  done(null, user._id);
  // if you use Model.id as your idAttribute maybe you'd want
  // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets"
},
function(accessToken, refreshToken, profile, cb) {
  // console.log(profile);
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get("/", function (req, res) {
    res.render("home")  
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }
))

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  });

app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.get("/secrets", function (req, res) {
  User.find({"secret": {$ne: null}})
  .then((user) =>{
    try{
      res.render("secrets", {usersWithSecrets: user})
    } catch(error){
      console.log(error);
    }
  })
})

app.get("/logout", function (req,res) {
  req.logOut(function () {
      res.redirect("/")
  })
})

app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("submit")
  } else {
    res.redirect("/login")
  }
})

app.post("/register", function (req,res) {
  User.register({username: req.body.username}, req.body.password)
  .then((user) =>{
    try {
      passport.authenticate("local")(req,res, function () {
        res.redirect("/secrets")
      })
    }
    catch (error) {
      console.log(error)
      res.redirect("/register")
    }
  })
})

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, function (error) {
    try {
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets")
      })
    }
    catch (error) {
      console.log(error)
      res.redirect("/login")
    }
  })
})

app.post("/submit", function (req, res) {
  const submittedSecret = req.body.secret;

  User.findById(req.user.id)
    .then((user) => {
      try {
        user.secret = submittedSecret;
        return user.save(); // Return the Promise from save() method
      } catch (error) {
        console.log(error);
        res.redirect("/register");
      }
    })
    .then(() => {
      res.redirect("/secrets"); // Redirect only after user.save() completes successfully
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/register");
    });
});

  


app.listen(3000, function () {
    console.log("Server started on port 3000...");
})
