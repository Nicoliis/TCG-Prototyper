# Colapso: guía de diseño

Para quien diseñe cartas nuevas (o quiera entender por qué las actuales son así). Las reglas de juego están en [ruleguides.md](ruleguides.md) y el significado de cada palabra de las cartas en [glosario.md](glosario.md).

## 1. Filosofía

**El juego busca interacción antes que velocidad.** Cada turno deberías poder armar un *tablero*: exploradores con triggers que castigan ciertas jugadas. El otro jugador intenta jugar a través de esas condiciones para *romper el tablero*, y después le toca armar el suyo.

Principios que salen de ahí:

1. **Más barrera de entrada, más diversión.** El juego va a ser complejo en interacciones y cartas. Es mejor tener un juego profundo que alguien quiera aprender que uno simple que nadie quiera jugar.
2. **Pocos efectos por carta.** Un efecto **Normal** (lo activas tú) y/o un efecto **Trigger** (reacciona). Una carta puede tener uno solo; las más sencillas suelen tener uno. Los exploradores que sirven de asistente pueden sumar un efecto **Asistiendo**.
3. **El poder se paga con restricciones.** Las cartas más fuertes cargan con una restricción (sección 4). Cuanto más grave, más fuerte puede ser la carta.
4. **Los asistentes son la mecánica distintiva.** Un explorador activo puede sostener a otro debajo, oculto, y al ser atacado el defensor elige si pelea CON o SIN esa ayuda. Casi todas las dimensiones deberían tener algo que juegue con esto (sección 5).
5. **Casi no hay "NO".** Las negaciones son mínimas y carísimas. Se interrumpe quitando recursos u objetivos, no frenando todo (sección 6).
6. **Una vez por turno, por nombre.** Cada efecto se activa una vez por turno por nombre de carta, así que sumar copias no multiplica el efecto.

## 2. Anatomía de una carta

### Explorador

| Campo | Contenido |
|---|---|
| Nombre | Corto, sin artículos largos. |
| Dimensión | Fantaspet, Ugabuga, Ragnatica, Baluarte, Neutral… |
| PODER | Un único valor, múltiplo de 10. Carta normalita: **150**. |
| Efecto | Etiquetas `**Normal:**`, `**Trigger:**`, `**Asistiendo:**`, **un efecto por línea**. Los efectos continuos van sin etiqueta. Máximo 3 efectos y el texto debe caber en la caja (ver *Presupuesto de texto*, sección 7). |
| Restricción | Opcional. Libre (sección 4). Una carta con restricción usa el tipo *Explorador (con restricción)*; una sin ella, el tipo *Explorador*. |
| ID | Se calcula solo en la app (`EXP-n`). |

### Evento

Igual que un explorador, sin PODER y con una **velocidad** (Rápido o Lento). Un evento tiene dos modos: su efecto **Normal** (lo activas cuando quieras, según la velocidad) o su efecto **Trigger** (lo activas desde la mano cuando se cumple su condición). Como el evento va al cementerio al resolverse, **eliges un modo por carta**.

### Escala de PODER

Con 800 de vida y daño 1 a 1:

| PODER | Qué es |
|---|---|
| 0-100 | Soporte, token o asistente-trampa. |
| 120-160 | Cuerpo normal. 150 es la carta de referencia sin restricción y con efectos flojos. |
| 180-200 | Buen cuerpo; casi siempre con un costo (restricción o efecto que lo castiga). |
| 250 | Pieza. Tres o cuatro golpes y casi terminas, pero entra con una restricción grave. |

Un PODER **muy bajo** no es una carta mala: es una carta pensada para ser **asistente** (Dragging 20, Capullo Silente 0, Lance-elot 30) o para usar su efecto, no para pelear.

## 3. Roles de las cartas

Cada carta debería poder responder "¿para qué la juego?". Las cuatro respuestas válidas:

