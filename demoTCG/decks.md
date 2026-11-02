# Mazos iniciales

Tres mazos de 40 cartas, listos para jugar entre sí. Cada uno usa una dimensión completa más 12-13 cartas del pool neutral. Ningún nombre supera las 3 copias.

Están pensados para que cada mazo aprenda una parte distinta del juego y para que ninguno gane siempre contra los otros dos:

| Mazo | Estilo | Aprende | Gana por | Pierde contra |
|---|---|---|---|---|
| **Fantaspet** · Niebla Persistente | Combo y resistencia | Búsquedas, cadenas de triggers, recursión | Tablero que castiga los combates | Presión rápida antes de armar el tablero |
| **Ugabuga** · Estampida de Piedra | Agresivo | Combate, posiciones, costo de las restricciones | Daño directo y descartes | Tableros que anulan ataques |
| **Ragnatica** · Telaraña Paciente | Control | Fichas, interrupciones por costo, tempo | Quitar recursos y objetivos al oponente | Mazos que ignoran las fichas y buscan velocidad |

Los tres incluyen 2 copias de **Grieta en emergente Valle Mudo**, una de las dos negaciones del juego (la otra es la Reina de Ragnatica), a propósito muy específica (solo contra búsquedas) y muy cara. Fantaspet y Ugabuga la usan contra el otro mazo que busca; no hace nada contra Ragnatica salvo cuando esta busca con Hilandera.

Antes de jugar, lee [ruleguides.md](ruleguides.md). Para ver el texto de cada carta, [cards.md](cards.md).

## Fantaspet · Niebla Persistente

**Composición:** 22 exploradores · 18 eventos.

**Idea:** ninguna carta hace mucho sola, pero casi todas reaccionan a que otro Fantaspet sea destruido. Sacrificar una carta abre una cadena de triggers que busca, baja y recupera.

**Cómo se juega**
- Starters: **Cesarmill** (busca lo que necesitas, pero abierto al oponente) y **Plumifer** (se destruye para buscar en secreto).
- Extenders: **Boolly**, **Cattrix**, **Koalma** y **Susurros en Eterneblina** devuelven cartas al juego si el oponente rompe el combo.
- Pieza: **Dragging**. Entra al final de tu turno (R3 termina el turno) y destruye a quien ataque a tus Fantaspet que no sea de la dimensión.
- Interrupciones: **Talkatak** devuelve a tu mano a quien intenten elegir; **Presencia en Eterneblina** evita una destrucción en combate.

**Línea de ejemplo (turno 1, sin Fase de Batalla)**
1. Bajas **Plumifer** (bajada espontánea del turno).
2. Activas su efecto Normal: se destruye. Comienza una cadena.
3. Como jugador de turno activas tus triggers en el orden que quieras: el de Plumifer (búsqueda secreta de un Fantaspet con ATK 150 o menos; muestras por ejemplo Cesarmill, Gooboy y Boolly) y, si tienes **Boolly** en la mano, el de Boolly (un Fantaspet fue destruido).
4. Resultado: Boolly en Defensa y una carta nueva en la mano, por el gasto de 1 sola carta. El oponente vio tres candidatos y no sabe cuál tomaste.

**Segundo turno ejemplo:** bajas **Cesarmill** y buscas **Dragging** (R1 te impide bajar más exploradores ese turno). Al turno siguiente, descartas 1 Fantaspet para bajar a Dragging; tu turno termina, pero ahora el tablero castiga a quien ataque.

**Debilidades:** las búsquedas de Cesarmill son públicas y el oponente sabe a qué te acercas. Muchas cartas tienen ATK bajo, así que un Ugabuga con 400 ATK atacando desde el turno 3 te pone contra las cuerdas.

**Para jugarlo mejor:** guarda **Talkatak** para el efecto que más te duela, no para el primero que veas. No gastes **Susurros** como trigger preventivo si puedes usarlo después para recuperar a Dragging.

### Lista (40 cartas)

