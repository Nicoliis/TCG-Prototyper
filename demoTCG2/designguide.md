# Colapso (modo tablero): guía de diseño

Para quien diseñe cartas nuevas (o quiera entender por qué las actuales son así). Las reglas de juego están en [ruleguides.md](ruleguides.md) y el significado de cada palabra en [glosario.md](glosario.md). El demo 1 ([Colapso, modo vida](../demoTCG/designguide.md)) comparte mundo, motor de cadenas y vocabulario; aquí solo se explica lo que cambia.

## 1. Filosofía

**El objetivo es una carrera por construir.** Ganas si empiezas tu turno con **1000 de PODER** en la primera fila, así que cada jugador tiene dos trabajos a la vez: **llegar a 1000** y **evitar que el otro llegue**. El oponente tiene un turno completo entre que llegas y ganas, y esa ventana es donde pasa el juego.

Principios:

1. **Cada mazo es una forma distinta de llegar a 1000.** El objetivo permite estilos muy diferentes y cada dimensión encarna uno (sección 2).
2. **Las cartas se juegan una después de otra.** Cada carta debe abrir la puerta a la siguiente (busca, juega, destruye, reemplaza) para que el mazo sea una **secuencia** y no una pila de cartas sueltas. Dominar el orden es dominar el mazo.
3. **Toda interacción trae un efecto secundario.** Las cartas que anulan, devuelven, destruyen o niegan siempre hacen **algo más** (agregan un token, roban, llenan el cementerio, curan). Así nunca están muertas en la mano y no se sienten como un "no" puro.
4. **El PODER es permanente, y cada punto cuenta.** El PODER de un explorador es siempre *PODER total − daño*: los bonos duran (marcadores de PODER agregado) y el daño le resta al tablero del rival. **Solo existen tres efectos sobre el PODER: potenciar, infligir daño y curar.** Perder PODER es recibir daño; no hay bonos ni pérdidas "este turno".
5. **Las restricciones son poco comunes.** El costo de una carta fuerte suele estar en su efecto, en la cadena o en lo que hay que sacrificar, no en una restricción. Cuando hay una, es una decisión.
6. **Las dos filas y las dos posiciones son la mecánica distintiva.** La primera fila suma y ataca; las barracas guardan los combos, las trampas y los cuerpos en espera. Las cartas **no se apilan**, y la posición elegida al entrar **no cambia**.
7. **En guardia es el efecto fuerte; Asistiendo es el combo.** Lo primero se gana con un lugar en la primera fila; lo segundo se paga con cartas.
8. **Casi no hay "NO".** Las negaciones son pocas y caras (Reina de Ragnatica, Grieta).
9. **Una vez por turno, por nombre.** Sumar copias no multiplica el efecto.

## 2. Estilos de juego

| Estilo | Cómo llega a 1000 | Cómo frena | Dimensión |
|---|---|---|---|
| **Inundar** | Muchos tokens baratos con bonos | Cada interrupción agrega más tokens | Ragnatica |
| **Arrasar y reconstruir** | Pocos cuerpos enormes tras borrar el tablero | Destruye lo que el otro armó | Ugabuga |
| **Ascenso constante** | Puntos "fiables" que crecen solos | Atracción: todo el daño va a un solo lugar | Baluarte |
| **Cementerio** | Cuerpos que crecen con las cartas del cementerio | Trampas de las barracas | Fantaspet |
| **Bajo PODER, mucha interrupción** | Ganar tiempo hasta tener el tablero | Anular, devolver, reemplazar | Cartas neutrales y trampas de las barracas |

Un mazo nuevo debería poder describirse como una fila de esta tabla. Cada estilo tiene una **debilidad concreta** que otro estilo puede explotar:

| Estilo | Le gana | Pierde contra |
|---|---|---|
| Inundar | Ascenso, Cementerio (por velocidad) | Arrasar (borra los tokens) |
| Arrasar | Inundar | Ascenso (su personaje no cae) |
| Ascenso | Arrasar | Inundar (más rápido), efectos que no eligen objetivo |
| Cementerio | Ascenso (lo ahoga) | Inundar (presión), exilio |

## 3. Anatomía de una carta

### Explorador

