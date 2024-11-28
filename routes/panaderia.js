import express, { json } from "express";
import fs from "node:fs";

const articulos = JSON.parse(
  fs.readFileSync("./datos/articulos.json", "utf-8")
);
// api/articulos/panaderia
export const routerPanaderia = express.Router();

routerPanaderia.get("/", (req, res) => {
  res.json(articulos.datos.panaderia);
});

// api/articulos/panaderia/:nombre
routerPanaderia.get("/:nombre", (req, res) => {
  // Añadir verificación de parámetro id
  const nombre = req.params.nombre;
  const articulos = articulos.panaderia.filter((art) => art.nombre === nombre);

  if (articulos.length === 0) {
    res.status(400).send(`No se encuentra articulos llamados ${articulos}`);
  }

  res.send(articulos);
});

// api/articulos/panaderia?nombre
routerPanaderia.post("/:nombre", (req, res) => {});

routerPanaderia.delete("/:id", (req, res) => {});
