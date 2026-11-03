# Catálogo de cartas

35 exploradores (incluye 1 ficha) y 20 eventos, repartidos en 4 dimensiones y un pool neutral.
Generado a partir de los CSV (los CSV son la fuente editable; el rol es una nota de diseño y no se imprime en la carta).

Hay **cuatro tipos de carta** en la app: *Explorador* y *Evento* (sin restricción, con la caja de efecto más alta) y *Explorador (con restricción)* y *Evento (con restricción)* (con la banda de restricción). El código de cada carta indica su tipo: `EXP`, `EXR`, `EVT`, `EVR`.

Roles: **Starter** abre el combo · **Extender** lo completa si fue interrumpido · **Pieza** es el objetivo a dejar en el tablero · **Interrupción** frena al oponente sin decir simplemente "no".

Etiquetas de efecto: **Normal** (lo activas tú) · **Trigger** (reacciona) · **Asistiendo** (solo funciona mientras la carta asiste). El texto sin etiqueta es un efecto continuo. Las palabras (buscar, atracción, asistir…) están en [glosario.md](glosario.md).

Las restricciones son libres: no hay niveles. Se muestran en su propia columna.

## Fantaspet

Mascotas espectrales de Eterneblina. Búsqueda, recursión y asistentes ocultos que castigan al ser revelados.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-1 | **Gooboy** | 150 | Extender | **Asistiendo:** Si el explorador fuera a ser destruido: destruye esta carta en su lugar. | — |
| EXP-2 | **Boolly** | 50 | Extender | **Trigger:** (Desde tu mano) Si un Fantaspet es destruido: juega esta carta boca arriba, asistiendo a un explorador sin asistente. | — |
| EXR-1 | **Cesarmill** | 120 | Pieza | **Normal:** Busca 1 Fantaspet y juégalo asistiendo a esta carta (solo sin asistente).<br>**Trigger:** Si un Fantaspet es revelado: el oponente recibe 50 de daño por cada Fantaspet en tu cementerio (máx. 4). | Después de entrar al campo> Si es tu turno: no puedes declarar ataques este turno. |
| EXP-3 | **Plumifer** | 100 | Starter | **Normal:** Destruye esta carta.<br>**Trigger:** Si esta carta es destruida: busca 1 Fantaspet con PODER 120 o menos. | — |
| EXP-4 | **Cattrix** | 100 | Extender | **Normal:** Juega 1 Fantaspet con PODER 100 o menos de tu mano.<br>**Asistiendo:** Si el explorador declara un ataque o es atacado: gana 50 PODER. | — |
| EXP-5 | **Koalma** | 100 | Extender | **Normal:** Exilia 1 carta de tu cementerio: devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Asistiendo:** Si el explorador es atacado: el atacante pierde 30 PODER. | — |
| EXR-2 | **Talkatak** | 150 | Interrupción | **Normal:** Reemplaza 1 asistente por 1 Fantaspet de tu mano. El asistente reemplazado vuelve a tu mano. | Después de entrar al campo> descarta 1 carta. |
| EXP-6 | **Dragging** | 20 | Pieza | **Asistiendo:** Si esta carta es revelada en combate: destruye los exploradores no Fantaspet de ese combate. | — |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-1 | **Susurros en Eterneblina** | Rápido | Extender | **Normal:** Devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Trigger:** Si un Fantaspet fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVR-1 | **Refugio en emergente Eterneblina** | Lento | Starter | **Normal:** Revela 1 Fantaspet de tu mano: busca 1 Fantaspet con distinto nombre.<br>**Trigger:** Si un Fantaspet es destruido: busca 1 Fantaspet con PODER 100 o menos. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |
| EVT-2 | **Presencia en Eterneblina** | Rápido | Interrupción | **Normal:** Elige 1 Fantaspet: gana 50 PODER.<br>**Trigger:** Si un Fantaspet es atacado: no puede ser destruido en este combate. | — |
| EVR-2 | **Procesión en emergente Eterneblina** | Lento | Extender | **Normal:** Juega hasta 2 Fantaspet con distinto nombre de tu cementerio. Sus efectos se niegan este turno. | Después de activar> se termina tu turno. |

## Ugabuga