| Copias | Carta | Tipo | Dimensión | Rol |
|---|---|---|---|---|
| 3 | Gooboy | Explorador | Fantaspet | Extender |
| 2 | Boolly | Explorador | Fantaspet | Extender |
| 3 | Cesarmill | Explorador | Fantaspet | Starter |
| 3 | Plumifer | Explorador | Fantaspet | Starter |
| 2 | Cattrix | Explorador | Fantaspet | Extender |
| 2 | Koalma | Explorador | Fantaspet | Extender |
| 2 | Talkatak | Explorador | Fantaspet | Interrupción |
| 2 | Dragging | Explorador | Fantaspet | Pieza |
| 3 | Susurros en Eterneblina | Evento | Fantaspet | Extender |
| 2 | Refugio en emergente Eterneblina | Evento | Fantaspet | Starter |
| 2 | Presencia en Eterneblina | Evento | Fantaspet | Interrupción |
| 2 | Procesión en emergente Eterneblina | Evento | Fantaspet | Extender |
| 3 | Cartógrafo Errante | Explorador | Neutral | Starter |
| 3 | Brújula Rota | Evento | Neutral | Starter |
| 2 | Campamento en emergente Tierra de Nadie | Evento | Neutral | Extender |
| 2 | Retirada Táctica | Evento | Neutral | Interrupción |
| 2 | Grieta en emergente Valle Mudo | Evento | Neutral | Interrupción |

## Ugabuga · Estampida de Piedra

**Composición:** 25 exploradores · 15 eventos.

**Idea:** los Ugabuga tienen el ATK más alto del juego y pagan por ello. Las cartas grandes se bajan destruyendo a otras, y las más fuertes tienen restricciones graves. No buscan un tablero: buscan que la partida termine antes de que el oponente arme el suyo.

**Cómo se juega**
- Starter: **Ugalito** (descarta 1 carta y busca en secreto lo que necesites) y **Banquete en emergente aldea Ugabuga** para robar a cambio de un explorador.
- Extenders: **Chamán Ugabu** recupera Ugabuga y roba cuando alguno muere en combate. **Balanced** cambia posiciones para esquivar o exponer.
- Piezas: **Monstaa** (400 ATK desde la mano, destruyendo a uno de tus propios exploradores) y **Cazador Ugabu** (cada explorador que destruye cuesta una carta al oponente).
- Muros ofensivos: **Lance-elot** y **Van-guard** no atacan, pero dan ATK a los demás o se llevan al atacante consigo.

**Línea de ejemplo**
1. Turno 1: bajas **Ugalito**, descartas 1 carta y buscas en secreto a **Monstaa** (muestras Monstaa, Balanced y Cazador Ugabu). R1 te impide bajar más exploradores. Pasas.
2. Turno 2: activas **Monstaa** desde la mano, destruyendo a Ugalito (ya cumplió), y la bajas. R3 termina tu turno: Monstaa no ataca todavía, pero el oponente ya tiene que contar con 400 ATK.
3. Turno 3: bajas **Cazador Ugabu** y atacas con Monstaa (400 ATK) y Cazador (250 ATK).
4. Si Monstaa destruye un explorador en combate, tienes que destruir otro explorador tuyo o a ella misma: decide antes de atacar con quién vas a pagar.

**Debilidades:** casi todo lo que haces es sacrificio y el oponente puede dejarte sin explorador sobre el cual pagar. Ragnatica anula ataques con Viuda Gris y devuelve a la mano a quien ataca con Capullo Silente.

**Para jugarlo mejor:** no uses **Grito de guerra Ugabuga** como respuesta a todo. Sirve más como carta de defensa (si te atacan) que como refuerzo del ataque, porque puedes ganar 200 ATK y 200 DEF.

### Lista (40 cartas)

| Copias | Carta | Tipo | Dimensión | Rol |
|---|---|---|---|---|
| 3 | Ugalito | Explorador | Ugabuga | Starter |
| 2 | Lance-elot | Explorador | Ugabuga | Pieza |
| 2 | Van-guard | Explorador | Ugabuga | Pieza |
| 2 | Monstaa | Explorador | Ugabuga | Pieza |
| 2 | Balanced | Explorador | Ugabuga | Extender |
| 2 | Pedrusco | Explorador | Ugabuga | Pieza |
| 3 | Chamán Ugabu | Explorador | Ugabuga | Extender |
| 3 | Cazador Ugabu | Explorador | Ugabuga | Pieza |
| 2 | Estampida en emergente Ugabuga | Evento | Ugabuga | Pieza |
| 3 | Grito de guerra Ugabuga | Evento | Ugabuga | Interrupción |
| 2 | Derrumbe en emergente cueva Ugabuga | Evento | Ugabuga | Interrupción |
| 2 | Banquete en emergente aldea Ugabuga | Evento | Ugabuga | Starter |
| 3 | Mercenario del Colapso | Explorador | Neutral | Extender |
| 3 | Cartógrafo Errante | Explorador | Neutral | Starter |
| 2 | Brújula Rota | Evento | Neutral | Starter |
| 2 | Campamento en emergente Tierra de Nadie | Evento | Neutral | Extender |
| 2 | Grieta en emergente Valle Mudo | Evento | Neutral | Interrupción |

