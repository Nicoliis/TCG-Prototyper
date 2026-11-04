# Colapso (modo tablero): reglas

*Segundo juego de demostración. Mismo mundo y mismo motor de cadenas que [Colapso (modo vida, demo 1)](../demoTCG/ruleguides.md), pero sin puntos de vida: se gana construyendo una primera fila.*

Esta guía explica **cómo se juega**. Para el porqué de las cartas y cómo escribir nuevas, mira [designguide.md](designguide.md). Las palabras de las cartas están en [glosario.md](glosario.md) y los mazos en [decks.md](decks.md).

Las partes marcadas con 🧪 son decisiones tomadas para poder jugar el demo y que deberían confirmarse en partidas de prueba (hay una lista al final).

**Qué cambia respecto al demo 1:** el objetivo (sección 1), el tablero con primera fila y barracas (sección 4), las posiciones En guardia y Asistiendo (sección 5), la fase de promoción (sección 7), el combate (sección 7) y el PODER de los efectos (sección 8). Las cartas **ya no se apilan**: no hay asistentes debajo de un explorador. Todo lo demás (cadenas, triggers, búsqueda, tokens, Atracción) funciona igual y se resume aquí.

---

## 1. Objetivo

Para ganar una partida de Colapso, debes tener 1000 o más puntos de poder en el campo al comenzar tu turno, antes de levantar.

- El **PODER del tablero** es la suma del **PODER** de tus exploradores en **primera fila** (tokens incluidos). El PODER de un explorador es siempre **PODER total − daño** (ver *Marcadores*, sección 7), así que **el daño que tengan encima le resta al tablero**.
- Las **barracas no suman**: son la reserva y el taller de combos.
- Esta comprobación no abre cadena. Tu oponente tuvo **todo su turno** para romper tu tablero.
- También pierdes si tienes que robar y no te quedan cartas en el mazo.
- No hay puntos de vida ni daño directo al jugador: el daño solo se pone sobre exploradores.

## 2. Qué necesitas

- 1 mazo de **50 cartas** por jugador, con **máximo 3 copias del mismo nombre**.
- Marcadores para el **daño** y para el **PODER agregado** (los mismos, de 50 cada uno).

## 3. Tipos de carta

| Tipo | Qué hace |
|---|---|
| **Explorador** | Vive en el campo (primera fila o barracas). Tiene un único valor: **PODER**. |
| **Evento** | Intervención que se activa desde la mano y va al cementerio. Tiene velocidad **Rápido** o **Lento**. |

Cada carta pertenece a una **dimensión** (Fantaspet, Ugabuga, Ragnatica, Baluarte, Neutral). La dimensión no limita en qué mazo puedes ponerla; sirve para que los efectos digan "un Fantaspet" y para armar mazos con identidad.

El **PODER** va de 50 en 50. Como hay que llegar a 1000 con 6 lugares en la primera fila, el promedio necesario es **~170**:

| PODER | Qué es |
|---|---|
| 50-100 | Soporte. Solo con un efecto muy bueno. |
| 150 | Cuerpo normal. |
| 200 | Cuerpo sólido, casi siempre con un efecto útil. |
| 250-300 | Pieza. Entra con un costo (efecto o restricción). |

Las **restricciones** (una desventaja obligatoria al entrar a la primera fila o al activar) existen pero son **poco comunes**: solo las cartas más fuertes o extrañas las llevan.

## 4. El tablero

| Zona | Notas |
|---|---|
| **Mazo** | Boca abajo. |
| **Mano** | Privada. Máximo **7 cartas** al final de tu turno. |
| **Primera fila** | **6 lugares** de explorador. Las cartas están **siempre boca arriba** y **siempre en guardia**. Es lo que suma al objetivo, ataca y es atacado. |
| **Barracas** | **6 lugares** de explorador. Las cartas pueden estar **boca arriba o boca abajo**, **en guardia o asistiendo**. No suman, no atacan y no pueden ser atacadas. |
| **Cementerio** | Pública y ordenada. Aquí van las cartas destruidas o descartadas. |
| **Exilio** | Pública. Las cartas exiliadas no vuelven. |

No hay zonas de evento. En los textos, **"explorador" quiere decir explorador en primera fila**; para las barracas se dice **"carta de tus barracas"**.

### Tokens

Un **token** es un explorador sin carta (por ejemplo, la "Cría de Ragnatica": 100 de PODER). Se **agrega**, no se juega: no cuenta para el límite de una carta por turno en la primera fila (sección 6), y las restricciones del tipo "no puedes jugar más exploradores" no lo bloquean. Siempre está en guardia y entra a la **primera fila**; si no hay lugar libre, no se agrega. Si deja el campo, desaparece (aunque cuenta como destruido si el efecto dice "destruir").

