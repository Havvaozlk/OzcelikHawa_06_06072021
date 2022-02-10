//on recupere le package jwt
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //on decode le token avec le package jwt et la fonction verify
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //on recupere le userId qui est dedans
    const userId = decodedToken.userId;
    //si on a un userIddans le corps de la requete et si celui ci est different
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
      //sinon on appel seulement next
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};