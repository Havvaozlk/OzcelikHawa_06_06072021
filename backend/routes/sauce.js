//on importe express
const express = require('express');
// express router permet de créer des routeurs séparés pour chaque route principale 
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
//const Sauce = require('../models/sauce');
const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;