const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require("mongoose");
const passport = require('passport');
const responseTime = require('response-time');
const redis = require('redis-promisify');

const client = redis.createClient({ host: process.env.REDIS_HOST, port: 6379 });
client.on("error", function (err) {
  console.log("Error " + err);
});
const User = require('./models/User');


require('./auth');
const authRoutes = require('./routes/authRoute');
const vaRoutes = require('./routes/vaRoute');
const adminRoutes = require('./routes/adminRoute');

// connect to mongodb & listen for requests
const dbURI = 'mongodb+srv://adraju:Abcd1234@cluster0.2nn26wj.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(PORT))
  .catch(err => console.log(err));

// express app
const app = express();

app.use(responseTime());

// register view engine
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');

//sessions
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(authRoutes);
app.use(vaRoutes);
app.use(adminRoutes);
//admin routes

// 404 page
app.use((req, res) => {
  if(req.user)
  User.findOne({email:req.user.email}, "role",  (err, result) => {
    if (err) return handleError(err);
    res.render('404',{title: '404 Error',  currentUser: req.user?req.user:"", role: result.role[0]});
  });
  else
    res.render('404',{title: '404 Error',  currentUser: req.user?req.user:"", role: ""});
});
