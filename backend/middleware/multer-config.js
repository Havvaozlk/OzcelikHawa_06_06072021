//on importe multer qui va nous permettre de gérer les fichiers entrants 
//dans les requêtes HTTP
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//objet de configuration pour multer avec la fonction diskStorage qui contient
//la logique nécessaire pour indiquer à multer où enregistrer les fichiers
const storage = multer.diskStorage({
  //on indique à multer d'enregistrer les fichiers dans le dossier image
  destination: (req, file, callback) => {
    callback(null, 'images');
  },

  //on utilise la fonction filename
  filename: (req, file, callback) => {
    //on indique à multer d'utiliser le nom d'origine, le split et on remplace
    //les espaces par des underscores
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    //on renvoie en callback le nom du fichier total
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exportation de multer, on passe l'objet storage
//single signifie que c'est un fichier unique
module.exports = multer({storage: storage}).single('image');