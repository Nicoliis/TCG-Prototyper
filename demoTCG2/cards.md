# Catálogo de cartas

40 exploradores (incluye 1 token) y 23 eventos, repartidos en 4 dimensiones y un pool neutral.
Generado a partir de los CSV (los CSV son la fuente editable; el rol es una nota de diseño y no se imprime en la carta).

Hay **cuatro tipos de carta** en la app: *Explorador* y *Evento* (sin restricción, con la caja de efecto más alta) y *Explorador (con restricción)* y *Evento (con restricción)* (con la banda de restricción). El código de cada carta indica su tipo: `EXP`, `EXR`, `EVT`, `EVR`.

Roles: **Starter** abre el combo · **Extender** lo completa si fue interrumpido · **Pieza** es el objetivo a dejar en el tablero · **Interrupción** frena al oponente sin decir simplemente "no".

Etiquetas de efecto: **Normal** (lo activas tú) · **Trigger** (reacciona) · **Asistiendo** (solo funciona mientras la carta asiste). El texto sin etiqueta es un efecto continuo. Las palabras (buscar, atracción, asistir…) están en [glosario.md](glosario.md).

Las restricciones son libres: no hay niveles. Se muestran en su propia columna.

## Fantaspet

Mascotas espectrales de Eterneblina. Cementerio como recurso y asistentes ocultos que protegen.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-1 | **Plumifer** | 100 | Starter | **Normal:** Destruye esta carta.<br>**Trigger:** Si esta carta es destruida: busca 1 Fantaspet con PODER 150 o menos. | — |
| EXP-2 | **Gooboy** | 150 | Extender | **Asistiendo:** Si el explorador fuera a ser destruido: destruye esta carta en su lugar. | — |
| EXP-3 | **Boolly** | 100 | Extender | **Trigger:** (Desde tu mano) Si un Fantaspet es destruido: juega esta carta boca arriba, asistiendo a un explorador sin asistente. | — |
| EXP-4 | **Cesarmill** | 150 | Pieza | Tiene +50 PODER por cada 3 cartas de tu cementerio (máx. +250).<br>**Normal:** Busca 1 Fantaspet y juégalo asistiendo a esta carta (solo sin asistente). | — |
| EXP-5 | **Koalma** | 100 | Extender | **Normal:** Exilia 1 carta de tu cementerio: devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Asistiendo:** Si el explorador es atacado: inflige 100 de daño al atacante. | — |
| EXP-6 | **Talkatak** | 150 | Interrupción | **Normal:** Reemplaza 1 asistente por 1 Fantaspet de tu mano. El asistente reemplazado va a tu cementerio. | — |
| EXP-7 | **Dragging** | 50 | Interrupción | **Asistiendo:** Si esta carta es revelada: destruye al atacante. Esta carta va a tu cementerio. | — |
| EXP-8 | **Espectro Guardián** | 200 | Pieza | Tiene +50 PODER mientras tengas 6 o más cartas en tu cementerio.<br>**Trigger:** Si esta carta fuera a ser destruida por daño: sobrevive con 50.<br>**Trigger:** Si esta carta es destruida: devuelve 1 Fantaspet de tu cementerio a tu mano. | — |
| EXR-1 | **Rey de la Niebla** | 200 | Pieza | Tiene +50 PODER por cada 2 Fantaspet de tu cementerio (máx. +250). | Después de entrar al campo> Si es tu turno: descarta 1 carta. |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-1 | **Susurros en Eterneblina** | Rápido | Extender | **Normal:** Descarta 1 carta: devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Trigger:** Si un Fantaspet fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVT-2 | **Refugio en emergente Eterneblina** | Lento | Starter | **Normal:** Revela 1 Fantaspet de tu mano: busca 1 Fantaspet con distinto nombre.<br>**Trigger:** Si un Fantaspet es destruido: busca 1 Fantaspet con PODER 150 o menos. | — |
| EVT-3 | **Presencia en Eterneblina** | Rápido | Interrupción | **Normal:** Elige 1 Fantaspet: gana 100 PODER.<br>**Trigger:** Si un Fantaspet fuera a ser destruido por daño: sobrevive con 50. | — |
| EVR-1 | **Procesión en emergente Eterneblina** | Lento | Pieza | **Normal:** Juega hasta 2 Fantaspet con distinto nombre de tu cementerio. Sus efectos se niegan este turno. | Después de activar> se termina tu turno. |

## Ugabuga

