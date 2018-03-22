

var express = require('express');
var router = express.Router();
var userModel = require('../models/user.model');
var bcrypt = require('bcryptjs');
var secretkeys = require('../secret.keys');
var verifyTokenMiddleware = require('../auth/verifyTokenMiddleware');

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

var admmiddleware = function (request, response, next) {
  if (request.params.type === 'USER') {
    return response.status(403).send({
      message: 'No eres administrador y no puedes crear un usuario',
      data: null
    });
  }
  next();
}

router.get('/', function (request, response) {
    console.log('headers-->', request.headers);
    userModel.find({
    deleted: false
  }, {
    password: 0,
    deleted: 0,
    __v: 0
  }, null, function (err, userList) {
    if (err) {
      return response.status(500).send({
        message: 'Thera was a problem retrieving the user list',
        error: err
      });
    } else {
      response.send({
        message: 'The userlist has been retrieved',
        data: userList
      });
    }
  });
});

router.post('/', function (request, response) {
  var newUser = new userModel(request.body);
  if (request.body.password) {
    var hashedPassword = bcrypt.hashSync(request.body.password, secretkeys.salts);
    newUser.password = hashedPassword;
  }
  newUser.save(function (err, userCreated) {
    if (err) {
      return response.status(500)
        .send({
          message: 'There was a problem registering ther user',
          error: err
        });
    } else {
      userCreated.speak();
      response.send({
        message: 'A new user has been created',
        data: userCreated.getDtoUser()
      });
    }

  });
});

router.put('/:id', function (request, response) {
  userModel.findOne({
    _id: request.params.id,
    deleted: false
  }, function (err, userFound) {
    if (err)
      return response.status(500).send({
        message: 'There was a problem to find the user, error server',
        error: err
      });
    if (!userFound)
      return response.status(404).send({
        message: 'There was a problem to find the user, invalid id',
        error: ''
      });
    for (var propiedad in request.body)
      userFound[propiedad] = request.body[propiedad];
    userFound.save(function (error, userUpdated) {
      if (error)
        return response.status(500).send({
          message: 'Thera was a problem to update the user, error serve',
          error: error
        });
      response.send({
        message: 'The user has been updated',
        data: userUpdated.getDtoUser()
      });
    });
  });
});

router.delete('/:id', function (request, response) {
  userModel.findOne({
    _id: request.params.id,
    deleted: false
  }, function (err, userFound) {
    if (err)
      return response.status(500).send({
        message: 'There was a problem to delete the user, error server',
        error: err
      });
    if (!userFound)
      return response.status(404).send({
        message: 'There was a problem to get the user(invalid id)',
        error: ''
      });

    userFound.deleted = true;

    userFound.save(function (error, userUpdated) {
      if (error)
        return response.status(500).send({
          message: 'There was a problem to delete the user, error server',
          error: error
        });
      response.send({
        message: 'The user has been deleted',
        data: userUpdated.getDtoUser()
      });
    });
  });
});

router.get('/:id', function (request, response) {
  userModel.findOne({
    _id: request.params.id,
    deleted: false
  }, {
    __v: 0,
    password: 0,
    deleted: 0
  }, null, function (err, userFound) {
    if (err)
      return response.status(500).send({
        message: 'There was a problem to find the user, server error',
        error: err
      });
    if (!userFound)
      return response.status(404).send({
        message: 'There was a proble to find the user, invalid id',
        error: ''
      });

    response.send({
      message: 'User retrieved',
      data: userFound
    });
  });
});

router.get('/seed', function (request, response) {
    var Client = require('node-rest-client').Client;
  
    var client = new Client();
  
    client.get("https://randomuser.me/api/?results=10&nat=us", function (data, response2) {
      var array = [];
      var hashedPassword = bcrypt.hashSync('1234567', secretkeys.salts);
      array.push({
        name: 'Angel',
        lastname: 'Antezana',
        username: 'anghel7',
        email: 'anghel@gmail.com',
        password: hashedPassword,
        avatar: 'https://pbs.twimg.com/profile_images/743853773429276672/_cLiC9TB_400x400.jpg',
        type: 'ADM'
      });
      data.results.forEach(element => {
        array.push({
          name: element.name.first,
          lastname: element.name.last,
          username: element.login.username,
          email: element.email,
          password: hashedPassword,
          avatar: element.picture.large
        });
      });
      userModel.remove({}, function (err) {
  
        userModel.create(array, function (error, userlistcreated) {
          if (error)
            return response.status(500).send({
              message: 'There was a problem to get the users.',
              error: error
            });
          response.send({
            data: userlistcreated
          });
        });
  
      });
    });
  });


module.exports = router;