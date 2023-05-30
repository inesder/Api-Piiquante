//Importation des modules
const express = require("express");
const router = express.Router(); //Création du routeur

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");

//Définition des routes
router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Exportation du routeur
module.exports = router;
