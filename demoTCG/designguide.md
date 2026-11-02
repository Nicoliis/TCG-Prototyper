# Colapso: guía de diseño

Para quien diseñe cartas nuevas (o quiera entender por qué las actuales son así). Las reglas de juego están en [ruleguides.md](ruleguides.md).

## 1. Filosofía

**El juego busca interacción antes que velocidad.** Cada turno deberías poder armar un *tablero*: exploradores con triggers que castigan ciertas jugadas. El otro jugador intenta jugar a través de esas condiciones para *romper el tablero*, y después le toca armar el suyo.

Principios que salen de ahí:

1. **Más barrera de entrada, más diversión.** El juego va a ser complejo en interacciones y cartas. Es mejor tener un juego profundo que alguien quiera aprender que uno simple que nadie quiera jugar.
2. **Dos efectos por carta, a lo sumo.** Un efecto **Normal** (lo activas tú) y un efecto **Trigger** (reacciona). Una carta puede tener uno solo; las más sencillas suelen tener uno.
3. **El poder se paga con restricciones.** Las cartas más fuertes cargan con una restricción (sección 4). Cuanto más grave, más fuerte puede ser la carta.
4. **Casi no hay "NO".** Las negaciones son mínimas y carísimas. Se interrumpe quitando recursos u objetivos, no frenando todo (sección 5).
5. **Una vez por turno, por nombre.** Cada efecto se activa una vez por turno por nombre de carta, así que sumar copias no multiplica el efecto.

## 2. Anatomía de una carta

### Explorador

| Campo | Contenido |
|---|---|
| Nombre | Corto, sin artículos largos. |
| Dimensión | Fantaspet, Ugabuga, Ragnatica, Neutral… |
| ATK / DEF | Múltiplos de 50, de 0 a 400. |
| Efecto | Hasta dos líneas: `**Normal:** …` y `**Trigger:** …` |
| Restricción | Opcional. Una de las tres estándar, o una permanente. |
| ID | Se calcula solo en la app (`EXP-n`). |

### Evento

Igual que un explorador, sin ATK/DEF y con una **velocidad** (Instantáneo o Lento). Un evento tiene dos modos: su efecto **Normal** (lo activas cuando quieras, según la velocidad) o su efecto **Trigger** (lo activas desde la mano cuando se cumple su condición). Como el evento va al cementerio al resolverse, **eliges un modo por carta**.

### Escala de estadísticas

Con 800 de vida:

| ATK | Qué es |
|---|---|
| 0-100 | Soporte o ficha. |
| 150-250 | Cuerpo normal. |
| 300 | Pieza. Tres golpes y casi terminas. |
| 350-400 | Pieza con restricción grave (R2/R3) o con un costo de entrada alto. |

La DEF suele ir en sentido contrario al ATK: las cartas con 300+ de DEF casi no atacan.

## 3. Roles de las cartas

Cada carta debería poder responder "¿para qué la juego?". Las cuatro respuestas válidas:

| Rol | Qué hace | Cómo se reconoce |
|---|---|---|
| **Starter** | Abre el combo. La mejor opción para empezar. | Busca, roba o agrega recursos desde casi nada. |
| **Extender** | Completa el combo si fue interrumpido. | Recupera, reemplaza o baja desde la mano en respuesta a una destrucción. |
| **Pieza** (*en-board*) | El objetivo a alcanzar. Lo que queda en el tablero. | Estadísticas altas o triggers fuertes. Casi siempre con restricción. |
| **Interrupción** | Frena al oponente sin decir "no". | Devuelve a la mano, quita un objetivo, cambia posiciones, descarta. |

Referencia para un mazo de 40 cartas: **25-35% starters, 20-40% extenders, 5-15% piezas, 15-30% interrupciones**. Las piezas son pocas porque son caras de bajar. Ugabuga se sale a propósito (32% de piezas, pocas interrupciones) porque es el mazo agresivo.

| Mazo | Starters | Extenders | Piezas | Interrupciones |
|---|---|---|---|---|
| Fantaspet | 14 | 16 | 2 | 8 |
| Ugabuga | 10 | 10 | 13 | 7 |
| Ragnatica | 15 | 9 | 3 | 13 |

## 4. Restricciones

