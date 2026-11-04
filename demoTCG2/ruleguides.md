# Umbral: reglas

*Nombre de trabajo del demo 2. Mismo mundo y mismo motor de cadenas que [Colapso (demo 1)](../demoTCG/ruleguides.md), pero sin puntos de vida: se gana construyendo un tablero.*

Esta guía explica **cómo se juega**. Para el porqué de las cartas y cómo escribir nuevas, mira [designguide.md](designguide.md). Las palabras de las cartas están en [glosario.md](glosario.md) y los mazos en [decks.md](decks.md).

Las partes marcadas con 🧪 son decisiones tomadas para poder jugar el demo y que deberían confirmarse en partidas de prueba (hay una lista al final).

**Qué cambia respecto al demo 1:** el objetivo (sección 1), el combate (sección 6), el PODER de los efectos (sección 7) y el tamaño del mazo y del campo. Todo lo demás (cadenas, triggers, búsqueda, asistentes, fichas, Atracción) funciona igual y se resume aquí.

---

## 1. Objetivo

**Al comienzo de tu turno, antes de robar, si el PODER total de tus exploradores activos es 1000 o más, ganas.**

- El **PODER total** es la suma del PODER actual de tus exploradores **activos** (fichas incluidas). Cuentan los bonos permanentes y los efectos continuos; no cuentan los que duran "este turno" (ya terminaron). El daño que tengan encima **no** lo reduce. 🧪
- Los **asistentes no suman**: son cartas de apoyo.
- Esta comprobación no abre cadena. Tu oponente tuvo **todo su turno** para romper tu tablero.
- También pierdes si tienes que robar y no te quedan cartas en el mazo.
- No hay puntos de vida ni daño directo al jugador: el daño solo se pone sobre exploradores.

## 2. Qué necesitas

- 1 mazo de **50 cartas** por jugador, con **máximo 3 copias del mismo nombre**.
- Marcadores para el **daño** (cubos) y para las fichas (monedas).

## 3. Tipos de carta

| Tipo | Qué hace |
|---|---|
| **Explorador** | Vive en el campo. Tiene un único valor: **PODER**. |
| **Evento** | Intervención que se activa desde la mano y va al cementerio. Tiene velocidad **Rápido** o **Lento**. |

Cada carta pertenece a una **dimensión** (Fantaspet, Ugabuga, Ragnatica, Baluarte, Neutral). La dimensión no limita en qué mazo puedes ponerla; sirve para que los efectos digan "un Fantaspet" y para armar mazos con identidad.

El **PODER** va de 50 en 50. Como hay que llegar a 1000 con 6 zonas, el promedio necesario es **~170**:

| PODER | Qué es |
|---|---|
| 50-100 | Soporte. Solo con un efecto muy bueno. |
| 150 | Cuerpo normal. |
| 200 | Cuerpo sólido, casi siempre con un efecto útil. |
| 250-300 | Pieza. Entra con un costo (efecto o restricción). |

Las **restricciones** (una desventaja obligatoria al entrar al campo o al activar) existen pero son **poco comunes**: solo las cartas más fuertes o extrañas las llevan.

## 4. Zonas

| Zona | Notas |
|---|---|
| **Mazo** | Boca abajo. |
| **Mano** | Privada. Máximo **7 cartas** al final de tu turno. |
| **Campo** | **6 zonas de explorador** por jugador. No hay zonas de evento. |
| **Cementerio** | Pública y ordenada. Aquí van las cartas destruidas o descartadas. |
| **Exilio** | Pública. Las cartas exiliadas no vuelven. |

### Activos y asistentes

Un explorador en el campo está **activo** (vertical, en una zona) o **asistiendo** (de costado, debajo de un activo). Solo los activos suman al objetivo, atacan y son atacados. En los textos, "explorador" quiere decir **explorador activo**; el que asiste se llama **asistente**.

- Cada activo puede tener **un asistente**. Los asistentes no ocupan zona.
- Cuando juegas un explorador de tu mano (la jugada espontánea del turno), lo juegas **activo** o **asistiendo**, boca arriba o boca abajo. 🧪
- Un asistente solo aplica su efecto **Asistiendo**. Un asistente **boca abajo** no tiene efecto hasta que se **revela** (cuando su activo es atacado, cuando activa su efecto o cuando otro efecto lo revela).
- Si el activo deja el campo, su asistente **va al cementerio** con él. 🧪

### Fichas

Una **ficha** es un explorador sin carta (por ejemplo, la "Cría de Ragnatica": 100 de PODER). Se **agrega**, no se juega: las restricciones del tipo "no puedes jugar más exploradores" no la bloquean. Siempre es activa, ocupa una zona y, si deja el campo, desaparece (aunque cuenta como destruida si el efecto dice "destruir").

## 5. Preparación

1. Cada jugador baraja su mazo. Una moneda decide quién empieza y el ganador elige si empieza o no.
2. Cada jugador roba **5 cartas**. 🧪 No hay mulligan.

## 6. Estructura del turno

