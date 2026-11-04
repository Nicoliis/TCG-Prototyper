# Colapso (modo tablero): glosario de efectos

Qué significa cada palabra de las cartas y cómo se resuelven sus casos borde. Si una carta dice algo distinto, **manda la carta**. Este glosario solo describe lo **nuevo o distinto** del demo 2; las palabras que no aparecen aquí (activar, agregar, anular, descartar, destruir, devolver a la mano, elegir, exiliar, negar, revelar, robar, buscar, Atracción, efecto continuo, restricción) funcionan **igual que en el [glosario del demo 1](../demoTCG/glosario.md)**. Las reglas están en [ruleguides.md](ruleguides.md).

Las entradas con 🧪 son decisiones por confirmar en partidas de prueba.

---

## Cómo se leen las cartas

- **Un efecto por línea.** La etiqueta dice **desde dónde** se activa: **Normal** (mano), **En guardia** (primera fila), **Asistiendo** (barracas, en posición asistiendo) y **Trigger** (reacciona). Sin etiqueta, efecto continuo.
- **"Explorador" es explorador en primera fila.** Las cartas de las barracas se nombran **"carta de tus barracas"**.
- **Todo es tuyo por defecto.** Lo del otro jugador dice "del oponente".
- **"Esta carta"** es la que tiene el efecto, esté donde esté.
- **PODER:** ganar PODER dura mientras el explorador siga en el campo (marcadores). Perder PODER es recibir daño.

---

## Posiciones y zonas

### Primera fila
Los 6 lugares donde suman, atacan y son atacados los exploradores. Todo está **boca arriba y en guardia**. El **PODER del tablero** es la suma del PODER de la primera fila.

### Barracas
Los 6 lugares de reserva. Las cartas pueden estar boca arriba o boca abajo, en guardia o asistiendo. No suman, no atacan y no pueden ser atacadas, pero los efectos sí pueden elegirlas.

### En guardia
Posición vertical. Puede **atacar** (desde la primera fila) y activar sus efectos **En guardia** y **Triggers** (desde la primera fila, boca arriba). Una carta en guardia en las barracas espera su **promoción**.

### Asistiendo
Posición horizontal. **No ataca.** Puede activar sus efectos **Asistiendo** y sus **Triggers (Asistiendo)** desde las barracas. Una carta **boca abajo** se **revela** al activarlos.
- La posición se elige al jugar la carta y **no se cambia** mientras esté en juego.
- Los tokens siempre están en guardia.

### Promoción
Fase del final del turno: mueves **1 carta en guardia de las barracas a un lugar libre de la primera fila**. Entra boca arriba y **no cuenta como jugarla**. 🧪

### Jugar
"Juega 1 X" pone a X **en guardia en la primera fila**. "Juega 1 X **asistiendo**" la pone **en las barracas, asistiendo y boca arriba**. Las jugadas por efecto no cuentan para el límite de una carta por turno en la primera fila. Si no hay lugar libre, no se juega.

### Entrar a primera fila
Una carta **entra a primera fila** cuando se **juega** o se **promueve** allí (no cuando se agrega un token). Las restricciones "Al entrar a primera fila>" y los triggers "Si esta carta entra a primera fila" se cumplen en los dos casos.

### Efecto Asistiendo (como criterio)
En las búsquedas, "con efecto Asistiendo" mira cartas que tengan un efecto **Asistiendo** o un **Trigger (Asistiendo)**.

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
Suma del **PODER** de tus exploradores en **primera fila** (tokens incluidos). Es lo que se compara con 1000 al comienzo de tu turno.
- El daño lo reduce. Un explorador de 250 con 100 de daño aporta 150.
- Las barracas no suman.

### Potenciar (ganar PODER)
**"Gana X PODER"** pone X/50 marcadores de PODER agregado (a la izquierda de la carta) y suma X al PODER total.
- Es **permanente** mientras el explorador siga en el campo.
- Es la única forma de subir el PODER con marcadores. Los efectos continuos ("Tiene +N PODER") suman sin usarlos.

### Perder PODER no existe
Sobre el PODER solo hay tres efectos: **potenciar**, **infligir daño** y **curar**. Perder PODER es **recibir daño**. No hay bonos ni pérdidas "este turno".
- Si el daño iguala o supera el PODER total del explorador, su PODER llega a 0 y se destruye.

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

## Trampas de las barracas

Un **Trigger (Asistiendo)** es una **trampa**: una carta de las barracas que responde a lo que pasa en la mesa, típicamente **"Si el oponente declara un ataque"**.
- Se puede activar con la carta **boca abajo o boca arriba**. Si está boca abajo, se **revela** al activarla.
- Casi siempre pagan un costo: **destruir esta carta** o **descartar una carta**.
- No importa a qué explorador ataque el oponente: la trampa responde a la declaración de ataque.

---

## Costos de las cartas Asistiendo

Los efectos Asistiendo abren y extienden combos, así que pagan **moviendo cartas**. Los costos típicos:

| Costo | Qué significa |
|---|---|
| **Destruye esta carta** | La carta de las barracas va al cementerio. |
| **Destruye esta carta y 1 carta de tus barracas** | Dos cartas de las barracas van al cementerio. |
| **Descarta 1 carta** | Una carta de la mano va al cementerio. |
| **Devuelve 1 carta de tus barracas a tu mano** | La carta vuelve a la mano. |

Los costos que destruyen cartas de las barracas **llenan el cementerio** y por eso encajan con Fantaspet.

---

## Límites compartidos

### Activa como (nombre)
Indicación al comienzo de un efecto, entre paréntesis: **(Activa como Escudero)**. Para la regla de **una vez por turno por nombre**, la carta cuenta como si se llamara así.

Ejemplo, los **Escuderos** del Baluarte (Rodelero, Alabardero, Armero, Ballestero y Heraldo): todos activan sus efectos extra "como Escudero", de modo que entre todos solo se puede activar **un** efecto extra por turno, sean copias o Escuderos distintos.
- Cuenta cada jugador por separado. 🧪
- Se gasta al **activar**, aunque el efecto no se resuelva o sea negado.
- Solo afecta al efecto que lleva la indicación. El efecto base de los Escuderos (traer a Aegis) no la lleva y no cuenta.
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
| **Promoción** | Fase entre la Principal 2 y la Final, en la que una carta en guardia pasa de las barracas a la primera fila. |

Los efectos **"Al comienzo de tu turno"** se activan **después** de comprobar el objetivo: un bono que ganas ahí cuenta para el turno siguiente.
