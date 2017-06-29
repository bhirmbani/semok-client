const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors());

// passport
const Worker = require('./controllers/worker');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, Worker.login));

// port setup
app.set('port', process.env.PORT || 3000);

// bodyparser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
const worker = require('./routes/worker');
const item = require('./routes/item');

// use the route
app.use('/api/worker', worker);
app.use('/api/item', item);

app.listen(app.get('port'), () => {
  console.log(`app listening on ${app.get('port')}`);
});

module.exports = app;
