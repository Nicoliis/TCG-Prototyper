# Colapso: glosario de efectos

Qué significa cada palabra de las cartas y cómo se resuelven sus casos borde, para no tener que aclararlos en cada carta. Si una carta dice algo distinto, **manda la carta**. Las reglas generales están en [ruleguides.md](ruleguides.md).

Las entradas marcadas con 🧪 son una decisión por confirmar en partidas de prueba.

---

## Acciones sobre cartas

### Activar
Informar que una carta usará un efecto. Un asistente **boca abajo** se revela al activar su efecto. Activar un efecto cuenta como acción y abre una cadena.

### Agregar (un token)
Poner un token en el campo, siempre como explorador **activo**.
- No es "jugar": las restricciones "no puedes jugar más exploradores" no la bloquean.
- Si no hay zona libre, no se agrega nada.
- Los tokens son exploradores de la dimensión que indique el efecto que las crea.

### Anular (un ataque)
El ataque termina sin cálculo de daño. El explorador atacante se considera que ya atacó este turno. No es una negación: no afecta a ningún efecto.

### Asistir
Poner una carta **debajo** de un explorador activo como su asistente. Si el explorador ya tiene asistente, no se puede asistir otro (salvo que el efecto diga **reemplazar**).
- Salvo indicación, la carta se asiste **boca abajo**.
- Asistir **no** es jugar activo: no ocupa zona de explorador.
- "Juega X asistiendo a Y" significa: X entra al campo (viniendo de donde diga el efecto) y se asiste a Y en el mismo paso.

### Descartar
Enviar una carta de la mano al cementerio. Si el efecto descarta "al azar", elige quien descarta sin mirar la mano.

### Destruir
Enviar un explorador del campo al cementerio.
- Si se destruye un explorador activo, su asistente va **con él** al cementerio. 🧪
- Los tokens desaparecen. Cuentan como destruidas.
- Destruir un asistente no afecta al explorador activo.

### Devolver a la mano
La carta vuelve a la mano de su dueño.
- Los tokens no se pueden devolver: desaparecen. (Un efecto que las "devuelve" no hace nada con ellas.)
- Si se devuelve un explorador activo, su asistente va al cementerio (no se considera destruido). 🧪

### Elegir (objetivo)
Elegir una carta al **activar**. Si al resolver la carta elegida ya no es válida, el efecto no se resuelve.
- Solo las cartas que se **eligen** pueden estar afectadas por una **Atracción** de efectos.
- Un efecto que dice "todos" o "cada" no elige.

### Exiliar
Quitar la carta del juego. Va a la zona de exilio, pública.

### Jugar
Poner un explorador en el campo viniendo de la mano, el cementerio, el mazo o donde diga el efecto.
- Por defecto se juega **activo** en una zona libre; si no hay zona libre, no se juega.
- Si dice "asistiendo", se asiste (ver **Asistir**).
- Jugar de la mano es la **jugada espontánea** del turno, una sola. Los efectos que "juegan" no la gastan.
- Las restricciones "no puedes jugar más exploradores" bloquean la jugada espontánea y a los efectos que juegan; no bloquean agregar tokens.

### Negar
La **activación** de un efecto no se resuelve, pero **sí** cuenta como activada (se usó su turno y se pagó el costo). Es la interrupción más fuerte del juego y por eso las cartas que niegan son pocas y caras.
- Se puede negar solo una activación en la cadena, no la carta.

### Reemplazar (un asistente)
Quitar el asistente actual de un explorador y asistir otra carta en su lugar, en el mismo paso, sin revelar ninguna de las dos. El asistente reemplazado va a donde diga el efecto (por ejemplo, "vuelve a tu mano").

### Revelar
Mostrar una carta al oponente. Si estaba boca abajo, se da vuelta y **queda boca arriba**.
- Se revela un asistente cuando su explorador activo es atacado.
- Revelar la mano o una carta de la mano no la mueve.

---

## Cómo se leen las cartas

Convenciones que las cartas no repiten, para que los textos sean cortos:

- **Un efecto por línea.** Las etiquetas son **Normal**, **Trigger** y **Asistiendo**; el texto sin etiqueta es un efecto continuo.
- **"Explorador" es explorador activo.** Un asistente se nombra "asistente".
- **Todo es tuyo por defecto.** "Un Fantaspet", "1 explorador" o "1 token" son tuyos; lo del otro jugador dice "del oponente".
- **Asistiendo:** en un efecto Asistiendo, "el explorador" es **aquel al que la carta asiste**. "Esta carta" es el asistente.
- **Duración:** ganar o perder PODER dura hasta el final del turno.
- **Asistir:** boca abajo, salvo que el texto diga "boca arriba".
- **Daño:** "el oponente recibe 50 de daño" es daño de efecto, no de combate.

---

## Efectos de valores

### Ganar / perder PODER
Cambia el PODER de un explorador. Dura **hasta el final del turno**, así que las cartas no lo repiten, salvo que digan otra cosa. El PODER nunca baja de 0.
- Los cambios se suman. Un efecto que **fija** el PODER (por ejemplo "su PODER pasa a ser 0") se aplica después de los que suman o restan.

### Daño
Puntos de vida que pierde un jugador por combate o por un efecto que diga "recibe X de daño". "Pierdes X puntos de vida" cuenta igual, pero no es daño de combate.

