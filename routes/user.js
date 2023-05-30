//Importation des modules
const express = require("express");
const router = express.Router(); //Création du router
const userCtrl = require("../controllers/user");

//Définition des routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//Exportation du routeur
module.exports = router;