Tres niveles estándar. Cuanto más grave, más puede dar la carta.

| Nivel | Texto exacto | Cuándo usarlo |
|---|---|---|
| **R1** | "No puedes bajar más exploradores este turno." | Starters que buscan o roban. Frena a los extenders que bajan. |
| **R2** | "No puedes activar más efectos este turno." | Piezas e interrupciones fuertes. Te quedas sin juego después de que entra. |
| **R3** | "Se termina tu turno." | Las piezas más fuertes. Entran al final de tu jugada y quitan tu Fase de Batalla. |

Reglas de uso:

- Explorador: "**Después de entrar al campo, si es tu turno:** …". Evento: "**Después de activar:** …".
- **Una restricción no debe bloquear a su propia carta.** Un explorador con R1 no puede tener un Normal que baje otro explorador, y uno con R2 no puede tener un trigger que deba activarse el mismo turno en que entra (por ejemplo después de un combate). Si el efecto es útil recién al turno siguiente, está bien. Los efectos que se activan **desde la mano** ocurren antes de entrar, así que no se ven afectados.
- Las fichas no son "bajadas", así que R1 no las toca. Esa excepción es la ventaja de Ragnatica; no la rompas con restricciones que digan "agregar".
- Las **restricciones permanentes** ("Esta carta no puede declarar ataques") valen aproximadamente una restricción R1. Usa máximo una por carta.

## 5. Negaciones y búsqueda

### Negaciones

Mantenerlas al mínimo. Hoy hay **dos** en todo el juego:

- **Grieta en emergente Valle Mudo** (neutral): niega solo efectos que **buscan en el mazo**. Cuesta descartar una carta y destruir uno de tus exploradores.
- **Reina de Ragnatica**: niega solo efectos de explorador que **eligen a una carta tuya**. Cuesta una carta de tu mano y una ficha cada vez, y la carta viene con R3.

Si diseñas una tercera, debería ser **muy específica** (un tipo de efecto concreto) o **muy cara** (dos recursos distintos y una restricción).

### Búsquedas

- **Pública** (revelas la carta) es más barata. Útil en starters con restricción.
- **Secreta** (muestras varios candidatos y tomas uno) cuesta algo: un descarte, una destrucción o un criterio más estrecho.
- Un criterio de búsqueda debe poder **fallar**. Un "busca cualquier carta" nunca falla y no tiene riesgo.

## 6. Escribir el texto de una carta

### Plantillas

```
Normal:   **Normal:** [Costo:] Efecto.
Trigger:  **Trigger:** Si [condición]: [Costo:] Efecto.
Desde la mano:  **Normal:** (Desde tu mano) [Costo:] Efecto.
Restricción:    Después de entrar al campo, si es tu turno: [R1 | R2 | R3].
```

El texto de la carta usa **negrita** con `**…**` (la app la interpreta en la carta). Los efectos Normal y Trigger van en líneas separadas dentro de la misma celda.

### Vocabulario cerrado

