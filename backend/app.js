//importation d'express

const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
//on importe MongoDB qui nous permet de valider le format des données, gérer les relations entre les documents et communiquer directement avec la base de données pour la lecture et l'écriture des documents
const mongoose = require('mongoose');
const  mongoSanitize  =  require ( 'express-mongo-sanitize' ) ;
const path = require('path');

require('dotenv').config();

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//connexion à la base de donnée MongoDB
mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

  //Nous avons des erreurs de CORS, on va donc des headers
  //Le middleware permet à toutes les demandes de toutes les origines d'accéder à votre API
app.use((req, res, next) => {
  // on dit que l'origine qui a le droit d'accéder à notre API c'est '*'= tout le monde
  res.setHeader('Access-Control-Allow-Origin', '*');
  //on donne l'autorisation d'utiliser certains en-tête
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //on donne l'autorisation d'utiliser certaines méthodes: GET, POST..
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
//pour gérer la requete post venant du frontend on extrait le corps JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

