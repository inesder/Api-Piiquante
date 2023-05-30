const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  //Extraction de l'objet de sauce à partir du corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  //Création d'une nouvelle sauce avec les données de la requête
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  // Sauvegarde de la sauce dans la base de données
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Objet enregistré",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeSauce = (req, res, next) => {
  // Récupération de l'identifiant de l'utilisateur, de l'identifiant de la sauce, du nombre de like
  const userId = req.auth.userId;
  const sauceId = req.params.id;
  const likeValue = req.body.like;
  // Recherche de la sauce dans la base de données
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (!sauce) {
        throw new Error("Sauce not found");
      }

      // Vérifier si l'utilisateur a déjà liké ou disliké la sauce
      const userLiked = sauce.usersLiked.includes(userId);
      const userDisliked = sauce.usersDisliked.includes(userId);

      if (likeValue === 1) {
        // L'utilisateur aime la sauce
        if (!userLiked) {
          sauce.likes++;
          sauce.usersLiked.push(userId);
        }
        if (userDisliked) {
          sauce.dislikes--;
          const index = sauce.usersDisliked.indexOf(userId);
          sauce.usersDisliked.splice(index, 1);
        }
      } else if (likeValue === -1) {
        // L'utilisateur n'aime pas la sauce
        if (!userDisliked) {
          sauce.dislikes++;
          sauce.usersDisliked.push(userId);
        }
        if (userLiked) {
          sauce.likes--;
          const index = sauce.usersLiked.indexOf(userId);
          sauce.usersLiked.splice(index, 1);
        }
      } else if (likeValue === 0) {
        // L'utilisateur annule son like ou dislike
        if (userLiked) {
          sauce.likes--;
          const index = sauce.usersLiked.indexOf(userId);
          sauce.usersLiked.splice(index, 1);
        }
        if (userDisliked) {
          sauce.dislikes--;
          const index = sauce.usersDisliked.indexOf(userId);
          sauce.usersDisliked.splice(index, 1);
        }
      } else {
        throw new Error("Invalid like value");
      }

      return sauce.save();
    })
    .then((updatedSauce) => {
      res.status(200).json(updatedSauce);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.getOneSauce = (req, res, next) => {
  // Recherche d'une sauce spécifique par son identifiant
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  // Extraction de l'objet de sauce à partir du corps de la requête
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  // Vérification de l'autorisation de modification de la sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Mise à jour de la sauce avec les nouvelles données
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  // Recherche de la sauce à supprimer par son identifiant
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Suppression de l'image associée à la sauce dans le système de fichiers
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Suppression de la sauce dans la base de données
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauce = (req, res, next) => {
  // Récupération de toutes les sauces dans la base de données
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