Tribus de piedra. Cuerpos enormes, sacrificios y borrado de tablero.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-9 | **Ugalito** | 100 | Starter | **Normal:** Descarta 1 carta: busca 1 Ugabuga. | — |
| EXP-10 | **Chamán Ugabu** | 150 | Extender | **Normal:** Descarta 1 carta: devuelve 1 Ugabuga de tu cementerio a tu mano.<br>**Trigger:** Si un Ugabuga es destruido: roba 1 carta. | — |
| EXP-11 | **Pedrusco** | 150 | Interrupción | **Trigger:** Si esta carta es destruida: destruye 1 explorador del oponente con PODER 200 o menos. | — |
| EXP-12 | **Cazador Ugabu** | 200 | Pieza | **Trigger:** Si el daño de esta carta destruye un explorador: el oponente descarta 1 carta al azar. | — |
| EXP-13 | **Balanced** | 200 | Extender | **Trigger:** Si esta carta fuera a ser destruida por daño: sobrevive con 50. | — |
| EXP-14 | **Triturador** | 250 | Pieza | **Trigger:** Si esta carta es jugada: destruye todos los demás exploradores con PODER 150 o menos. | — |
| EXR-2 | **Monstaa** | 300 | Pieza | — | Después de entrar al campo> destruye 1 explorador tuyo. Si no puedes, se destruye. |
| EXR-3 | **Lance-elot** | 100 | Extender | **Asistiendo:** El explorador tiene +100 PODER. | Esta carta no puede declarar ataques. |
| EXR-4 | **Van-guard** | 300 | Interrupción | **Atracción** de ataques. | No puede declarar ataques. Recibe el doble de daño. |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-4 | **Estampida en emergente Ugabuga** | Lento | Extender | **Normal:** Elige 1 Ugabuga: puede declarar un segundo ataque este turno. | — |
| EVT-5 | **Grito de guerra Ugabuga** | Rápido | Interrupción | **Normal:** Elige 1 Ugabuga: gana 100 PODER.<br>**Trigger:** Si un Ugabuga es atacado: gana 150 PODER. | — |
| EVR-2 | **Derrumbe en emergente cueva Ugabuga** | Lento | Pieza | **Normal:** Descarta 1 carta: destruye todos los exploradores con PODER 200 o menos. Roba 1 carta por cada Ugabuga destruido. | Después de activar> no puedes declarar ataques este turno. |
| EVT-6 | **Banquete inaugural de aldea Ugabuga** | Lento | Starter | **Normal:** Destruye 1 explorador: roba 2 cartas.<br>**Trigger:** Si un Ugabuga es destruido: juega 1 Ugabuga con PODER 200 o menos de tu mano. | — |
| EVR-3 | **Colapso de la meseta Ugabuga** | Lento | Pieza | **Normal:** Destruye todos los exploradores. Cada jugador descarta 1 carta. | Después de activar> se termina tu turno. |

## Ragnatica

Arácnidos tejedores. Inundar el campo de tokens; cada interrupción agrega más.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-15 | **Telarín** | 100 | Starter | **Normal:** Agrega 1 token Cría. | — |
| EXP-16 | **Hilandera** | 150 | Starter | **Normal:** Destruye 1 token Cría: busca 1 Ragnatica con PODER 200 o menos. | — |
| EXP-17 | **Madre Telar** | 200 | Pieza | Los tokens Cría tienen +50 PODER.<br>**Normal:** Descarta 1 carta: agrega 2 tokens Cría. | — |
| EXP-18 | **Nido Vivo** | 150 | Extender | **Trigger:** Si un token Cría es destruida: roba 1 carta. | — |
| EXP-19 | **Reina de Ragnatica** | 250 | Pieza | Mientras controles 3 o más tokens Cría, esta carta tiene +100 PODER.<br>**Trigger:** Si el oponente activa un efecto de explorador que elige a una carta tuya, destruye 1 token Cría: niega esa activación. Agrega 1 token Cría. | — |
| EXP-20 | **Viuda Gris** | 150 | Interrupción | **Trigger:** Si un explorador del oponente declara un ataque: anula ese ataque. Agrega 1 token Cría. | — |
| EXP-21 | **Emboscadora** | 150 | Interrupción | **Trigger:** (Desde tu mano) Si el oponente juega un explorador: juega esta carta. Agrega 1 token Cría. | — |
| EXR-5 | **Señuelo** | 100 | Interrupción | **Atracción** de ataques.<br>**Normal:** Agrega 1 token Cría. | Esta carta no puede declarar ataques. |
| EXP-22 | **Capullo Silente** | 100 | Interrupción | **Asistiendo:** Si el explorador es atacado: devuelve al atacante a su mano. Agrega 1 token Cría. | — |
| EXP-23 | **Cría de Ragnatica** | 100 | Token | Token. Desaparece si deja el campo. | — |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-7 | **Conflicto en emergente reino de Ragnatica** | Lento | Starter | **Normal:** Agrega 2 tokens Cría.<br>**Trigger:** Si el oponente declara un ataque: agrega 1 token Cría. | — |
| EVT-8 | **Telar de urgencia en Ragnatica** | Lento | Starter | **Normal:** Descarta 1 carta: agrega 2 tokens Cría. | — |
| EVT-9 | **Hilos cortados en Ragnatica** | Rápido | Interrupción | **Normal:** Devuelve a su mano 1 explorador del oponente. Agrega 1 token Cría. | — |
| EVT-10 | **Crianza en Ragnatica** | Lento | Extender | **Normal:** Elige 1 token Cría: gana 100 PODER. | — |
| EVR-4 | **Plaga en emergente Ragnatica** | Rápido | Interrupción | **Normal:** Destruye todos tus tokens Cría (mínimo 1): el oponente descarta 1 carta por cada una (máx. 3). | Después de activar> no puedes activar más efectos este turno. |

