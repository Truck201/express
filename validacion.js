import z from "zod";

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
  url: z.string({
    message: "Imagen solo string local",
    required_error: "La URL es requerida",
  }),
});
// input todos los elementos
export function isCorrect(input) {
  return plantillaObjetoValido.safeParse(input);
}

// input no todos los elementos (partial)
export function isPartialCorrect(input) {
  return plantillaObjetoValido.partial().safeParse(input);
}
