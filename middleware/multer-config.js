//Importation du module multer
const multer = require("multer");

// Définition des types MIME(format) des images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//Configuration du stockage des fichiers avec Multer:
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//Exportation de la configuration de Multer
module.exports = multer({ storage: storage }).single("image");
