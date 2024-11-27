const express = require("express");
const app = express();

const cors = require("cors");

const { datos } = require("./datos/articulos");
const { isCorrect, isPartialCorrect } = require("./validacion.js");

app.disable("x-powered-by");
app.use(express.json());

// Routers
const routerPanaderia = require("./router/panaderia");
app.use("/api/articulos/panaderia", routerPanaderia);

const routerLacteos = require("./router/lacteos");
app.use("/api/articulos/lacteos", routerLacteos);

const routerEmbutidos = require("./router/embutidos");
app.use("/api/articulos/embutidos", routerEmbutidos);

// GET
app.get("/api/articulos", (req, res) => {
  // /api/articulos?id:int&nombre:articulo
  // const { query } = req.query;
  try {
    console.log(`Articulos: /n${datos}`);
    res.json(data);
  } catch (err) {
    console.log(`Error al obtener los articulos: ${err}`);
    res
      .status(500)
      .json({ error: "Hubo un problema al obtener los articulos." });
  }
});

// POST
const tomarSiguienteID = (array) => {
  return array.length ? array[array.length - 1] : 1;
};

app.post("/api/articulos/:categoria", (req, res) => {
  const categoria = req.params.categoria;
  const validacion = isCorrect(req.body);

  if (!validacion.success) {
    res.status(400).json({ error: validacion.error.message });
  }

  if (!data[categoria]) {
    res.send(404).send(`<h1>404 Not Found ${categoria}</h1>`);
  }

  const existe = data[categoria].some(
    (art) => art.toLowerCase() === validacion.data.nombre.toLowerCase()
  );

  if (existe) {
    return res
      .status(400)
      .send(
        `<h1>Ya existe ${validacion.data.nombre} en la categoria ${categoria}`
      );
  }

  const siguienteID = tomarSiguienteID(data[categoria]);

  const nuevoArticulo = {
    id: siguienteID,
    ...validacion.data,
  };

  data[categoria].push(nuevoArticulo);

  res.status(201).json(nuevoArticulo);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escucha en http//localhost:${PORT}`);
});

module.exports = app;
