# Umbral: glosario de efectos

Qué significa cada palabra de las cartas y cómo se resuelven sus casos borde. Si una carta dice algo distinto, **manda la carta**. Este glosario solo describe lo **nuevo o distinto** del demo 2; las palabras que no aparecen aquí (activar, agregar, anular, asistir, descartar, destruir, devolver a la mano, elegir, exiliar, jugar, negar, reemplazar, revelar, robar, buscar, Atracción, efecto continuo, restricción) funcionan **igual que en el [glosario del demo 1](../demoTCG/glosario.md)**. Las reglas están en [ruleguides.md](ruleguides.md).

Las entradas con 🧪 son decisiones por confirmar en partidas de prueba.

---

## Cómo se leen las cartas

- **Un efecto por línea.** Etiquetas: **Normal**, **Trigger** y **Asistiendo**; sin etiqueta, efecto continuo.
- **"Explorador" es explorador activo.** Un asistente se nombra "asistente".
- **Todo es tuyo por defecto.** Lo del otro jugador dice "del oponente".
- **Asistiendo:** "el explorador" es aquel al que la carta asiste; "esta carta" es el asistente.
- **PODER permanente:** ganar PODER dura mientras el explorador siga en el campo (marcadores), salvo que diga **"este turno"**.
- **Asistir:** boca abajo, salvo que diga "boca arriba".

---

## Valores

### PODER base, agregado, total y PODER
Cada explorador tiene cuatro valores. Todos salen del PODER impreso y de los **marcadores** (cada marcador vale **50**):

| Valor | Cómo se calcula |
|---|---|
| **PODER base** | El impreso en la carta. |
| **PODER agregado** | Los marcadores de PODER agregado (a la **izquierda** de la carta) × 50. |
| **PODER total** | PODER base + PODER agregado + efectos continuos. |
| **PODER** | **PODER total − daño.** Es el valor que cuenta para atacar, para el objetivo, para los criterios y para la destrucción. |

- Los marcadores son los mismos para el PODER agregado y el daño. El PODER agregado va a la izquierda y el daño a la derecha. También pueden ser fichas de dos caras: espada (PODER agregado) y golpe (daño).
- Fuera del campo no hay marcadores y los criterios ("con PODER 150 o menos") miran el PODER base.
- Un explorador cuyo **PODER llega a 0 o menos** se destruye de inmediato.

### PODER del tablero
Suma del **PODER** de tus exploradores **activos** (tokens incluidos). Es lo que se compara con 1000 al comienzo de tu turno.
- El daño lo reduce. Un explorador de 250 con 100 de daño aporta 150.
- Los asistentes no suman.

### Ganar / perder PODER
Cambia el PODER total de un explorador.
- **Ganar PODER** pone marcadores de PODER agregado y es **permanente** mientras el explorador siga en el campo, salvo "este turno". Con "este turno" no se usan marcadores: se anota el bono y se descarta al final del turno.
- Los cambios se suman. Un efecto que **fija** el PODER (por ejemplo "su PODER es 0") se aplica después de los que suman o restan.
- Si el PODER total baja por debajo de lo que corresponde al daño que ya tiene, el PODER llega a 0 y el explorador se destruye.

### Tiene +N PODER
Efecto continuo: mientras se cumpla la condición, suma N al PODER total. No usa marcadores. "Por cada…" cuenta de nuevo cada vez (por ejemplo, +50 por cada 3 cartas del cementerio es +50 con 3, +100 con 6, y así). Si hay un máximo, "(máx. +250)" se refiere al bono, no al PODER.

---

## Daño

### Daño
Marcadores de **daño** (a la **derecha** de la carta), de 50 cada uno. Los pone un **ataque** (daño igual al PODER del atacante) o un efecto que dice **"inflige X de daño"**.
- Resta 50 al PODER por marcador. Cuando el PODER llega a 0 o menos, el explorador se destruye.
- Se acumula mientras el explorador siga en el campo.
- Si el explorador deja el campo, su daño desaparece.
- El daño **sí** reduce el PODER del tablero y también la fuerza de ataque del explorador dañado.

