import express, { json, query } from "express";
export const app = express();

import fs from "node:fs";
import cors from "cors";

const articulos = JSON.parse(
  fs.readFileSync("./datos/articulos.json", "utf-8")
);

import { isCorrect, isPartialCorrect } from "./validacion.js";

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ["http://localhost:8080", "http://punto70"];

      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.error(`Bloqueado por CORS: origen ${origin}`);
      return callback(new Error("No permitido por CORS"));
    },
  })
);

app.disable("x-powered-by");
// Middleware para procesar JSON
app.use(express.json());

// Routers
import { routerPanaderia } from "./routes/panaderia.js";
app.use("/api/articulos/pan", routerPanaderia);

import { routerLacteos } from "./routes/lacteos.js";
app.use("/api/articulos/lac", routerLacteos);

import { routerEmbutidos } from "./routes/embutidos.js";
app.use("/api/articulos/emb", routerEmbutidos);

// GET
app.get("/api/articulos", (req, res) => {
  // /api/articulos?id:int&nombre:articulo
  // const { query } = req.query;
  try {
    return res.json(articulos);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "❌ Hubo un problema al obtener los articulos." });
  }
});

// POST
const tomarSiguienteID = (array) => {
  return array.length ? array[array.length - 1].id + 1 : 1;
};

app.post("/api/articulos/:categoria", (req, res) => {
  console.log(req.body);
  const categoria = req.params.categoria;
  const validacion = isCorrect(req.body);

  if (!validacion.success) {
    return res.status(400).json({ error: `❌ ${validacion.error.message}` });
  }

  if (!articulos.datos[categoria]) {
    return res.send(404).json({ error: `❌ 404 Not Found ${categoria}` });
  }

  const existe = articulos.datos[categoria].some(
    (art) => art.nombre === validacion.data.nombre
  );

  if (existe) {
    return res.status(400).json({
      message: `Ya existe ${validacion.data.nombre} en la categoria ${categoria} 🤫`,
    });
  }

  const siguienteID = tomarSiguienteID(articulos.datos[categoria]);

  const nuevoArticulo = {
    id: siguienteID,
    ...validacion.data,
  };

  articulos.datos[categoria].push(nuevoArticulo);

  res.status(201).json(nuevoArticulo);
});

// PATCH
app.patch("/api/articulos", (req, res) => {
  const { categoria, id } = req.query;
  const validacion = isPartialCorrect(req.body);

  if (!validacion.success) {
    return res.status(400).json({ error: validacion.error.message });
  }

  if (!articulos.datos[categoria]) {
    return res.status(404).json({
      error: `❌ No existe categoria ${categoria} en la base de datos`,
    });
  }
  // some = boolean // find = object
  const articulo = articulos.datos[categoria].find(
    (art) => art.id === parseInt(id)
  );

  if (!articulo) {
    return res
      .status(404)
      .json({ error: `❌ No existe un articulo con ID ${id}` });
  }

  Object.assign(articulo, validacion.data);
  res.json(articulo);
});

// DELETE
app.delete("/api/articulos/:categoria/:id", (req, res) => {
  console.log("DELETE request:", req.params);
  const categoria = req.params.categoria;
  const id = req.params.id;
  const parsedID = parseInt(id, 10);

  if (!articulos.datos[categoria]) {
    return res
      .status(404)
      .json({ error: `❌ La categoria ${categoria} no existe en articulos` });
  }

  const categoriaArticulo = articulos.datos[categoria];
  const indice = categoriaArticulo.findIndex(
    (articulo) => articulo.id === parsedID
  );

  if (indice === -1) {
    return res.status(404).json({
      error: `❌ El articulo con ID ${id} no se encuentra en la categoria ${categoria}`,
    });
  }

  categoriaArticulo.splice(indice, 1);
  return res
    .status(200)
    .json({ message: `El articulo con id ${id} ha sido eliminado 👌` });
});

app.use((req, res) => {
  return res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`-> Servidor escucha en http://localhost:${PORT} 🦻🦻`);
});