1. **Comienzo.** Compruebas el objetivo (sección 1). No hay cadena.
2. **Robo.** Robas 1 carta. Pasar de una fase a otra abre una cadena (sección 8).
3. **Principal 1.** Juegas **1 explorador de tu mano** (activo o asistiendo) y activas efectos. Cualquier otra jugada es resultado de un efecto.
4. **Batalla.** Atacas con tus exploradores activos. **El jugador que empieza la partida no tiene Fase de Batalla en su primer turno.**
5. **Principal 2.** Opcional. Igual que Principal 1.
6. **Final.** Descartas hasta quedar en 7 cartas y terminan los efectos "este turno".

### Combate: en una dirección y sumando daño

1. **Declaras un ataque** con un explorador activo tuyo que no haya atacado este turno, contra un explorador activo del oponente (respetando la **Atracción**). Si el oponente no tiene exploradores, no hay ataque.
2. Si el objetivo tiene asistente, el asistente se **revela**.
3. Se abre una cadena. Si el objetivo ya no está al terminar, puedes re-declarar uno nuevo o anular el ataque.
4. Si el objetivo tiene asistente, su controlador elige defender **CON** o **SIN** asistencia.
5. **Daño:** el atacante pone sobre el objetivo tanto **daño** como su PODER actual. **El atacante no recibe nada.**
   - **SIN asistencia:** el daño va al explorador atacado.
   - **CON asistencia:** el daño va al **asistente**, que se comporta como un explorador con su propio PODER; el explorador no recibe nada.
6. Un explorador (o asistente) cuyo daño **iguala o supera** su PODER es **destruido** de inmediato. Lo que le queda de PODER (su PODER menos su daño) es su **PODER restante**.

El **daño se acumula** mientras la carta esté en el campo: unos exploradores pequeños pueden destruir a uno grande en varios ataques o en un mismo turno. El daño se quita con efectos que **curan**, y desaparece si la carta deja el campo. Si un efecto le quita PODER a un explorador y su daño pasa a ser mayor, se destruye.

> **Idea clave:** atacar casi nunca es gratis para quien defiende, pero tampoco expone al atacante. Por eso se ataca para **bajarle el PODER total al otro** antes de su turno.

## 7. Efectos

### Cómo se leen las cartas

- Cada efecto va en su propia línea. Etiquetas: **Normal** (lo activas tú), **Trigger** (reacciona), **Asistiendo** (solo funciona mientras la carta asiste). El texto sin etiqueta es un efecto continuo.
- "Explorador" es explorador activo; las cartas que menciona son **tuyas** salvo que diga "del oponente".
- **Ganar o perder PODER es permanente** mientras el explorador siga en el campo, salvo que el texto diga **"este turno"**. (El objetivo se mide al comienzo de tu turno, así que los bonos "este turno" solo sirven para combatir.)
- Asistir es boca abajo, salvo que el texto diga "boca arriba".
- En un efecto Asistiendo, "el explorador" es aquel al que la carta asiste.

### Reglas generales

- **Una vez por turno por nombre:** cada efecto se activa una vez por turno por nombre de carta. Si un efecto empieza con **(Activa como `<nombre>`)**, la carta cuenta como si se llamara así para esta regla.
- **Dónde funcionan:** un explorador, en el campo (si asiste, solo su efecto Asistiendo); un evento, desde la mano; **(Desde tu mano)** funciona desde la mano.
- **Velocidad:** los efectos Normal de los exploradores son Lentos (solo en tu Fase Principal con la cadena vacía), salvo que el texto diga Rápido; los de los eventos tienen su velocidad impresa. Los Trigger siempre se pueden activar cuando se cumple su condición.
- **Costos:** lo que va antes de `:` se paga al activar. Si no puedes pagar, no puedes activar.
- Un efecto que no puede resolverse (objetivo inválido, búsqueda fallida) no se resuelve, pero la carta cuenta como activada.
- Una restricción es una desventaja obligatoria que se aplica en simultáneo con la acción que la reveló y no abre cadena.

### Palabras de las cartas

| Palabra | Significado |
|---|---|
| **Destruir** | Enviar un explorador del campo al cementerio. |
| **Descartar** | Enviar una carta de la mano al cementerio. |
| **Exiliar** | Quitar la carta del juego. |
| **Jugar** | Poner un explorador en el campo, activo o asistiendo. |
| **Asistir** | Poner una carta debajo de un activo como su asistente. |
| **Revelar** | Mostrar una carta (queda boca arriba). |
| **Agregar** | Poner una ficha en el campo. |
| **Elegir** | Elegir un objetivo al activar. |
| **Buscar** | Mecánica de búsqueda en el mazo (sección 11). |
| **Atracción** | Obliga a elegir como objetivo a ciertas cartas. |
| **Infligir daño** | Poner marcadores de daño sobre un explorador. |
| **Curar** | Quitar marcadores de daño. |
| **Sobrevive con X** | Evita la destrucción por daño: al explorador le quedan X de PODER restante. |
| **Activa como `<nombre>`** | Para la regla de una vez por turno, la carta cuenta con ese nombre. |
| **Anular / Negar** | Un ataque anulado termina; la activación negada no se resuelve pero sí cuenta. |

