# Colapso: reglas

*Nombre de trabajo. Juego de cartas 1 contra 1, de cadenas e interacción, inspirado en Yu-Gi-Oh!.*

Esta guía explica **cómo se juega**. Para el porqué de las cartas y cómo escribir nuevas, mira [designguide.md](designguide.md). Los mazos para empezar están en [decks.md](decks.md).

Las partes marcadas con 🧪 son decisiones tomadas para poder jugar el demo y que deberían confirmarse en partidas de prueba (hay una lista al final).

---

## 1. Objetivo

Baja los **puntos de vida de tu oponente de 800 a 0**. También ganas si tu oponente tiene que robar y no le quedan cartas en el mazo.

Cada jugador empieza con 800 puntos de vida.

## 2. Qué necesitas

- 1 mazo de **40 cartas** por jugador, con **máximo 3 copias del mismo nombre**.
- Algo para anotar la vida, y marcadores para las fichas (monedas o cubos).

## 3. Tipos de carta

| Tipo | Qué hace | Equivalente en Yu-Gi-Oh! |
|---|---|---|
| **Explorador** | Combate en el campo. Tiene ATK y DEF. | Monstruo |
| **Evento** | Intervención que se activa desde la mano y va al cementerio. | Hechizo rápido |

Cada carta pertenece a una **dimensión** (Fantaspet, Ugabuga, Ragnatica, Neutral…). La dimensión no limita en qué mazo puedes ponerla; sirve para que los efectos digan "un Fantaspet" y para armar mazos con identidad.

**Eventos:** cada uno tiene una **velocidad** impresa.
- **Instantáneo**: puedes activar su efecto Normal en cualquier momento en que puedas activar un efecto instantáneo (ver sección 8), también en el turno del oponente.
- **Lento**: solo puedes activar su efecto Normal durante tu Fase Principal, con la cadena vacía. Es la velocidad "sorcery" de Magic.

La velocidad solo limita al efecto **Normal**. El efecto **Trigger** de un evento siempre se puede activar desde la mano cuando se cumple su condición, aunque el evento sea Lento.

Los eventos no se quedan en el campo: se activan desde la mano y, al resolverse, van al cementerio.

## 4. Zonas

| Zona | Notas |
|---|---|
| **Mazo** | Boca abajo, nadie puede mirarlo salvo por efectos. |
| **Mano** | Privada. Máximo **7 cartas** al final de tu turno: descarta hasta quedar en 7. |
| **Campo** | **5 zonas de explorador** por jugador. Todos los exploradores están boca arriba. No hay zonas de evento. |
| **Cementerio** | Pública, ordenada. Cualquiera puede mirarla. Aquí van las cartas destruidas o descartadas. |
| **Exilio** | Pública. Las cartas exiliadas no vuelven a menos que un efecto lo diga. |

### Posiciones

Un explorador está en **Ataque** (de pie) o en **Defensa** (de costado).
- En Ataque cuenta su **ATK** y puede atacar.
- En Defensa cuenta su **DEF** y no puede atacar.

Al bajar un explorador eliges su posición, salvo que el efecto diga otra. Una vez por turno, en tu Fase Principal, puedes cambiar la posición de un explorador que controlas, siempre que no haya sido bajado ese turno ni haya atacado.

### Fichas

Una **ficha** es un explorador que no viene de ninguna carta (por ejemplo, la Cría de Ragnatica). Se representa con un marcador y sus valores salen del efecto que la crea.

- Las fichas se **agregan** al campo, no se "bajan": las restricciones del tipo "no puedes bajar más exploradores" no las bloquean.
- Si no hay una zona libre, no se puede agregar la ficha.
- Una ficha nunca va a la mano, al mazo ni al cementerio: si deja el campo, desaparece. Pero **sí** se considera destruida si el efecto dice "destruir".

## 5. Preparación

1. Cada jugador baraja su mazo. Se decide quién empieza con una moneda; **el ganador elige** si empieza o no.
2. Cada jugador roba **5 cartas**. 🧪 No hay mulligan.
3. Empieza el primer turno.

## 6. Estructura del turno

Cada turno tiene cuatro fases. **Pasar de una fase a otra es una acción** y abre una cadena (ver sección 8), así que los dos jugadores pueden reaccionar al cambio de fase.

1. **Robo.** Robas 1 carta. *Se roba incluso en el primer turno del juego.*
2. **Principal.** Es donde se juega casi todo (ver más abajo).
3. **Batalla.** Atacas con tus exploradores en Ataque. **El jugador que empieza la partida no tiene Fase de Batalla en su primer turno.**
4. **Final.** Descartas hasta quedar en 7 cartas. Terminan los efectos "hasta el final del turno".