### Infligir daño
Poner X de daño (X/50 marcadores) sobre un explorador. Es un efecto: puede elegir objetivo (y estar sujeto a una **Atracción** de efectos).

### Curar
**"Cura X de daño"** quita hasta X de daño (X/50 marcadores). **"Cura todo el daño"** los quita todos. Curar devuelve PODER al explorador y al tablero.

### Sobrevive con X
Efecto que evita una destrucción **por daño**. Se usa en un trigger preventivo: **"Si esta carta fuera a ser destruida por daño: sobrevive con 50."**

- Cuando el daño que va a recibir el explorador dejaría su PODER en 0 o menos, el daño total se **limita** al máximo que lo deja con **X de PODER**. El exceso se pierde.
- Si el explorador ya tiene X o menos de PODER, no hace nada y se destruye.
- Solo protege contra **daño**. No evita otras destrucciones.
- Es un efecto y se activa en una cadena, así que cuenta para la regla de una vez por turno por nombre y se puede negar o responder.
- Si el daño ya fue puesto, no se puede "sobrevivir" después: hay que activarlo antes de que se resuelva (trigger preventivo).

### Recibir el doble de daño
Cada vez que le pones daño, pones el doble. Se aplica al daño de ataques y de efectos.

---

## Asistente en combate

- Al ser atacado un explorador con asistente, el asistente se **revela** y el defensor elige:
  - **CON asistencia:** el daño va al **asistente**. Si el PODER del asistente llega a 0, se destruye; el explorador no recibe nada.
  - **SIN asistencia:** el daño va al explorador.
- Un asistente que recibe daño lo conserva mientras siga asistiendo (los marcadores se quedan debajo o al lado de su carta).
- Un efecto que dice "el explorador" en Asistiendo se refiere al activo, no al asistente.

---

## Límites compartidos

### Activa como (nombre)
Indicación al comienzo de un efecto, entre paréntesis: **(Activa como Escudero)**. Para la regla de **una vez por turno por nombre**, la carta cuenta como si se llamara así.

Ejemplo, los **Escuderos** del Baluarte (Rodelero, Alabardero, Armero, Ballestero y Heraldo): todos activan sus efectos extra "como Escudero", de modo que entre todos solo se puede activar **un** efecto extra por turno, sean copias o Escuderos distintos.
- Cuenta cada jugador por separado. 🧪
- Se gasta al **activar**, aunque el efecto no se resuelva o sea negado.
- Solo afecta al efecto que lleva la indicación. Los triggers base de los Escuderos no la llevan y no cuentan.
- "Escudero" también es el grupo: "1 Escudero" busca o devuelve solo entre esas cinco cartas.

---

## Efectos de cementerio

- **"Por cada carta de tu cementerio"** cuenta todas las cartas (exploradores y eventos). **"Por cada Fantaspet de tu cementerio"** cuenta solo las de esa dimensión.
- Los tokens no van al cementerio, así que no cuentan.
- Exiliar o devolver cartas del cementerio baja el contador de inmediato.

---

## Términos de turno

| Término | Significado |
|---|---|
| **Comienzo del turno** | Antes de robar. Aquí se comprueba el objetivo y se disparan los efectos "Al comienzo de tu turno". |
| **Este turno** | Hasta la Fase Final del turno actual. |
| **Una vez por turno** | Una activación por turno por **nombre** de carta, para cada efecto. |
| **Lento / Rápido** | Solo en tu Fase Principal con la cadena vacía / se puede activar en una cadena. |
| **Desde tu mano** | El efecto funciona (y se activa) desde la mano. |

Los efectos **"Al comienzo de tu turno"** se activan **después** de comprobar el objetivo: un bono que ganas ahí cuenta para el turno siguiente.