## 8. Cadenas

Una **cadena** es la lista de efectos que se activan antes de resolverse. Resumen (el detalle está en el [demo 1](../demoTCG/ruleguides.md#8-cadenas)):

1. **Cualquier acción abre una cadena**: jugar, atacar, activar, cambiar de fase, robar, descartar.
2. **Paso de triggers:** primero el jugador de turno puede activar cualquier cantidad de triggers cuya condición se cumple; después el otro jugador. Si hubo triggers, se repite el paso.
3. Cuando una ronda no trae triggers nuevos, el jugador de turno puede activar **un efecto rápido**, luego el otro jugador. Cada efecto rápido vuelve al paso 2.
4. Cuando ninguno activa nada, la cadena se **resuelve al revés**. Después empieza una cadena nueva en la que solo se activan los triggers reactivos a lo que se resolvió.

Los efectos Lentos solo se activan con la cadena vacía.

## 9. Triggers

Un trigger es **"Si [condición]: efecto"**. La condición tiene alcance (global, propio o dirigido), tempo (preventivo "fuera a ser…" o reactivo "es…") y acción (modificar el tablero, acción de jugador o cambio de fase). Los preventivos pueden reemplazar el resultado; los reactivos ocurren después.

## 10. Restricciones

Poco comunes, libres y siempre **proporcionales**: cuanto más grave, más fuerte la carta. Ejemplos del demo: "se termina tu turno", "descarta 1 carta", "no puedes declarar ataques este turno", "esta carta no puede declarar ataques", "destruye 1 explorador tuyo". Una restricción no bloquea el efecto de su propia carta.

## 11. Buscar cartas

Buscar es **la mecánica de toda búsqueda**: las cartas solo dicen "Busca 1 [criterio]".

1. Al activar, anuncias el criterio y revelas **una o más** cartas válidas del mazo. Si no hay ninguna, la búsqueda **falla**.
2. **Una sola** revelada: búsqueda **pública**. **Más de una**: búsqueda **secreta** (eliges cuál sin decirlo y el resto vuelve al mazo).
3. El efecto de buscar se agrega a la cadena. Al resolverse, la carta va a tu mano (salvo que el texto diga otra cosa) y se baraja.
4. **Fallo:** no se paga costo ni se abre cadena, sí gasta el uso del turno, y no puedes reintentar con el mismo criterio hasta que algo habilitante vuelva al mazo.

## 12. Resumen rápido

- Gana quien **empiece su turno con 1000 de PODER** en exploradores activos. No hay puntos de vida.
- Mazo de **50**, máximo **3** copias por nombre. Mano máxima **7**. **6** zonas de explorador.
- El combate es **en una dirección**: el atacante pone daño igual a su PODER, el defensor no responde. El explorador se destruye cuando su daño **iguala o supera** su PODER.
- Los asistentes no suman al objetivo, pero reciben el daño si eliges defender CON asistencia.
- Ganar o perder PODER es **permanente** salvo "este turno".
- Todo efecto es **una vez por turno por nombre**.
- Todo puede disparar una **cadena**.

---

## Decisiones confirmadas

- **Objetivo: 1000 de PODER total al comienzo de tu turno.** Sin puntos de vida.
- **Combate estilo Pokémon:** un solo sentido, el daño se suma hasta igualar o superar el PODER.
- **No hay "destruido en combate":** lo que distingue un combate es el daño. Las cartas que protegen usan **Sobrevive con X** (ver glosario) y las que castigan hablan de **daño**.
- **Mismo mundo y dimensiones que el demo 1**, reescritos para el nuevo objetivo.
- **PODER de 50 en 50**, sin cartas de 50 salvo efectos muy buenos.
- **Mazo de 50:** 38 de la dimensión + 12 neutrales.
- **Restricciones poco comunes.**
- **Interacción con efecto secundario:** toda carta que interrumpe trae además otro efecto.

## Decisiones por probar 🧪

1. **El daño no reduce el PODER total.** Alternativa: que el PODER contado sea PODER − daño.
2. **Se destruye con daño igual o mayor.** Si los combates matan demasiado rápido, pasar a "estrictamente mayor".
3. **El daño es igual al PODER del atacante.** Alternativa: la mitad, para que los combates sean más lentos.
4. **6 zonas y objetivo 1000.** Si el juego dura muy poco, subir a 1200; si no termina nunca, bajar a 900.
5. **Los asistentes no suman.** Alternativa: que sumen a mitad de valor.
6. **PODER permanente por defecto.** Si los mazos crecen demasiado rápido, hacer que los bonos pierdan fuerza o que "este turno" sea la norma en eventos.
7. **Sin mulligan, mano inicial de 5.**
8. **Primer jugador sin Fase de Batalla** en su primer turno.
9. **Un asistente por explorador.**
10. **Atracción solo restringe al oponente** y solo al elegir objetivos.
