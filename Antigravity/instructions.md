Esta app por el momento no tiene soporte de micrófono eso será para una próxima iteración.

**Archivos de audio**

Se va a proporcionar archivos de audio de los siguientes acordes:

- Mayores
- Menores
- sus2
- sus4
- aumentada
- dismiuida
- Maj 7
- 7
- Maj 6
- Menor maj7
- Menor 7

El audio contendrá una cadencia en mayor o menor dependiendo el acorde y después el arpegio. Habrá un archivo de audio por cada tonalidad y por cada cualidad, es decir un archivo para el acorde de C mayor, uno para el de C menor, uno para el Db mayor y así sucesivamente.

Se va a proporcionar archivos de audio de las 12 notas musicales, un archivo por cada nota individual, es decir, un archivo para C, uno para Db y así sucesivamente.

La cadencia mayor es: I - IV - V - I para los acordes:

- Mayores
- Maj7
- 7
- 6
- sus2,
- sus4,
- Aug

La cadencia menor es: i - iv - V7 - i para los acordes

- Menores
- m7
- m(Maj7)
- Disminuido
- sus2
- sus4

Esto quiere decir que si la triada es sus2 o sus4, aleatoriamente el contexto puede estar dado en mayor o menor.

### Lógica de audios

Para el contexto se van a dar con el siguiente formato: `[triada/tétrada][octava]_context.wav`, ejemplo: `c3_maj_context.wav` (cadencia y arpegio de la tétrada C maj7), `c3_min_maj7_context.wav` (cadencia y arpegio de la tétrada C min(Maj7)), `c3_context.wav` (cadencia y arpegio de la triada C mayor), `c3_min_context.wav` (cadencia y arpegio de la triada C menor)

Para las notas musicales aisladas se tendrán archivos con este formato `[nota][octava].wav`

Ej. `c3.wav`, `cs3.wav`, `d3.wav`, etc.

El número de octava está dado por el número que de octava de la tónica.

El sistema NO preguntará notas de extensiones como 9na, 11na, 13na etc.

Por lo tanto las notas que se pregunten deben estar en la misma octava, por ejemplo si se pregunta un C3 mayor, las notas posibles son: C3, E3 y G3, no será E4 o E5.

Si se pregunta por ejemplo un A3 las notas posibles serán: A3 C#4 y E4, nota que aquí ya hay un salto de octava, NO se preguntará un C#3 o un C#5, se preguntará un C#4 porque es el que le corresponde a la octava de esa triada

Dependiendo la escala y el intervalo puede pedir una nota de Db, pero internamente el sistema escogerá el audio de C#. Por ejemplo.

Estamos en Ab y se pregunta por una 4J, la nota correcta sería un Db, pero internamente, el sistema tomará el C#.

