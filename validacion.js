const z = require("zod");

const plantillaObjetoValido = z.object({
  nombre: z.string({
    invalid_type_error: "El nombre tiene que ser una cadena de caracteres",
    required_error: "El nombre es requerido",
  }),
  precio: z
    .number({
      required_error: "El precio es requerido",
    })
    .int({
      invalid_type_error: "El numero tiene que ser entero",
    })
    .positive(),
  url: z.string().url({
    message: "Imagen solo URL",
    required_error: "La URL es requerida",
  }),
});

function isCorrect(input) {
  return plantillaObjetoValido.safeParse(input);
}

function isPartialCorrect(input) {
  return plantillaObjetoValido.partial().safeParse(input);
}

module.exports = {
  isCorrect,
  isPartialCorrect,
};
