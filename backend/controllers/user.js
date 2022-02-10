//on utilise le package de cryptage pour hasher le mot de passe
const bcrypt = require('bcrypt');
//on importe notre modele user
const User = require('../models/user');
//on installe et importe le package pour créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

//fonction signup pour l'enregistrement des utilisateurs
exports.signup = (req, res, next) => {
  //on hash le mot de passe avec bcrypt, on lui passe le mot de passe et le nombre de tour que l'algorithme va faire
    bcrypt.hash(req.body.password, 10)
    //on récupere le hash de mdp
      .then(hash => {
        //on crée le nouvel utilisateur avecnotre modele Mongoose
        const user = new User({
          //on passe l'adresse qui est fourni dans le corps de la requete et le mot de passe
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  //fonction login pour connecter des utilisateurs existants
  exports.login = (req, res, next) => {
    //on trouve l'utilisateur de la base de donnée
    User.findOne({ email: req.body.email })
      .then(user => {
        //si on ne trouve pas l'utilisateur
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //si l'utilisateur a été trouvé on compare les mot de passes
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            //si elle n'est pas valable 
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //si elle est valable on envoie un objet json avec le userId et token
            res.status(200).json({
                userId: user._id,
                //on appel la fonction sign de jwt
                token: jwt.sign(
                  { userId: user._id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                )
              });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };