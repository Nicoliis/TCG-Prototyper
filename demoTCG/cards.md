# Catálogo de cartas

35 exploradores (incluye 1 ficha) y 20 eventos, repartidos en 4 dimensiones y un pool neutral.
Generado a partir de `cartas-exploradores.csv` y `cartas-eventos.csv` (los CSV son la fuente editable; el rol es una nota de diseño y no se imprime en la carta).

Roles: **Starter** abre el combo · **Extender** lo completa si fue interrumpido · **Pieza** es el objetivo a dejar en el tablero · **Interrupción** frena al oponente sin decir simplemente "no".

Etiquetas de efecto: **Normal** (lo activas tú) · **Trigger** (reacciona) · **Asistencia** (solo funciona mientras la carta es un asistente). El texto sin etiqueta es un efecto continuo. Las palabras (buscar, atracción, asistir…) están en [glosario.md](glosario.md).

Las restricciones son libres: no hay niveles. Se muestran en su propia columna.

## Fantaspet

Mascotas espectrales de Eterneblina. Búsqueda, recursión y asistentes que protegen o castigan.

### Exploradores

| # | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-1 | **Gooboy** | 150 | Extender | **Asistencia:** Si el explorador activo fuera a ser destruido: destruye a esta carta en su lugar. | — |
| EXP-2 | **Boolly** | 50 | Extender | **Trigger:** (Desde tu mano) Si un Fantaspet que controlas es destruido: juega a esta carta boca arriba, asistiendo a un explorador sin asistente que controlas. | — |
| EXP-3 | **Cesarmill** | 120 | Starter | **Normal:** Busca 1 Fantaspet y juégalo asistiendo a esta carta, boca abajo (solo si no tiene asistente). | Después de entrar al campo> Si es tu turno: no puedes declarar ataques este turno. |
| EXP-4 | **Plumifer** | 100 | Starter | **Normal:** Destruye esta carta.<br>**Trigger:** Si esta carta es destruida: busca 1 Fantaspet con PODER 120 o menos. | — |
| EXP-5 | **Cattrix** | 100 | Extender | **Normal:** Juega 1 Fantaspet con PODER 100 o menos de tu mano.<br>**Asistencia:** Si el explorador activo declara un ataque o es atacado: ese explorador gana 50 PODER hasta el final del turno. | — |
| EXP-6 | **Koalma** | 100 | Extender | **Normal:** Exilia 1 carta de tu cementerio: devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Asistencia:** Si el explorador activo es atacado: el atacante pierde 30 PODER hasta el final del turno. | — |
| EXP-7 | **Talkatak** | 150 | Interrupción | **Normal:** Reemplaza 1 asistente que controlas por 1 Fantaspet de tu mano, boca abajo. El asistente reemplazado vuelve a tu mano. | Después de entrar al campo> descarta 1 carta. |
| EXP-8 | **Dragging** | 20 | Pieza | **Asistencia:** Si esta carta es revelada en un combate: destruye todos los exploradores que no sean Fantaspet involucrados en ese combate. | — |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-1 | **Susurros en Eterneblina** | Rápido | Extender | **Normal:** Devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Trigger:** Si un Fantaspet que controlas fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVT-2 | **Refugio en emergente Eterneblina** | Lento | Starter | **Normal:** Revela 1 Fantaspet de tu mano: busca 1 Fantaspet con distinto nombre.<br>**Trigger:** Si un Fantaspet que controlas es destruido: busca 1 Fantaspet con PODER 100 o menos. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |
| EVT-3 | **Presencia en Eterneblina** | Rápido | Interrupción | **Normal:** Elige 1 Fantaspet que controlas: gana 50 PODER hasta el final del turno.<br>**Trigger:** Si un Fantaspet que controlas es atacado: ese Fantaspet no puede ser destruido en este combate. | — |
| EVT-4 | **Procesión en emergente Eterneblina** | Lento | Extender | **Normal:** Juega hasta 2 Fantaspet con distinto nombre de tu cementerio. Sus efectos se niegan hasta el final del turno. | Después de activar> se termina tu turno. |

## Ugabuga

Tribus de piedra. Presión de combate a costa de sacrificios.

### Exploradores

| # | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-9 | **Ugalito** | 100 | Starter | **Normal:** Descarta 1 carta: busca 1 Ugabuga. | Después de entrar al campo> Si es tu turno: no puedes jugar más exploradores este turno. |
| EXP-10 | **Lance-elot** | 30 | Pieza | **Asistencia:** El explorador activo gana 30 PODER. | Esta carta no puede declarar ataques. |
| EXP-11 | **Van-guard** | 180 | Interrupción | **Atracción** de ataques. | Esta carta no puede declarar ataques ni tener asistentes. Mientras combate, su PODER pasa a ser 0. |
| EXP-12 | **Monstaa** | 180 | Pieza | — | Después de combatir> Destruye el asistente de esta carta. Si no puedes, destruye esta carta. |
| EXP-13 | **Balanced** | 160 | Extender | — | — |
| EXP-14 | **Pedrusco** | 100 | Pieza | **Trigger:** Si esta carta es destruida en combate: destruye al explorador que participó en ese combate. | — |
| EXP-15 | **Chamán Ugabu** | 120 | Extender | **Normal:** Descarta 1 carta: devuelve 1 Ugabuga de tu cementerio a tu mano.<br>**Trigger:** Si un Ugabuga que controlas es destruido en combate: roba 1 carta. | — |
| EXP-16 | **Cazador Ugabu** | 150 | Pieza | **Trigger:** Si esta carta destruye un explorador en combate: el oponente descarta 1 carta al azar. | — |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-5 | **Estampida en emergente Ugabuga** | Lento | Pieza | **Normal:** Elige 1 Ugabuga que controlas: puede declarar un segundo ataque este turno. | Después de activar> no puedes activar más efectos este turno. |
| EVT-6 | **Grito de guerra Ugabuga** | Rápido | Interrupción | **Normal:** Elige 1 Ugabuga que controlas: gana 50 PODER hasta el final del turno.<br>**Trigger:** Si un Ugabuga que controlas es atacado: ese Ugabuga gana 80 PODER hasta el final del turno. | — |
| EVT-7 | **Derrumbe en emergente cueva Ugabuga** | Rápido | Interrupción | **Normal:** Descarta 1 carta: destruye 1 explorador con PODER 100 o menos.<br>**Trigger:** Si el oponente juega un explorador, descarta 1 Ugabuga: destruye ese explorador si su PODER es 100 o menos. | — |
| EVT-8 | **Banquete inaugural de aldea Ugabuga** | Lento | Starter | **Normal:** Destruye 1 explorador que controlas: roba 2 cartas.<br>**Trigger:** Si un Ugabuga que controlas es destruido: juega 1 Ugabuga con PODER 120 o menos de tu mano. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |

## Ragnatica

Arácnidos tejedores. Fichas, señuelos y asistentes-trampa.

### Exploradores

| # | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-17 | **Telarín** | 100 | Starter | **Normal:** Agrega 1 ficha Cría (solo si no controlas fichas Cría). | — |
| EXP-18 | **Hilandera** | 120 | Starter | **Normal:** Destruye 1 ficha Cría que controlas: busca 1 Ragnatica con PODER 200 o menos. | — |
| EXP-19 | **Viuda Gris** | 150 | Interrupción | **Trigger:** Si un explorador del oponente declara un ataque, destruye 1 ficha Cría que controlas: anula ese ataque. | — |
| EXP-20 | **Capullo Silente** | 0 | Interrupción | **Asistencia:** Si el explorador activo es atacado: devuelve al atacante a la mano de su controlador. El ataque termina. | — |
| EXP-21 | **Emboscadora** | 150 | Extender | **Trigger:** (Desde tu mano) Si el oponente juega un explorador: juega a esta carta. Ese explorador no puede declarar ataques este turno. | — |
| EXP-22 | **Señuelo** | 100 | Interrupción | **Atracción** de ataques. | Esta carta no puede declarar ataques. |
| EXP-23 | **Madre Telar** | 200 | Pieza | **Normal:** Destruye 2 fichas Cría que controlas: devuelve 1 explorador del oponente a su mano. | Después de entrar al campo> Si es tu turno: no puedes activar más efectos este turno. |
| EXP-24 | **Reina de Ragnatica** | 250 | Pieza | **Normal:** (Desde tu mano) Destruye 2 fichas Cría que controlas: juega esta carta.<br>**Trigger:** Si el oponente activa un efecto de explorador que elige a una carta que controlas, descarta 1 carta y destruye 1 ficha Cría que controlas: niega esa activación. | Después de entrar al campo> Si es tu turno: se termina tu turno. |
| EXP-25 | **Cría de Ragnatica** | 100 | Ficha | Ficha. Desaparece si deja el campo. | — |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-9 | **Conflicto en emergente reino de Ragnatica** | Lento | Starter | **Normal:** Agrega 2 fichas Cría.<br>**Trigger:** Si el oponente declara un ataque: agrega 1 ficha Cría. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |
| EVT-10 | **Hilos cortados en Ragnatica** | Rápido | Interrupción | **Normal:** Descarta 1 carta: devuelve a la mano 1 explorador con PODER 120 o menos.<br>**Trigger:** Si el oponente juega un explorador, descarta 1 carta: devuelve ese explorador a su mano. | — |
| EVT-11 | **Cosecha en Ragnatica** | Lento | Extender | **Normal:** Destruye 1 ficha Cría que controlas: roba 2 cartas.<br>**Trigger:** Si una ficha Cría que controlas es destruida: roba 1 carta. | — |
| EVT-12 | **Plaga en emergente Ragnatica** | Rápido | Interrupción | **Normal:** Destruye todas las fichas Cría que controlas (mínimo 1): el oponente descarta 1 carta por cada ficha destruida (máximo 3). | Después de activar> no puedes activar más efectos este turno. |

## Baluarte

Fortaleza emergente. Un personaje principal resistente, sostenido por escuderos que comparten efectos.

### Exploradores

| # | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-26 | **Aegis, Custodio del Baluarte** | 200 | Pieza | **Atracción** de ataques y efectos.<br>Mientras esta carta tenga un asistente, no puede ser destruida por efectos.<br>**Trigger:** Si esta carta fuera a ser destruida en batalla: puedes destruir a su asistente en lugar de esta carta. | Después de entrar al campo> Si es tu turno: se termina tu turno. Solo puedes controlar 1 copia de esta carta. |
| EXP-27 | **Rodelero** | 160 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo y asiste esta carta a Aegis, boca abajo.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asiste esta carta a Aegis, boca abajo.<br>**Asistencia:** Un solo escudero. Si el explorador activo es atacado: ese explorador gana 20 PODER hasta el final del turno. | — |
| EXP-28 | **Alabardero** | 140 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo y asiste esta carta a Aegis, boca abajo.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asiste esta carta a Aegis, boca abajo.<br>**Asistencia:** Un solo escudero. Si el explorador activo es atacado: el atacante pierde 20 PODER hasta el final del turno. | — |
| EXP-29 | **Armero** | 120 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo y asiste esta carta a Aegis, boca abajo.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asiste esta carta a Aegis, boca abajo.<br>**Asistencia:** Un solo escudero. Si esta carta es destruida: el explorador activo gana 30 PODER hasta el final del turno. | — |
| EXP-30 | **Ballestero** | 100 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo y asiste esta carta a Aegis, boca abajo.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asiste esta carta a Aegis, boca abajo.<br>**Trigger:** Un solo escudero. Si un explorador del oponente declara un ataque: ese explorador pierde 20 PODER hasta el final del turno. | — |
| EXP-31 | **Heraldo** | 80 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo y asiste esta carta a Aegis, boca abajo.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asiste esta carta a Aegis, boca abajo.<br>**Asistencia:** Un solo escudero. Si esta carta es destruida: devuelve 1 escudero de tu cementerio a tu mano. | — |
| EXP-32 | **Archivista del Baluarte** | 90 | Starter | **Normal:** Busca 1 Baluarte. | Después de entrar al campo> pierdes 50 puntos de vida. |
| EXP-33 | **Centinela del Baluarte** | 140 | Extender | **Normal:** Descarta 1 carta: asiste 1 Baluarte de tu cementerio a un explorador sin asistente que controlas, boca abajo. | — |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-13 | **Cerrad filas en emergente Baluarte** | Rápido | Interrupción | **Normal:** Elige 1 explorador que controlas con asistente: gana 50 PODER hasta el final del turno.<br>**Trigger:** Si un explorador que controlas con asistente es atacado: el atacante pierde 50 PODER hasta el final del turno. | — |
| EVT-14 | **Relevo de guardia en Baluarte** | Rápido | Extender | **Normal:** Reemplaza 1 asistente que controlas por 1 Baluarte de tu mano, boca abajo. El asistente reemplazado vuelve a tu mano.<br>**Trigger:** Si un asistente que controlas fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVT-15 | **Reconstrucción en emergente Baluarte** | Lento | Extender | **Normal:** Juega 1 Baluarte de tu cementerio asistiendo, boca abajo, a un explorador sin asistente que controlas.<br>**Trigger:** Si un Baluarte que controlas es destruido: busca 1 Baluarte con PODER 120 o menos. | Después de activar> no puedes declarar ataques este turno. |
| EVT-16 | **Represalia en Baluarte** | Rápido | Interrupción | **Normal:** Elige 1 explorador del oponente: pierde 50 PODER hasta el final del turno.<br>**Trigger:** Si un explorador del oponente es destruido en combate: el oponente recibe 50 puntos de daño. | — |

## Neutral

Cartas sin dimensión, jugables en cualquier mazo.

### Exploradores

| # | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-34 | **Cartógrafo Errante** | 100 | Starter | **Normal:** Roba 1 carta, luego descarta 1 carta. | Después de entrar al campo> Si es tu turno: no puedes jugar más exploradores este turno. |
| EXP-35 | **Mercenario del Colapso** | 200 | Extender | **Normal:** (Desde tu mano) Descarta 1 carta: juega esta carta. | Después de entrar al campo> Si es tu turno: no puedes activar más efectos este turno. |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-17 | **Grieta en emergente Valle Mudo** | Rápido | Interrupción | **Trigger:** Si el oponente activa un efecto que busca, descarta 1 carta y destruye 1 explorador que controlas: niega esa activación. | — |
| EVT-18 | **Brújula Rota** | Lento | Starter | **Normal:** Roba 2 cartas, luego descarta 2 cartas.<br>**Trigger:** Si una carta falla en la búsqueda: roba 1 carta. | — |
| EVT-19 | **Campamento en emergente Tierra de Nadie** | Lento | Extender | **Normal:** Devuelve 1 explorador de tu cementerio a tu mano. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |
| EVT-20 | **Retirada Táctica** | Rápido | Interrupción | **Normal:** Devuelve 1 explorador que controlas a tu mano.<br>**Trigger:** Si un explorador que controlas es atacado: devuelve ese explorador a tu mano. El ataque termina. | — |