Tribus de piedra. Presión de combate a costa de sacrificios.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXR-3 | **Ugalito** | 100 | Starter | **Normal:** Descarta 1 carta: busca 1 Ugabuga. | Después de entrar al campo> Si es tu turno: no puedes jugar más exploradores este turno. |
| EXR-4 | **Lance-elot** | 30 | Pieza | **Asistiendo:** El explorador gana 30 PODER. | Esta carta no puede declarar ataques. |
| EXR-5 | **Van-guard** | 180 | Interrupción | **Atracción** de ataques. | No puede declarar ataques ni tener asistentes. Al combatir, su PODER pasa a ser 0. |
| EXR-6 | **Monstaa** | 180 | Pieza | — | Después de combatir> Destruye su asistente. Si no puedes, destruye esta carta. |
| EXP-7 | **Balanced** | 160 | Extender | — | — |
| EXP-8 | **Pedrusco** | 100 | Pieza | **Trigger:** Si esta carta es destruida en combate: destruye al otro explorador del combate. | — |
| EXP-9 | **Chamán Ugabu** | 120 | Extender | **Normal:** Descarta 1 carta: devuelve 1 Ugabuga de tu cementerio a tu mano.<br>**Trigger:** Si un Ugabuga es destruido en combate: roba 1 carta. | — |
| EXP-10 | **Cazador Ugabu** | 150 | Pieza | **Trigger:** Si esta carta destruye un explorador en combate: el oponente descarta 1 carta al azar. | — |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVR-3 | **Estampida en emergente Ugabuga** | Lento | Pieza | **Normal:** Elige 1 Ugabuga: puede declarar un segundo ataque este turno. | Después de activar> no puedes activar más efectos este turno. |
| EVT-3 | **Grito de guerra Ugabuga** | Rápido | Interrupción | **Normal:** Elige 1 Ugabuga: gana 50 PODER.<br>**Trigger:** Si un Ugabuga es atacado: gana 80 PODER. | — |
| EVT-4 | **Derrumbe en emergente cueva Ugabuga** | Rápido | Interrupción | **Normal:** Descarta 1 carta: destruye 1 explorador con PODER 100 o menos.<br>**Trigger:** Si el oponente juega un explorador con PODER 100 o menos, descarta 1 Ugabuga: destrúyelo. | — |
| EVR-4 | **Banquete inaugural de aldea Ugabuga** | Lento | Starter | **Normal:** Destruye 1 explorador: roba 2 cartas.<br>**Trigger:** Si un Ugabuga es destruido: juega 1 Ugabuga con PODER 120 o menos de tu mano. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |

## Ragnatica

Arácnidos tejedores. Fichas, señuelos y asistentes-trampa.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-11 | **Telarín** | 100 | Starter | **Normal:** Agrega 1 ficha Cría (solo sin fichas Cría). | — |
| EXP-12 | **Hilandera** | 120 | Starter | **Normal:** Destruye 1 ficha Cría: busca 1 Ragnatica con PODER 200 o menos. | — |
| EXP-13 | **Viuda Gris** | 150 | Interrupción | **Trigger:** Si un explorador del oponente declara un ataque, destruye 1 ficha Cría: anula ese ataque. | — |
| EXP-14 | **Capullo Silente** | 0 | Interrupción | **Asistiendo:** Si el explorador es atacado: devuelve al atacante a su mano. El ataque termina. | — |
| EXP-15 | **Emboscadora** | 150 | Extender | **Trigger:** (Desde tu mano) Si el oponente juega un explorador: juega esta carta. Ese explorador no puede declarar ataques este turno. | — |
| EXR-7 | **Señuelo** | 100 | Interrupción | **Atracción** de ataques. | Esta carta no puede declarar ataques. |
| EXR-8 | **Madre Telar** | 200 | Pieza | **Normal:** Destruye 2 fichas Cría: devuelve 1 explorador del oponente a su mano. | Después de entrar al campo> Si es tu turno: no puedes activar más efectos este turno. |
| EXR-9 | **Reina de Ragnatica** | 250 | Pieza | **Normal:** (Desde tu mano) Destruye 2 fichas Cría: juega esta carta.<br>**Trigger:** Si el oponente activa un efecto de explorador que elige a una carta tuya, descarta 1 carta y destruye 1 ficha Cría: niega esa activación. | Después de entrar al campo> Si es tu turno: se termina tu turno. |
| EXP-16 | **Cría de Ragnatica** | 100 | Ficha | Ficha. Desaparece si deja el campo. | — |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVR-5 | **Conflicto en emergente reino de Ragnatica** | Lento | Starter | **Normal:** Agrega 2 fichas Cría.<br>**Trigger:** Si el oponente declara un ataque: agrega 1 ficha Cría. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |
| EVT-5 | **Hilos cortados en Ragnatica** | Rápido | Interrupción | **Normal:** Descarta 1 carta: devuelve a su mano 1 explorador del oponente con PODER 120 o menos.<br>**Trigger:** Si el oponente juega un explorador, descarta 1 carta: devuelve ese explorador a su mano. | — |
| EVT-6 | **Cosecha en Ragnatica** | Lento | Extender | **Normal:** Destruye 1 ficha Cría: roba 2 cartas.<br>**Trigger:** Si una ficha Cría es destruida: roba 1 carta. | — |
| EVR-6 | **Plaga en emergente Ragnatica** | Rápido | Interrupción | **Normal:** Destruye todas tus fichas Cría (mínimo 1): el oponente descarta 1 carta por cada una (máx. 3). | Después de activar> no puedes activar más efectos este turno. |

