# Colapso: reglas

*Nombre de trabajo. Juego de cartas 1 contra 1, de cadenas e interacción, inspirado en Yu-Gi-Oh!.*

Esta guía explica **cómo se juega**. Para el porqué de las cartas y cómo escribir nuevas, mira [designguide.md](designguide.md). Los significados exactos de las palabras de las cartas (buscar, atracción, asistir…) están en [glosario.md](glosario.md). Los mazos para empezar están en [decks.md](decks.md).

Las partes marcadas con 🧪 son decisiones tomadas para poder jugar el demo y que deberían confirmarse en partidas de prueba (hay una lista al final).

---

## 1. Objetivo

Baja los **puntos de vida de tu oponente de 800 a 0**. También ganas si tu oponente tiene que robar y no le quedan cartas en el mazo.

Cada jugador empieza con 800 puntos de vida.

## 2. Qué necesitas

- 1 mazo de **30 cartas** por jugador, con **máximo 3 copias del mismo nombre**.
- Algo para anotar la vida, y marcadores para las fichas (monedas o cubos).

## 3. Tipos de carta

| Tipo | Qué hace | Equivalente en Yu-Gi-Oh! |
|---|---|---|
| **Explorador** | Combate en el campo. Tiene un único valor: **PODER**. | Monstruo |
| **Evento** | Intervención que se activa desde la mano y va al cementerio. | Hechizo rápido |

Cada carta pertenece a una **dimensión** (Fantaspet, Ugabuga, Ragnatica, Baluarte, Neutral…). La dimensión no limita en qué mazo puedes ponerla; sirve para que los efectos digan "un Fantaspet" y para armar mazos con identidad.

El **PODER** se mide en múltiplos de 10 y una carta normal ronda los **150**. Las cartas sin restricción y con efectos flojos suelen estar ahí; las muy fuertes llegan a 200-250 pero pagan por ello.

**Eventos:** cada uno tiene una **velocidad** impresa.
- **Rápido**: puedes activar su efecto Normal en cualquier momento en que puedas activar un efecto rápido (ver sección 8), también en el turno del oponente.
- **Lento**: solo puedes activar su efecto Normal durante tu Fase Principal, con la cadena vacía.

La velocidad solo limita a los efectos tipo **Normal**. Los efectos tipo **Trigger** siempre se pueden activar cuando se cumple su condición.

Los **eventos** no entran en el campo: se juegan desde la mano y, al resolverse, van al cementerio.

## 4. Zonas

| Zona | Notas |
|---|---|
| **Mazo** | Boca abajo, nadie puede mirarlo salvo por efectos. |
| **Mano** | Privada. Máximo **7 cartas** al final de tu turno: descarta hasta quedar en 7. |
| **Campo** | **5 zonas de explorador** por jugador. No hay zonas de evento. |
| **Cementerio** | Pública, ordenada. Cualquiera puede mirarla. Aquí van las cartas destruidas o descartadas. |
| **Exilio** | Pública. Las cartas exiliadas no vuelven a menos que un efecto lo diga. |

### Posiciones: activo y asistiendo

Un explorador en el campo está **activo** (vertical, boca arriba, en una zona de explorador) o **asistiendo** (de costado, debajo de un explorador activo).

- Solo los exploradores **activos** pueden declarar ataques y ser atacados.
- Los exploradores que están asistiendo pueden estar **boca arriba o boca abajo**.
- En los textos de las cartas, "explorador" quiere decir **explorador activo**. Cuando se habla de un explorador que asiste, el texto dice **asistente**.

### Asistentes

El asistente es la mecánica distintiva de este juego: un explorador "sostiene" a otro debajo suyo y, al ser atacado, puede apoyarse en él.

- Cada explorador activo puede tener **un asistente**. Los asistentes **no ocupan zona** de explorador.
- Cuando juegas un explorador de tu mano (la jugada espontánea del turno), lo juegas **activo** en una zona libre, o **asistiendo**: debajo de un explorador activo tuyo que no tenga asistente, boca arriba o boca abajo, a tu elección. 🧪
- Un asistente **solo aplica su efecto Asistiendo** (y las partes continuas de ese efecto). Sus efectos Normal y Trigger no funcionan mientras asiste, salvo los que digan **(Desde tu mano)**, que funcionan desde la mano.
- Un asistente **boca abajo** no tiene efecto hasta que se **revela** (se da vuelta boca arriba; después se queda boca arriba). Se revela cuando:
  - el explorador activo al que asiste es **atacado** (automático),
  - **activa** su efecto Asistiendo,
  - un efecto lo revela.
