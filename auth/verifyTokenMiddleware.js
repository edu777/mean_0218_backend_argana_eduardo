var jsonwebtoken = require('jsonwebtoken');
var verifyToken = function (request, response, next) {
  var tokenEncoded = request.headers['auth-access-token'];
  if (!tokenEncoded)
    return response.status(403).send({
      auth: false,
      token: null
    });

}; 