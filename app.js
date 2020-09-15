var express = require('express');
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
var server = require('http').createServer(app);

var storage = multer.diskStorage({
    destination: function (req, file, cd) {
        if (file.fieldname === 'featured_img') {
            cd(null, './assets/uploads/featured-img');
        }

        else if (file.fieldname === 'audio') {
            cd(null, './assets/uploads/audio-file');
        }
    },

    filename: function (req, file, cd) {
      cd(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({storage: storage});

// Set Database Connection
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodejs_crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req, res) => {
    let sql = "SELECT * FROM music";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('music_index', { 
            music : rows
        });
    });
});

var cpUpload = upload.fields([{ name: 'featured_img', maxCount: 1}, { name: 'audio', maxCount: 1}]);
app.post('/save', cpUpload, function (req, res, next) { 
    let data = {
        featured_img: req.files.featured_img[0].filename, 
        title: req.body.title, 
        band_name: req.body.band_name, 
        audio: req.files.audio[0].filename
    };
    let sql = "INSERT INTO music SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      console.log('\n', data, '\n', "Data successfully inserted...");
      res.redirect('/');
    });
});

var port = process.env.PORT || 3000;

// Server Listening
server.listen(port, function () {
    console.log('Server successfully running at: -',port);
});