### Fase Principal: qué puedes hacer

- **Bajar 1 explorador de tu mano**, una vez por turno. Es la única jugada "espontánea" de poner cartas en el campo.
- **Cambiar la posición** de un explorador (una vez por explorador, como se explicó en la sección 4).
- **Activar efectos** de tus cartas (sección 7), cuando la cadena está vacía y es tu turno.

> **Regla de oro:** salvo bajar un explorador por turno, **cualquier otra jugada tiene que ser resultado de un efecto**. Si quieres bajar un segundo explorador, tiene que venir de un efecto que lo permita.

### Fase de Batalla

1. **Declaras un ataque** con un explorador tuyo en Ataque, eligiendo como objetivo un explorador del oponente. Si el oponente **no controla ningún explorador**, puedes atacar directamente.
2. Se abre una cadena. Si el objetivo ya no está en el campo cuando termina, el ataque **termina** (no se convierte en ataque directo).
3. **Cálculo de daño**:

| Objetivo | Resultado |
|---|---|
| En **Ataque** | Se comparan ATK. El de menor ATK es destruido y su controlador recibe la diferencia como daño. Si empatan, **ambos** son destruidos y nadie recibe daño. |
| En **Defensa** | Se compara el ATK del atacante contra la DEF del objetivo. Si el ATK es mayor, el objetivo es destruido y no hay daño. Si es menor, el atacante **no** es destruido y su controlador recibe la diferencia como daño. Si es igual, no pasa nada. |
| **Directo** | El ATK del atacante se resta de los puntos de vida del oponente. |

Cada explorador puede atacar **una vez por turno**.

## 7. Efectos

Una carta puede tener hasta dos efectos y una restricción:

- **Normal**: lo activas tú, cuando puedes. Es el efecto "activo" de la carta.
- **Trigger**: reacciona a algo que pasó o va a pasar (se explica en la sección 9).
- **Restricción**: un costo que pagas por entrar al campo o por activar la carta (sección 10).

### Cada efecto, una vez por turno, por nombre

**Cada efecto se puede activar una vez por turno por nombre de carta.** Es decir, todas las copias de "Cesarmill" comparten el mismo uso de su efecto Normal, y todas las copias de "Boolly" el de su efecto Trigger. Los efectos Normal y Trigger de una misma carta cuentan por separado.

Esto está en el juego a propósito: limita el abuso de copias y hace que cada carta distinta que sumas al mazo importe.

### Dónde funciona un efecto

- **Explorador:** funciona **en el campo**.
- **Evento:** funciona **desde la mano**.
- Si el texto dice **(Desde tu mano)**, el efecto se activa o funciona desde la mano.

### Velocidad de los efectos Normal

- Los efectos Normal de los **exploradores** son **Lentos**: solo en tu Fase Principal, con la cadena vacía. A menos que el texto diga **Instantáneo**.
- Los efectos Normal de los **eventos** tienen la velocidad impresa en la carta (sección 3).

### Costos

En el texto, lo que va antes de los dos puntos `:` es un **costo** y se paga al activar (aunque el efecto después no se resuelva). Ejemplo: "Descarta 1 carta: busca 1 Ugabuga." Si no puedes pagar el costo, no puedes activar el efecto.

### Cuando un efecto no puede resolverse

Si el objetivo elegido ya no es válido al resolver, o la condición ya no se cumple, el efecto **no se resuelve**. La carta igual cuenta como activada. (Excepción: el fallo en la búsqueda, sección 11.)

### Palabras de las cartas

| Palabra | Significado |
|---|---|
| **Destruir** | Enviar un explorador del campo al cementerio. |
| **Descartar** | Enviar una carta de la mano al cementerio. |
| **Exiliar** | Quitar la carta del juego. |
| **Bajar** | Poner un explorador en el campo (desde la mano, el cementerio, etc.). |
| **Agregar** | Poner una ficha en el campo. |
| **Elegir** | Elegir un objetivo al **activar**. El efecto "elige". |
| **Devolver a la mano** | La carta vuelve a la mano de su dueño. Las fichas no se pueden devolver. |
| **Anular** | Un ataque anulado termina sin daño. |
| **Negar** | La activación de un efecto no se resuelve, pero **sí** cuenta como activada. |
| **ATK / DEF + / −** | Cambios "hasta el final del turno", salvo que se diga otra cosa. |

## 8. Cadenas

Una **cadena** es la lista de efectos que se están activando antes de resolverse. Es la parte más importante de las reglas: lee esta sección con calma.

