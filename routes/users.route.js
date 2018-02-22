
var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
//nos devuelve una lista
    router.get('/',function (request, response) {
       //{} criterio de seleccion
       //{} que se va a mostrar id apellido, name
       //null a que se limita
        userModel.find({
            deleted:false
        }, {
            password:0,
            deleted:0,
            __v:0
        }, null, function (err, userList) {
            if (err) {
              return response.status(500).send({
                message: 'Thera was a problem retrieving the user list',
                error: err
              });
            } else {
              response.send({
                message: 'The user list has been retrieved',
                data:userList
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
               userCreated.speak();    

               response.send({message:'A new user has been created',
               data:userCreated.getDtoUser()
            });
           }  
       }); 
       
        // response.send('accediendo a usuarios con el metodo post');
        //console.log('log post: ',request.body);
        //userModel.create(request.body, function (err, user) {
       // });
    });
    
    router.put('/:id',function (request, response) {
        userModel.findOne({
            _id:request.params.id,
            deleted:false
        },function(err,userFound){
            if(err)
                return response.status(500).send({
                message:'There was a problem to find the user, error server',
                error:err    
            });
            if(!userFound)
            return response,status(404).send({
                message:'There was a problem to find the user, invalid id',
                error:''
            });
            for(var propiedad in request.body)
            userFound[propiedad]=request.body[propiedad];
            userFound.save(function(error,userUpdated){
                if(error)
                return response.status(500).send({
                message:'There was a problem to update the user, error serve',
                error:error  
                 });
                 response.send({
                    message:'The user has been updated',
                    data: userUpdated.getDtoUser()
                });
            }); 
        });
    });

    router.delete('/:id', function (request, response) {
        userModel.findOne({
            _id:request.params.id,
            deleted:false
        },function(err,userFound){
            if(err)
                return response.status(500).send({
                message:'There was a problem to delete the user, error serve',
                error:err    
            });
            if(!userFound)
            return response(404).send({
                message:'There was a problem to get the user (invalid id)',
                error:''
            });
            userFound.deleted=true;


            userFound.save(function (error,userUpdated){
                if(error)
                return response.status(500).send({
                message:'There was a problem to delete the user, error serve',
                error:error  
            });
            response.send({
                message:'The user has been deleted',
                data: userUpdated.getDtoUser()
            });
        });
    });
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
                        data:userFound.getDtoUser()
                    });
                 }
        }); 
        
    });

    module.exports = router;