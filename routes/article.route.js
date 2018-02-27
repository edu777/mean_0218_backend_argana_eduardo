var express = require('express');
var router = express.Router();
var articleModel = require('../models/article.model');

var secretkeys = require('../secret.keys');

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
        articleModel.find({
            deleted:false
        }, {
            deleted:0,
            __v:0
        }, null, function (err, articleList) {
            if (err) {
              return response.status(500).send({
                message: 'Thera was a problem retrieving the article list',
                error: err
              });
            } else {
              response.send({
                message: 'The article list has been retrieved',
                data:articleList
              });
            }
        });
        
    });
    
    router.post('/',function (request, response) {
       var newArticle = new articleModel(request.body);
       newArticle.save(function(err,articleCreated){
           if(err){
               return response.status(500)
               .send({
                   message:'The was a problem registering article',
                   error:err
                })
           }else{
               articleCreated.speak();    

               response.send({message:'A new article has been created',
               data:articleCreated.getDtoArticle()
            });
           }  
       }); 
    });
    
    router.put('/:id', updateMiddleware2, function (request, response) {
        articleModel.findOne({
            _id:request.params.id,
            deleted:false
        },function(err,articleFound){
            if(err)
                return response.status(500).send({
                message:'There was a problem to find the article, error server',
                error:err    
            });
            if(!articleFound)
            return response,status(404).send({
                message:'There was a problem to find the article, invalid id',
                error:''
            });
            for(var propiedad in request.body)
            articleFound[propiedad]=request.body[propiedad];
            articleFound.save(function(error,userUpdated){
                if(error)
                return response.status(500).send({
                message:'There was a problem to update the article, error serve',
                error:error  
                 });
                 response.send({
                    message:'The article has been updated',
                    data: userUpdated.getDtoArticle()
                });
            }); 
        });
    });

    router.delete('/:id', function (request, response) {
            articleModel.findOne({
                _id:request.params.id,
                deleted:false
            },function(err,articleFound){
                if(err)
                    return response.status(500).send({
                    message:'There was a problem to delete the article, error serve',
                    error:err    
                });
                if(!articleFound)
                return response.status(404).send({
                    message:'There was a problem to get the article (invalid id)',
                    error:''
                });
                articleFound.deleted=true;


                articleFound.save(function (error,articleUpdated){
                    if(error)
                    return response.status(500).send({
                    message:'There was a problem to delete the article, error serve',
                    error:error  
                });
                response.send({
                    message:'The article has been deleted',
                    data: articleUpdated.getDtoArticle()
                });
            });
        });
    });
        

    router.get('/:id', function (request, response) {
       //nombre
        //opciones
        articleModel.findOne({
            _id:request.params.id,
            deleted:false
        },{
            __v:0,
            deleted:0
        },null,function(err,articleFound){
            if(err)
                return response.status(500).send({
                message:'There was a problem to find the article, server error',
                error:err    
            });
            if(!articleFound)
            return response.status(404).send({
                message:'There was a problem to find the article, invalid id',
                error:''
             });
             response.send({
                 message:'Article retrieved',
                 data:articleFound
             })
        });
            
    });

    module.exports = router;

    //