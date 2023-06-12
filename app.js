//importation des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
require('dotenv').config();
const url = process.env.MONGODB_URL;
//Connexion à la base de données MongoDB
mongoose
  .connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Création de l'application Express
const app = express();

//Middleware pour traiter les données en tant que JSON
app.use(express.json());

//Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Configuration des routes de l'API
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//Gestion des fichiers statiques
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
