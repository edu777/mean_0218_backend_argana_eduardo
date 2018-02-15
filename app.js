var express = require('express');
var app = express();
app.get('/',function (request, response) {
  response.send('Hola mundo');
});

    app.get('/usuarios',function (request, response) {
      response.send('accediendo a usuarios con el metodo get');
    });
    
    app.post('/usuarios',function (request, response) {
      response.send('accediendo a usuarios con el metodo post');
    });
    
    app.put('/usuarios',function (request, response) {
      response.send('accediendo a usuarios con el metodo put');
    });
    
    app.delete('/usuarios',function (request, response) {
      response.send('accediendo a usuarios con el metodo delete');
    });
    
     app.listen(3000,function () {
       console.log('corriendo en el puerto 3000');
     }); 