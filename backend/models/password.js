var passwordValidator = require('password-validator');

var schema = new passwordValidator();

schema
.is().min(8)   //minimum 8 caractères                                 
.is().max(100)  //max 100                                
.has().uppercase()   //doit contenir des lettres majuscule                           
.has().lowercase()    //  doit contenir des lettres minuscule                        
.has().digits(1)       //doit contenir au moins un chiffre                         
.has().not().spaces()    //pas d'espace                      
.is().not().oneOf(['Passw0rd', 'Password123']); //ne doit pas etre égale à

module.exports = schema;
// module.exports = (req, res, next) => {
//     const pass = req.body.password;

//     if(schema.validate(pass)) {
//         next();
//     }
//     else {
//         return res.status(400).json({ message : 'Mot de passe trop faible.\n Veuillez saisir: 1 majuscule, 1 minuscule, 2 chiffres, 6 caractères minimum' })
//     }
// }