# Catálogo de cartas

27 exploradores (incluye 1 ficha) y 16 eventos, repartidos en 3 dimensiones y un pool neutral.
Generado a partir de `cartas-exploradores.csv` y `cartas-eventos.csv` (los CSV son la fuente editable; el rol es una nota de diseño y no se imprime en la carta).

Roles: **Starter** abre el combo · **Extender** lo completa si fue interrumpido · **Pieza** es el objetivo a dejar en el tablero · **Interrupción** frena al oponente sin decir simplemente "no".

Las restricciones tienen tres niveles (ver [designguide.md](designguide.md)): **R1** no más exploradores · **R2** no más efectos · **R3** se termina el turno.

## Fantaspet

Mascotas espectrales de Eterneblina. Búsqueda, recursión y protección mutua.

### Exploradores

| # | Carta | ATK/DEF | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-1 | **Gooboy** | 100/250 | Extender | **Trigger:** Si otro Fantaspet que controlas fuera a ser destruido: destruye a esta carta en su lugar. | — |
| EXP-2 | **Boolly** | 50/100 | Extender | **Trigger:** Si un Fantaspet que controlas es destruido: baja a esta carta de tu mano en Defensa. | — |
| EXP-3 | **Cesarmill** | 150/150 | Starter | **Normal:** Busca 1 Fantaspet de tu mazo (búsqueda pública). | **R1** Después de entrar al campo, si es tu turno: no puedes bajar más exploradores este turno. |
| EXP-4 | **Plumifer** | 100/100 | Starter | **Normal:** Destruye esta carta.<br>**Trigger:** Si esta carta es destruida: busca 1 Fantaspet con ATK 150 o menos (búsqueda secreta). | — |
| EXP-5 | **Cattrix** | 200/100 | Extender | **Normal:** Baja 1 Fantaspet con ATK 100 o menos de tu mano.<br>**Trigger:** Si un Fantaspet que controlas declara un ataque: ese Fantaspet gana 100 ATK hasta el final del turno. | — |
| EXP-6 | **Koalma** | 100/300 | Extender | **Normal:** Exilia 1 carta de tu cementerio: devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Trigger:** Si esta carta es atacada: el atacante pierde 100 ATK hasta el final del turno. | — |
| EXP-7 | **Talkatak** | 200/200 | Interrupción | **Trigger:** Si el oponente activa un efecto que elige como objetivo a un explorador que controlas: devuelve ese explorador a tu mano. El efecto no se resuelve. | **R2** Después de entrar al campo, si es tu turno: no puedes activar más efectos este turno. |
| EXP-8 | **Dragging** | 350/250 | Pieza | **Normal:** (Desde tu mano) Descarta 1 Fantaspet: baja a esta carta.<br>**Trigger:** Si un Fantaspet que controlas declara un ataque o es atacado: destruye todos los exploradores que no sean Fantaspet involucrados en ese combate. | **R3** Después de entrar al campo, si es tu turno: se termina tu turno. |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-1 | **Susurros en Eterneblina** | Instantáneo | Extender | **Normal:** Devuelve 1 Fantaspet de tu cementerio a tu mano.<br>**Trigger:** Si un Fantaspet que controlas fuera a ser destruido: devuélvelo a tu mano en su lugar. | — |
| EVT-2 | **Refugio en emergente Eterneblina** | Lento | Starter | **Normal:** Revela 1 Fantaspet de tu mano: busca 1 Fantaspet con distinto nombre (búsqueda pública).<br>**Trigger:** Si un Fantaspet que controlas es destruido: busca 1 Fantaspet con ATK 100 o menos (búsqueda secreta). | **R1** Después de activar su efecto Normal: no puedes bajar más exploradores este turno. |
| EVT-3 | **Presencia en Eterneblina** | Instantáneo | Interrupción | **Normal:** Elige 1 Fantaspet que controlas: gana 100 ATK y 100 DEF hasta el final del turno.<br>**Trigger:** Si un Fantaspet que controlas es atacado: ese Fantaspet no puede ser destruido en este combate. | — |
| EVT-4 | **Procesión en emergente Eterneblina** | Lento | Extender | **Normal:** Baja hasta 2 Fantaspet con distinto nombre de tu cementerio en Defensa. Sus efectos se niegan hasta el final del turno. | **R3** Después de activar: se termina tu turno. |

## Ugabuga