## 5. Posiciones: En guardia y Asistiendo

Un explorador en el campo está en una de dos posiciones. **La eliges al jugarlo y no se puede cambiar mientras la carta esté en juego.**

| Posición | Cómo se coloca | Qué puede hacer |
|---|---|---|
| **En guardia** | Vertical | **Atacar** (solo desde la primera fila). Activar sus efectos **En guardia** y sus **Triggers** (solo desde la primera fila, boca arriba). |
| **Asistiendo** | De costado (horizontal) | **No ataca.** Activar sus efectos **Asistiendo** (boca arriba, o revelándola al activar). Solo puede estar en las barracas. |

- En la **primera fila** todas las cartas están en guardia y boca arriba.
- En las **barracas** una carta en guardia espera su turno de **ser promovida** (sección 7); una carta asistiendo **se queda ahí**: es una pieza de combo.
- Un efecto **Asistiendo** o un **Trigger (Asistiendo)** de una carta **boca abajo** se activa **revelándola** (queda boca arriba). Mientras está boca abajo, el oponente no sabe qué es.
- Un explorador en guardia **boca abajo** en las barracas no tiene efectos hasta que sea promovido (entra boca arriba).

## 6. Preparación y jugadas

1. Cada jugador baraja su mazo. Una moneda decide quién empieza y el ganador elige si empieza o no.
2. Cada jugador roba **5 cartas**. 🧪 No hay mulligan.

### Cuántas cartas puedes jugar

- **En las barracas:** cuantas quieras (si hay lugar), en guardia o asistiendo, boca arriba o boca abajo.
- **En la primera fila:** **una sola carta por turno** de tu mano. Entra en guardia y boca arriba.
- Los efectos de las cartas que dicen "juega" **no cuentan para ese límite**. Por defecto "juega 1 X" pone la carta **en guardia en la primera fila**; "juega 1 X **asistiendo**" la pone en las **barracas**, asistiendo y boca arriba.
- Un explorador **no puede jugarse** si no hay un lugar libre en la zona elegida.

## 7. Estructura del turno

1. **Comienzo.** Compruebas el objetivo (sección 1). No hay cadena.
2. **Robo.** Robas 1 carta. Pasar de una fase a otra abre una cadena (sección 9).
3. **Principal 1.** Juegas cartas (sección 6) y activas efectos.
4. **Batalla.** Atacas con tus exploradores de la primera fila. **El jugador que empieza la partida no tiene Fase de Batalla en su primer turno.**
5. **Principal 2.** Opcional. Igual que Principal 1.
6. **Promoción.** Puedes **mover 1 carta en guardia de tus barracas a un lugar libre de tu primera fila**. Entra boca arriba. **No cuenta como jugarla**: es un movimiento aparte. 🧪
7. **Final.** Descartas hasta quedar en 7 cartas y terminan los efectos "este turno".

La promoción abre cadena y los efectos que dicen "entra a primera fila" (por ejemplo, el de Triturador) se activan tanto si la carta fue jugada como promovida. Con **"se termina tu turno"** pasas directo a la Fase Final, sin promoción.

Así, sin efectos, puedes llevar **hasta 2 cartas por turno a la primera fila**: una jugada y una promovida. Llenar los 6 lugares lleva por lo menos 3 turnos, salvo que los efectos agreguen o jueguen más. Los tokens y los efectos de "juega" son la forma de ir más rápido.

### Marcadores: PODER agregado y daño

Cada explorador lleva marcadores de dos tipos. **Un marcador vale 50.** Son los mismos marcadores para los dos, y se distinguen por el lado de la carta donde se ponen:

| Marcador | Dónde | Efecto |
|---|---|---|
| **PODER agregado** | A la **izquierda** de la carta | Suma 50 al PODER total. Lo ponen los efectos que "ganan PODER" de forma permanente. |
| **Daño** | A la **derecha** de la carta | Resta 50 al PODER. Lo ponen los ataques y los efectos que "infligen daño". |

Los marcadores también pueden ser **fichas de dos caras**: una con una espada (PODER agregado) y otra con un golpe (daño), que de paso sirven de moneda para los efectos al azar.

El PODER de un explorador se calcula siempre así:

| Valor | Cómo se calcula |
|---|---|
| **PODER base** | El impreso en la carta. |
| **PODER agregado** | Los marcadores de la izquierda × 50. |
| **PODER total** | PODER base + PODER agregado + efectos continuos ("Tiene +50 PODER por cada…"). |
| **PODER** | **PODER total − daño.** Es el único que cuenta para todo: atacar, el objetivo, los criterios de las cartas y la destrucción. |

