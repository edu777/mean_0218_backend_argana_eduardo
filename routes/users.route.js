
var express = require('express');
var router = express.Router();


    router.get('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo get');
      });
    
    router.post('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo post');
        console.log('log post: ',request.body);
    });
    
    router.put('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo put');
        console.log('log post: ',request.body);
    });
    router.delete('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo delete');
    });

    router.get('/find', function (request, response) {
          response.send('buscando un users con el metodo get');
    });

    module.exports = router;