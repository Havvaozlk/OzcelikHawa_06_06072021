// Création du modele de base de connées pour les informations des utilisateurs

//importation de mongoose
const mongoose = require('mongoose');
//importation du pluggin pour que l'adresse mail soit unique
const uniqueValidator = require('mongoose-unique-validator');

//création du schema de donnée liée a l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//Exportation du schema sous forme de modèle
module.exports = mongoose.model('User', userSchema);