- Un explorador cuyo **PODER llega a 0 o menos** es **destruido** de inmediato.
- Los marcadores desaparecen cuando la carta deja el campo.
- Fuera del campo (mano, mazo, cementerio) no hay marcadores y los criterios como "con PODER 150 o menos" miran el PODER base.
- Las cartas de las barracas también pueden llevar marcadores (un efecto puede elegirlas). Los conservan al ser promovidas, porque no dejan el campo.

### Combate: en una dirección y sumando daño

1. **Declaras un ataque** con un explorador de tu **primera fila** que no haya atacado este turno, contra un explorador de la **primera fila** del oponente (respetando la **Atracción**). Las barracas no se pueden atacar. Si el oponente no tiene exploradores en su primera fila, no hay ataque.
2. Se abre una cadena. Si el objetivo ya no está al terminar, puedes re-declarar uno nuevo o anular el ataque. Aquí se activan las **trampas**: los Triggers (Asistiendo) de las barracas, boca abajo o arriba.
3. **Daño:** el atacante pone sobre el objetivo tantos marcadores de **daño** como su PODER (50 de PODER = 1 marcador). **El atacante no recibe nada.** Un atacante dañado golpea más débil, porque su PODER ya descuenta su daño.
4. Si el PODER del objetivo llega a **0 o menos**, es **destruido** de inmediato.

El **daño se acumula** mientras la carta esté en el campo: unos exploradores pequeños pueden destruir a uno grande en varios ataques o en un mismo turno. El daño se quita con efectos que **curan**. Si un efecto le quita PODER a un explorador y su daño pasa a ser igual o mayor que su PODER total, se destruye.

> **Idea clave:** atacar casi nunca expone al atacante, y **cada marcador de daño le baja 50 al tablero del otro**. Se ataca para destruir, pero también para **bajarle el PODER del tablero** antes de su turno, y se cura para devolvérselo.

## 8. Efectos

### Cómo se leen las cartas

- Cada efecto va en su propia línea. La **etiqueta** dice **desde dónde** se activa:

| Etiqueta | Se activa desde | Notas |
|---|---|---|
| **Normal** | La **mano** | Eventos y exploradores con "(Desde tu mano)". |
| **En guardia** | La **primera fila** | Siempre **Lento**. Son los efectos **más fuertes** de la carta. |
| **Asistiendo** | Las **barracas**, en posición asistiendo | Abren y extienden combos. Casi siempre tienen un **costo que mueve cartas**. |
| **Trigger** | Reacciona a una condición | Por defecto funciona desde la primera fila. `(Asistiendo)` desde las barracas (trampas) y `(Desde tu mano)` desde la mano. |

- El texto sin etiqueta es un efecto **continuo**: funciona mientras la carta esté en la primera fila, salvo que la etiqueta diga otra cosa.
- **"Explorador"** es explorador en primera fila. Las cartas de las barracas se nombran **"carta de tus barracas"**. Todo es tuyo salvo que diga "del oponente".
- **Sobre el PODER solo hay tres efectos:** **potenciar** ("gana X PODER": pone marcadores de PODER agregado, permanentes mientras el explorador siga en el campo), **infligir daño** y **curar**. **Perder PODER es recibir daño**: no existen las pérdidas ni los bonos temporales.
- **"Esta carta"** es la carta que tiene el efecto, esté donde esté.

### Reglas generales

- **Una vez por turno por nombre:** cada efecto se activa una vez por turno por nombre de carta. Si un efecto empieza con **(Activa como `<nombre>`)**, la carta cuenta como si se llamara así para esta regla.
- **Dónde funcionan:** cada efecto, desde la zona que dice su etiqueta; los eventos, desde la mano.
- **Velocidad:** los efectos En guardia y Asistiendo son Lentos (solo en tu Fase Principal con la cadena vacía), salvo que el texto diga Rápido; los de los eventos tienen su velocidad impresa. Los Triggers siempre se pueden activar cuando se cumple su condición.
- **Costos:** lo que va antes de `:` se paga al activar. Si no puedes pagar, no puedes activar. Los costos típicos de los efectos Asistiendo mueven cartas: **destruir esta carta y otra**, **descartar una carta**, **devolver esta carta y otra a la mano**.
- Un efecto que no puede resolverse (objetivo inválido, búsqueda fallida) no se resuelve, pero la carta cuenta como activada.
- Una restricción es una desventaja obligatoria que se aplica en simultáneo con la acción que la reveló y no abre cadena.