| Rol | Qué hace | Cómo se reconoce |
|---|---|---|
| **Starter** | Abre el combo. La mejor opción para empezar. | Busca, roba o agrega recursos desde casi nada. |
| **Extender** | Completa el combo si fue interrumpido. | Recupera, reemplaza o juega desde la mano en respuesta a una destrucción. |
| **Pieza** (*end-board*) | El objetivo a alcanzar. Lo que queda en el tablero. | PODER alto o triggers fuertes. Casi siempre con restricción. |
| **Interrupción** | Frena al oponente sin decir "no". | Devuelve a la mano, quita un objetivo, resta PODER, descarta. |

Referencia para un mazo de 30 cartas: **25-35% starters, 20-40% extenders, 5-15% piezas, 15-30% interrupciones**. Las piezas son pocas porque son caras de jugar. Las desviaciones de los mazos iniciales son a propósito.

| Mazo | Starters | Extenders | Piezas | Interrupciones |
|---|---|---|---|---|
| Fantaspet | 7 | 12 | 5 | 6 |
| Ugabuga | 7 | 7 | 9 | 7 |
| Ragnatica | 11 | 5 | 3 | 11 |
| Baluarte | 16 | 5 | 2 | 7 |

Ugabuga es agresivo (muchas piezas). Baluarte cuenta a los escuderos como starters porque cada uno juega a Aegis: es la fuerza y la debilidad del mazo.

## 4. Restricciones

Una restricción es una **desventaja obligatoria** que se aplica en simultáneo con la acción que la reveló. **No hay restricciones estándar ni niveles**: las restricciones son más interesantes si son variadas. Cuanto más grave, más puede dar la carta.

### Formato

- Explorador: "**Después de entrar al campo>** [condición:] consecuencia".
- Explorador, en otro momento: "**Después de combatir>** …".
- Evento: "**Después de activar>** …" (vale para el efecto Normal y para el Trigger).
- Permanente: una frase sin momento ("Esta carta no puede declarar ataques").

### Catálogo de ideas (no es una lista cerrada)

| Familia | Ejemplos |
|---|---|
| Cierra tu turno | "Se termina tu turno." "No puedes declarar ataques este turno." |
| Cierra tus jugadas | "No puedes jugar más exploradores este turno." "No puedes activar más efectos este turno." |
| Cuesta recursos | "Descarta 1 carta." "Pierdes 50 puntos de vida." |
| Cuesta tablero | "Destruye el asistente de esta carta. Si no puedes, destruye esta carta." |
| Limita a la carta | "No puede declarar ataques." "No puede tener asistentes." "Mientras combate, su PODER pasa a ser 0." |
| Limita al mazo | "Solo puedes controlar 1 copia de esta carta." |

### Reglas de uso

- **Una restricción no debe bloquear a su propia carta.** Un explorador con restricción no puede tener un efecto al entrar que la viole. Si el efecto es útil recién al turno siguiente, está bien. Los efectos que se activan **desde la mano** ocurren antes de entrar, así que no se ven afectados.
- Los tokens no son "jugadas", así que "no jugar más exploradores" no las toca. Esa excepción es la ventaja de Ragnatica; no la rompas con restricciones que digan "agregar".
- Las **restricciones permanentes** ("Esta carta no puede declarar ataques") pesan más que las del turno, por lo que si son severas, la carta debería ganar sola. Usa máximo una por carta.
- Una restricción distinta le da **personalidad** a una carta. Antes de repetir "no puedes jugar más exploradores", pregúntate si hay otra que cuente mejor qué cuesta esa carta.

## 5. Asistentes y Atracción

### Diseñar con asistentes

El asistente es un explorador debajo de otro. Al ser atacado el activo, el asistente se **revela** y el defensor elige defender **CON** o **SIN** asistencia. Eso crea decisiones que ninguna otra mecánica da.

Familias de cartas con asistencia:

| Familia | Qué hace | Ejemplos |
|---|---|---|
| **Escudo** | Se sacrifica o recibe el golpe en lugar del activo. | Gooboy (se destruye en su lugar), Aegis (destruye al asistente en vez de a sí mismo). |
| **Trampa** | Se revela al ser atacado y castiga al atacante. | Dragging (destruye a los no Fantaspet del combate), Capullo Silente (devuelve al atacante a la mano), Koalma (resta PODER). |
| **Refuerzo** | Suma PODER al activo. | Lance-elot, Cattrix. |
| **Combustible** | Un recurso que otra carta quiere gastar. | Monstaa (debe destruir a su asistente después de combatir). |
| **Generador** | Pone asistentes (de la mano, del mazo o del cementerio). | Cesarmill, Boolly, Talkatak, Centinela, Reconstrucción. |

