import express from "express";
import fs from "node:fs";

const articulos = JSON.parse(
  fs.readFileSync("./datos/articulos.json", "utf-8")
);

export const routerEmbutidos = express.Router();

routerEmbutidos.get("/", (req, res) => {
  res.json(articulos.datos.emb);
});

routerEmbutidos.get("/:nombre", (req, res) => {
  // Añadir verificación de parámetro id
  const { nombre } = req.params.id;
  const articulos = articulos.emb.filter((art) => art.nombre === nombre);

  if (articulos.length === 0) {
    res.status(400).send(`No se encuentra articulos llamados ${articulos}`);
  }

  res.send(articulos);
});
