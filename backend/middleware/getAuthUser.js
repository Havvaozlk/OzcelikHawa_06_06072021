const getAuthUser = (req) => {
const token = req.headers.authorization.split(' ')[1];
//on decode le token avec le package jwt et la fonction verify
const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//on recupere le userId qui est dedans
const userId = decodedToken.userId;

return userId;
}

module.exports = getAuthUser;