| Campo | Contenido |
|---|---|
| Nombre | Corto. |
| Dimensión | Fantaspet, Ugabuga, Ragnatica, Baluarte, Neutral. |
| PODER base | Múltiplo de 50. **150** es el cuerpo normal. Durante la partida, PODER = base + agregado − daño. |
| Efecto | Etiquetas `**En guardia:**`, `**Asistiendo:**`, `**Normal:**` (desde la mano) y `**Trigger:**`, un efecto por línea. Continuos sin etiqueta. Máximo 3 efectos. |
| Restricción | Opcional y poco común. |

### Evento

Como un explorador, sin PODER y con **velocidad** (Rápido o Lento). Tiene dos modos: efecto Normal o efecto Trigger desde la mano. Como va al cementerio al resolverse, **eliges un modo por carta**.

### Escala de PODER

La primera fila necesita ~170 por lugar (6 lugares), así que:

| PODER | Qué es | Condición |
|---|---|---|
| 50-100 | Soporte | Solo con un efecto muy bueno (Dragging 50: trampa que destruye al atacante; Lance-elot 100: +100 permanente a cambio de destruirse). |
| 150 | Cuerpo normal | Efectos flojos o de apoyo. |
| 200 | Cuerpo sólido | Un efecto útil. |
| 250-300 | Pieza | Un costo real: sacrificio (Monstaa), cementerio, restricción. |

Regla de oro: **una carta de 50 o 100 debe valer lo que le falta**. Cuantos más cuerpos de 100 haya en un mazo, más bonos necesita para llegar a 1000.

## 4. Roles de las cartas

| Rol | Qué hace | Cómo se reconoce |
|---|---|---|
| **Starter** | Abre la secuencia. | Busca, roba o agrega recursos desde casi nada. |
| **Extender** | Continúa la secuencia si fue interrumpida. | Recupera, reemplaza o juega desde la mano en respuesta. |
| **Pieza** | Lo que queda en el tablero; aporta mucho PODER o lo multiplica. | PODER alto o bonos continuos. |
| **Interrupción** | Frena al oponente **y trae un efecto secundario**. | Anula, devuelve, destruye, resta PODER. |

| Mazo | Starters | Extenders | Piezas | Interrupciones |
|---|---|---|---|---|
| Fantaspet | 10 | 19 | 11 | 10 |
| Ugabuga | 10 | 15 | 13 | 12 |
| Ragnatica | 16 | 10 | 4 | 20 |
| Baluarte | 19 | 15 | 6 | 10 |

Ragnatica tiene muchos starters e interrupciones porque casi todos los tokens se agregan "gratis"; Ugabuga tiene muchas piezas porque su plan es llegar con cuerpos enormes. Las desviaciones de los mazos iniciales son a propósito.

## 5. La secuencia como regla de diseño

Antes de agregar una carta, escribe la secuencia donde participa:

1. ¿Qué carta la **abre**? (o ella abre algo)
2. ¿Qué abre **ella**? (otra carta, un trigger, una búsqueda)
3. ¿Qué pasa si **la interrumpen** a mitad?

Las cartas que no abren ni continúan nada son excepciones y deberían ser **cuerpos resistentes** (Balanced 200, que solo sobrevive con 50) o **interrupciones**.

Cada mazo documenta su secuencia en [decks.md](decks.md): una lista de 4-5 pasos y una línea de ejemplo con los números.

## 6. Interacción con efecto secundario

Una interrupción tiene dos partes: el **efecto principal** (frenar) y el **efecto secundario** (valor). Diseñarlas en pareja:

| Carta | Principal | Secundario |
|---|---|---|
| Viuda Gris | Anula un ataque (se destruye) | Agrega un token Cría |
| Capullo Silente | Devuelve al atacante a su mano (se destruye) | Agrega un token Cría |
| Dragging | Destruye al atacante (descartando 1 carta) | Se destruye (llena el cementerio) |
| Retirada Táctica | Devuelve a tu mano y termina el ataque | Roba 1 carta |
| Grieta | Niega una búsqueda | Roba 1 carta |
| Derrumbe | Destruye todo con PODER ≤ 200 | Roba por cada Ugabuga destruido |
| Cerrad filas | +50 PODER permanente | Cura todo el daño |

Pautas:

