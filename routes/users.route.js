
var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');


    router.get('/',function (request, response) {
       //{} creiterio de seleccion
       //{} que se va a mostrar id apellido
       //null a que se limita
        userModel.find({},{},null,function(err,userList){
            if (err) {
               return response.status(500).send({
                   message:'Thera was a problem retrieving the user list ',
                   error:err
               }); 
            }else{
                response.send({message:'The user list has been retrieved',
            data: userList
            });
            }
        });
        
      });
    
    router.post('/',function (request, response) {
       var newUser = new userModel(request.body);
       newUser.save(function(err,userCreated){
           if(err){
               return response.status(500)
               .send({
                   message:'The was a problem registering user',
                   error:err
                })
           }else{
               response.send({message:'A new user has been created',
               data:userCreated
            });
           }
           
       }); 
       
        // response.send('accediendo a usuarios con el metodo post');
        //console.log('log post: ',request.body);
        //userModel.create(request.body, function (err, user) {

       //     });
    });
    
    router.put('/:id',function (request, response) {
        userModel.findByIdAndUpdate(request.params.id,request.body,{
            new: true
        },function(err,userUpdated){
            if(err){
                return response.status(500)
                .send({
                    message:'The was a problem updating a user',
                    error:err
                     });
             }else{
        response.send({
            message:'A user has been updated',
            data:userUpdated
        });
        
        }
        });
    });
    
    router.delete('/',function (request, response) {
        response.send('accediendo a usuarios con el metodo delete');
    });


    router.get('/:id', function (request, response) {
       //nombre
        //opciones
        userModel.findById(request.params.id, {},null, function(err, userFound){
            if(err){
                return response.status(500).send({
                    message:'The was a problem retrieving the user by id',
                    error:err
                 });
                }else{
                    response.send({
                        message:'User found by id',
                        data:userFound
                    });
                 }
        }); 
        // response.send('buscando un users con el metodo get');
    });

    module.exports = router;