Todo en los audios de las notas está estandarizado a sostenidos (#), la notación de los audios, para el sostenido, no será “#”, será una “s” de sostendio

Los audios se encuentran en la carpeta @audios que se encuentra dentro de resources, que a su vez está dentro de la carpeta antigravity

La app debe hacer el calculo de los intervalos nunca debe mostrar el nombre de las notas, siempre intervalos.

La app va a estar dividida por módulos

## Pantallas

El total de pantallas serán 3

- Pantalla inicial donde se elige el módulo a trabajar y las configuraciones iniciales del ejercicio
- Pantalla del ejercicio. Aquí es donde se hacen las preguntas, se escuchan los audios, etc
- Pantalla final. Aquí se muestra un resumen de lo trabajado

### Pantalla final

Aquí es donde se da un summary de los ejercicios que se preguntaron. Se muestra la triada preguntada, el número de veces que se preguntó y el número de veces acertada correctamente. Ej: 

- Triada mayor (2/3) → Se preguntó 3 veces, 2 fueron correctas 1 incorrect

….

En este momento sólo habrá un módulo disponible, habrá más en futuras iteraciones.

# Módulo 1: Intervalos en contexto

**Objetivo**: identificar la una nota o secuencia de notas siempre a partir del contexto, no de intervalos sueltos.

Se eligen estes acordes porque son los más comunes en cuestión de armonía y también nos permiten abarcar la escala mayor y menor, pero no de manera clásica, memorizar la escala cantada de una intención, lo que buscamos es dar pequeños pasos, pocas notas en un inicio e ir incrementando.

Settings del ejercicio → Se va a preguntar:

**Base Armónica**

- ¿Qué triadas quieres practicar? → check box donde puede seleccionar las que quiera practicar. Opciones de triadas + opción de “Todas”
- ¿Qué tétradas quieres practicar? → check box donde puede seleccionar las que quiera practicar. Opciones de tétradas + opción de “Todas”

Las opciones disponibles de triadas y tétradas están definidas más arriba

**Notas a preguntar**

Opciones, sólo se elige una

- Sólo las del acorde
    
    Sólo te va a preguntar las 3 o 4 de la triada o tétrada que se está preguntando
    
- Notas de la escala
    
    Sólo te va a preguntar notas de la escala y de la triada o tétrada. Si el contexto es de triada mayor, se van a pregunta notas de la escala mayor, si el contexto es de tétrada menor maj7, te va a preguntar notas de la escala menor y a parte el intervalo maj7, si el contexto es aumentado, te preguntará notas de la escala mayor y se agrega el intervalo de 5# y así sucesivamente.
    
- Todas las notas posibles - Esta opción sólo estará disponible para triadas y tétradas mayores, menores, maj7 y m7 (esto también se explica en el tooltip). Si el usuario selecciona esta opción, de deshabilita el input de triadas y tétradas a prácticar.
    
    Se puede preguntar cualquier nota de la escala cromática.
    

**Modo de preguntas**

- ¿Cuántos ejercicios quieres practicar? → default 10
- ¿Secuencia melódica? → Opción booleana

Secuencia melódica

Si selecciona esta opción significa que se van a preguntar más de una nota, en este caso vamos a preguntar de 2 - 4 al azar, es decir va a sonar el acorde, el arpegio y después va a sonar una secuencia de 2-4 notas, el usuario debe seleccionar las notas que escuchó en el orden correcto.

En este caso en la pantalla aparecen las 3 o 4 notas posibles que se pueden preguntar (dependiendo si es tétrada o triada).

En la parte inferior se muestran de 2 - 4 espacios donde van a ir ordenadas las notas que el usuario escuchó. 

El usuario selecciona un botón de la nota escuchada y esa nota se coloca en automático en el espacio de respuesta, después selecciona el siguiente botón y la nota se asigna al siguiente espacio.

Si la secuencia melódica no está activada, solo se pregunta una nota.

## Flujo del ejercicio

En la parte superior se muestra el tipo de triada/tétrada que se está preguntando (mayor,  menor, sus2, maj7, m(Maj7), etc). Esta es la única parte de toda la app donde se muestren notas, es decir en lugar de decir “triada mayor” dirá “triada de C” o tétrada de Cmaj7, según sea el caso. Como se puede observar el uso de la nota es decir C, E, etc, en este caso es solo informativo, no influye en ningún momento con la decisión del usuario, el usuario siempre selecciona intervalos. 

1. Canta → Suena la cadencia y arpegio, el usuario debe cantar, la app NO verifica con el micrófono que esté afinado ni nada por el estilo.
2. Escucha → Suena la nota que se está preguntando
3. Elige → seleccionar la nota o notas escuchadas

Hay un botón de “repetir”, esto solo repite la nota o secuencia de notas a preguntar.

Hay un botón que dice, “dame contexto”, que vuelve al paso 1, da contexto y después pasa al paso 2, arroja la nota o secuencia de notas.

La app pasa en automático del paso 1 al 2, es hasta el 3 donde se requiere interacción del usuario.

No hay botón de verificar, si no es secuencia melódica, el botón que se toque se toma como respuesta, si hay secuencia melódica, cuando acaba de poner todas las notas en los bloques en blanco, eso se toma en automático como respuesta.

Habrá un botón de borrar último sólo para secuencia melódica, en caso de que el usuario se equivoque y quiera corregirse.

Los bloques de respuesta siempre van a ser visibles, es decir si el usuario selecciona respuestas y quiere volver a escuchar, los bloques van a ser visibles mientras escucha, igual al inicio, cuando este escuchando la secuencia o la nota, los bloques de respuesta ya serán visibles.

En toda la app nunca se mostrarán notas como C, D, etc. Siempre intervalos.

Cuando se muestren las opciones disponibles para que el usuario seleccione, no serán notas, serán intervalos (T - 3M, etc). Cuándo en el banner se muestre cuál era la respuesta correcta, igual será en intervalos. Esto quiere decir que también en el sistema internamente, todo el cálculo ser hará por intervalos.

Las opciones disponibles sólo serán las disponibles, es decir, si el usuario seleccionó solo notas de la triada, debería mostrarse sólo las opciones de la triada, si seleccionó notas de la escala, se mostrarán como opciones solo notas de la escala, pero si seleccionó está opción y el contexto es por ejemplo un aug, entonces las opciones serán las notas de la escala + la 5#. Si se está preguntando por notas de la escala menor las opciones serán “T “2M 3m 4J 5J 6m 7m 8”

Si la respuesta es correcta se lanza confeti y se muestra un banner que diga correcto y las nota seleccionadas se ponen en verde

Si la respuesta es incorrecta se muestra el baner en rojo con la respuesta correcta, se ponen en verde las respuestas correctas seleccionadas y se ponen en rojo las incorrectas seleccionadas.

Triadas posibles:

- Mayores
- Menores
- sus2
- sus4
- aumentada
- dismiuida

Tetradas disponibles

- Maj 7
- 7
- Maj 6
- Menor maj7
- Menor 7

Escalas posibles:

- C: C D E F G A B C
- G: G A B C D E F# G
- D:  D E F# G A B C# D
- A: A B C# D E F# G# A
- E: E F# G# A B C# D# E
- B: B C# D# E F# G# A# B
- F#: F# G# A# B C# D# E# F#
- C#: C# D# E# F# G# A# B# C#
- F: F G A Bb C D E F
- Bb: Bb C D Eb F G A Bb
- Eb: Eb F G Ab Bb C D Eb
- Ab: Ab Bb C Db Eb F G Ab
- Db: Db Eb F Gb Ab Bb C Db
- Gb: Gb Ab Bb Cb Db Eb F Gb
- Cb: Cb Db Eb Fb Gb Ab Bb Cb

Para las escalas menores se obtiene su relativo menor