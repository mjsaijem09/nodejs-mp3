const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv/config');

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('assets'));

// Routes
const mp3Route = require('./views/index');
const { urlencoded } = require('body-parser');
app.use('/', mp3Route);

// Databse Connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('Connected to Databse');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Connected to server 3000');
});