//importation de mongo
const mongoose = require('mongoose');

//création du schema de donnée liée à la sauce
const sauceSchema = mongoose.Schema({
//identifiant MongoDB de l'utilisateur qui a crée la sauce
  userId: { type: String, required: true },
  //nom de la sauce
  name: { type: String, required: true },
  //fabriquant de la sauce
  manufacturer: { type: String, required: true },
  //description de la sauce
  description: { type: String, required: true },
  //principal ingrédient épicé de la sauce
  mainPepper: { type: String, required: true },
  //URL del'image de la sauce téléchargée
  imageUrl: { type: String, required: true },
  //nombre entre 1 et 10 décrivant la sauce
  heat: { type: Number, required: true },
  // nombre d'utilisateurs qui aiment (= likent) la sauce
  likes: { type: Number, required: true },
  // nombre d'utilisateurs qui n'aiment pas (= dislike) la
// sauce
  dislikes: { type: Number, required: true },
  // tableau des identifiants des utilisateurs qui ont aimé la sauce
  usersLiked: { type: [String], required: true },
  // tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
  usersDisliked: { type: [String], required: true },
});

//Exportation du schema sous forme de modèle
module.exports = mongoose.model('Sauce', sauceSchema); 