### 8.1 Generación de la cadena

1. **Cualquier acción abre una cadena.** Bajar un explorador, declarar un ataque, activar un efecto, cambiar de fase, robar, descartar. Esa acción es el disparador.
2. **Paso de triggers.** Primero el **jugador de turno** puede activar **cualquier cantidad de triggers** cuya condición se cumple por la acción (o por la última carta agregada a la cadena). Los encadena en el orden que quiera. Después, el **otro jugador** puede hacer lo mismo con sus triggers; si el trigger reacciona a una carta de la cadena y hace falta aclararlo, indica a cuál.
3. Si en este paso alguien activó triggers, **se repite el paso 2** para reaccionar a las nuevas cartas de la cadena. Mientras vaya habiendo triggers nuevos, el paso sigue.
4. Cuando una ronda del paso 2 termina **sin triggers nuevos**, el **jugador de turno** puede activar **un efecto instantáneo** (un evento instantáneo, o un efecto marcado como Instantáneo). Si lo hace, esa carta se agrega a la cadena y se **vuelve al paso 2**.
5. Si el jugador de turno **no** activa un efecto instantáneo, el **otro jugador** puede activar uno. Si lo hace, también se vuelve al paso 2.
6. Si se completa una ronda en la que **ninguno** activó un efecto instantáneo, la cadena pasa a **resolverse**.

Los efectos Lentos no se pueden agregar a una cadena que ya tiene cartas: solo se activan con la cadena vacía (y cada activación abre su propia cadena).

### 8.2 Resolución de la cadena

- Se resuelve **al revés**: la última carta activada se resuelve primero.
- **No se pueden agregar triggers ni efectos instantáneos mientras se resuelve.**
- Cuando termina de resolverse la cadena, **comienza una nueva cadena**. Su primer paso 2 es especial: en él solo se pueden activar los triggers **reactivos** que reaccionan a lo que pasó al resolver la cadena anterior.

### 8.3 Un ejemplo corto

Es tu turno. Bajas **Plumifer** (acción → cadena).
1. No hay triggers que reaccionen a una bajada. Nadie activa instantáneos. Plumifer entra.
2. Activas el efecto Normal de Plumifer (cadena nueva): *destruye esta carta*. El paso 2 está vacío. Nadie activa instantáneos. Se resuelve: Plumifer es destruida.
3. Empieza una **cadena nueva** por esa destrucción. Primer paso 2: tus triggers reactivos pueden activarse, por ejemplo el de Plumifer ("si esta carta es destruida: busca…") y, si lo tienes en la mano, el de **Boolly** ("si un Fantaspet que controlas es destruido…"). Los activas en el orden que prefieras.
4. Tu oponente puede reaccionar con sus propios triggers a esa destrucción. Después se resuelven al revés.

## 9. Triggers

Un trigger tiene la forma **"Si [condición]: efecto"**. La condición es lo que tiene que pasar; lo que está después de los dos puntos es el efecto (y el costo, si lo hay, va entre medio, separado por una coma).

Una condición se describe con tres partes:

### Alcance

| Alcance | Ejemplo | Quién la activa |
|---|---|---|
| **Global** | "Si se declara un ataque" | Cualquier ataque del juego. |
| **Propio** | "Si esta carta declara un ataque" | Solo la propia carta. |
| **Dirigido** | "Si el explorador elegido declara un ataque" | La carta que un efecto eligió. |

### Tempo

- **Preventivo** (*"fuera a ser…"*): "Si esta carta **fuera a ser** destruida". Se puede activar apenas aparece, en una cadena, un efecto que **hará** esa acción, antes de que se resuelva. Suele **reemplazar** el resultado.
- **Reactivo** (*"es…"*): "Si esta carta **es** destruida". Se puede activar **después**, en la cadena que empieza al resolver la acción.

### Acción

- **Modificación del tablero**: destruir, devolver a la mano, negar, cambiar ATK o DEF, agregar una ficha…
- **Acción de jugador**: declarar un ataque, bajar un explorador, revelar una carta, activar un efecto, descartar, buscar, elegir una carta…
- **Cambio de fase**: pasar de una fase a otra. Abre una cadena y permite triggers e instantáneos.

> En estas reglas, "evento" siempre es el **tipo de carta**. Lo que dispara un trigger se llama **condición**.

## 10. Restricciones

Algunas cartas tienen una **restricción**: una desventaja que se paga cuando la carta se usa. Cuanto más grave la restricción, más fuerte es la carta. Hay tres niveles estándar:

