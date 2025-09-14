export interface Card {
  carta: string;
  posicion: string;
  orientacion: "derecha" | "invertida";
  description: string;
}

const arcanosMayores = [
  "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
  "El Hierofante", "Los Enamorados", "El Carro", "La Justicia", "El Ermitaño",
  "La Rueda de la Fortuna", "La Fuerza", "El Colgado", "La Muerte",
  "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
  "El Sol", "El Juicio", "El Mundo"
];

const posicionesCruzCelta = [
  { posicion: "Situación actual", description: "Representa el presente del consultante." },
  { posicion: "Obstáculos", description: "Lo que se cruza en el camino, los desafíos." },
  { posicion: "Fundamentos", description: "La base de la situación, el origen." },
  { posicion: "Pasado reciente", description: "Eventos que acaban de ocurrir." },
  { posicion: "Posibles resultados", description: "El mejor resultado posible o la meta." },
  { posicion: "Futuro inmediato", description: "Lo que sucederá a corto plazo." },
  { posicion: "El consultante", description: "La actitud o posición del consultante." },
  { posicion: "Entorno", description: "Influencias externas, el ambiente." },
  { posicion: "Esperanzas y miedos", description: "Las emociones internas del consultante." },
  { posicion: "Resultado final", description: "El desenlace más probable de la situación." }
];

/**
 * Baraja un array en su lugar usando el algoritmo Fisher-Yates.
 * @param array El array a barajar.
 */
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 * Genera una tirada de 10 cartas para la Cruz Celta.
 * @returns Un array de 10 objetos Card.
 */
export function generarTiradaCruzCelta(): Card[] {
  const arcanosBarajados = shuffle([...arcanosMayores]);
  const tirada: Card[] = [];

  for (let i = 0; i < 10; i++) {
    const carta = arcanosBarajados[i];
    const orientacion = Math.random() < 0.5 ? "derecha" : "invertida";
    const { posicion, description } = posicionesCruzCelta[i];

    tirada.push({
      carta,
      posicion,
      orientacion,
      description,
    });
  }

  return tirada;
}