Tribus de piedra. Presión de combate a costa de sacrificios.

### Exploradores

| # | Carta | ATK/DEF | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-9 | **Ugalito** | 100/100 | Starter | **Normal:** Descarta 1 carta: busca 1 Ugabuga (búsqueda secreta). | **R1** Después de entrar al campo, si es tu turno: no puedes bajar más exploradores este turno. |
| EXP-10 | **Lance-elot** | 200/100 | Pieza | **Trigger:** Si otro Ugabuga que controlas declara un ataque: ese Ugabuga gana 150 ATK hasta el final del turno. | Esta carta no puede declarar ataques. |
| EXP-11 | **Van-guard** | 300/100 | Pieza | **Trigger:** Si esta carta es atacada: destruye al atacante y a esta carta antes del cálculo de daño. | Esta carta no puede declarar ataques. |
| EXP-12 | **Monstaa** | 400/200 | Pieza | **Normal:** (Desde tu mano) Destruye 1 explorador que controlas: baja a esta carta.<br>**Trigger:** Si esta carta destruye un explorador en combate: destruye 1 otro explorador que controlas. Si no puedes, destruye esta carta. | **R3** Después de entrar al campo, si es tu turno: se termina tu turno. |
| EXP-13 | **Balanced** | 200/200 | Extender | **Normal:** Cambia de posición hasta 2 exploradores que controlas.<br>**Trigger:** Si un Ugabuga que controlas es atacado: cambia ese Ugabuga a Defensa. | — |
| EXP-14 | **Pedrusco** | 50/350 | Pieza | **Trigger:** Si esta carta es destruida en combate: destruye al explorador que participó en ese combate. | — |
| EXP-15 | **Chamán Ugabu** | 150/150 | Extender | **Normal:** Descarta 1 carta: devuelve 1 Ugabuga de tu cementerio a tu mano.<br>**Trigger:** Si un Ugabuga que controlas es destruido en combate: roba 1 carta. | — |
| EXP-16 | **Cazador Ugabu** | 250/100 | Pieza | **Trigger:** Si esta carta destruye un explorador en combate: el oponente descarta 1 carta al azar. | — |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-5 | **Estampida en emergente Ugabuga** | Lento | Pieza | **Normal:** Elige 1 Ugabuga que controlas: puede declarar un segundo ataque este turno. | **R2** Después de activar: no puedes activar más efectos este turno. |
| EVT-6 | **Grito de guerra Ugabuga** | Instantáneo | Interrupción | **Normal:** Elige 1 Ugabuga que controlas: gana 200 ATK hasta el final del turno.<br>**Trigger:** Si un Ugabuga que controlas es atacado: ese Ugabuga gana 200 ATK y 200 DEF hasta el final del turno. | — |
| EVT-7 | **Derrumbe en emergente cueva Ugabuga** | Instantáneo | Interrupción | **Normal:** Descarta 1 carta: destruye 1 explorador con ATK 200 o menos.<br>**Trigger:** Si el oponente baja un explorador: descarta 1 Ugabuga: destruye ese explorador si su DEF es 100 o menos. | — |
| EVT-8 | **Banquete en emergente aldea Ugabuga** | Lento | Starter | **Normal:** Destruye 1 explorador que controlas: roba 2 cartas.<br>**Trigger:** Si un Ugabuga que controlas es destruido: baja 1 Ugabuga con ATK 150 o menos de tu mano. | **R1** Después de activar su efecto Normal: no puedes bajar más exploradores este turno. |

## Ragnatica

Arácnidos tejedores. Fichas, control y quitar objetivos.

### Exploradores

