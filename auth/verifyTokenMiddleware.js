var jsonwebtoken = require('jsonwebtoken');
var secretkeys = require ('../secret.keys');

var verifyToken = function (request, response, next) {
  var tokenEncoded = request.headers['auth-access-token'];
  if (!tokenEncoded)
    return response.status(403).send({
      auth: false,
      token: null,
      message:'No has enviado el token a travez de los headers'
    });
    jsonwebtoken.verify(tokenEncoded,secretkeys.token,
      function(err, tokenEncoded){
        if (err) 
        return response.status(500).send({
          auth:false,
          token:null,
          message:'failed to uthenticate, expeired token, invalid token'
        });  
        request.params.userid=tokenEncoded.userid;
        request.params.type= tokenEncoded.type;
       // request.params.correo=tokenEncoded.correo
      next();
      });

};
module.exports=verifyToken;