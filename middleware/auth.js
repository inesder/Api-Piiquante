// Importation du module JSONWebToken
const jwt = require("jsonwebtoken");

//Exportation fonction middleware
module.exports = (req, res, next) => {
  //Récupération et vérification du token JWT
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //Attribution de l'identifiant de l'utilisateur
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };

    console.log("Token vérifié avec succès");
    next();
  } catch (error) {
    // Gestion des erreurs
    res.status(401).json({ error });
  }
};