Usa siempre las mismas palabras (definidas en [ruleguides.md](ruleguides.md#palabras-de-las-cartas)): **destruir**, **descartar**, **exiliar**, **bajar** (explorador), **agregar** (ficha), **elegir**, **devolver a la mano**, **anular** (ataque), **negar** (efecto), **ganar / perder ATK**. No uses sinónimos.

### Condiciones de trigger

Cada condición tiene tres partes: alcance (global / propio / dirigido), tempo (preventivo `fuera a ser…` / reactivo `es…`) y acción. Ejemplos válidos:

| Condición | Alcance | Tempo |
|---|---|---|
| "Si esta carta es destruida" | Propio | Reactivo |
| "Si otro Fantaspet que controlas fuera a ser destruido" | Global (tuyo) | Preventivo |
| "Si el oponente baja un explorador" | Global | Reactivo |
| "Si un explorador del oponente declara un ataque" | Global | Reactivo |

### Lista de revisión para una carta nueva

1. ¿Tiene un rol claro (starter, extender, pieza, interrupción)?
2. ¿Tiene un efecto Normal y/o un Trigger, nada más?
3. ¿Su restricción es proporcional a lo que da? ¿No bloquea su propio efecto?
4. ¿Qué la **frena**? Toda carta debería poder ser interrumpida: quitándole el objetivo, matándola o quedándose sin recurso.
5. ¿Puede **fallar** si es una búsqueda?
6. ¿Usa el vocabulario cerrado?
7. ¿El nombre sigue la convención de la sección 7?

## 7. Lore y nombres

### Mundo

El juego sucede en una dimensión en la que el **multiverso colapsa y muchas dimensiones chocan**. Los exploradores buscan recursos para sus colonias en un mundo que no tiene mucho sentido para ellos.

Que el mismo explorador aparezca varias veces y que haya alianzas raras se explica por la **irregularidad espacio-temporal** de este lugar: no es un error, es parte del mundo.

### Dimensiones

| Dimensión | Origen | Identidad |
|---|---|---|
| **Fantaspet** | Eterneblina | Mascotas espectrales. Búsqueda, recursión, protección mutua. |
| **Ugabuga** | Meseta y cuevas de Ugabuga | Tribus de piedra. Fuerza bruta, sacrificios, presión. |
| **Ragnatica** | Reino de Ragnatica | Arácnidos tejedores. Fichas, interrupciones por costo. |
| **Neutral** | El propio Colapso | Viajeros y recursos que sirven a cualquiera. |

### Nombres de eventos

Los eventos cuentan historias, pero **como referencias a las dimensiones originales y no como cosas que ya pasaron**. El lugar todavía no existe del todo; se está formando.

| Mal (cuenta lo que pasó) | Bien (el lugar está surgiendo) |
|---|---|
| Guerra por sucesión de Ragnatica | **Conflicto en emergente reino de Ragnatica** |
| La caída de Eterneblina | **Susurros en Eterneblina** |
| Banquete de la aldea Ugabuga | **Banquete en emergente aldea Ugabuga** |

Truco: si el nombre dice "en emergente [lugar]", "en [lugar]" o describe algo que **está pasando**, sirve. Si dice algo que **ya terminó**, cámbialo.

Los exploradores llevan nombres propios cortos o apodos (Gooboy, Cesarmill, Viuda Gris). Los de una misma dimensión comparten una sensación sonora: los Fantaspet son juguetones (-y, -ill, -ak), los Ugabuga son toscos (-ito, -aa, "Ugabu"), los Ragnatica son tejedores (-ín, -era, "Telar").

## 8. Dimensiones neutrales y estructura del pool

- Un mazo de 40 = **~28 cartas de dimensión** (12 nombres distintos) + **~12 neutrales** (5-6 nombres).
- El pool neutral ofrece: robo y filtro (**Cartógrafo Errante**, **Brújula Rota**), recuperación (**Campamento…**), escape (**Retirada Táctica**), un cuerpo sin dimensión (**Mercenario del Colapso**) y la **Grieta** como interrupción anti-búsqueda.
- Una dimensión nueva necesita: 8 exploradores, 4 eventos, un tipo de recurso propio (fichas, recursión, sacrificios…) y una debilidad concreta que pueda explotar otro mazo.

## 9. Diseño visual

Las cartas de la app (proyecto `colapso.json`) siguen este esquema, tamaño 240 × 336:

| Zona | Explorador | Evento |
|---|---|---|
| Color del marco | Marrón cobre `#a8641c`, nombre sobre `#f3d9b1` | Verde azulado `#1c7f86`, nombre sobre `#bfe6e8` |
| Franja superior | Nombre (negrita, se comprime) | Nombre (negrita, se comprime) |
| Subtítulo | Dimensión · `EXPLORADOR` | Dimensión · `EVENTO · velocidad` |
| Arte | Recuadro gris de 230 × 118 (hasta tener ilustraciones) | Igual |
| Estadísticas | `ATK` (rojo claro) y `DEF` (azul claro) | No tiene |
| Efectos | Caja blanca, el texto se achica para entrar | Caja blanca más alta |
| Restricción | Banda rosada abajo (vacía si no hay restricción) | Igual |
| ID | `EXP-n` en la esquina inferior derecha | `EVT-n` |

El rojo del ATK y el azul de la DEF van en todos los exploradores para leerlos de un vistazo. La **restricción** va en su propia banda separada del texto, siempre en el mismo lugar, para que se vea a primera vista el costo de cada carta. Cuando haya arte, conviene que el color del marco indique la dimensión y no el tipo.
