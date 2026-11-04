# Colapso, modo tablero (demo 2)

Segundo juego de demostración para Cardgame Prototyper. Comparte mundo, dimensiones y motor de cadenas con [Colapso, modo vida (demo 1)](../demoTCG/README.md), y por eso **los dos se llaman Colapso**. Aquí **no hay puntos de vida**: gana quien empieza su turno con **1000 de PODER** en su **primera fila**.

## Qué cambia respecto al demo 1

| | Modo vida (demo 1) | Modo tablero (demo 2) |
|---|---|---|
| Objetivo | Bajar la vida del oponente de 800 a 0 | Empezar tu turno con 1000 de PODER en la primera fila |
| Combate | Se comparan PODER; el menor se destruye | En un solo sentido: el atacante pone daño igual a su PODER y el explorador se destruye cuando su PODER (*total − daño*) llega a 0 |
| PODER | Efectos "este turno" posibles | Solo **potenciar** (permanente), **infligir daño** y **curar** |
| Mazo | 30 cartas | **50 cartas** (38 de dimensión + 12 neutrales) |
| Tablero | 5 zonas de explorador | **Primera fila** (6 lugares, siempre boca arriba) y **barracas** (6 lugares, boca arriba o abajo) |
| Posiciones | Activo o asistiendo (debajo de un activo) | **En guardia** (ataca y activa su efecto En guardia en la primera fila) o **Asistiendo** (no ataca, activa su efecto Asistiendo en las barracas); no cambian |
| Jugar | Una carta por turno | Una carta por turno a la primera fila, cuantas quieras a las barracas, y una **promoción** al final del turno |
| Restricciones | Frecuentes | Poco comunes |
| Interrupciones | Pueden ser puras | Siempre traen un **efecto secundario** |

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| [ruleguides.md](ruleguides.md) | **Cómo se juega.** Objetivo, tablero, posiciones, turno con promoción, combate por daño, efectos, cadenas. |
| [designguide.md](designguide.md) | **Cómo se diseña.** Estilos de juego, efectos En guardia y Asistiendo, búsquedas estrechas, secuencias, escala de PODER. |
| [glosario.md](glosario.md) | Lo nuevo del demo 2 (posiciones, primera fila y barracas, promoción, PODER base/agregado/total, daño, curar, trampas, Activa como). El resto hereda del [glosario del demo 1](../demoTCG/glosario.md). |
| [cards.md](cards.md) | Catálogo completo: 40 exploradores (1 token) y 23 eventos. |
| [decks.md](decks.md) | Cuatro mazos de 50 cartas, con su secuencia y una línea de ejemplo. |
| `colapso.json` | Proyecto para **importar en la app**: 4 tipos de carta, todas las cartas y los 4 mazos. |
| `cartas-*.csv` | Exploradores y eventos, con y sin restricción, para el importador de CSV (uno por tipo de carta). |

## Los mazos

| Mazo | Estilo | Cómo llega a 1000 |
|---|---|---|
| **Fantaspet** · Niebla Persistente | Cementerio | Cuerpos que crecen con las cartas del cementerio; combos que destruyen cartas de las barracas |
| **Ugabuga** · Estampida de Piedra | Arrasar y reconstruir | Pocos cuerpos enormes tras borrar el tablero |
| **Ragnatica** · Telaraña Paciente | Inundar | Muchos tokens Cría con PODER extra |
| **Baluarte** · Muralla Viviente | Ascenso constante | Un personaje que crece solo y Escuderos en las barracas |

Empieza leyendo [ruleguides.md](ruleguides.md) y después elige un mazo en [decks.md](decks.md). La lista de decisiones por confirmar en partidas de prueba está al final de las reglas.

## Para modificar las cartas

Los CSV son la fuente editable. Antes de añadir cartas nuevas, revisa la lista de [designguide.md](designguide.md#lista-de-revisión-para-una-carta-nueva).
