
var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var  bcrypt  = require ('bcryptjs'); 
var secretkeys = require('../secret.keys');
var verifyTokenMiddleware = require('../auth/verifyTokenMiddleware');
var Client = require('node-rest-client').Client;

var client = new Client();
var randomuser = 'https://randomuser.me/api/?results=10&nat=us';
router.get('/seed', function (request, response) {
    var client = new Client();
    client.get(randomuser, function (userSeed) {
        var arrayUser = [];
        for (var i = 0; i < userSeed.results.length; i++) {
            var userse = {
                name: userSeed.results[i].name.first,
                lastname: userSeed.results[i].name.last,
                username: userSeed.results[i].login.username,
                email: userSeed.results[i].email,
                password: userSeed.results[i].login.password,
                avatar: userSeed.results[i].picture.medium,
            };
            if (userse.password) {
                var hashedPassword = bcrypt.hashSync(userse.password, secretkeys.salt);
                userse.password = hashedPassword;
            };
            arrayUser.push(userse);
        };
        userModel.create(arrayUser, function (err, userCreated) {
            if (err)
                return response.status(500).send({
                    message: 'There was a problem registering ther user',
                    error: err
                });
            response.send({
                message: 'A new user has been created',
                data: userCreated
            });
        })
    });
});

var updateMiddleware = function (request, response, next) {
      if (request.body.deleted) {
        return response.status(403).send({
          message: "No debes tratar de actualizar este campo"
        });
      } else {
        next();
      }
    };
    
    var updateMiddleware2 = function (request, response, next) {
      delete request.body.password;
      delete request.body.type;
      delete request.body.deleted;
      next();
    };

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
    var admmiddleware=function(request,response,next){
        if (request.body.params.type == 'user') {
            return response.status(403).send({
                message:'No eres administrador y no puedes crar un usuario',
                data:null
            });
    }
    next();
}

    router.post('/',function (request, response) {
       var newUser = new userModel(request.body);
       if(request.body.password)
       {
        var hashedPassword = bcrypt.hashSync(request.body.password, secretkeys.salts);
        newUser.password = hashedPassword;
       } 
       
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

    router.delete('/:id',function (request, response) 
    {
            userModel.findOne({
                _id:request.params.id,
                deleted:false
            
            }, function (err, userFound) {
                if (err)
                  return response.status(500).send({
                    message: 'There was a problem to delete the user, error server',		        
                    error: err		        
                  });


                if(!userFound)
                return response.status(404).send({
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
        

    router.get('/:id',function (request, response) {
       //nombre
        //opciones
        userModel.findOne({
            _id:request.params.id,
            deleted:false
        },{
            __v:0,
            password:0,
            deleted:0
        },null,function(err,userFound){
            if(err)
                return response.status(500).send({
                message:'There was a problem to find the user, server error',
                error:err    
            });
            if(!userFound)
            return response.status(404).send({
                message:'There was a problem to find the user, invalid id',
                error:''
             });
             response.send({
                 message:'User retrieved',
                 data:userFound
             });
        });
            
    });


    router.get('/:seed',function (request, response) {
        //nombre
         //opciones
         userModel.findOne({
             _id:request.params.id,
             deleted:false
         },{
             __v:0,
             password:0,
             deleted:0
         },null,function(err,userFound){
             if(err)
                 return response.status(500).send({
                 message:'There was a problem to find the user, server error',
                 error:err    
             });
             if(!userFound)
             return response.status(404).send({
                 message:'There was a problem to find the user, invalid id',
                 error:''
              });
              response.send({
                  message:'User retrieved',
                  data:userFound
              });
         });
             
     });

    

    module.exports = router;