### Palabras de las cartas

| Palabra | Significado |
|---|---|
| **Destruir** | Enviar un explorador del campo al cementerio. |
| **Descartar** | Enviar una carta de la mano al cementerio. |
| **Exiliar** | Quitar la carta del juego. |
| **Jugar** | Poner un explorador en el campo. Por defecto, en guardia en la primera fila; "asistiendo" lo pone en las barracas. |
| **Revelar** | Mostrar una carta (queda boca arriba). |
| **Agregar** | Poner un token en la primera fila. |
| **Elegir** | Elegir un objetivo al activar. |
| **Buscar** | Mecánica de búsqueda en el mazo (sección 12). |
| **Atracción** | Obliga a elegir como objetivo a ciertas cartas. |
| **Infligir daño** | Poner marcadores de daño sobre un explorador. |
| **Curar** | Quitar marcadores de daño. |
| **Sobrevive con X** | Evita la destrucción por daño: al explorador le quedan X de PODER. |
| **Activa como `<nombre>`** | Para la regla de una vez por turno, la carta cuenta con ese nombre. |
| **Anular / Negar** | Un ataque anulado termina; la activación negada no se resuelve pero sí cuenta. |

## 9. Cadenas

Una **cadena** es la lista de efectos que se activan antes de resolverse. Resumen (el detalle está en el [demo 1](../demoTCG/ruleguides.md#8-cadenas)):

1. **Cualquier acción abre una cadena**: jugar, promover, atacar, activar, cambiar de fase, robar, descartar.
2. **Paso de triggers:** primero el jugador de turno puede activar cualquier cantidad de triggers cuya condición se cumple; después el otro jugador. Si hubo triggers, se repite el paso.
3. Cuando una ronda no trae triggers nuevos, el jugador de turno puede activar **un efecto rápido**, luego el otro jugador. Cada efecto rápido vuelve al paso 2.
4. Cuando ninguno activa nada, la cadena se **resuelve al revés**. Después empieza una cadena nueva en la que solo se activan los triggers reactivos a lo que se resolvió.

Los efectos Lentos solo se activan con la cadena vacía.

## 10. Triggers

Un trigger es **"Si [condición]: efecto"**. La condición tiene alcance (global, propio o dirigido), tempo (preventivo "fuera a ser…" o reactivo "es…") y acción (modificar el tablero, acción de jugador o cambio de fase). Los preventivos pueden reemplazar el resultado; los reactivos ocurren después.

Dos condiciones nuevas: **"Si esta carta entra a primera fila"** (se cumple al jugarla o al promoverla) y **"Si el oponente declara un ataque"**, la condición de las trampas de las barracas.

## 11. Restricciones

Poco comunes, libres y siempre **proporcionales**: cuanto más grave, más fuerte la carta. Se aplican **al entrar a la primera fila** o **después de activar**. Ejemplos del demo: "se termina tu turno", "descarta 1 carta", "no puedes declarar ataques este turno", "esta carta no puede declarar ataques", "destruye 1 explorador tuyo". Una restricción no bloquea el efecto de su propia carta.

## 12. Buscar cartas

Buscar es **la mecánica de toda búsqueda**: las cartas solo dicen "Busca 1 [criterio]". Los criterios del demo son **estrechos** (PODER exacto, un tipo de efecto, un evento Lento…): hay que **encadenar** cartas para llegar a la pieza que falta.

1. Al activar, anuncias el criterio y revelas **una o más** cartas válidas del mazo. Si no hay ninguna, la búsqueda **falla**.
2. **Una sola** revelada: búsqueda **pública**. **Más de una**: búsqueda **secreta** (eliges cuál sin decirlo y el resto vuelve al mazo).
3. El efecto de buscar se agrega a la cadena. Al resolverse, la carta va a tu mano (salvo que el texto diga otra cosa) y se baraja.
4. **Fallo:** no se paga costo ni se abre cadena, sí gasta el uso del turno, y no puedes reintentar con el mismo criterio hasta que algo habilitante vuelva al mazo.

## 13. Resumen rápido

- Gana quien **empiece su turno con 1000 de PODER en su primera fila**. No hay puntos de vida.
- Mazo de **50**, máximo **3** copias por nombre. Mano máxima **7**. **6 lugares de primera fila** (siempre boca arriba y en guardia) y **6 de barracas** (boca arriba o abajo, en guardia o asistiendo).
- **En guardia:** ataca y activa su efecto En guardia (solo desde la primera fila). **Asistiendo:** no ataca y activa su efecto Asistiendo (desde las barracas). La posición **no cambia** mientras la carta está en juego.
- **Una carta por turno** de la mano a la primera fila; en las barracas, cuantas quieras. Al final del turno, **promoción**: una carta en guardia pasa de las barracas a la primera fila.
- **PODER = PODER total − daño**, y PODER total = PODER base + PODER agregado. Los marcadores (50 cada uno) van a la izquierda (PODER agregado) y a la derecha (daño).
- El combate es **en una dirección**: el atacante pone daño igual a su PODER, el defensor no responde. El explorador se destruye cuando su PODER llega a 0.
- Sobre el PODER solo hay **potenciar**, **infligir daño** y **curar**. Perder PODER es recibir daño.
- Los efectos En guardia son los más fuertes; los Asistiendo abren combos y cuestan cartas.
- Todo efecto es **una vez por turno por nombre**. Todo puede disparar una **cadena**.

---

## Decisiones confirmadas

- **Objetivo: 1000 de PODER en la primera fila al comienzo de tu turno.** Sin puntos de vida.
- **Tablero de dos filas de 6 lugares:** primera fila (siempre boca arriba) y barracas (boca arriba o abajo).
- **Dos posiciones, fijas mientras la carta está en juego:** En guardia (ataca, efecto En guardia desde la primera fila) y Asistiendo (no ataca, efecto Asistiendo). Los tokens siempre están en guardia.
- **Las cartas no se apilan.** Se acabaron los asistentes debajo de un explorador, el combate CON/SIN asistencia y los efectos "el explorador".
- **Una carta por turno a la primera fila, cuantas quieras en las barracas, y una promoción al final del turno.**
- **Los efectos En guardia son los más fuertes y siempre Lentos. Los Asistiendo abren y extienden combos y cuestan cartas.** Las búsquedas son estrechas, no "este arquetipo".
- **PODER = PODER total − daño**, con PODER total = base + agregado. El daño le resta al tablero.
- **Los mismos marcadores sirven para PODER agregado y daño**, de 50 cada uno, uno a cada lado de la carta.
- **Solo potenciar, infligir daño y curar.** Perder PODER es recibir daño, y no hay bonos ni pérdidas "este turno".
- **Combate estilo Pokémon:** un solo sentido, el daño se suma hasta que el PODER llega a 0.
- **No hay "destruido en combate":** las cartas que protegen usan **Sobrevive con X** y las que castigan hablan de **daño**.
- **Mismo mundo y dimensiones que el demo 1**, reescritos para el nuevo objetivo. Los dos demos se llaman **Colapso**: el 1 es el modo vida y el 2 el modo tablero.
- **PODER de 50 en 50**, sin cartas de 50 salvo efectos muy buenos.
- **Mazo de 50:** 38 de la dimensión + 12 neutrales.
- **Restricciones poco comunes.**
- **Interacción con efecto secundario:** toda carta que interrumpe trae además otro efecto.

## Decisiones por probar 🧪

1. **La promoción no cuenta como jugar**, así que se pueden llevar 2 cartas por turno a la primera fila. Alternativa: que la promoción comparta el límite de una carta.
2. **Solo la primera fila suma y ataca.** Si el juego es muy lento, subir los lugares de primera fila o bajar el objetivo a 900.
3. **Los tokens entran a la primera fila.** Con la fila llena no se agregan; quizá deban poder entrar a las barracas.
4. **Las barracas no se pueden atacar.** Los efectos sí pueden elegirlas.
5. **Un marcador vale 50.** Si se necesita más precisión, usar marcadores de 25 (los PODER seguirían de 50 en 50).
6. **Un atacante dañado golpea más débil** (su PODER descuenta el daño). Alternativa: que ataque con su PODER total.
7. **El daño es igual al PODER del atacante.** Alternativa: la mitad, para que los combates sean más lentos.
8. **6 lugares y objetivo 1000.** Si el juego dura muy poco, subir a 1200; si no termina nunca, bajar a 900.
9. **Sin PODER temporal.** No hay "pierde X PODER" ni "gana X PODER este turno": solo potenciar, daño y curar. Si faltaran trucos de combate, el siguiente paso sería un "daño temporal" que solo cuente para el PODER y no para morir.
10. **Sin mulligan, mano inicial de 5.**
11. **Primer jugador sin Fase de Batalla** en su primer turno.
12. **Atracción solo restringe al oponente** y solo al elegir objetivos.
13. **Las trampas boca abajo en las barracas** se activan revelándose: pueden responder a un ataque aunque no estén boca arriba.
