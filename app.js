
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();

    app.use(morgan('dev'));

    app.use(bodyParser.urlencoded({
        extended: false
        }));
    app.use(bodyParser.json());

var usersRoute = require('./routes/users.route');

    app.get('/',function (request, response) {
    response.send('Hola mundo');
    });
    
    app.use('/users', usersRoute);

    app.listen(3000,function () {
        console.log('corriendo en el puerto 3000');
      }); 
      



