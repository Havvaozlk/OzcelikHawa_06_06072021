const schema = require('../models/password');

module.exports = (req, res, next) => {
if (!schema.validate(req.body.password)){
    
    //  res.writeHead(
    //     400,
    //     "Le  mot de passe doit contenir au moins 8 caractères; une majuscule, une minuscule, un chiffre et pas d'espace ",
    //     {
    //       "content-type": "application/json",
    //     }
    //    );
    //    res.end("Le format de votre mot de passe est incorrect");
    return res.status(400).json({ message : 'Mot de passe trop faible.\n Veuillez saisir: 1 majuscule, 1 minuscule, 1 chiffres, 8 caractères minimum sans espaces' })
    } else {
      next();
    }
  };