Pautas:

- Un asistente **boca abajo** debe ser una amenaza creíble: si el defensor siempre sabe qué hay, no hay decisión.
- El **PODER de un asistente** importa porque se compara contra el atacante cuando se defiende CON asistencia. Un asistente de PODER alto es un buen escudo; uno de PODER bajo debería tener un buen efecto.
- Las cartas con efecto **Asistiendo** solo funcionan mientras asisten. Si quieres que además funcionen fuera, dales un efecto Normal o Trigger aparte (y recuerda que no funcionan mientras asisten).
- Cada dimensión nueva debería tener al menos una carta de cada una de dos o tres familias.

### Límites compartidos: "Activa como…"

Cuando varias cartas distintas comparten un límite, **no se escribe el límite en cada carta**: se usa la indicación **(Activa como `<nombre>`)** y el detalle va al glosario. Para la regla de una vez por turno por nombre, todas esas cartas cuentan como una sola. Es una indicación corta (tres palabras) que no inventa una regla nueva: reutiliza la que ya existe.

Los cinco Escuderos de Baluarte son el modelo: cada uno tiene un efecto extra, deliberadamente flojo, que se activa **como Escudero**. Como la mitad del valor está en poder repetirlo con muchas cartas distintas, el límite compartido ("uno por turno, sea cual sea el Escudero") lo mantiene a raya, y no hace falta subir su costo. La **Atracción** funciona igual: una frase corta en la carta y el detalle en el glosario.

### Diseñar con Atracción

Atracción obliga al oponente a elegir como objetivo (de ataques, de efectos, o ambos) a las cartas que la tienen. Es un efecto continuo muy fuerte, y casi siempre va acompañado de:

- una **desventaja** (Van-guard y Señuelo no pueden atacar; Van-guard además tiene 0 PODER al combatir; Aegis termina el turno al entrar y es única), o
- una **debilidad evidente**: ignora los efectos que no eligen objetivo.

Úsala para dar al jugador un **punto focal**: "todo el mundo ataca a esa carta". Después, rodéala de cosas que castiguen a quien lo haga (un asistente-trampa debajo, un trigger que reacciona al ataque).

## 6. Negaciones y búsqueda

### Negaciones

Mantenerlas al mínimo. Hoy hay **dos** en todo el juego:

- **Grieta en emergente Valle Mudo** (neutral): niega solo efectos que **buscan en el mazo**. Cuesta descartar una carta y destruir uno de tus exploradores.
- **Reina de Ragnatica**: niega solo efectos de explorador que **eligen a una carta tuya**. Cuesta una carta de tu mano y un token cada vez, y viene con una restricción grave (termina tu turno).

Si diseñas una tercera, debería ser **muy específica** (un tipo de efecto concreto) o **muy cara** (dos recursos distintos y una restricción).

### Búsquedas