- Si un explorador activo **deja el campo** (destruido, devuelto a la mano, exiliado), su asistente **va al cementerio** con él. Se considera destruido solo si el activo fue destruido. 🧪
- Un asistente puede ser destruido, devuelto o reemplazado por efectos, sin afectar al activo. Si un explorador activo **se queda sin asistente**, es una condición que otros efectos pueden esperar ("Si [carta] se queda sin asistente…").

### Fichas

Una **ficha** es un explorador que no viene de ninguna carta (por ejemplo, la "Cría de Ragnatica").
Se representa con un marcador y sus valores salen del efecto que la crea.

- Las fichas se **agregan** al campo, no se "juegan": las restricciones del tipo "no puedes jugar más exploradores" no las bloquean.
- Las fichas siempre son exploradores **activos**.
- Si no hay una zona libre, no se puede agregar la ficha.
- Una ficha nunca va a la mano, al mazo ni al cementerio: si deja el campo, desaparece. Pero **sí** se considera destruida si el efecto dice "destruir".

## 5. Preparación

1. Cada jugador baraja su mazo. Se decide quién empieza con una moneda; **el ganador elige** si empieza o no.
2. Cada jugador roba **5 cartas**. 🧪 No hay mulligan.
3. Empieza el primer turno.

## 6. Estructura del turno

Cada turno tiene 5 fases. **Pasar de una fase a otra es una acción** y abre una cadena (ver sección 8), así que los dos jugadores pueden reaccionar al cambio de fase.

1. **Robo.** Robas 1 carta. *Se roba incluso en el primer turno del juego.*
2. **Principal 1.** Es donde se juega casi todo (ver más abajo).
3. **Batalla.** Atacas con tus exploradores activos. **El jugador que empieza la partida no tiene Fase de Batalla en su primer turno.**
4. **Principal 2.** Solo se puede acceder después de la batalla (es opcional al salir de batalla).
5. **Final.** Descartas hasta quedar en 7 cartas. Terminan los efectos "hasta el final del turno".

### Fases Principales: qué puedes hacer

- **Jugar 1 explorador de tu mano**, una vez por turno (activo o asistiendo). Es la única jugada "espontánea" que agrega cartas en el campo.
- **Activar efectos** de tus cartas (sección 7), cuando la cadena está vacía y es tu turno.

> **Regla de oro:** salvo jugar un explorador por turno, **cualquier otra jugada tiene que ser resultado de un efecto**. Si quieres jugar un segundo explorador, tiene que venir de un efecto que lo permita.

### Fase de Batalla