- El efecto secundario debe ser **relevante para el mazo** (tokens en Ragnatica, cementerio en Fantaspet), no un "roba 1 carta" genérico.
- Si el secundario es demasiado bueno, la carta se juega aunque no haga falta frenar. Eso es aceptable **si** el principal sigue siendo su razón de ser.
- Una interrupción sin secundario debería ser **muy barata** (Presencia en Eterneblina) o **muy específica**.

## 7. Daño y supervivencia

El combate es en un solo sentido y el daño se acumula, así que **no existe "destruido en combate"**: lo que cuenta es el **daño**. Las cartas hablan de daño y de supervivencia, no de combates. Como el daño le resta PODER al tablero, **curar vale tanto como sumar** y **atacar sirve aunque no destruya**:

| Para… | Se escribe | Ejemplo |
|---|---|---|
| Proteger un explorador | **Sobrevive con X** (trigger preventivo: "Si esta carta fuera a ser destruida por daño: sobrevive con X") | Balanced, Espectro Guardián, Torre Viva, Presencia en Eterneblina |
| Castigar a quien destruye | "Si esta carta es destruida: …" (no importa cómo) | Pedrusco |
| Premiar al atacante | "Si el daño de esta carta destruye un explorador: …" | Cazador Ugabu |
| Curar | **Cura X de daño** | Torre Viva, Botiquín del Colapso, Cerrad filas |

Pautas para **Sobrevive con X**:

- X es el **PODER que le queda** al explorador: 50 es una vida de seguridad, 100 es mucha. Más de 100 casi nunca.
- Es un **trigger preventivo** (cuenta para una vez por turno por nombre y se puede responder), así que protege **una vez por turno**, no siempre.
- Va bien en cuerpos **sólidos** (200-250) y en eventos de protección; en cuerpos de 50-100 vale poco.
- Solo detiene **daño**. Los efectos de destruir siguen funcionando, así que mantienen su papel de respuesta.

### Cuánto potenciar, dañar y curar

Como todo es permanente y el daño baja el tablero, las cantidades se miden en marcadores (50 cada uno):

| Efecto | Referencia | Notas |
|---|---|---|
| **Potenciar** | **+50** es una ayuda; **+100** es una carta entera de valor | Un evento que potencia +100 debe tener algo más; un cuerpo que se potencia a sí mismo, un máximo (Aegis, +200). |
| **Infligir daño** (efecto) | **50** en una trampa o cuerpo barato; **100-200** en un evento | Es daño real: baja el tablero del rival y debilita al atacante. |
| **Curar** | **100** al comienzo del turno (Torre Viva) o **todo** en un evento | Curar es potenciar: cuanto más daño haya en juego, más vale. |

## 8. Restricciones (poco comunes)

Libres, obligatorias y simultáneas con la acción que las revela (**al entrar a primera fila** o **después de activar**). Solo **10 de las 63 cartas** las llevan. Se reservan para:

- **Piezas de 250-300** (Monstaa destruye uno de tus exploradores al entrar, Aegis termina tu turno).
- **Cartas con un efecto muy fuerte de borrado** (Colapso de la meseta termina tu turno; Derrumbe te impide atacar).
- **Cartas neutrales muy rápidas** (Mercenario del Colapso entra desde la mano sin gastar la jugada, pero no puedes activar más efectos este turno).

Pautas:

- **No bloquees el efecto de la propia carta.** Si el efecto es útil recién el turno siguiente, está bien.
- Las restricciones **permanentes** ("Esta carta no puede declarar ataques", "recibe el doble de daño") pesan más que las del turno: máximo una por carta.
- Una restricción distinta le da personalidad. Antes de repetir "no puedes jugar más exploradores", pregúntate si hay otra que cuente mejor qué cuesta la carta.

## 9. Primera fila, barracas y posiciones

El tablero tiene **dos filas** y cada carta elige una **posición** al entrar. Esa decisión es el corazón del diseño:

| Posición | Dónde | Qué ofrece | Qué cuesta |
|---|---|---|---|
| **En guardia, primera fila** | 6 lugares | **Suma al 1000**, ataca, activa el efecto **En guardia** (el más fuerte) | Una sola carta por turno de la mano, más la promoción |
| **En guardia, barracas** | 6 lugares | Espera, boca abajo o arriba, su **promoción** | No suma ni hace nada hasta ser promovida |
| **Asistiendo, barracas** | 6 lugares | Activa el efecto **Asistiendo** (combos y trampas) | No suma ni ataca, y **no se puede mover** a la primera fila |

