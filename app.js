const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//use public folder
app.use(express.static(path.join(__dirname, '/assets')));

// Routes
const mp3Route = require('./routes/mp3')
app.use('/', mp3Route);

// Databse Connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('Connected to Databse');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Connected to server 3000');
});
