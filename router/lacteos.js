const express = require("express");

const { lacteos } = require("../datos/articulos");

const routerLacteos = express.Router();

routerLacteos.get("/", (req, res) => {
  res.json(lacteos);
});

routerLacteos.get("/:nombre", (req, res) => {
  // Añadir verificación de parámetro id
  const { nombre } = req.params.id;
  const articulos = lacteos.filter((art) => art.nombre === nombre);

  if (articulos.length === 0) {
    res.status(400).send(`No se encuentra articulos llamados ${articulos}`);
  }

  res.send(articulos);
});

module.exports = routerLacteos;
