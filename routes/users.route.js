
var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');


    router.get('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo get');
      });
    
    router.post('/',function (request, response) {
       // response.send('accediendo a usuarios con el metodo post');
        //console.log('log post: ',request.body);
        userModel.create(request.body, function (err, user) {

            });
    });
    
    router.put('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo put');
        //console.log('log post: ',request.body);
        console.log('log put: ',request.body);
    });
    router.delete('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo delete');
    });

    router.get('/find', function (request, response) {
          response.send('buscando un users con el metodo get');
    });

    module.exports = router;