| # | Carta | ATK/DEF | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-17 | **Telarín** | 100/100 | Starter | **Normal:** Si no controlas fichas Cría: agrega 1 ficha Cría en Defensa. | — |
| EXP-18 | **Hilandera** | 150/200 | Starter | **Normal:** Destruye 1 ficha Cría que controlas: busca 1 Ragnatica con ATK 300 o menos (búsqueda pública). | — |
| EXP-19 | **Viuda Gris** | 250/150 | Interrupción | **Trigger:** Si un explorador del oponente declara un ataque: destruye 1 ficha Cría que controlas: anula ese ataque. | — |
| EXP-20 | **Capullo Silente** | 0/300 | Interrupción | **Normal:** Cambia 1 explorador del oponente a Defensa.<br>**Trigger:** Si esta carta es atacada: devuelve al atacante a la mano de su controlador. El ataque termina. | — |
| EXP-21 | **Emboscadora** | 250/100 | Extender | **Trigger:** (Desde tu mano) Si el oponente baja un explorador: baja a esta carta en Ataque. Luego, cambia a ese explorador a Defensa. | — |
| EXP-22 | **Señuelo** | 100/200 | Extender | **Trigger:** Si un Ragnatica que controlas fuera a ser destruido: destruye 1 ficha Cría que controlas en su lugar. | — |
| EXP-23 | **Madre Telar** | 300/300 | Pieza | **Normal:** Destruye 2 fichas Cría que controlas: devuelve 1 explorador del oponente a su mano. | **R2** Después de entrar al campo, si es tu turno: no puedes activar más efectos este turno. |
| EXP-24 | **Reina de Ragnatica** | 350/250 | Pieza | **Normal:** (Desde tu mano) Destruye 2 fichas Cría que controlas: baja a esta carta.<br>**Trigger:** Si el oponente activa un efecto de explorador que elige como objetivo a una carta que controlas: descarta 1 carta y destruye 1 ficha Cría que controlas: niega esa activación. | **R3** Después de entrar al campo, si es tu turno: se termina tu turno. |
| EXP-25 | **Cría de Ragnatica** | 100/100 | Ficha | Ficha. No puede volver a la mano: desaparece si deja el campo. | — |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-9 | **Conflicto en emergente reino de Ragnatica** | Lento | Starter | **Normal:** Agrega 2 fichas Cría en Defensa.<br>**Trigger:** Si el oponente declara un ataque: agrega 1 ficha Cría en Defensa. | **R1** Después de activar su efecto Normal: no puedes bajar más exploradores este turno. |
| EVT-10 | **Hilos cortados en Ragnatica** | Instantáneo | Interrupción | **Normal:** Descarta 1 carta: devuelve a la mano 1 explorador con ATK 150 o menos.<br>**Trigger:** Si el oponente baja un explorador: descarta 1 carta: devuelve ese explorador a su mano. | — |
| EVT-11 | **Cosecha en Ragnatica** | Lento | Extender | **Normal:** Destruye 1 ficha Cría que controlas: roba 2 cartas.<br>**Trigger:** Si una ficha Cría que controlas es destruida: roba 1 carta. | — |
| EVT-12 | **Plaga en emergente Ragnatica** | Instantáneo | Interrupción | **Normal:** Destruye todas las fichas Cría que controlas (mínimo 1): el oponente descarta 1 carta por cada ficha destruida (máximo 3). | **R2** Después de activar: no puedes activar más efectos este turno. |

## Neutral

Cartas sin dimensión, jugables en cualquier mazo.

### Exploradores

| # | Carta | ATK/DEF | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EXP-26 | **Cartógrafo Errante** | 100/200 | Starter | **Normal:** Roba 1 carta, luego descarta 1 carta. | **R1** Después de entrar al campo, si es tu turno: no puedes bajar más exploradores este turno. |
| EXP-27 | **Mercenario del Colapso** | 250/150 | Extender | **Normal:** (Desde tu mano) Descarta 1 carta: baja a esta carta. | **R2** Después de entrar al campo, si es tu turno: no puedes activar más efectos este turno. |

### Eventos

| # | Carta | Velocidad | Rol | Efectos | Restricción |
|---|---|---|---|---|---|
| EVT-13 | **Grieta en emergente Valle Mudo** | Instantáneo | Interrupción | **Trigger:** Si el oponente activa un efecto que busca en el mazo: descarta 1 carta y destruye 1 explorador que controlas: niega esa activación. | — |
| EVT-14 | **Brújula Rota** | Lento | Starter | **Normal:** Roba 2 cartas, luego descarta 2 cartas.<br>**Trigger:** Si una carta falla en la búsqueda: roba 1 carta. | — |
| EVT-15 | **Campamento en emergente Tierra de Nadie** | Lento | Extender | **Normal:** Devuelve 1 explorador de tu cementerio a tu mano. | **R1** Después de activar su efecto Normal: no puedes bajar más exploradores este turno. |
| EVT-16 | **Retirada Táctica** | Instantáneo | Interrupción | **Normal:** Devuelve 1 explorador que controlas a tu mano.<br>**Trigger:** Si un explorador que controlas es atacado: devuelve ese explorador a tu mano. El ataque termina. | — |