Una misma carta puede tener un efecto En guardia y uno Asistiendo (Telarín, Talkatak): el jugador **elige para qué la usa** al jugarla, y no puede volver atrás.

### Efectos En guardia (los fuertes)

- Son **siempre Lentos** y solo funcionan desde la **primera fila**: hay que ganarse el lugar.
- Son el **pago** de tener la carta en la fila: agregan tokens, buscan, curan, potencian.
- Si el efecto es muy bueno, se acompaña de un costo (descartar, destruir una carta de las barracas).

### Efectos Asistiendo (los de combo)

Sirven para **empezar y extender** combos. Reglas de diseño:

1. **Requieren mover cartas.** El costo es el límite: **destruir esta carta y otra**, **descartar una carta**, **devolver esta y otra a la mano**. Un efecto Asistiendo sin costo está mal diseñado.
2. **Mueven cartas, no suman PODER.** Buscan, recuperan, juegan o agregan tokens; no sustituyen a los cuerpos de la primera fila.
3. **Pueden ser trampas.** Un **Trigger (Asistiendo)** responde a un ataque desde las barracas, boca abajo. Casi siempre se destruye al activarse.

| Familia | Qué hace | Ejemplos |
|---|---|---|
| **Combo** | Busca, recupera o juega pagando con cartas | Plumifer, Ugalito, Hilandera, Archivista, Centinela, Gooboy, Talkatak |
| **Trampa** | Responde a un ataque, boca abajo, y suele destruirse | Dragging, Koalma, Viuda Gris, Capullo Silente, Alabardero |
| **Refuerzo** | Se sacrifica para potenciar | Lance-elot (+100 permanente), Armero (+50 al caer) |
| **Generador** | Agrega tokens o cuerpos | Nido Vivo, Telarín, Boolly |

### Cuerpos en espera

Los cuerpos grandes (250-300) viven **boca abajo y en guardia en las barracas** hasta la promoción: Triturador entra con su efecto "al entrar a primera fila" y sorprende. La promoción es la ventana donde se arma el tablero que hay que romper en el turno del oponente.

### Atracción

**Atracción de ataques / efectos:** obliga al oponente a elegir como objetivo a las cartas con ella (solo en la primera fila). Úsala como **punto focal** ("todo va contra Aegis") y acompáñala siempre de una desventaja o una debilidad (ignora lo que no elige objetivo; Van-guard recibe el doble de daño y no ataca).

### Límites compartidos: "Activa como…"

Cuando varias cartas distintas comparten un límite, **no se escribe el límite en cada carta**: se usa **(Activa como `<nombre>`)** y el detalle va al glosario. Es una indicación corta que reutiliza la regla de una vez por turno por nombre. Los Escuderos de Baluarte son el modelo.

## 10. Negaciones y búsqueda

Dos negaciones en todo el juego, ambas con efecto secundario:

- **Grieta en emergente Valle Mudo** (neutral): niega solo efectos que **buscan**; roba 1 carta.
- **Reina de Ragnatica**: niega solo efectos de explorador que **eligen a una carta tuya**; agrega un token Cría.

