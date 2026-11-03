# Colapso (demo)

Juego de cartas de demostración para Cardgame Prototyper: 1 contra 1, de cadenas e interacción, inspirado en Yu-Gi-Oh!. *Colapso* es un nombre de trabajo.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| [ruleguides.md](ruleguides.md) | **Cómo se juega.** Turnos, combate, cadenas, triggers, restricciones, búsquedas. |
| [designguide.md](designguide.md) | **Cómo se diseña.** Filosofía, roles, restricciones, vocabulario, lore, diseño visual. |
| [glosario.md](glosario.md) | **Qué significa cada palabra** de las cartas (buscar, asistir, atracción…) y sus casos borde. |
| [cards.md](cards.md) | Catálogo completo: 35 exploradores (1 ficha) y 20 eventos, con su rol y su código por tipo de carta. |
| [decks.md](decks.md) | Tres mazos iniciales de 30 cartas más un starter extra (Baluarte), con estrategia y líneas de juego de ejemplo. |
| `colapso.json` | Proyecto completo para **importar en la app**: 4 tipos de carta (Explorador y Evento, con y sin restricción) con su diseño, todas las cartas y los 3 mazos iniciales más Baluarte (starter extra). |
| `cartas-exploradores.csv`, `cartas-exploradores-con-restriccion.csv` | Exploradores sin y con restricción, listos para el importador de CSV (uno por tipo de carta). |
| `cartas-eventos.csv`, `cartas-eventos-con-restriccion.csv` | Eventos sin y con restricción, igual. |
| `mytcg.json` | Primer borrador (proyecto "Mytcg", otra mecánica de combate). Se conserva como referencia. |

## Cómo usarlo en la app

**Opción rápida:** importa `colapso.json` desde la lista de proyectos. Obtienes el proyecto **Colapso** con todo cargado, y desde Deckbuilding ves los mazos. En la sección de impresión puedes imprimir un mazo entero como proxy.

**Opción manual:** crea un proyecto y un tipo de carta por cada CSV ("Explorador", "Explorador (con restricción)", "Evento" y "Evento (con restricción)") con las propiedades de sus cabeceras, y usa el importador de CSV en cada uno. Las columnas se mapean por nombre, así que puedes editar los CSV y volver a importarlos (con `ID` como clave se actualizan en lugar de duplicar).

## Los mazos

| Mazo | Estilo | Lo que aprende quien lo juega |
|---|---|---|
| **Fantaspet** · Niebla Persistente | Combo y trampas | Búsquedas y asistentes ocultos. |
| **Ugabuga** · Estampida de Piedra | Agresivo | Combate y el costo de las restricciones. |
| **Ragnatica** · Telaraña Paciente | Control | Fichas, atracción y trampas. |
| **Baluarte** · Muralla Viviente *(starter extra)* | Aguantar | Atracción y asistentes como escudo. |

Empieza leyendo [ruleguides.md](ruleguides.md) y después elige un mazo en [decks.md](decks.md). La lista de decisiones por confirmar en partidas de prueba está al final de las reglas.

**Mecánica distintiva:** los *asistentes*. Un explorador activo puede sostener a otro debajo; cuando lo atacan, el asistente se revela y el defensor decide si pelea CON o SIN su ayuda.

## Para modificar las cartas

Los CSV son la fuente editable. El rol de cada carta (starter, extender, pieza, interrupción) es una nota de diseño y solo aparece en [cards.md](cards.md); no se imprime en la carta. Antes de añadir cartas nuevas, revisa la lista de [designguide.md](designguide.md#lista-de-revisión-para-una-carta-nueva).
