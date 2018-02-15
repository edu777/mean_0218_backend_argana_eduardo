
var express = require('express');
var app = express();
var usersRoute = require('./routes/users.route');

    app.get('/',function (request, response) {
    response.send('Hola mundo');
    });
    
    app.use('/users', usersRoute);

    app.listen(3000,function () {
        console.log('corriendo en el puerto 3000');
      }); 
      



