// Le fichier controleur exporte des méthodes qui sont ensuite attribuées aux routes
const Sauce = require('../models/sauce');
const fs = require('fs');

//Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  //
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  //on crér une instance du modèle sauce
  const sauce = new Sauce({
    //on récupère les champs qu'il y a dans le corps de la requête
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  //on enregistre la sauce dans la base de donnée
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

//afficher une sauce
exports.getOneSauce = (req, res, next) => {
  //on utilise findOne pour trouver la sauce ayant le meme id que le parametre de la requete
  Sauce.findOne({
    _id: req.params.id
  }).then(
    //la sauce est retournée dans une promesse et est envoyé au frontend
    (sauce => {
      res.status(200).json(sauce);
    })
    //si aucune sauce n'est trouvé ou si une erreur se produit nous envoyons une erreur 404 au frontend
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// modofier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    //on utilise la methode uptadeOne pour mettre à jour la sauce qui correspond à l'objet que nous passons comme premier argument
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

//supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//afficher toute les sauces
exports.getAllSauce = (req, res, next) => {
  //nous utilisons la méthode find afin de renvoyer un tableau avec toutes les sauces
  Sauce.find()
  .then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeDislike = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  if (like === 1) {
    Sauce.updateOne({ _id: sauceId }, {
      $push: { usersLiked: userId }, $inc: { likes: +1 },
    })
      .then(() => res.status(200).json({
        message: 'Like ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }

  if (like === 0) {
    Sauce.findOne({
      _id: sauceId
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({ _id: sauceId }, {
            $pull: { usersLiked: userId }, $inc: { likes: -1 },
          })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({ _id: sauceId }, {
            $pull: { usersDisliked: userId }, $inc: { dislikes: -1 },
          })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }

  if (like === -1) {
    Sauce.updateOne({ _id: sauceId }, {
      $push: { usersDisliked: userId }, $inc: { dislikes: +1 },
    }
    )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
} 