| Nivel | Texto | Efecto |
|---|---|---|
| **R1** | "No puedes bajar más exploradores este turno." | Cierra tu bajada (y todo lo que *baje*), pero no las fichas ni tus otros efectos. |
| **R2** | "No puedes activar más efectos este turno." | Congela tu juego: puedes atacar, pero no activar nada nuevo. Dejan de funcionar tus triggers nuevos hasta el final del turno. |
| **R3** | "Se termina tu turno." | Saltas directamente a la Fase Final. No atacas. |

- En un **explorador**, la restricción se aplica "**Después de entrar al campo, si es tu turno**". Si entra en el turno del oponente, no se paga.
- En un **evento**, se aplica "**Después de activar**" (o "después de activar su efecto Normal").
- Una restricción solo te afecta **a ti** y solo en el turno en que se activa.

Algunas cartas tienen restricciones permanentes más específicas (por ejemplo "Esta carta no puede declarar ataques").

## 11. Buscar cartas

Buscar es mirar el mazo para tomar una carta que cumpla un criterio.

1. Al **activar** una carta que busca, anuncias el criterio ("1 Fantaspet con ATK 150 o menos").
2. Se **revela el criterio y se muestra el objetivo** antes de poder interactuar: si tienes un objetivo válido en el mazo, sigues; si no, la búsqueda **falla** (ver abajo). 🧪
3. Tras mostrar los posibles objetivos, el oponente puede **reaccionar a la activación**.
4. Eliges entre dos tipos de búsqueda, según indique la carta:
   - **Búsqueda pública**: revelas la carta que agregas a tu mano.
   - **Búsqueda secreta**: muestras al oponente **cualquier cantidad de objetivos válidos** del mazo (al menos uno) y agregas a tu mano **una** de ellas sin decir cuál. 🧪 Mostrar más candidatos protege tu plan; mostrar uno solo equivale a una búsqueda pública.
5. Después de buscar, **barajas** el mazo.

### Fallo en la búsqueda

Si la carta **no tiene ningún objetivo válido** en el mazo, "**falla en la búsqueda**":
- No se considera que se activó (no gasta su uso del turno ni su costo, y no abre cadena).
- No puedes **volver a intentar** esa carta, ni otras cartas con el mismo objetivo, hasta que pase **algo habilitante**: que un objetivo válido vuelva (o pueda haber vuelto) al mazo.

Esto evita que se "pesque" información del mazo repitiendo activaciones sin riesgo.

## 12. Resumen rápido

- **800** de vida. Mazo de **40**, máximo **3** copias por nombre. Mano máxima **7**.
- Robas 1 por turno, también el primero. El que empieza no tiene Fase de Batalla en su primer turno.
- Solo **1 explorador de la mano por turno**, lo demás son efectos.
- Todo efecto: **una vez por turno por nombre**.
- Todo puede disparar una **cadena**; se arma con triggers primero, instantáneos después, y se resuelve al revés.
- Restricciones: **R1** (no bajar), **R2** (no activar), **R3** (termina el turno).
- Casi no hay negaciones: se interrumpe **quitando recursos u objetivos**.

---

## Decisiones por probar 🧪

Cosas que cerré para tener un demo jugable y que conviene revisar jugando:

1. **ATK/DEF en múltiplos de 50, entre 0 y 400.** Con 800 de vida, un ataque de 300-400 ya es medio juego.
2. **Posiciones Ataque/Defensa.** Reemplazan el sistema de "holder" del primer borrador, que no encajaba con las reglas de cadenas.
3. **Eventos solo desde la mano.** No hay zona de eventos ni cartas "puestas". El tablero se arma con exploradores y sus triggers; los eventos son la interacción que el jugador guarda en la mano.
4. **Sin mulligan.** Si las manos iniciales salen malas, probar con un único mulligan (devolver, barajar y robar 4).
5. **Búsqueda secreta** como "muestro varios candidatos y tomo uno sin decir cuál". Es mi lectura del borrador ("mostrando cualquier cantidad de posibles válidos targets"); confirmar que es la intención.
6. **Fallo de búsqueda al activar:** no consume el uso del turno. Sin esto, buscar sin objetivos sería gratis.
7. **Primer jugador sin Fase de Batalla:** lo interpreté como solo en su primer turno.
8. **Mano máxima de 7.** Para que robar cartas tenga un costo de oportunidad.
9. **Las fichas no son "bajadas".** Ragnatica depende de esto.
10. **Orden de severidad R1 < R2 < R3.** El borrador ponía "se termina tu turno" primero en la lista; aquí es el más grave porque incluye a los otros dos y además quita la Fase de Batalla.