## Baluarte

Fortaleza emergente. Un personaje principal que crece solo, apuntalado por Escuderos.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXR-6 | **Aegis, Custodio del Baluarte** | 200 | Pieza | **Atracción** de ataques y efectos.<br>Mientras tenga asistente, no puede ser destruida por efectos.<br>**Trigger:** Al comienzo de tu turno: esta carta gana 50 PODER (máx. +200). | Después de entrar al campo> Si es tu turno: se termina tu turno. Solo 1 copia. |
| EXP-24 | **Rodelero** | 200 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si el explorador es atacado: gana 50 PODER. | — |
| EXP-25 | **Alabardero** | 150 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si el explorador es atacado: inflige 100 de daño al atacante. | — |
| EXP-26 | **Armero** | 150 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si esta carta es destruida: el explorador gana 100 PODER. | — |
| EXP-27 | **Ballestero** | 100 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Trigger:** (Activa como **Escudero**) Si el oponente declara un ataque: inflige 100 de daño a ese explorador. | — |
| EXP-28 | **Heraldo** | 100 | Starter | **Trigger:** Si esta carta es jugada activa desde tu mano: juega 1 Aegis de tu mazo asistido por esta carta.<br>**Trigger:** (Desde tu mano) Si Aegis se queda sin asistente: asístelo con esta carta.<br>**Asistiendo:** (Activa como **Escudero**) Si esta carta es destruida: devuelve 1 Escudero de tu cementerio a tu mano. | — |
| EXR-7 | **Archivista del Baluarte** | 100 | Starter | **Normal:** Busca 1 Baluarte. | Después de entrar al campo> descarta 1 carta. |
| EXP-29 | **Centinela del Baluarte** | 150 | Extender | **Normal:** Descarta 1 carta: juega 1 Baluarte de tu cementerio asistiendo a un explorador sin asistente. | — |
| EXP-30 | **Sargento de la Muralla** | 200 | Pieza | Los demás Baluarte tienen +50 PODER. | — |
| EXP-31 | **Torre Viva** | 250 | Pieza | **Trigger:** Al comienzo de tu turno: cura 100 de daño a 1 explorador.<br>**Trigger:** Si esta carta fuera a ser destruida por daño: sobrevive con 100. | — |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-11 | **Cerrad filas en emergente Baluarte** | Rápido | Interrupción | **Normal:** Elige 1 explorador con asistente: gana 100 PODER y cura todo su daño.<br>**Trigger:** Si un explorador con asistente es atacado: inflige 100 de daño al atacante. | — |
| EVT-12 | **Relevo de guardia en Baluarte** | Rápido | Extender | **Normal:** Reemplaza 1 asistente por 1 Baluarte de tu mano. El asistente reemplazado vuelve a tu mano.<br>**Trigger:** Si un asistente fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVT-13 | **Reconstrucción en emergente Baluarte** | Lento | Extender | **Normal:** Juega 1 Baluarte de tu cementerio asistiendo a un explorador sin asistente.<br>**Trigger:** Si un Baluarte es destruido: busca 1 Baluarte con PODER 150 o menos. | — |
| EVT-14 | **Represalia en Baluarte** | Rápido | Interrupción | **Normal:** Elige 1 explorador del oponente: inflige 100 de daño.<br>**Trigger:** Si un Baluarte es destruido por un explorador del oponente: inflige 200 de daño a ese explorador. | — |
| EVT-15 | **Refuerzo de la Muralla** | Lento | Extender | **Normal:** Elige 1 Baluarte: gana 100 PODER. | — |

## Neutral

Cartas sin dimensión, jugables en cualquier mazo.

### Exploradores

| Código | Carta | PODER | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-32 | **Cartógrafo Errante** | 150 | Starter | **Normal:** Roba 1 carta, luego descarta 1 carta. | — |
| EXR-8 | **Mercenario del Colapso** | 250 | Extender | **Normal:** (Desde tu mano) Descarta 1 carta: juega esta carta. | Después de entrar al campo> Si es tu turno: no puedes activar más efectos este turno. |

### Eventos

| Código | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-16 | **Brújula Rota** | Lento | Starter | **Normal:** Roba 2 cartas, luego descarta 2 cartas.<br>**Trigger:** Si una carta falla en la búsqueda: roba 1 carta. | — |
| EVT-17 | **Retirada Táctica** | Rápido | Interrupción | **Normal:** Devuelve 1 explorador a tu mano.<br>**Trigger:** Si un explorador es atacado: devuélvelo a tu mano. El ataque termina. Roba 1 carta. | — |
| EVT-18 | **Grieta en emergente Valle Mudo** | Rápido | Interrupción | **Trigger:** Si el oponente activa un efecto que busca, descarta 1 carta: niega esa activación. Roba 1 carta. | — |
| EVT-19 | **Botiquín del Colapso** | Lento | Extender | **Normal:** Cura todo el daño de 1 explorador. Roba 1 carta. | — |