1. **Declaras un ataque** con un explorador tuyo activo, eligiendo como objetivo un explorador activo del oponente (respetando la **Atracción**, si el oponente tiene cartas con ella: ver [glosario.md](glosario.md#atracción)). Si el oponente **no controla ningún explorador**, puedes atacar directamente.
2. Si el objetivo atacado es un explorador con un asistente debajo, el asistente es **revelado**.
3. Se abre una cadena (ver sección 8).
4. Si el objetivo ya no está en el campo cuando termina la cadena, se puede **re-declarar** un nuevo objetivo (se vuelve al paso 1). También se puede elegir **anular** el ataque, y se considera que el explorador ya atacó.
5. Si el objetivo atacado es un explorador con un asistente debajo, quien lo controla elige si el cálculo se realiza **CON** o **SIN** asistencia.
6. **Cálculo de daño**:

| Objetivo | Resultado |
|---|---|
| Sin **asistencia** | Los exploradores activos comparan PODER. El de menor PODER es destruido y su controlador recibe la diferencia como daño. Si empatan, **ambos** son destruidos y nadie recibe daño. |
| Con **asistencia** | Se compara el PODER del atacante contra el PODER del **asistente** del objetivo. Si el PODER del atacante es mayor, el objetivo y su asistente son destruidos y el controlador del objetivo recibe la diferencia como daño. Si es menor, el atacante **no** es destruido y su controlador recibe la diferencia como daño. Si es igual, solo el asistente es destruido. |
| **Directo** | El PODER del atacante se resta de los puntos de vida del oponente. |

Un daño de 1 es 1 punto de vida (no hay multiplicador). Cada explorador activo puede atacar **una vez por turno**.

## 7. Efectos

Las cartas pueden tener más de un efecto y restricciones:

- **Efecto Normal**: lo activas tú, cuando puedes. Es el efecto "activo" de la carta.
- **Efecto Trigger**: reacciona a algo que pasó o va a pasar (se explica en la sección 9).
- **Efecto Asistiendo**: funciona solo mientras la carta es un asistente (sección 4). Puede ser un trigger ("Si el explorador es atacado: …") o un efecto continuo ("El explorador gana 30 PODER"). En él, **"el explorador" es aquel al que la carta asiste**.
- **Efecto continuo**: texto sin etiqueta, como "Mientras esta carta tenga un asistente, no puede ser destruida por efectos". No se activa, no abre cadena, no se puede negar, y se aplica mientras se cumpla la condición.
- **Restricción**: una desventaja que se paga por entrar al campo, por activar la carta o por lo que hace (sección 10).

### Cada efecto, una vez por turno, por nombre

**Cada efecto se puede activar una vez por turno por nombre de carta.** Es decir, todas las copias de "Cesarmill" comparten el mismo uso de su efecto Normal, y todas las copias de "Boolly" el de su efecto Trigger. Los efectos de una misma carta cuentan por separado.

Si un efecto empieza con **(Activa como `<nombre>`)**, para esta regla la carta cuenta como si se llamara `<nombre>`. Todas las cartas con la misma indicación comparten un solo uso por turno, sean copias o cartas distintas (ver [glosario.md](glosario.md#activa-como-nombre)).

### Cómo se leen las cartas

Para que los textos sean cortos, las cartas se escriben con estas convenciones (el glosario las detalla):

- Cada **efecto va en su propia línea**.
- "Explorador" quiere decir **explorador activo**, y las cartas que menciona son **tuyas** salvo que el texto diga "del oponente".
- Ganar o perder PODER dura **hasta el final del turno**, y asistir es **boca abajo**, salvo que el texto diga otra cosa.
- En un efecto **Asistiendo**, "el explorador" es aquel al que la carta asiste.

### Dónde funciona un efecto

- **Explorador:** funciona **en el campo**, activo. (Si asiste, solo funciona su efecto Asistiendo.)
- **Evento:** funciona **desde la mano**.
- Si el texto dice **(Desde tu mano)**, el efecto se activa o funciona desde la mano.

### Velocidad de los efectos Normal

- Los efectos Normal de los **exploradores** son **Lentos**: solo en tu Fase Principal, con la cadena vacía. A menos que el texto diga **Rápido**.
- Los efectos Normal de los **eventos** tienen la velocidad impresa en la carta (sección 3).

### Costos

En el texto, lo que va antes de los dos puntos `:` es un **costo** y se paga al activar (aunque el efecto después no se resuelva). Ejemplo: "Descarta 1 explorador: busca 1 Ugabuga de menor PODER." Si no puedes pagar el costo, no puedes activar el efecto.

### Cuando un efecto no puede resolverse

Si el objetivo elegido ya no es válido al resolver, la condición ya no se cumple, o si falló la búsqueda (sección 11), el efecto **no se resuelve**. La carta igual cuenta como activada.

### Palabras de las cartas

Resumen. Los casos borde de cada una están en [glosario.md](glosario.md).

| Palabra | Significado |
|---|---|
| **Destruir** | Enviar un explorador del campo al cementerio. |
| **Descartar** | Enviar una carta de la mano al cementerio. |
| **Exiliar** | Quitar la carta del juego. |
| **Jugar** | Poner un explorador en el campo (desde la mano, el cementerio, el mazo…), activo o asistiendo. |
| **Asistir** | Poner una carta debajo de un explorador activo como su asistente. |
| **Revelar** | Mostrar una carta (si estaba boca abajo, queda boca arriba). |
| **Activar** | Informar que una carta usará un efecto (un asistente boca abajo se revela al activar). |
| **Agregar** | Poner una ficha en el campo. |
| **Elegir** | Elegir un objetivo al **activar**. El efecto "elige". |
| **Buscar** | Mecánica de búsqueda en el mazo (sección 11). |
| **Atracción** | Obliga a elegir como objetivo a ciertas cartas. |
| **Activa como `<nombre>`** | Para la regla de una vez por turno por nombre, esta carta cuenta como si se llamara `<nombre>` (ejemplo: **Activa como Escudero**). |
| **Devolver a la mano** | La carta vuelve a la mano de su dueño. Las fichas no se pueden devolver. |
| **Anular** | Un ataque anulado termina sin daño. |
| **Negar** | La activación de un efecto no se resuelve, pero **sí** cuenta como activada. |

## 8. Cadenas

Una **cadena** es la lista de efectos que se están activando antes de resolverse. Es la parte más importante de las reglas: lee esta sección con calma.

### 8.1 Generación de la cadena

1. **Cualquier acción abre una cadena.** Jugar un explorador, declarar un ataque, activar un efecto, cambiar de fase, robar, descartar. Esa acción es el disparador.
2. **Paso de triggers.** Primero el **jugador de turno** puede activar **cualquier cantidad de triggers** cuya condición se cumple por la acción (o por cualquier carta agregada a la cadena). El jugador elige el orden en que se encadenan. Después, el **otro jugador** puede hacer lo mismo con sus triggers; si el trigger reacciona a una carta de la cadena y hace falta aclararlo, indica a cuál.
3. Si en este paso alguien activó triggers, **se repite el paso 2** para reaccionar a las nuevas cartas de la cadena. Mientras vaya habiendo triggers nuevos, el paso sigue.
4. Cuando una ronda del paso 2 termina **sin triggers nuevos**, el **jugador de turno** puede activar **un efecto rápido** (un evento rápido, o un efecto marcado como Rápido). Si lo hace, esa carta se agrega a la cadena y se **vuelve al paso 2**.
5. Si el jugador de turno **no** activa un efecto rápido, el **otro jugador** puede activar uno. Si lo hace, también se vuelve al paso 2.
6. Si se completa una ronda en la que **ninguno** activó un efecto rápido, la cadena pasa a **resolverse**.

Los efectos Lentos no se pueden agregar a una cadena que ya tiene cartas: solo se activan con la cadena vacía (y cada activación abre su propia cadena).

### 8.2 Resolución de la cadena

- Se resuelve **al revés**: la última carta activada se resuelve primero.
- **No se pueden agregar triggers ni efectos rápidos mientras se resuelve.**
- Cuando termina de resolverse la cadena, **comienza una nueva cadena**. Su primer paso 2 es especial: en él solo se pueden activar los triggers **reactivos** que reaccionan a lo que pasó al resolver la cadena anterior.

### 8.3 Un ejemplo corto

Es tu turno. Juegas a **Plumifer** (acción → cadena).
1. No hay triggers que reaccionen a una jugada. Nadie activa efectos rápidos. Plumifer entra.
2. Activas el efecto Normal de Plumifer (cadena nueva): *destruye esta carta*. El paso 2 está vacío. Nadie activa efectos rápidos. Se resuelve: Plumifer es destruida.
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

- **Modificación del tablero**: destruir, devolver a la mano, negar, cambiar PODER, agregar una ficha…
- **Acción de jugador**: declarar un ataque, jugar un explorador, revelar una carta, activar un efecto, descartar, buscar, elegir una carta…
- **Cambio de fase**: pasar de una fase a otra. Abre una cadena permitiendo triggers y efectos rápidos.

> En estas reglas, "evento" siempre es el **tipo de carta**. Lo que dispara un trigger se llama **condición**.

## 10. Restricciones

Algunas cartas tienen una **restricción**: una desventaja que se paga cuando la carta se usa.
Los efectos de la restricción **no son opcionales** y se aplican **en simultáneo con la resolución de la acción que los reveló** (no abren una cadena propia).

- En un **explorador**, la restricción se aplica "**Después de entrar al campo**". Ya sea tu turno o el del oponente, salvo que el texto lo limite ("Si es tu turno").
- En un **explorador**, también puede aplicarse en otro momento que diga el texto (por ejemplo "Después de combatir").
- En un **evento**, se aplica "**Después de activar**", tanto el efecto Normal como el Trigger.
- Una restricción solo afecta a quien la jugó o activó.

**No hay restricciones estándar.** Cualquier carta puede llevar cualquier restricción, y cuanto más grave, más fuerte puede ser la carta. Para dar una idea de la variedad:

- "No puedes jugar más exploradores este turno."
- "No puedes declarar ataques este turno."
- "Se termina tu turno."
- "Descarta 1 carta."
- "Pierdes 50 puntos de vida."
- "Destruye el asistente de esta carta. Si no puedes, destruye esta carta."
- "Esta carta no puede declarar ataques."
- "Solo puedes controlar 1 copia de esta carta."

## 11. Buscar cartas

Buscar es mirar el mazo para tomar una carta que cumpla un criterio. **No es una palabra clave de unas pocas cartas: es la mecánica de toda búsqueda**, y las cartas solo dicen "Busca 1 [criterio]". Sin otra indicación, la carta buscada se agrega a la mano.

1. Al **activar** una carta que busca, anuncias el criterio ("1 Fantaspet con PODER 120 o menos").
2. Se revelan y se dejan boca arriba **uno o más objetivos que cumplan el criterio** antes de terminar con la activación: si revelas mínimo una carta, sigues; si no, la búsqueda **falla** (ver abajo).
3. Tras mostrar los posibles objetivos, el efecto de buscar se agrega a la cadena.
4. Después de resolver una búsqueda, antes de que comience la siguiente cadena, **barajas** el mazo.

En el paso 2, según la cantidad de cartas reveladas, la búsqueda es de uno de dos tipos:
   - **Búsqueda pública**: revelas **una sola carta**; esa carta será la afectada por la búsqueda (jugada, agregada a la mano, descartada, etc.).
   - **Búsqueda secreta**: revelas **más de un objetivo válido** del mazo y eliges entre ellos cuál será la afectada **sin decir cuál**, devolviendo el resto al mazo.

### Fallo en la búsqueda

Si la carta **no tiene ningún objetivo válido** en el mazo, "**falla en la búsqueda**":
- No se paga costo.
- No se agrega a la cadena ni comienza una.
- **Sí** se considera activada para la restricción de una vez por turno.
- No puedes **volver a intentar** esa carta, ni otras cartas con el mismo criterio de búsqueda, hasta que pase **algo habilitante**: que un objetivo válido vuelva (o pueda haber vuelto) al mazo.

## 12. Resumen rápido

- **800** de vida. Mazo de **30**, máximo **3** copias por nombre. Mano máxima **7**.
- Un explorador tiene un único valor, el **PODER** (normal ≈ 150). El daño es la diferencia, 1 a 1.
- Robas 1 por turno, también el primero. El que empieza no tiene Fase de Batalla en su primer turno.
- Solo **1 explorador de la mano por turno** (activo o asistiendo), lo demás son efectos.
- Un explorador activo puede tener **un asistente**; al ser atacado, el asistente se revela y puedes elegir defender CON o SIN él.
- Todo efecto es: **una vez por turno por nombre**.
- Todo puede disparar una **cadena**; se arma con triggers primero, efectos rápidos después, y se resuelve al revés.
- Las restricciones son libres, no hay niveles.
- Casi no hay negaciones: se interrumpe **quitando recursos u objetivos**.

---

## Decisiones confirmadas

Cosas que estaban abiertas y ya se definieron:

- **PODER ≈ 150, daño 1 a 1.** Sin múltiplos de 50: cualquier múltiplo de 10. Una carta normal ronda 150.
- **Un solo valor, PODER.** Se reemplazó ATK/DEF. Las posiciones son **activo / asistiendo**, no Ataque/Defensa.
- **Búsqueda secreta** es parte de toda búsqueda ("muestro varios candidatos y tomo uno sin decir cuál"), no una palabra clave.
- **El fallo de búsqueda consume el uso del turno** y trae la penalidad del bloqueo (no se puede reintentar sin algo habilitante).
- **Las restricciones son abiertas.** No existen niveles R1/R2/R3: cualquier carta puede llevar cualquier restricción.
- **Mazos de 30 cartas.** Máximo 3 copias por nombre y vida 800 sin cambios.
- **"Asistiendo"** es la etiqueta del efecto de los asistentes (antes "Asistencia"). "CON o SIN asistencia" sigue siendo la elección del defensor.
- **Escuderos:** el límite de un efecto extra por turno se escribe **(Activa como Escudero)** y reutiliza la regla de una vez por turno por nombre.

## Decisiones por probar 🧪

Cosas que cerré para tener un demo jugable y que conviene revisar jugando:

1. **Eventos solo desde la mano.** No hay zona de eventos ni cartas "puestas". El tablero se arma con exploradores y sus triggers; los eventos son la interacción que el jugador guarda en la mano.
2. **Sin mulligan.** Si las manos iniciales salen malas, probar con un único mulligan (devolver, barajar y robar 4).
3. **Primer jugador sin Fase de Batalla:** lo interpreté como solo en su primer turno.
4. **Mano máxima de 7.** Para que robar cartas tenga un costo de oportunidad.
5. **Las fichas no son "jugadas".** Ragnatica depende de esto.
6. **Jugar asistiendo es la jugada espontánea del turno** y se puede hacer boca arriba o boca abajo. Sin esto, los asistentes solo entrarían por efectos.
7. **Si el explorador activo deja el campo, su asistente va al cementerio.** Alternativa: que el asistente pase a activo si hay zona libre.
8. **Los asistentes solo aplican su efecto Asistiendo.** Alternativa: que conserven también su efecto Trigger.
9. **Un explorador, un asistente.** Se podría probar con dos en las piezas grandes.
10. **Atracción solo restringe al oponente**, y solo cuando elige objetivos; no frena efectos que no eligen (como destruir todos) ni los propios.
