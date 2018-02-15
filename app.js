
var express = require('express');
var app = express();

    app.get('/',function (request, response) {
    response.send('Hola mundo');
    });

    app.get('/',function (request, response) {
    app.route('/usuarios')
    .get(function (request, response) {
        response.send('accediendo a usuarios con el metodo get');
      });

    app.post(function (request, response) {
    })
    .post(function (request, response) {
        response.send('accediendo a usuarios con el metodo get');
    });
    
    app.put(function (request, response) {
    })
    .put(function (request, response) {
        response.send('accediendo a usuarios con el metodo get');
    });
    
    app.delete(function (request, response) {
    })
    .delete(function (request, response) {
        response.send('accediendo a usuarios con el metodo get');
    });
    
    
    });
    
    app.listen(3000,function () {
        console.log('corriendo en el puerto 3000');
      }); 
      