### Robar
Tomar la carta superior del mazo. Si no hay cartas, **pierdes** la partida cuando te toca robar. Si un efecto te manda robar varias cartas y se acaba el mazo, también.

---

## Mecánicas

### Buscar
Mecánica de toda búsqueda en el mazo. Las cartas dicen solo "Busca 1 [criterio]".

1. **Anuncias** el criterio al activar la carta.
2. **Revelas** boca arriba uno o más objetivos válidos del mazo, antes de terminar la activación.
   - Revelas **una sola**: búsqueda **pública**. Esa carta es la afectada.
   - Revelas **más de una**: búsqueda **secreta**. Eliges cuál es la afectada sin decir cuál, y las demás vuelven al mazo.
3. El efecto de buscar **se agrega a la cadena** (el oponente puede reaccionar sabiendo qué reveló).
4. Al resolverse, la carta afectada se **agrega a la mano**, salvo que el texto diga otra cosa ("Busca 1 X y juégala", "Busca 1 X y descártala").
5. **Barajas** el mazo, antes de que comience la siguiente cadena.

**Fallo en la búsqueda:** si no hay ningún objetivo válido, la búsqueda falla.
- No se paga costo, no se agrega a la cadena ni comienza una.
- **Sí** consume el uso del turno de ese efecto.
- No se puede volver a intentar esa carta, ni otras con el mismo criterio, hasta que pase **algo habilitante**: que un objetivo válido vuelva (o pueda haber vuelto) al mazo.

**Pistas de estrategia:** revelar muchos candidatos esconde tu plan; revelar uno solo es información gratis para el oponente. Un criterio muy estrecho es más fácil de ver y de fallar.

### Atracción
**Atracción de `<algo>`**: cuando un jugador controla una o más cartas con Atracción de `<algo>`, **el oponente solo puede elegir como objetivo de `<algo>` a esas cartas.**

Variantes:
- **Atracción de ataques**: los ataques del oponente solo pueden declararse contra las cartas con esa Atracción.
- **Atracción de efectos**: los efectos del oponente que **eligen** un objetivo en tu campo solo pueden elegir a las cartas con esa Atracción.
- **Atracción de ataques/efectos**: ambas.

Casos borde:
- Si controlas **varias** cartas con la misma Atracción, el oponente elige entre ellas.
- La Atracción solo limita al **oponente**, y solo cuando **elige** objetivo. No afecta a efectos que no eligen ("destruye todos"), ni a tus propios efectos.
- Si ninguna carta con la Atracción puede ser elegida por el efecto (porque no cumple su criterio), ese efecto **no puede activarse** contra tu campo.
- Si la carta con Atracción deja de estar en el campo, la Atracción termina de inmediato.
- Los asistentes pueden ser elegidos por efectos, pero mientras haya una Atracción de efectos en juego, solo se puede elegir a las cartas con esa Atracción. 🧪
- Un ataque declarado antes de que apareciera la Atracción no se re-evalúa, salvo que se re-declare.

### Asistente
Explorador que está debajo de un explorador activo (ver [ruleguides.md](ruleguides.md#asistentes)).
- Solo funciona su efecto **Asistiendo**.
- Si está boca abajo no hace nada hasta ser revelado.
- Cuando el activo es atacado, el asistente se revela y el defensor elige defender **CON** o **SIN** asistencia.

### Activa como (nombre)
Indicación al comienzo de un efecto, entre paréntesis: **(Activa como Escudero)**. Para la regla de **una vez por turno por nombre**, la carta cuenta como si se llamara así, sin importar su nombre real.

Ejemplo, los **Escuderos** del Baluarte (Rodelero, Alabardero, Armero, Ballestero y Heraldo): todos activan sus efectos extra "como Escudero", de modo que entre todos solo se puede activar **un** efecto extra por turno, sean copias iguales o Escuderos distintos.
- Cuenta cada jugador por separado: que uses uno no impide al oponente usar el suyo (por ejemplo en su turno, con un efecto rápido). 🧪
- Se gasta al **activar**, aunque el efecto después no se resuelva o sea negado.
- Solo afecta al efecto que lleva la indicación. Los dos triggers base de los Escuderos (el que juega a Aegis desde el mazo y el que repone su asistente) **no** la llevan y no cuentan para ese límite.
- "Escudero" es además el nombre del grupo: los efectos que dicen "1 Escudero" buscan o devuelven solo entre esas cinco cartas.
- Si una dimensión nueva necesita un límite compartido entre varias cartas, se hace con esta misma indicación y su propio nombre.

### Efecto continuo
Texto sin etiqueta que describe algo que se cumple mientras la condición sea verdad ("Mientras esta carta tenga un asistente, no puede ser destruida por efectos"). No se activa, no abre cadena y no se puede negar.

### Restricción
Desventaja obligatoria que se aplica **en simultáneo con la resolución de la acción que la reveló**. No abre cadena. Ver [ruleguides.md](ruleguides.md#10-restricciones).

---

## Términos de turno

| Término | Significado |
|---|---|
| **Este turno** | Hasta la Fase Final del turno actual. |
| **Hasta el final del turno** | Igual: los efectos terminan al comenzar la Fase Final. |
| **Una vez por turno** | Una activación por turno por **nombre** de carta, para cada efecto. |
| **Lento** | Solo en tu Fase Principal con la cadena vacía. |
| **Rápido** | Se puede activar en una cadena, también en el turno del oponente. |
| **Desde tu mano** | El efecto funciona (y se activa) desde la mano. |
