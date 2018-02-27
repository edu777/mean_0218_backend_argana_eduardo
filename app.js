
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/*Routes declaration*/
var articleRoute = require('./routes/article.route');
var usersRoute = require('./routes/users.route');
var authRoute = require('./routes/auth.route');

var app = express();

app.use(function(request, response, next){
    response.header('Access-Control-Allow-origin', 'http://localhost:4200');
    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETED');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content_type, Accept');
    next();
    });  

  
    mongoose.connect('mongodb://localhost/exampledb');

    mongoose.connection.on('error',function () {
    console.log('error..............');
    });
    mongoose.connection.once('open', function () {
    console.log('We are conected to mongodb ;)');
    });


    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({
        extended: false
        }));
    app.use(bodyParser.json());

/*Add routes to app*/
    app.use('/article', articleRoute);
    app.use('/users', usersRoute);
    app.use('/auth', authRoute);

    app.listen(3000,function () {
        console.log('corriendo en el puerto 3000');
      }); 
      



