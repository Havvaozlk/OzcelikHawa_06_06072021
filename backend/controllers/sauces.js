// Le fichier controleur exporte des méthodes qui sont ensuite attribuées aux routes
const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');


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

// modifier une sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      const oldUrl = sauce.imageUrl;
      if (!sauce) {
        return res.status(404).json({
          error: new Error('No such sauce!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: new Error('Unauthorized request!')
        });
      }
      if (req.file) {
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
              }`,
          }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({
              message: 'Sauce modifié !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        })
      } else {
        const newSauce = req.body;
        newSauce.imageUrl = oldUrl;
        Sauce.updateOne({ _id: req.params.id }, { ...newSauce, _id: req.params.id })
          .then(() => res.status(200).json({
            message: 'Sauce modifié !'
          }))
          .catch((error) => res.status(400).json({
            error
          }))
      }
    })
    .catch((error) => res.status(500).json({
      error
    }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error('No such sauce!')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        console.log(sauce.userId);
        console.log(req.auth.userId);
        return res.status(403).json({
          error: new Error('Unauthorized request!')
        });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      })
    }).catch(error => res.status(500).json({ error }));
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
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;


  if (like == 1) {
     Sauce.findOne({ _id: req.params.id })
      .then((sauce) => { 
        //Si l'utilisateur n'est pas present dans le tableau des likes
        if (sauce.usersLiked.indexOf(userId) == -1 && sauce.usersDisliked.indexOf(userId) == -1) {
            Sauce.updateOne({ _id: sauceId }, {
            $push: { usersLiked: userId }, $inc: { likes: +1 },
          })
            .then(() => res.status(200).json({ 
              message: 'Like ajouté !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        } else {
         return res.status(403).json({ message: 'Vous avez déjà liké ou disliké la sauce !' })
        }
      }).catch((error) => res.status(400).json({
        error
      }))
  } 

  if (like == 0) {
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // si l'utilisateur est présent dans le tableau des dislikes
      if (sauce.usersDisliked.indexOf(req.body.userId) != -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          // retrait de l'utilisateur du tableau usersDisliked + décrémentation du dislike
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          }
        )
          .then(() => res.status(200).json({ message: "aucun avis" }))
          .catch((error) => res.status(400).json({ error }));
      }
      // si l'utilisateur est présent dans le tableau des likes
      if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          // retrait de l'utilisateur du tableau usersliked + décrémentation du like
          { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
        )
          .then(() => res.status(200).json({ message: "aucun avis" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));}



  if (like === -1) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersDisliked.indexOf(userId) == -1 && sauce.usersLiked.indexOf(userId) == -1) {
          Sauce.updateOne({ _id: sauceId }, {
            $push: { usersDisliked: userId }, $inc: { dislikes: +1 },
          })
            .then(() => res.status(200).json({
              message: 'Dislike ajouté !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        } else {
          return res.status(403).json({ message: 'Vous avez déjà liké ou disliké la sauce !' })
        }
      }).catch((error) => res.status(400).json({
        error
      }))
  }

} 