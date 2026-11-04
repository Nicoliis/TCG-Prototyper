# Umbral (demo 2)

Segundo juego de demostración para Cardgame Prototyper. Comparte mundo, dimensiones y motor de cadenas con [Colapso (demo 1)](../demoTCG/README.md), pero **sin puntos de vida**: gana quien empieza su turno con **1000 de PODER** en exploradores activos. *Umbral* es un nombre de trabajo.

## Qué cambia respecto al demo 1

| | Colapso (demo 1) | Umbral (demo 2) |
|---|---|---|
| Objetivo | Bajar la vida del oponente de 800 a 0 | Empezar tu turno con 1000 de PODER en el campo |
| Combate | Se comparan PODER; el menor se destruye | En un solo sentido: el atacante pone daño igual a su PODER y el explorador se destruye cuando su PODER (*total − daño*) llega a 0 |
| PODER | Hasta el final del turno (por defecto) | **Permanente** (por defecto); "este turno" se escribe |
| Mazo | 30 cartas | **50 cartas** (38 de dimensión + 12 neutrales) |
| Campo | 5 zonas | 6 zonas |
| Restricciones | Frecuentes | Poco comunes |
| Interrupciones | Pueden ser puras | Siempre traen un **efecto secundario** |

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| [ruleguides.md](ruleguides.md) | **Cómo se juega.** Objetivo, turno, combate por daño, efectos, cadenas. |
| [designguide.md](designguide.md) | **Cómo se diseña.** Estilos de juego, secuencias, interacción con efecto secundario, escala de PODER. |
| [glosario.md](glosario.md) | Lo nuevo del demo 2 (PODER base/agregado/total, daño, curar, Activa como). El resto hereda del [glosario del demo 1](../demoTCG/glosario.md). |
| [cards.md](cards.md) | Catálogo completo: 40 exploradores (1 token) y 23 eventos. |
| [decks.md](decks.md) | Cuatro mazos de 50 cartas, con su secuencia y una línea de ejemplo. |
| `umbral.json` | Proyecto para **importar en la app**: 4 tipos de carta, todas las cartas y los 4 mazos. |
| `cartas-*.csv` | Exploradores y eventos, con y sin restricción, para el importador de CSV (uno por tipo de carta). |

## Los mazos

| Mazo | Estilo | Cómo llega a 1000 |
|---|---|---|
| **Fantaspet** · Niebla Persistente | Cementerio | Cuerpos que crecen con las cartas del cementerio |
| **Ugabuga** · Estampida de Piedra | Arrasar y reconstruir | Pocos cuerpos enormes tras borrar el tablero |
| **Ragnatica** · Telaraña Paciente | Inundar | Muchos tokens Cría con PODER extra |
| **Baluarte** · Muralla Viviente | Ascenso constante | Un personaje que crece solo y soldados que lo apuntalan |

Empieza leyendo [ruleguides.md](ruleguides.md) y después elige un mazo en [decks.md](decks.md). La lista de decisiones por confirmar en partidas de prueba está al final de las reglas.

## Para modificar las cartas

Los CSV son la fuente editable. Antes de añadir cartas nuevas, revisa la lista de [designguide.md](designguide.md#lista-de-revisión-para-una-carta-nueva).
