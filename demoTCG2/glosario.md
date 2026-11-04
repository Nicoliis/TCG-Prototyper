# Umbral: glosario de efectos

Qué significa cada palabra de las cartas y cómo se resuelven sus casos borde. Si una carta dice algo distinto, **manda la carta**. Este glosario solo describe lo **nuevo o distinto** del demo 2; las palabras que no aparecen aquí (activar, agregar, anular, asistir, descartar, destruir, devolver a la mano, elegir, exiliar, jugar, negar, reemplazar, revelar, robar, buscar, Atracción, efecto continuo, restricción) funcionan **igual que en el [glosario del demo 1](../demoTCG/glosario.md)**. Las reglas están en [ruleguides.md](ruleguides.md).

Las entradas con 🧪 son decisiones por confirmar en partidas de prueba.

---

## Cómo se leen las cartas

- **Un efecto por línea.** Etiquetas: **Normal**, **Trigger** y **Asistiendo**; sin etiqueta, efecto continuo.
- **"Explorador" es explorador activo.** Un asistente se nombra "asistente".
- **Todo es tuyo por defecto.** Lo del otro jugador dice "del oponente".
- **Asistiendo:** "el explorador" es aquel al que la carta asiste; "esta carta" es el asistente.
- **PODER permanente:** ganar o perder PODER dura mientras el explorador siga en el campo, salvo que diga **"este turno"**.
- **Asistir:** boca abajo, salvo que diga "boca arriba".

---

## Valores

### PODER total
Suma del PODER actual de tus exploradores **activos** (fichas incluidas). Es lo que se compara con 1000 al comienzo de tu turno.
- Cuentan los bonos permanentes y los efectos continuos. No cuentan los efectos "este turno".
- El **daño no lo reduce**. 🧪
- Los asistentes no suman.

### Ganar / perder PODER
Cambia el PODER de un explorador.
- **Permanente** mientras el explorador siga en el campo, salvo "este turno".
- Los cambios se suman. Un efecto que **fija** el PODER (por ejemplo "su PODER es 0") se aplica después de los que suman o restan.
- El PODER nunca baja de 0.
- Si el PODER baja por debajo del daño que tiene el explorador, se destruye.

### Tiene +N PODER
Efecto continuo: mientras se cumpla la condición, el explorador tiene N de PODER más. "Por cada…" cuenta de nuevo cada vez (por ejemplo, +50 por cada 3 cartas del cementerio es +50 con 3, +100 con 6, y así). Si hay un máximo, "(máx. +250)" se refiere al bono, no al PODER total.

---

## Daño

### Daño
Marcadores sobre un explorador. Lo pone un **ataque** (daño igual al PODER del atacante) o un efecto que dice **"inflige X de daño"**.
- Se acumula mientras el explorador siga en el campo.
- Un explorador cuyo daño **iguala o supera** su PODER se destruye de inmediato.
- **PODER restante** es su PODER menos su daño. Un explorador de 200 con 150 de daño tiene 50 de PODER restante.
- Si el explorador deja el campo, su daño desaparece.
- El daño no es una pérdida de PODER: no cambia el PODER total, pero acerca al explorador a la destrucción.

### Infligir daño
Poner X marcadores de daño sobre un explorador. Es un efecto: puede elegir objetivo (y estar sujeto a una **Atracción** de efectos).

### Curar
**"Cura X de daño"** quita hasta X marcadores. **"Cura todo el daño"** los quita todos.

### Sobrevive con X
Efecto que evita una destrucción **por daño**. Se usa en un trigger preventivo: **"Si esta carta fuera a ser destruida por daño: sobrevive con 50."**

- Cuando el daño que va a recibir el explorador igualaría o superaría su PODER, el daño total se **limita** al máximo que lo deja con **X de PODER restante**. El exceso se pierde.
- Si el explorador ya tiene X o menos de PODER restante, no hace nada y se destruye.
- Solo protege contra **daño**. No evita otras destrucciones.
- Es un efecto y se activa en una cadena, así que cuenta para la regla de una vez por turno por nombre y se puede negar o responder.
- Si el daño ya fue puesto, no se puede "sobrevivir" después: hay que activarlo antes de que se resuelva (trigger preventivo).

### Recibir el doble de daño
Cada vez que le pones daño, pones el doble. Se aplica al daño de ataques y de efectos.

---

## Asistente en combate

- Al ser atacado un explorador con asistente, el asistente se **revela** y el defensor elige:
  - **CON asistencia:** el daño va al **asistente**. Si el daño del asistente iguala o supera su PODER, se destruye; el explorador no recibe nada.
  - **SIN asistencia:** el daño va al explorador.
- Un asistente que recibe daño lo conserva mientras siga asistiendo.
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
- Las fichas no van al cementerio, así que no cuentan.
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