La búsqueda es una **mecánica** (ver [glosario.md](glosario.md#buscar)), no una palabra clave de unas cartas: las cartas solo dicen "Busca 1 [criterio]".

- Revelar **una sola** carta es una búsqueda pública (barata en información); revelar **varias** es secreta.
- Un criterio de búsqueda debe poder **fallar**. Un "busca cualquier carta" nunca falla y no tiene riesgo; un criterio estrecho (por ejemplo "Fantaspet con PODER 120 o menos") es más fácil de ver y de fallar.
- Un fallo de búsqueda consume el uso del turno: diseña búsquedas pensando en que a veces fallan.

## 7. Escribir el texto de una carta

### Plantillas

```
Normal:       **Normal:** [Costo:] Efecto.
Trigger:      **Trigger:** Si [condición][, costo]: Efecto.
Asistiendo:   **Asistiendo:** Si [condición]: Efecto.    (o un efecto continuo)
Desde la mano:  **Normal:** (Desde tu mano) [Costo:] Efecto.
Continuo:     Texto sin etiqueta: Mientras [condición], [efecto].
Restricción:  Después de entrar al campo> [Si es tu turno:] consecuencia.
```

El texto de la carta usa **negrita** con `**…**` (la app la interpreta en la carta). **Cada efecto va en su propia línea** dentro de la misma celda (en la app, el campo de texto separa las líneas con el ajuste *Line gap*).

### Presupuesto de texto

Las cartas son pequeñas y el texto tiene que **caber en la caja sin achicarse**. Es una regla de diseño, no un parche visual: si una carta no entra, se recorta el texto, no la letra.

| Tipo de carta | Caja de efecto | Líneas aprox. | Máximo |
|---|---|---|---|
| Con restricción | 230 × 116 | 8 | 3 efectos, ~45 palabras |
| Sin restricción | 230 × 146 | 10 | 3 efectos, ~55 palabras |

Reglas para recortar, en este orden:

1. **Usa las convenciones de lectura** (glosario): "explorador" es activo, las cartas son tuyas por defecto, PODER dura hasta el final del turno, asistir es boca abajo, en Asistiendo "el explorador" es el asistido. No las repitas.
2. **Un efecto, una condición, una acción.** Si necesitas "y luego" dos veces, son dos cartas.
3. **Un límite compartido** se escribe con **(Activa como …)** y no con una frase larga.
4. **Una restricción, dos líneas** como máximo.
5. Si aun así no entra, el efecto es demasiado complicado: pásalo a otra carta.

El script que genera las cartas comprueba este presupuesto y falla si una carta no entra.

### Vocabulario cerrado

Usa siempre las mismas palabras (definidas en [glosario.md](glosario.md)): **destruir**, **descartar**, **exiliar**, **jugar** (explorador), **asistir**, **revelar**, **agregar** (token), **elegir**, **buscar**, **devolver a la mano**, **anular** (ataque), **negar** (efecto), **Atracción**, **Activa como**, **ganar / perder PODER**. No uses sinónimos, y no repitas en la carta los casos borde que ya explica el glosario.

### Condiciones de trigger

Cada condición tiene tres partes: alcance (global / propio / dirigido), tempo (preventivo `fuera a ser…` / reactivo `es…`) y acción. Ejemplos válidos:

| Condición | Alcance | Tempo |
|---|---|---|
| "Si esta carta es destruida" | Propio | Reactivo |
| "Si el explorador activo fuera a ser destruido" | Dirigido (a quien asiste) | Preventivo |
| "Si el oponente juega un explorador" | Global | Reactivo |
| "Si un explorador del oponente declara un ataque" | Global | Reactivo |
| "Si Aegis se queda sin asistente" | Dirigido | Reactivo |

### Lista de revisión para una carta nueva

1. ¿Tiene un rol claro (starter, extender, pieza, interrupción)?
2. ¿Sus efectos son pocos, cada uno en su línea, y **entran en la caja** (presupuesto de texto)?
3. ¿Su restricción es proporcional a lo que da y **no bloquea su propio efecto**? ¿Es distinta de las demás o repite una por pereza?
4. ¿Qué la **frena**? Toda carta debería poder ser interrumpida: quitándole el objetivo, matándola o quedándose sin recurso.
5. Si es una búsqueda: ¿puede **fallar**?
6. Si usa asistentes: ¿hay una decisión real (CON o SIN, revelar o no)?
7. ¿Usa el vocabulario cerrado?
8. ¿El nombre sigue la convención de la sección 8?

## 8. Lore y nombres

### Mundo

El juego sucede en una dimensión en la que el **multiverso colapsa y muchas dimensiones chocan**. Los exploradores buscan recursos para sus colonias en un mundo que no tiene mucho sentido para ellos.

Que el mismo explorador aparezca varias veces y que haya alianzas raras se explica por la **irregularidad espacio-temporal** de este lugar: no es un error, es parte del mundo.

### Dimensiones

| Dimensión | Origen | Identidad |
|---|---|---|
| **Fantaspet** | Eterneblina | Mascotas espectrales. Búsqueda, recursión y asistentes ocultos. |
| **Ugabuga** | Meseta y cuevas de Ugabuga | Tribus de piedra. Fuerza bruta, sacrificios, presión. |
| **Ragnatica** | Reino de Ragnatica | Arácnidos tejedores. Tokens, señuelos y trampas. |
| **Baluarte** | Fortaleza emergente | Un personaje principal resistente sostenido por escuderos. |
| **Neutral** | El propio Colapso | Viajeros y recursos que sirven a cualquiera. |

### Nombres de eventos

Los eventos cuentan historias, pero **como referencias a las dimensiones originales y no como cosas que ya pasaron**. El lugar todavía no existe del todo; se está formando.

| Mal (cuenta lo que pasó) | Bien (el lugar está surgiendo) |
|---|---|
| Guerra por sucesión de Ragnatica | **Conflicto en emergente reino de Ragnatica** |
| La caída de Eterneblina | **Susurros en Eterneblina** |
| Banquete de la aldea Ugabuga | **Banquete inaugural de aldea Ugabuga** |

Truco: si el nombre dice "en emergente [lugar]", "en [lugar]" o describe algo que **está pasando**, sirve. Si dice algo que **ya terminó**, cámbialo.

Los exploradores llevan nombres propios cortos o apodos (Gooboy, Cesarmill, Viuda Gris). Los de una misma dimensión comparten una sensación sonora: los Fantaspet son juguetones (-y, -ill, -ak), los Ugabuga son toscos (-ito, -aa, "Ugabu"), los Ragnatica son tejedores (-ín, -era, "Telar"), los Baluarte llevan oficios de guarnición (Rodelero, Armero, Heraldo).

## 9. Pool neutral y estructura de un mazo

- Un mazo de 30 = **22 cartas de dimensión** (12 nombres distintos) + **8 neutrales** (5 nombres).
- El pool neutral ofrece: robo y filtro (**Cartógrafo Errante**, **Brújula Rota**), recuperación (**Campamento…**), escape (**Retirada Táctica**), un cuerpo sin dimensión (**Mercenario del Colapso**) y la **Grieta** como interrupción anti-búsqueda.
- Una dimensión nueva necesita: 8 exploradores, 4 eventos, un tipo de recurso propio (tokens, recursión, sacrificios, escuderos…) y una debilidad concreta que pueda explotar otro mazo.

## 10. Diseño visual

Las cartas de la app (proyecto `colapso.json`) siguen este esquema, tamaño 240 × 336. Hay **cuatro tipos de carta**: *Explorador*, *Explorador (con restricción)*, *Evento* y *Evento (con restricción)*. Los de "con restricción" llevan la banda de restricción; los otros no la tienen y dan más altura a la caja de efecto (146 en lugar de 116).

| Zona | Explorador | Evento |
|---|---|---|
| Color del marco | Marrón cobre `#a8641c`, nombre sobre `#f3d9b1` | Verde azulado `#1c7f86`, nombre sobre `#bfe6e8` |
| Franja superior | Nombre (negrita, se comprime) | Nombre (negrita, se comprime) |
| Subtítulo | Dimensión · `EXPLORADOR` | Dimensión · `EVENTO · velocidad` |
| Arte | Recuadro de 230 × 118 (hasta tener ilustraciones) | Igual |
| Estadísticas | `PODER` (rojo claro) sobre el arte | No tiene |
| Efectos | Caja blanca, cada efecto en su línea (interlineado 1,2 y 3 px entre efectos) | Igual |
| Restricción | Banda rosada abajo, solo en los tipos "con restricción" | Igual |
| ID | `EXP-n` / `EXR-n` | `EVT-n` / `EVR-n` |

Los campos de texto de la app tienen dos ajustes de separación: **Line height** (interlineado dentro de un párrafo) y **Line gap** (espacio extra entre efectos separados por salto de línea). El rojo del PODER va en todos los exploradores para leerlos de un vistazo. La **restricción** va en su propia banda, siempre en el mismo lugar, para que se vea a primera vista el costo de cada carta. Cuando haya arte, conviene que el color del marco indique la dimensión y no el tipo.
