var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var bcrypt = require('bcryptjs');

var jsonwebtoken = require('jsonwebtoken');
var secretkeys = require('../secret.keys');

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
        type: userFound.type
      }, secretkeys.token, {
          expiresIn: 60 * 3
        });

    return response.send({
      auth: true,
      token: tokenEncoded
    });
  });
});


router.get('/logout', function (request, response) {
  response.send({
    message: 'testing logout',
    auth: false,
    token: null
  });
});

router.get('/me', function (request, response) {
  response.send({
    message: 'testing me'
  });
});

module.exports = router;