## Baluarte

Fortaleza emergente. Un personaje principal resistente, sostenido por escuderos que comparten efectos.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXR-10 | **Aegis, Custodio del Baluarte** | 200 | Pieza | **Atracción** de ataques y efectos.<br>Mientras tenga asistente, no puede ser destruida por efectos.<br>**Trigger:** Si esta carta fuera a ser destruida en batalla: puedes destruir a su asistente en su lugar. | Después de entrar al campo> Si es tu turno: se termina tu turno. Solo 1 copia. |
| EXP-17 | **Rodelero** | 160 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si el explorador es atacado: gana 20 PODER. | — |
| EXP-18 | **Alabardero** | 140 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si el explorador es atacado: el atacante pierde 20 PODER. | — |
| EXP-19 | **Armero** | 120 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si esta carta es destruida: el explorador gana 30 PODER. | — |
| EXP-20 | **Ballestero** | 100 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Trigger:** (Activa como **Escudero**) Si el oponente declara un ataque: ese explorador pierde 20 PODER. | — |
| EXP-21 | **Heraldo** | 80 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si esta carta es destruida: devuelve 1 Escudero de tu cementerio a tu mano. | — |
| EXR-11 | **Archivista del Baluarte** | 90 | Starter | **Normal:** Busca 1 Baluarte. | Después de entrar al campo> pierdes 50 puntos de vida. |
| EXP-22 | **Centinela del Baluarte** | 140 | Extender | **Normal:** Descarta 1 carta: juega 1 Baluarte de tu cementerio asistiendo a un explorador sin asistente. | — |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-7 | **Cerrad filas en emergente Baluarte** | Rápido | Interrupción | **Normal:** Elige 1 explorador con asistente: gana 50 PODER.<br>**Trigger:** Si un explorador con asistente es atacado: el atacante pierde 50 PODER. | — |
| EVT-8 | **Relevo de guardia en Baluarte** | Rápido | Extender | **Normal:** Reemplaza 1 asistente por 1 Baluarte de tu mano. El asistente reemplazado vuelve a tu mano.<br>**Trigger:** Si un asistente fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVR-7 | **Reconstrucción en emergente Baluarte** | Lento | Extender | **Normal:** Juega 1 Baluarte de tu cementerio asistiendo a un explorador sin asistente.<br>**Trigger:** Si un Baluarte es destruido: busca 1 Baluarte con PODER 120 o menos. | Después de activar> no puedes declarar ataques este turno. |
| EVT-9 | **Represalia en Baluarte** | Rápido | Interrupción | **Normal:** Elige 1 explorador del oponente: pierde 50 PODER.<br>**Trigger:** Si un explorador del oponente es destruido en combate: el oponente recibe 50 de daño. | — |

## Neutral

Cartas sin dimensión, jugables en cualquier mazo.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXR-12 | **Cartógrafo Errante** | 100 | Starter | **Normal:** Roba 1 carta, luego descarta 1 carta. | Después de entrar al campo> Si es tu turno: no puedes jugar más exploradores este turno. |
| EXR-13 | **Mercenario del Colapso** | 200 | Extender | **Normal:** (Desde tu mano) Descarta 1 carta: juega esta carta. | Después de entrar al campo> Si es tu turno: no puedes activar más efectos este turno. |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-10 | **Grieta en emergente Valle Mudo** | Rápido | Interrupción | **Trigger:** Si el oponente activa un efecto que busca, descarta 1 carta y destruye 1 explorador: niega esa activación. | — |
| EVT-11 | **Brújula Rota** | Lento | Starter | **Normal:** Roba 2 cartas, luego descarta 2 cartas.<br>**Trigger:** Si una carta falla en la búsqueda: roba 1 carta. | — |
| EVR-8 | **Campamento en emergente Tierra de Nadie** | Lento | Extender | **Normal:** Devuelve 1 explorador de tu cementerio a tu mano. | Después de activar> Si es tu turno: no puedes jugar más exploradores este turno. |
| EVT-12 | **Retirada Táctica** | Rápido | Interrupción | **Normal:** Devuelve 1 explorador a tu mano.<br>**Trigger:** Si un explorador es atacado: devuélvelo a tu mano. El ataque termina. | — |
