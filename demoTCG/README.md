# Colapso (demo)

Juego de cartas de demostración para Cardgame Prototyper: 1 contra 1, de cadenas e interacción, inspirado en Yu-Gi-Oh!. *Colapso* es un nombre de trabajo.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| [ruleguides.md](ruleguides.md) | **Cómo se juega.** Turnos, combate, cadenas, triggers, restricciones, búsquedas. |
| [designguide.md](designguide.md) | **Cómo se diseña.** Filosofía, roles, restricciones, vocabulario, lore, diseño visual. |
| [cards.md](cards.md) | Catálogo completo: 27 exploradores (1 ficha) y 16 eventos, con rol y nivel de restricción. |
| [decks.md](decks.md) | Tres mazos de 40 cartas con estrategia y líneas de juego de ejemplo. |
| `colapso.json` | Proyecto completo para **importar en la app**: 2 tipos de carta con su diseño, todas las cartas y los 3 mazos. |
| `cartas-exploradores.csv` | Exploradores, listos para el importador de CSV. |
| `cartas-eventos.csv` | Eventos, listos para el importador de CSV. |
| `mytcg.json` | Primer borrador (proyecto "Mytcg", otra mecánica de combate). Se conserva como referencia. |

## Cómo usarlo en la app

**Opción rápida:** importa `colapso.json` desde la lista de proyectos. Obtienes el proyecto **Colapso** con todo cargado, y desde Deckbuilding ves los tres mazos. En la sección de impresión puedes imprimir un mazo entero como proxy.

**Opción manual:** crea un proyecto, un tipo de carta "Explorador" y otro "Evento" con las propiedades de las cabeceras de cada CSV, y usa el importador de CSV en cada uno. Las columnas se mapean por nombre, así que puedes editar los CSV y volver a importarlos (con `ID` como clave se actualizan en lugar de duplicar).

## Los tres mazos

| Mazo | Estilo | Lo que aprende quien lo juega |
|---|---|---|
| **Fantaspet** · Niebla Persistente | Combo y resistencia | Búsquedas y cadenas de triggers. |
| **Ugabuga** · Estampida de Piedra | Agresivo | Combate y el costo de las restricciones. |
| **Ragnatica** · Telaraña Paciente | Control | Fichas e interrupciones por costo. |

Empieza leyendo [ruleguides.md](ruleguides.md) y después elige un mazo en [decks.md](decks.md). La lista de decisiones por confirmar en partidas de prueba está al final de las reglas.

## Para modificar las cartas

Los CSV son la fuente editable. El rol de cada carta (starter, extender, pieza, interrupción) es una nota de diseño y solo aparece en [cards.md](cards.md); no se imprime en la carta. Antes de añadir cartas nuevas, revisa la lista de [designguide.md](designguide.md#lista-de-revisión-para-una-carta-nueva).