## Ragnatica · Telaraña Paciente

**Composición:** 21 exploradores · 19 eventos.

**Idea:** las fichas **Cría** son recurso y escudo. Casi todas las interrupciones de Ragnatica se pagan con fichas, no con cartas de la mano, y las fichas no cuentan como "bajar" un explorador, así que R1 no las bloquea. Ragnatica prepara un tablero lleno de condiciones y deja que el oponente intente jugar a través.

**Cómo se juega**
- Starters: **Telarín** (1 ficha por turno si no tienes otra), **Conflicto en emergente reino de Ragnatica** (2 fichas) e **Hilandera** (busca convirtiendo una ficha).
- Interrupciones: **Viuda Gris** (anula un ataque), **Capullo Silente** (devuelve a la mano al atacante), **Hilos cortados en Ragnatica** (devuelve un explorador a la mano de su dueño), **Emboscadora** (desde la mano, responde a una bajada).
- Extenders: **Señuelo** (una ficha muere en lugar de un Ragnatica), **Cosecha en Ragnatica**.
- Piezas: **Madre Telar** y **Reina de Ragnatica**. La Reina es la única negación general del juego (cualquier efecto de explorador que elija una carta tuya), y cuesta una carta de tu mano y una ficha cada vez.

**Línea de ejemplo (dos turnos)**
1. Turno 1: bajas **Telarín** y activas su efecto (1 ficha). Activas **Conflicto en emergente reino de Ragnatica** (2 fichas más). Ya tienes Telarín y 3 fichas en el campo, y R1 no te importa porque no ibas a bajar más exploradores.
2. Turno 2: activas **Reina de Ragnatica** desde la mano, destruyendo 2 fichas, y la bajas. R3 termina tu turno, pero el tablero queda con Reina, Telarín y 1 ficha, y todo el que quiera elegir objetivo en tu campo se arriesga a una negación.

**Debilidades:** sin fichas todas las interrupciones se apagan. Lo que destruye a tus fichas sin que las pagues (por ejemplo **Dragging**, que destruye a los no Fantaspet de un combate) te deja sin combustible. Es el mazo más lento.

**Para jugarlo mejor:** no gastes fichas por gastar. La ficha que dejas en el campo también protege a tus Ragnatica con **Señuelo** y alimenta **Viuda Gris**.

### Lista (40 cartas)

| Copias | Carta | Tipo | Dimensión | Rol |
|---|---|---|---|---|
| 3 | Telarín | Explorador | Ragnatica | Starter |
| 3 | Hilandera | Explorador | Ragnatica | Starter |
| 2 | Viuda Gris | Explorador | Ragnatica | Interrupción |
| 2 | Capullo Silente | Explorador | Ragnatica | Interrupción |
| 3 | Emboscadora | Explorador | Ragnatica | Extender |
| 2 | Señuelo | Explorador | Ragnatica | Extender |
| 2 | Madre Telar | Explorador | Ragnatica | Pieza |
| 1 | Reina de Ragnatica | Explorador | Ragnatica | Pieza |
| 3 | Conflicto en emergente reino de Ragnatica | Evento | Ragnatica | Starter |
| 2 | Hilos cortados en Ragnatica | Evento | Ragnatica | Interrupción |
| 2 | Cosecha en Ragnatica | Evento | Ragnatica | Extender |
| 2 | Plaga en emergente Ragnatica | Evento | Ragnatica | Interrupción |
| 3 | Cartógrafo Errante | Explorador | Neutral | Starter |
| 3 | Brújula Rota | Evento | Neutral | Starter |
| 3 | Retirada Táctica | Evento | Neutral | Interrupción |
| 2 | Campamento en emergente Tierra de Nadie | Evento | Neutral | Extender |
| 2 | Grieta en emergente Valle Mudo | Evento | Neutral | Interrupción |