La búsqueda es una **mecánica** (ver [glosario del demo 1](../demoTCG/glosario.md#buscar)): las cartas solo dicen "Busca 1 [criterio]". Un criterio debe poder **fallar**, y un fallo consume el uso del turno.

### Búsquedas estrechas

**Nunca "busca 1 de este arquetipo".** El criterio debe ser **específico**, para que haga falta **saltar por varios aros** y encadenar cartas hasta la pieza deseada. Los criterios del demo:

| Criterio | Ejemplos |
|---|---|
| PODER exacto o tope | "Fantaspet con PODER 100 o menos", "Ugabuga con PODER 150", "Ugabuga con PODER 250 o más" |
| Tipo de efecto | "con efecto Asistiendo", "evento Ragnatica Lento" |
| Relación con otra carta | "con el mismo PODER y distinto nombre" que una carta de tu mano (se revela como costo) |
| Dos criterios a la vez | "Baluarte con PODER 150 o menos y efecto Asistiendo" |

Cada búsqueda lleva a un **subconjunto de 3-5 cartas**, y la carta encontrada abre la siguiente. Así el mazo se juega como una cadena de pasos, y una búsqueda interrumpida o fallida corta la secuencia.

## 11. Escribir el texto de una carta

### Plantillas

```
Normal:       **Normal:** [Costo:] Efecto.                        (eventos, o "(Desde tu mano)")
En guardia:   **En guardia:** [Costo:] Efecto.                    (siempre Lento, desde la primera fila)
Asistiendo:   **Asistiendo:** Costo: Efecto.                      (costo que mueve cartas)
Trigger:      **Trigger:** Si [condición][, costo]: Efecto.       (primera fila)
Trampa:       **Trigger:** (Asistiendo) Si [condición][, costo]: Efecto.
Desde la mano:  **Trigger:** (Desde tu mano) Si [condición]: Efecto.
Continuo:     Texto sin etiqueta: Tiene +N PODER por cada…; Mientras [condición], [efecto].
Comienzo:     **Trigger:** Al comienzo de tu turno: Efecto.
Restricción:  Al entrar a primera fila> [Si es tu turno:] consecuencia.
```

**Cada efecto va en su propia línea.** Usa **negrita** con `**…**`.

### Presupuesto de texto

El texto tiene que **caber en la caja sin achicarse**:

| Tipo de carta | Caja de efecto | Máximo |
|---|---|---|
| Con restricción | 230 × 116 | 3 efectos, ~45 palabras |
| Sin restricción | 230 × 146 | 3 efectos, ~55 palabras |

Para recortar: usa las convenciones de lectura; un efecto, una condición, una acción; un límite compartido con **(Activa como …)**; si aun así no entra, pásalo a otra carta. El script que genera las cartas falla si una carta no entra.

### Vocabulario cerrado

**destruir**, **descartar**, **exiliar**, **jugar** (y **jugar asistiendo**), **revelar**, **agregar** (token), **elegir**, **buscar**, **devolver a la mano**, **anular** (ataque), **negar** (efecto), **Atracción**, **Activa como**, **ganar PODER** (potenciar), **infligir daño**, **curar**, **sobrevive con X**, **primera fila**, **barracas**, **en guardia**, **asistiendo**, **entra a primera fila**. No uses sinónimos, y no escribas "destruido en combate".

### Lista de revisión para una carta nueva

1. ¿Qué **secuencia** abre o continúa? ¿Qué pasa si la interrumpen?
2. Si es una interrupción: ¿tiene un **efecto secundario** relevante para su mazo?
3. ¿Su PODER y su costo valen para llegar a 1000? Una carta de 100 necesita un efecto muy bueno.
4. ¿El efecto sobre el PODER es potenciar, daño o curar? (No existe perder PODER ni bonos temporales.)
5. ¿Es un efecto **En guardia** (fuerte, desde la primera fila) o **Asistiendo** (combo, con un costo que mueve cartas)?
6. Si tiene restricción: ¿es realmente necesaria? ¿No bloquea su efecto?
7. Si busca: ¿el criterio es **estrecho** (3-5 cartas) y puede **fallar**?
8. ¿Usa el vocabulario cerrado y **entra en la caja**?

## 12. Pool neutral y estructura de un mazo

- Un mazo de 50 = **38 cartas de dimensión** (13 o 14 nombres, 2-3 copias) + **12 neutrales** (6 nombres, 2 copias).
- El pool neutral ofrece robo y filtro (**Cartógrafo Errante**, **Brújula Rota**), escape con valor (**Retirada Táctica**), curación (**Botiquín del Colapso**), un cuerpo sin dimensión (**Mercenario del Colapso**) y la **Grieta** como anti-búsqueda.
- Una dimensión nueva necesita: un estilo de la tabla de la sección 2, una secuencia de 4-5 pasos, 9 exploradores y 5 eventos, y una debilidad concreta.

## 13. Diseño visual

Cuatro tipos de carta, igual que en el demo 1: *Explorador*, *Explorador (con restricción)*, *Evento* y *Evento (con restricción)*, tamaño 240 × 336. Los tipos con restricción llevan la banda rosada; los demás no la tienen y dan más altura al efecto (146 en vez de 116). Códigos: `EXP`, `EXR`, `EVT`, `EVR`.

Como las restricciones son poco comunes, **la mayoría de las cartas usan los tipos sin restricción**. El texto de los campos usa los ajustes **Line height** y **Line gap** para separar los efectos.
