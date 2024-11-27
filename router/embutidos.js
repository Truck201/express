const express = require("express");

const { embutidos } = require("../datos/articulos");

const routerEmbutidos = express.Router();

routerEmbutidos.get("/", (req, res) => {
  res.json(embutidos);
});

routerEmbutidos.get("/:nombre", (req, res) => {
  // Añadir verificación de parámetro id
  const { nombre } = req.params.id;
  const articulos = embutidos.filter((art) => art.nombre === nombre);

  if (articulos.length === 0) {
    res.status(400).send(`No se encuentra articulos llamados ${articulos}`);
  }

  res.send(articulos);
});

module.exports = routerEmbutidos;
