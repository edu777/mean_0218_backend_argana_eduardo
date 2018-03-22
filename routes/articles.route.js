var express = require('express');
var router = express.Router();
var articleModel = require('../models/article.model');
var userModel = require('../models/user.model')

var selectUserPopulated={
    path:'author',
    select:'-_id -username -avatar -type -deleted -password -__v'
};


//nos devuelve una lista
    router.get('/',function (request, response) {
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
                userModel.populate(articleList, selectUserPopulated,function(errPopulating,
                    populatedArticleList){
                        if(errPopulating)
                        return response.status(500).send({
                            message: 'Thera was a problem retrieving the article list',
                            error: errPopulating
                        });
                        response.send({
                            message: 'The article list has been retrieved',
                            data:articleList
                        });
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
                   message:'There was a problem registering the article',
               error:err
                });
           }else{
            userModel.populate(articleCreated, selectUserPopulated,function(errPopulating,
                populatedArticle){
                    if(errPopulating)
                    return response.status(500).send({
                        message: 'Thera was a problem retrieving the article list',
                        error: errPopulating
                    }); 
                    response.send({
                        message:'A new article has been created',
                        data:articleCreated.getDtoArticle()
                    });
                });
            }
        });
    });
    
    router.put('/:id', function (request, response) {
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
                 userModel.populate(articleUpdated, selectUserPopulated,function(errPopulating,
                populatedArticle){
                    if(errPopulating)
                    return response.status(500).send({
                        message: 'Thera was a problem retrieving the article',
                        error: errPopulating
                    }); 
                    response.send({
                        message:'Article retrieved',
                        data:articleCreated.getDtoArticle()
                    });
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
             userModel.populate(articleFound, selectUserPopulated,function(errPopulating,
                populatedArticle){
                    if(errPopulating)
                    return response.status(500).send({
                        message: 'Thera was a problem retrieving the article list',
                        error: errPopulating
                    }); 
                    response.send({
                        message:'Article retrieved',
                        data:articleCreated.getDtoArticle()
                    });
                });
        });
            
    });

    module.exports = router;
