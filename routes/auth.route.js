
var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var bcrypt = require('bcryptjs');
var jsonwebtoken = require('jsonwebtoken');
var secretkeys = require('../secret.keys');
var veryfyTokenMiddleware = require('../auth/verifyTokenMiddleware');

router.post('/login', function (request, response) {
    var query = {
    deleted: false,
    username: request.body.username
};
userModel.findOne(query, function (err, userFound) {
    if (err)
      return response.status(500).send({
        message: 'Internal error',
        error: err
      });
    if (!userFound)
      return response.status(404).send({
        message: 'Resource not found, invalid username',
        error: null
      });
    var passworIsValid = bcrypt.compareSync(request.body.password, userFound.password);
    if (!passworIsValid)
      return response.status(403).send({
        message: 'unauthorized access, invalid password',
        error: null
      });
      var tokenEncoded = jsonwebtoken.sign({
        userid: userFound._id,
        type: userFound.type,
        //correo:userFound.email
      }, secretkeys.token, {
          expiresIn: 60 * 2
        });

    return response.send({
      auth: true,
      token: tokenEncoded
    });
  });
});

router.get('/logout',veryfyTokenMiddleware,function (request, response) {
  response.send({
    message: 'testing logout',
    auth: false,
    token: null
  });
});

router.get('/me',function (request, response) {
  response.send({
    auth:false,
    token:null
  });
});
//192.168.1.33:300/users
router.get('/me',veryfyTokenMiddleware,function (request, response) {
  userModel.findOn({
    _id:request.params.userid,
    deleted:false
  },function(err, userFound){
      if (err) 
      return response.status(401).send({
        message:'internal error',
        error: null
      });
    response.send({
      message:'user logged',
      data:userFound.getDtoUser()
    });
  });
});

module.exports = router;