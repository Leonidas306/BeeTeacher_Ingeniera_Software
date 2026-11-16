# Backlog e Historias de Usuario — Sistema de Tutores, Asesorías y Salones Vacíos (Arquitectura 100% Gratuita Estilo DICIS-Tracker)

## 1. Bases del Proyecto Mejoradas

### 1.1 Descripción General del Proyecto

El **Sistema de Tutores y Asesorías Académicas (DICIS / UG)** es una plataforma web y aplicación instalable (PWA) 100% gratuita diseñada para conectar a los estudiantes de la universidad con tutores pares, profesores y asesores académicos, integrando el motor de detección de **salones vacíos en tiempo real** de [DICIS-Tracker](https://github.com/moraxh/DICIS-Tracker/tree/main).

Para operar **sin pagar alojamiento web ni bases de datos en la nube** y **sin que el desarrollador tenga que capturar datos en código**, el sistema utiliza una arquitectura estática automatizada (*Zero-DB*):

* **Perfiles visuales ricos tipo red social:** Cada tutor cuenta con una tarjeta y página de perfil que muestra su **foto de perfil**, una **imagen de fondo o portada (banner estilo Facebook)**, su **precio base por 30 minutos y por 1 hora** (o indicación de asesoría gratuita), las **etiquetas de materias** que domina (`#Cálculo`, `#Probabilidad`, `#Física`, `#Programación`, etc.), sus horarios disponibles y las **calificaciones y comentarios** dejados por sus alumnos.

* **Identificador de Comunidad (`#DICIS` / futuros campus UG vs. `#Externo`) y Modalidad (`#Presencial` / `#Virtual`):** Cada perfil muestra claramente si el tutor pertenece a la comunidad universitaria (**`#DICIS`**, preparado para escalar a otros campus y divisiones de la Universidad de Guanajuato) o si es un asesor **`#Externo`** (personas ajenas a la comunidad UG que ofrecen servicios de asesoría), así como las etiquetas de modalidad en que imparte sus clases (**`#Presencial`**, **`#Virtual`** o ambas).

* **Etiqueta Especial `"#TutorPar"` (Programa Institucional de Asesorías Entre Pares / Beca de Comunidad Universitaria UG):** En la Universidad de Guanajuato opera formalmente el esquema de **Asesorías Entre Pares** (*Asesores Par / Monitorías Académicas*), gestionado mediante la convocatoria institucional de **Beca de Comunidad Universitaria (modalidad Asesoría Par / Mentoría)** o apoyos divisionales:

  * **Para los alumnos receptores:** El servicio de asesoría y regularización dentro del programa es **completamente gratuito**.

  * **Para el alumno que imparte las clases (Asesor Par):** La universidad le otorga un estímulo económico (beca monetaria mensual o semestral) a cambio de cubrir un número determinado de horas semanales de asesoría y entregar bitácoras de asistencia.

  * **Coexistencia con tarifas por hora/media hora:** Contar con la etiqueta **`#TutorPar`** le indica a la comunidad que el tutor ofrece asesorías gratuitas bajo esta modalidad institucional, **pero no le impide publicar también sus precios base (30 min / 1 hora)** en su perfil, ya que el tutor no está obligado a impartir sesiones extensas (por ejemplo, 3 o 4 horas seguidas) ni horas fuera de su cuota de beca de forma gratuita.

* **Coordinación directa por WhatsApp + Salones Vacíos:** Los alumnos no necesitan crear cuentas ni contraseñas. Buscan al tutor filtrando por etiquetas de materia, origen (`#DICIS` o `#Externo`), modalidad (`#Presencial`, `#Virtual`, `#TutorPar`) o precio, consultan qué salón de la sede está vacío en ese horario (para sesiones presenciales en el campus) y presionan el **botón de WhatsApp**, el cual abre el chat directo con el tutor con un mensaje prellenado.

* **Alta controlada bajo solicitud a Administradores + Automatización con Google Forms y GitHub Actions:** En la sección para tutores de la plataforma se muestran las indicaciones de que **el formulario de registro se otorga únicamente bajo solicitud previa a los administradores**. Esto sirve como filtro de verificación inicial: los desarrolladores/administradores comprueban si el solicitante pertenece a la comunidad universitaria (entregándole el formulario de comunidad que asigna la etiqueta `#DICIS`, su verificación y, cuando aplique, la etiqueta `#TutorPar`) o si es ajeno a la universidad (entregándole el formulario o clasificación separada que le asigna automáticamente la etiqueta `#Externo`). Una vez llenado el formulario, **GitHub Actions** procesa las respuestas y actualiza la web en **Vercel** automáticamente.

### 1.2 Alcance Funcional Detallado por Rol

| Rol | Alcance Funcional en el Modelo Automatizado (Estilo DICIS-Tracker) | 
| ----- | ----- | 
| **Estudiantes (Alumnos)** | Buscar tutores por nombre o materia con tolerancia a errores ortográficos; filtrar tutores por **etiquetas temáticas** (`#Cálculo`, `#Probabilidad`, `#Física`, etc.), **etiqueta de pertenencia** (`#DICIS` / futuros campus UG o `#Externo`), **etiqueta `#TutorPar`** (para identificar quiénes dan asesorías gratuitas del programa de beca UG), **modalidad** (`#Presencial` o `#Virtual`), sede y rango de precio (30 min / 1 h); consultar el perfil completo del tutor (**foto de perfil, foto de portada tipo Facebook, tarifas por 30 min y 1 hora, etiquetas, horarios libres, salones vacíos compatibles y comentarios de otros estudiantes**); agendar en un clic mediante el **botón de WhatsApp**; guardar favoritos; y **calificar al tutor mediante un formulario prellenado** desde su perfil. | 
| **Tutores (Comunidad `#DICIS` / UG, `#TutorPar` y `#Externo`)** | Consultar en la sección de tutores de la web las **indicaciones para solicitar el acceso al formulario de alta** ante los administradores; registrarse mediante el **Formulario de Tutores** asignado tras la validación (subiendo foto de perfil, foto de portada estilo Facebook, indicando si participa en el programa **`#TutorPar`**, sin que ello le impida definir sus precios base de 30 min y 1 hora para horas adicionales/particulares, modalidad `#Presencial` y/o `#Virtual`, selección de etiquetas de materias, horarios libres y número de WhatsApp); **consultar qué salones de la universidad están vacíos** en tiempo real o por día/hora y duración (`30+ min`, `1+ hora`, `2+ horas`); consultar espacios y recursos de apoyo de la UG; coordinar detalles con el alumno en su WhatsApp; y llevar su **bitácora de asistencia y notas** en su navegador (`localStorage`) exportable para sus entregas de beca. | 
| **Administradores / Desarrolladores** | Atender las solicitudes de nuevos tutores para verificar desde el primer contacto si pertenecen a la comunidad universitaria (`#DICIS` / UG), si son becarios del programa **`#TutorPar`** o si son asesores independientes (`#Externo`), entregándoles el formulario correspondiente; supervisar la hoja de **Google Sheets** alimentada por los formularios de tutores y comentarios; contar con el robot de **GitHub Actions** que convierte automáticamente las filas en perfiles publicados (`tutors.json`) y vincula cada reseña a su tutor (`reviews.json`); moderar u ocultar perfiles o comentarios desde Google Sheets; y mantener la actualización automática semanal de horarios y salones oficiales desde los PDFs de [CAECIS UG](http://www.caecis.ugto.mx/caecis/pages/horarios.aspx). | 

### 1.3 ¿Cómo Funciona la Verificación Previa y la Automatización con Google Forms?

Para que tú como desarrollador **no tengas que programar ni capturar en código a cada tutor**, pero al mismo tiempo tengas **control total sobre quién entra como miembro de la UG, quién es Tutor Par y quién es Externo**, el flujo funciona en **4 pasos 100% gratuitos**:

1. **Paso 1 — Solicitud de Formulario y Separación Comunidad / Tutor Par vs. Externo (Verificación de entrada):**

   * En la página web hay una sección llamada **"¿Quieres ser Tutor?"** donde se muestran las indicaciones claras: el enlace al formulario no está abierto al azar, sino que se solicita mediante un botón de contacto a los administradores.

   * Cuando la persona solicita registrarse, los desarrolladores verifican rápidamente si es alumno/egresado/profesor de la UG (por ejemplo, con su correo `@ugto.mx` o credencial) o si es una persona externa:

     * **Si es de la comunidad UG:** Se le comparte el **Formulario de Comunidad UG**, que le asigna su insignia de **Verificado**, su etiqueta de campus/división (**`#DICIS`**, o en el futuro `#DCEA`, `#DCNE`, `#CampusLeón`, etc.) y la opción de marcar la etiqueta **`#TutorPar`** si forma parte del programa de *Asesorías Entre Pares / Beca de Comunidad Universitaria*.

     * **Si NO es de la comunidad UG:** Se le comparte el **Formulario para Asesores Externos** (o una sección separada que guarda sus datos en la pestaña de externos), asignándole obligatoriamente la etiqueta **`#Externo`** para separarlo de la comunidad estudiantil (sin posibilidad de activar `#TutorPar`).

2. **Paso 2 — Llenado del Formulario de Tutores (Google Forms):**

   * El tutor llena sus datos: Nombre completo, Origen (`#DICIS` o `#Externo`), **Participación como `#TutorPar` (Sí/No)**, **Modalidad de servicio (`#Presencial`, `#Virtual` o ambas)**, Sede (si da presencial), WhatsApp (10 dígitos), **Precio por 30 min** y **Precio por 1 hora** (permitidos incluso si es `#TutorPar` para sesiones extensas o fuera de sus horas de beca), casillas de **Etiquetas de materias** (`Cálculo`, `Probabilidad`, `Física`, `Álgebra Lineal`, `Programación`, etc.), Horarios disponibles, **Foto de Perfil** y **Foto de Portada (Banner estilo Facebook)**.

3. **Paso 3 — Formulario de Comentarios y Calificaciones de Alumnos (Google Forms con Enlace Prellenado):**

   * En el perfil de cada tutor dentro de la página web hay un botón **"Calificar a este tutor"**.

   * Ese botón abre el Google Form de reseñas pero **ya lleva escrito automáticamente el ID y nombre del tutor en la URL**. Así el comentario se asigna exactamente a ese profesor sin errores.

4. **Paso 4 — Sincronización Automática (Google Sheets → GitHub Actions → Vercel Gratis):**

   * El script de Python en **GitHub Actions** (`scrapper/src/sync_forms.py`) lee las hojas de Google Sheets, procesa los enlaces de Google Drive de la foto de perfil y del banner de portada, clasifica las etiquetas de materia, origen (`#DICIS` / `#Externo`), programa (`#TutorPar`) y modalidad (`#Presencial` / `#Virtual`), calcula el promedio de estrellas de cada tutor y actualiza automáticamente `frontend/src/data/tutors.json` y `frontend/src/data/reviews.json` para que **Vercel** publique los cambios en menos de 1 minuto.

## 2. Historias de Usuario Adaptadas al Formato Estándar (`user_stories.md`)

Todas las historias de usuario han sido adaptadas al flujo real (**Perfiles con Portada y Precios + Filtro por Etiquetas de Materia, Comunidad `#DICIS`/`#Externo`, Etiqueta `#TutorPar` y Modalidad `#Presencial`/`#Virtual` + Salones Vacíos + Botón de WhatsApp + Solicitud de Formulario con Verificación**), siguiendo el formato Gherkin (`Given` / `When` / `Then` / `And`) de `user_stories.md`.

# APARTADO 1: HISTORIAS DE USUARIO — ESTUDIANTES (ALUMNOS)

# HU-EST-01-Buscar tutores por materia o nombre

**Prioridad:** Alta | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero buscar tutores mediante una barra de búsqueda general por nombre de materia o nombre del tutor, para encontrar rápidamente a alguien que me ayude con los temas que necesito aprender.

## Criterios de aceptación

### CA-001-Búsqueda con coincidencias

Given que existen tutores registrados en el archivo de datos con distintas materias y etiquetas asignadas
When el estudiante ingresa un término de búsqueda en la barra de búsqueda
Then el sistema debe mostrar las tarjetas de los tutores cuyo nombre, descripción o etiquetas coincidan con el término
And cada tarjeta debe mostrar su foto de perfil, imagen de portada, nombre, etiqueta de origen (`#DICIS` o `#Externo`), etiqueta `#TutorPar` (cuando aplique), modalidad (`#Presencial` / `#Virtual`), etiquetas de materias, precio base (30 min y 1 hora) y calificación promedio

### CA-002-Tolerancia a mayúsculas, acentos y errores tipográficos

Given que existe un tutor con la etiqueta "Cálculo" o "Probabilidad"
When el estudiante escribe "calculo" sin acento o con un error menor de escritura como "probalidad"
Then el buscador difuso debe normalizar el texto y mostrar a dicho tutor dentro de los resultados

### CA-003-Búsqueda sin coincidencias

Given que el estudiante ingresa un texto que no coincide con ningún tutor ni etiqueta registrada
When ejecuta la búsqueda
Then el sistema debe mostrar un mensaje indicando que no se encontraron tutores con ese criterio
And debe mostrar un botón para limpiar la búsqueda

### CA-004-Restablecer listado al limpiar búsqueda

Given que el estudiante tiene un texto escrito en la barra de búsqueda
When borra el texto o presiona el botón de limpiar
Then el sistema debe mostrar nuevamente a todos los tutores disponibles

# HU-EST-02-Filtrar tutores mediante etiquetas de materias (Cálculo, Probabilidad, Física, etc.)

**Prioridad:** Alta | **Rol:** Estudiante

## Historia de usuario

Como alumno, quiero que los tutores tengan etiquetas como "Cálculo", "Probabilidad", "Física", "Álgebra Lineal" o "Programación" para poder filtrar la búsqueda al seleccionarlas y que me aparezcan únicamente los tutores que imparten esa materia.

## Criterios de aceptación

### CA-001-Visualizar etiquetas en las tarjetas y perfiles

Given que existen tutores dados de alta con etiquetas de las materias que imparten
When el alumno consulta el catálogo de tutores
Then cada tarjeta de tutor debe mostrar sus etiquetas correspondientes (por ejemplo, `#Cálculo`, `#Probabilidad`, `#Física`)

### CA-002-Filtrar por una etiqueta seleccionada

Given que el alumno visualiza la barra de filtros por etiquetas de materias
When selecciona una etiqueta específica como "Probabilidad"
Then el listado debe actualizarse mostrando únicamente a los tutores que tienen asignada la etiqueta "Probabilidad"
And la etiqueta seleccionada debe mostrarse con estado activo

### CA-003-Filtrar por múltiples etiquetas combinadas

Given que el alumno ya seleccionó la etiqueta "Cálculo"
When selecciona adicionalmente la etiqueta "Física"
Then el sistema debe filtrar y mostrar a los tutores que coincidan con las etiquetas seleccionadas
And debe actualizar el contador total de tutores encontrados

### CA-004-Mantener filtro de etiqueta al buscar por texto o cambiar otros filtros

Given que el alumno tiene activa la etiqueta "Cálculo"
When escribe un término adicional en el buscador o filtra por origen (`#DICIS` / `#Externo`), `#TutorPar` o modalidad (`#Presencial` / `#Virtual`)
Then el sistema debe mostrar solo los tutores que tengan la etiqueta "Cálculo" y cumplan simultáneamente con los demás filtros activos

### CA-005-Etiqueta sin tutores registrados

Given que ningún tutor tiene asignada una etiqueta determinada con los filtros actuales
When el alumno selecciona esa etiqueta
Then debe visualizar un mensaje indicando que por el momento no hay tutores registrados para esa materia

### CA-006-Desactivar filtros de etiquetas

Given que el alumno tiene una o más etiquetas activas como filtro
When presiona nuevamente sobre la etiqueta activa o selecciona "Todas las materias"
Then el sistema debe quitar el filtro y mostrar el listado completo de tutores

# HU-EST-03-Identificar y filtrar tutores por pertenencia (DICIS / UG o Externo) y por modalidad (Presencial o Virtual)

**Prioridad:** Alta | **Rol:** Estudiante / Tutor

## Historia de usuario

Como alumno o tutor, quiero que cada perfil tenga una etiqueta o identificador que distinga si el tutor pertenece a la comunidad universitaria (`#DICIS`, escalable en un futuro a los demás campus y divisiones de la Universidad de Guanajuato) o si es un asesor `#Externo` (ajeno a la comunidad UG), además de una etiqueta que indique si imparte asesoría `#Presencial`, `#Virtual` o ambas, para poder diferenciar y filtrar fácilmente el tipo de asesor y la modalidad del servicio.

## Criterios de aceptación

### CA-001-Distinción visual clara entre tutor de la comunidad (DICIS / UG) y tutor Externo

Given que existen tutores pertenecientes a la comunidad universitaria y tutores independientes ajenos a la universidad
When el usuario visualiza las tarjetas o el perfil de los tutores
Then los tutores de la universidad deben mostrar el identificador institucional `#DICIS` (o el campus/división de la UG correspondiente)
And los asesores que no forman parte de la comunidad universitaria deben mostrar claramente la etiqueta `#Externo` con un color distintivo que los separe de la comunidad interna

### CA-002-Filtrar tutores por origen (Comunidad DICIS / UG vs. Externos)

Given que el alumno desea buscar únicamente asesores de su propia división/universidad o bien incluir asesores externos
When selecciona el filtro de origen ("Todos", "Comunidad DICIS / UG" o "Externos")
Then el listado debe mostrar únicamente los tutores que correspondan a la categoría seleccionada

### CA-003-Visualizar y filtrar por modalidad de asesoría (Presencial y Virtual)

Given que los tutores registraron si imparten asesorías en modalidad `#Presencial`, `#Virtual` o ambas (`#Presencial` y `#Virtual`)
When el alumno aplica el filtro de modalidad ("Presencial" o "Virtual")
Then el sistema debe mostrar únicamente a los tutores que ofrezcan la modalidad seleccionada
And cada tarjeta debe mostrar los indicadores visuales de `#Presencial` y/o `#Virtual`

### CA-004-Escalabilidad para futuros campus de la Universidad de Guanajuato

Given que la estructura de etiquetas de comunidad soporta identificadores por división o campus
When en el futuro se incorporen tutores de otros campus de la UG (como `#Guanajuato`, `#León` o `#Celaya-Salvatierra`)
Then el filtro de comunidad debe listar automáticamente las nuevas etiquetas de campus sin requerir rediseñar las tarjetas de perfil

# HU-EST-04-Identificar y filtrar tutores con la etiqueta "Tutor Par" (Asesorías Entre Pares UG) coexistiendo con sus precios

**Prioridad:** Alta | **Rol:** Estudiante / Tutor

## Historia de usuario

Como estudiante o tutor, quiero que exista la etiqueta `"#TutorPar"` para identificar a los alumnos asesores que forman parte del programa institucional de *Asesorías Entre Pares (Beca de Comunidad Universitaria UG)* —con quienes los estudiantes saben que cuentan con horas de asesoría gratuita—, sin impedir que el tutor publique también sus precios por 30 minutos o 1 hora en su perfil para sesiones particulares extensas o fuera de su horario de beca.

## Criterios de aceptación

### CA-001-Visualizar la etiqueta "Tutor Par" y su explicación institucional

Given que un tutor de la comunidad universitaria (`#DICIS` / UG) participa en el programa de *Asesorías Entre Pares (Beca de Comunidad Universitaria)*
When el estudiante visualiza su tarjeta o abre su perfil
Then debe mostrarse de forma destacada la etiqueta **`#TutorPar`**
And al pasar el cursor o tocar el icono informativo (`MetricTooltip`), debe explicarse que bajo la modalidad *Tutor Par* el alumno receptor tiene derecho a asesorías gratuitas dentro de las horas del programa institucional del tutor

### CA-002-Permitir que el perfil "Tutor Par" conserve y muestre sus precios por 30 min y 1 hora

Given que un tutor tiene asignada la etiqueta **`#TutorPar`**
And además registró en el formulario una tarifa base por 30 minutos y/o por 1 hora (porque no impartirá múltiples horas seguidas gratis ni sesiones particulares fuera de su cuota semanal de beca)
When se publica su tarjeta y su perfil en la plataforma
Then el sistema **no debe bloquear ni ocultar sus tarifas**, mostrando tanto la etiqueta **`#TutorPar` (Horas de beca sin costo)** como sus precios regulares para sesiones adicionales o extensas

### CA-003-Filtrar el directorio por la etiqueta "Tutor Par"

Given que el estudiante busca específicamente asesores del programa institucional de apoyo entre pares para recibir regularización gratuita
When selecciona el filtro **`#TutorPar`**
Then el listado debe mostrar únicamente a los tutores que cuentan con la etiqueta **`#TutorPar`** activa

### CA-004-Restringir la etiqueta "Tutor Par" exclusivamente a miembros de la comunidad UG

Given que el programa de *Asesorías Entre Pares* es una beca oficial de la Universidad de Guanajuato
When se procesa el registro de un asesor con etiqueta **`#Externo`**
Then el sistema no debe permitir asignar la etiqueta **`#TutorPar`** a ningún perfil externo

### CA-005-Distinguir en el mensaje de WhatsApp si se solicita hora de "Tutor Par" o sesión particular

Given que el estudiante abre el perfil de un tutor que tiene la etiqueta **`#TutorPar`** y tarifas publicadas
When presiona el botón de WhatsApp para agendar
Then el mensaje prellenado debe incluir una línea para que el alumno indique si consulta disponibilidad dentro de sus horas del programa **Tutor Par (sin costo)** o como asesoría particular

# HU-EST-05-Consultar el perfil completo de un tutor (Fotos, precios, etiquetas, horarios y reseñas)

**Prioridad:** Alta | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero abrir el perfil detallado de un tutor para ver su foto de perfil, su imagen de fondo tipo Facebook, su identificador (`#DICIS` o `#Externo`), si cuenta con la etiqueta `#TutorPar`, su modalidad (`#Presencial` / `#Virtual`), sus tarifas por 30 minutos y por 1 hora, sus horarios disponibles y los comentarios de otros estudiantes, para decidir con confianza antes de contactarlo.

## Criterios de aceptación

### CA-001-Visualizar diseño completo del perfil

Given que el estudiante selecciona la tarjeta de un tutor
When se abre la vista o modal de perfil del tutor
Then debe visualizar la imagen de portada (banner superior estilo Facebook), la foto de perfil circular superpuesta, su nombre, su etiqueta de pertenencia (`#DICIS` o `#Externo`), la etiqueta `#TutorPar` (si aplica), sus etiquetas de modalidad (`#Presencial` / `#Virtual`), sus etiquetas de materias, su tarifa por media hora, su tarifa por una hora y su calendario de disponibilidad

### CA-002-Imagen de portada o perfil por defecto

Given que un tutor se registró en el formulario sin adjuntar foto de perfil o imagen de portada
When el estudiante abre su perfil
Then el sistema debe mostrar un avatar e imagen de portada institucional por defecto sin romper el diseño visual

### CA-003-Visualizar comentarios y promedio de estrellas

Given que otros estudiantes han enviado reseñas para ese tutor mediante el formulario de evaluación
When el estudiante revisa la sección de opiniones dentro del perfil
Then debe visualizar la calificación promedio en estrellas, el total de evaluaciones recibidas y la lista de comentarios asignados a ese tutor

# HU-EST-06-Contactar al tutor y agendar asesoría mediante botón directo de WhatsApp

**Prioridad:** Alta | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero contar con un botón de WhatsApp en el perfil del tutor que me lleve directamente a su chat con un mensaje prellenado (incluyendo la materia, la modalidad presencial o virtual, el horario elegido y sugerencias de salones vacíos cuando sea presencial en el campus), para coordinar mi asesoría de forma inmediata sin necesidad de crear una cuenta.

## Criterios de aceptación

### CA-001-Abrir chat de WhatsApp con mensaje prellenado para sesión presencial en DICIS

Given que el estudiante está viendo el perfil de un tutor con modalidad `#Presencial` en `#DICIS`
And selecciona una etiqueta de materia (por ejemplo, "Cálculo") y un bloque horario disponible
When presiona el botón "Agendar por WhatsApp"
Then el sistema debe abrir `https://wa.me/` hacia el número del tutor con un mensaje prellenado que indique el nombre del tutor, la materia, la modalidad presencial, el día/hora propuestos y los salones de la sede que están vacíos en ese horario

### CA-002-Adaptar mensaje de WhatsApp para modalidad virtual o tutor externo

Given que el estudiante selecciona la modalidad `#Virtual` o contacta a un tutor con etiqueta `#Externo`
When presiona el botón "Agendar por WhatsApp"
Then el mensaje prellenado debe indicar la materia, el horario solicitado y la modalidad virtual (o punto de reunión a acordar) sin exigir un salón físico de la universidad

# HU-EST-07-Reprogramar o cancelar una asesoría directamente con el tutor por WhatsApp

**Prioridad:** Media | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero consultar nuevamente los horarios libres del tutor y los salones vacíos en la plataforma para enviarle un mensaje de reprogramación o cancelación por WhatsApp, para ajustar mi asesoría fácilmente si surge un cambio en mi horario escolar.

## Criterios de aceptación

### CA-001-Consultar nuevo horario y salón vacío para reprogramar

Given que el estudiante necesita cambiar la hora de una asesoría previamente acordada con un tutor
When entra al perfil del tutor o al buscador de salones vacíos y elige un nuevo día y hora disponible
Then puede generar un nuevo mensaje rápido de WhatsApp con la propuesta de nuevo horario y el salón disponible correspondiente

# HU-EST-08-Calificar y dejar un comentario al tutor mediante formulario vinculado

**Prioridad:** Media | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero calificar a un tutor y escribir un comentario sobre su asesoría a través de un botón en su perfil que abra el formulario de evaluación ya vinculado a ese profesor, para compartir mi experiencia y que mi reseña aparezca en su perfil para ayudar a otros alumnos.

## Criterios de aceptación

### CA-001-Abrir formulario de reseña con el tutor preseleccionado

Given que el estudiante se encuentra en el perfil de un tutor específico
When presiona el botón "Calificar a este tutor"
Then el sistema debe abrir el Google Form de evaluación con el identificador y nombre de ese tutor ya prellenados automáticamente en el formulario

### CA-002-Publicación automática del comentario en el perfil del tutor

Given que el estudiante envía su calificación (de 1 a 5 estrellas) y su comentario en el formulario
When se ejecuta el proceso automático de sincronización de datos del sistema
Then el comentario debe asociarse al perfil de ese tutor y su promedio de calificación debe actualizarse automáticamente

# HU-EST-09-Guardar tutores y salones como favoritos en mi dispositivo

**Prioridad:** Media | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero marcar a mis tutores preferidos y mis salones habituales como favoritos sin necesidad de iniciar sesión, para verlos fijados en la pantalla principal cada vez que abra la aplicación desde mi celular o computadora.

## Criterios de aceptación

### CA-001-Agregar y conservar favoritos en el navegador

Given que el estudiante presiona el icono de corazón en la tarjeta de un tutor o de un salón
When recarga la página o cierra y vuelve a abrir el navegador
Then los tutores y salones marcados deben permanecer guardados en el almacenamiento local (`localStorage`) y mostrarse en la sección "Tus Favoritos"

### CA-002-Quitar elemento de favoritos

Given que un tutor o salón ya está marcado como favorito
When el estudiante vuelve a presionar el icono de corazón
Then el elemento debe eliminarse inmediatamente de la sección "Tus Favoritos"

# APARTADO 2: HISTORIAS DE USUARIO — TUTORES

# HU-TUT-01-Consultar salones vacíos para impartir una asesoría (Motor DICIS-Tracker)

**Prioridad:** Alta | **Rol:** Tutor

## Historia de usuario

Como tutor de la comunidad que imparte asesorías presenciales, quiero consultar qué salones de la universidad están vacíos en este momento o en el día y hora en que acordé una asesoría por WhatsApp, para saber exactamente en qué aula desocupada puedo dar mi sesión sin interrumpir clases oficiales.

## Criterios de aceptación

### CA-001-Visualizar salones libres y ocupados en tiempo real

Given que el tutor ingresa a la sección de "Salones" en horario escolar (lunes a sábado de 08:00 a 18:00)
When selecciona su sede activa ("Salamanca" o "Yuriria")
Then el sistema debe separar y mostrar los salones que están "Disponibles" ahora mismo y los que están "Ocupados"

### CA-002-Calcular tiempo libre real encadenando clases consecutivas

Given que el sistema evalúa el horario de un salón en el día seleccionado
When calcula por cuánto tiempo estará libre u ocupado
Then para un salón libre debe mostrar cuántos minutos u horas faltan para su siguiente clase (o "Resto del día" si ya no tiene clases)
And para un salón ocupado que tenga dos o más clases seguidas sin descanso entre ellas, debe sumar los bloques consecutivos y mostrar hasta qué hora real quedará libre

### CA-003-Filtrar salones vacíos por día, hora futura y duración mínima

Given que el tutor acordó por WhatsApp dar una asesoría de 2 horas el jueves a las 11:00
When selecciona en el filtro de tiempo "Jueves", "11:00" y duración mínima "2+ horas"
Then el sistema debe mostrar únicamente los salones que estarán vacíos el jueves a partir de las 11:00 durante al menos 120 minutos continuos

# HU-TUT-02-Recibir solicitudes de alumnos en mi WhatsApp y coordinar la sesión

**Prioridad:** Alta | **Rol:** Tutor

## Historia de usuario

Como tutor, quiero recibir directamente en mi WhatsApp los mensajes de los alumnos interesados junto con la materia, la modalidad (`#Presencial` o `#Virtual`), si solicitan apoyo bajo modalidad `#TutorPar` o sesión particular y la sugerencia de horario y salón vacío, para responderles al instante desde mi teléfono y confirmar si se adapta a mi jornada.

## Criterios de aceptación

### CA-001-Recepción de datos claros en el mensaje de WhatsApp

Given que un alumno presiona el botón de contacto en el perfil del tutor
When se genera el mensaje en WhatsApp
Then el tutor debe recibir claramente el saludo del alumno, la etiqueta de la materia en la que requiere apoyo, la modalidad solicitada, el horario consultado y las opciones de salones vacíos detectadas por la plataforma (cuando sea presencial)

# HU-TUT-03-Solicitar acceso al formulario de tutores ante los administradores y registrar mi perfil (Comunidad DICIS, Tutor Par vs. Externo)

**Prioridad:** Alta | **Rol:** Tutor

## Historia de usuario

Como aspirante a tutor, quiero ver en la sección de registro de tutores de la plataforma las indicaciones claras para solicitar el formulario de alta a los administradores, de modo que al solicitarlo ellos verifiquen si soy parte de la comunidad universitaria (`#DICIS`), si formo parte del programa institucional `#TutorPar` o si soy un asesor `#Externo`, me entreguen el formulario correspondiente y pueda registrar mi foto de perfil, portada tipo Facebook, precios (30 min / 1 h), modalidad (`#Presencial` / `#Virtual`), etiquetas de materias y horarios.

## Criterios de aceptación

### CA-001-Mostrar instrucciones de solicitud previa y verificación en la sección de registro

Given que un interesado en dar asesorías entra al apartado "Quiero ser Tutor" dentro de la plataforma
When visualiza la sección de registro
Then el sistema debe mostrar las instrucciones indicando que el acceso al formulario de alta se otorga únicamente bajo solicitud a los administradores para fines de verificación previa
And debe mostrar el botón de contacto con los administradores indicando qué datos enviar según sea miembro de la comunidad (`#DICIS` / UG, indicando si además es becario `#TutorPar`) o asesor `#Externo`

### CA-002-Registro diferenciado para tutores de la comunidad (`#DICIS` / `#TutorPar`) y tutores `#Externo`

Given que el administrador validó al solicitante y le proporcionó el enlace al formulario correspondiente (Comunidad UG o Externos)
When el tutor completa sus datos (foto de perfil, foto de portada estilo Facebook, indicación de `#TutorPar`, precios de 30 min y 1 hora, modalidad `#Presencial` y/o `#Virtual`, etiquetas de materias como `Cálculo`, `Probabilidad`, `Física` y horarios) y envía el formulario
Then sus datos deben guardarse con la etiqueta `#DICIS` (y `#TutorPar` si aplica, conservando sus precios para sesiones adicionales) o con la etiqueta `#Externo` (si proviene del formulario de externos) para mantenerlos separados en la plataforma

### CA-003-Actualización de perfil existente

Given que un tutor ya verificado desea actualizar sus tarifas, su estado de `#TutorPar`, modalidad, etiquetas o horarios
When envía la actualización a través del formulario autorizado con su mismo identificador
Then el script de sincronización debe actualizar su perfil conservando su etiqueta de origen (`#DICIS` o `#Externo`) sin duplicar su tarjeta

# HU-TUT-04-Consultar espacios de apoyo y recursos universitarios (Biblioteca, cubículos y material UG)

**Prioridad:** Media | **Rol:** Tutor

## Historia de usuario

Como tutor de la comunidad universitaria, quiero consultar una guía rápida de los espacios de estudio adicionales (como áreas de biblioteca, salas de cómputo o cubículos) y recursos de apoyo académico de la UG junto con los horarios de salones vacíos, para elegir el mejor lugar y material para la enseñanza de mi tutorado.

## Criterios de aceptación

### CA-001-Visualizar espacios y recomendaciones por sede

Given que el tutor busca un espacio o recurso para impartir su asesoría presencial
When consulta los detalles de espacios en su sede activa
Then debe visualizar tanto las aulas desocupadas del día como la información de ubicación, edificios (Zona A, B, M, Y, Posgrado, Laboratorios) y recomendaciones de uso de espacios de la universidad

# HU-TUT-05-Reportar incidencias con alumnos mediante formulario de seguimiento

**Prioridad:** Media | **Rol:** Tutor

## Historia de usuario

Como tutor, quiero contar con un acceso a un formulario de reporte para notificar inasistencias reiteradas o malas situaciones con algún alumno, para dejar antecedente ante los administradores del proyecto y prevenir abusos.

## Criterios de aceptación

### CA-001-Enviar reporte de incidencia

Given que el tutor tuvo una mala situación o inasistencia sin aviso tras haber acordado una sesión por WhatsApp
When accede al enlace de "Reportar incidencia de tutoría" y registra los datos de la sesión y el motivo
Then el reporte debe guardarse en la hoja privada de supervisión de los administradores

# HU-TUT-06-Llevar bitácora de asistencia y anotaciones privadas de mis alumnos en mi dispositivo

**Prioridad:** Media | **Rol:** Tutor

## Historia de usuario

Como tutor (especialmente si soy `#TutorPar` y debo entregar reportes de horas y bitácoras de asistencia a la universidad), quiero registrar notas, fecha, duración y asistencia después de cada sesión con mis alumnos (guardadas localmente en mi navegador o descargables), para dar seguimiento a cada alumno y facilitar la entrega de mis bitácoras sin depender de una base de datos externa.

## Criterios de aceptación

### CA-001-Crear y conservar nota de seguimiento y asistencia en el dispositivo

Given que el tutor accede a la herramienta de "Mis Notas / Bitácora de Tutoría" dentro de la plataforma
And escribe el nombre del alumno, la materia (etiqueta), la duración de la sesión y las observaciones (hasta 500 caracteres)
When guarda la anotación
Then la nota debe almacenarse en el almacenamiento local (`localStorage`) de su dispositivo y conservarse al cerrar y volver a abrir la aplicación

### CA-002-Exportar bitácora o enviar resumen de la sesión por WhatsApp

Given que el tutor tiene registros de sesiones en su bitácora local
When selecciona la opción "Descargar bitácora" o "Compartir resumen por WhatsApp"
Then el sistema debe permitirle descargar sus registros para comprobar sus horas de asesoría o enviar los puntos clave al chat del alumno

# APARTADO 3: HISTORIAS DE USUARIO — ADMINISTRADOR / DESARROLLADOR (FLUJO AUTOMATIZADO)

# HU-ADM-01-Sincronizar automáticamente a los tutores desde Google Forms hacia la plataforma

**Prioridad:** Alta | **Rol:** Administrador

## Historia de usuario

Como administrador/desarrollador, quiero que un flujo automatizado (GitHub Actions) lea periódicamente las respuestas de los formularios de tutores (tanto de la comunidad `#DICIS` y `#TutorPar` como de asesores `#Externo`), procese sus fotos de perfil y portada, valide sus etiquetas de materia y modalidad (`#Presencial` / `#Virtual`), y actualice el archivo `tutors.json`, para no tener que dar de alta tutor por tutor en el código.

## Criterios de aceptación

### CA-001-Generar y publicar nuevos tutores automáticamente con sus etiquetas de origen, Tutor Par y modalidad

Given que uno o más tutores autorizados llenaron el formulario de registro con datos válidos
When se ejecuta el flujo automatizado de sincronización en GitHub Actions
Then el script debe transformar las filas en objetos JSON válidos (incluyendo etiqueta de origen `#DICIS` o `#Externo`, etiqueta `#TutorPar` cuando corresponda, etiquetas de modalidad `#Presencial` y/o `#Virtual`, etiquetas de materias, tarifas por 30 min y 1 hora, enlace de WhatsApp y URLs de foto de perfil y portada)
And debe hacer el commit automático a `frontend/src/data/tutors.json` para que Vercel actualice la página web sin intervención manual

### CA-002-Ignorar registros incompletos o desactivados sin detener el sistema

Given que una fila de la hoja de cálculo no tiene número de WhatsApp válido o tiene la casilla de visibilidad desmarcada
When corre el script de sincronización
Then debe omitir únicamente esa fila y continuar publicando al resto de los tutores activos sin generar errores

# HU-ADM-02-Asignar y publicar automáticamente los comentarios de alumnos al perfil de cada tutor

**Prioridad:** Alta | **Rol:** Administrador

## Historia de usuario

Como administrador/desarrollador, quiero que el script de sincronización lea las respuestas del Google Form de reseñas, agrupe los comentarios por el ID de cada tutor y calcule su promedio de estrellas automáticamente, para que las opiniones de los alumnos aparezcan en el perfil de su profesor sin capturarlas a mano.

## Criterios de aceptación

### CA-001-Vincular reseñas al tutor correspondiente y calcular promedio

Given que existen nuevas calificaciones y comentarios enviados por alumnos en el formulario de reseñas
When se ejecuta la sincronización automática
Then cada comentario debe asociarse únicamente al tutor cuyo ID coincide con el registro
And debe recalcularse el promedio de estrellas (de 1.0 a 5.0) y el total de reseñas de ese tutor en `tutors.json` / `reviews.json`

### CA-002-Filtrar comentarios vacíos o con palabras prohibidas

Given que un registro del formulario de reseñas contiene palabras de una lista negra de insultos o tiene una puntuación fuera del rango 1 a 5
When el script procesa las reseñas
Then dicho comentario debe descartarse automáticamente para mantener limpia la plataforma

# HU-ADM-03-Modificar datos o dar de baja tutores y comentarios desde Google Sheets

**Prioridad:** Media | **Rol:** Administrador

## Historia de usuario

Como administrador, quiero poder editar los datos de un tutor, activar o desactivar su etiqueta `#TutorPar`, cambiar su etiqueta entre `#DICIS` y `#Externo`, corregir sus materias o dar de baja un perfil o comentario directamente desde la hoja de Google Sheets, para administrar toda la plataforma desde cualquier lugar sin necesidad de abrir el código fuente.

## Criterios de aceptación

### CA-001-Reflejar edición o baja en la siguiente sincronización

Given que el administrador edita el precio, la columna `TutorPar`, las etiquetas o cambia la columna "Activo" a "NO" de un tutor en Google Sheets
When se ejecuta el flujo de actualización
Then los cambios deben reflejarse en la página web (actualizando la tarjeta del tutor o retirándolo del directorio público si fue dado de baja)

# HU-ADM-04-Actualizar automáticamente los horarios de asignaturas y salones desde los PDFs de la UG

**Prioridad:** Alta | **Rol:** Administrador

## Historia de usuario

Como administrador, quiero que el flujo de GitHub Actions descargue automáticamente los PDFs de horarios oficiales del portal de la UG, unifique nombres de aulas con errores tipográficos y actualice `rooms.json` y `classes.json`, para que el buscador de salones vacíos siempre refleje el semestre actual sin mantenimiento manual.

## Criterios de aceptación

### CA-001-Extracción semanal y protección contra datos parciales

Given que el flujo programado (`scraper.yml`) se ejecuta automáticamente o se dispara al inicio del semestre
When descarga y procesa los horarios de las sedes de la DICIS
Then debe actualizar los archivos de salones, materias y horarios de clases
And si el portal de la UG falla o no devuelve datos completos, debe abortar sin borrar los horarios vigentes

# HU-ADM-05-Verificar solicitantes antes de entregar el formulario de tutores y separar miembros de la comunidad (`#DICIS` / `#TutorPar`) de asesores (`#Externo`)

**Prioridad:** Alta | **Rol:** Administrador

## Historia de usuario

Como administrador/desarrollador, quiero que el formulario de alta de tutores solo se entregue cuando el interesado lo solicite, para verificar en ese momento si realmente pertenece a la comunidad universitaria (asignándole el formulario de `#DICIS` con insignia de verificado y validando si es becario `#TutorPar`) o si es una persona ajena a la institución (entregándole el formulario separado para asignarle la etiqueta `#Externo`).

## Criterios de aceptación

### CA-001-Verificación de pertenencia a la comunidad DICIS / UG y modalidad Tutor Par al solicitar el formulario

Given que un aspirante solicita el enlace para registrarse como tutor
And comprueba que es estudiante, egresado o docente de la DICIS / UG (mediante correo `@ugto.mx`, credencial vigente o constancia de Beca de Comunidad Universitaria si solicita la etiqueta `#TutorPar`)
When el administrador aprueba su solicitud
Then le proporciona el formulario de la comunidad que le asigna automáticamente la etiqueta `#DICIS`, la insignia de "Tutor Verificado" y, cuando corresponda, la etiqueta `#TutorPar`

### CA-002-Separación de asesores externos mediante formulario o pestaña independiente

Given que un aspirante solicita ofrecer asesorías pero no pertenece a la comunidad de la Universidad de Guanajuato
When el administrador atiende su solicitud
Then le proporciona el formulario específico para asesores externos (o lo registra en el apartado de externos)
And el sistema le asigna obligatoriamente la etiqueta `#Externo` para que en la plataforma quede claramente separado de la comunidad universitaria

## 3. Propuestas Extra — Historias de Usuario Recomendadas que Faltaron

Para redondear esta versión con **Solicitud de Formulario Verificada (`#DICIS` / `#TutorPar` vs. `#Externo`) + Modalidad (`#Presencial` / `#Virtual`) + Fotos estilo Facebook + Precios (30m/1h) + Etiquetas + WhatsApp + Salones Vacíos**, te recomiendo estas **6 historias extra**:

| Código | Historia Propuesta | Qué aporta a tu proyecto | 
| ----- | ----- | ----- | 
| **HU-EXT-01** | **Filtrar y ordenar tutores por precio (30 min / 1 hora, `#TutorPar` o Gratuitos)** | Como los tutores pondrán en el Form su tarifa por media hora y por hora (incluso si son `#TutorPar` para horas extra), permite a los alumnos filtrar u ordenar para ver primero los tutores pares o los más económicos. | 
| **HU-EXT-02** | **Cruzar automáticamente el horario libre del tutor `#DICIS` `#Presencial` con los salones vacíos dentro de su perfil** | Cuando el tutor es de `#DICIS` y da servicio `#Presencial`, dentro de su mismo perfil el sistema le muestra al alumno: *"Martes 12:00–13:00 (Disponible en Salón B102 o A105)"*. | 
| **HU-EXT-03** | **Conversión automática de enlaces de Google Drive para las fotos de perfil y portada** | Cuando el tutor sube su foto de perfil y banner en el Google Form, el script de Python convierte o descarga automáticamente esas fotos de Google Drive para que el banner tipo Facebook cargue rápido y sin fallos de permisos. | 
| **HU-EXT-04** | **Ventana de "Quiero ser Tutor" con requisitos y botón directo para solicitar el Form a los Administradores** | Muestra en la web las reglas claras, qué diferencia hay entre tutor `#DICIS`, `#TutorPar` y `#Externo`, y un botón de WhatsApp/Correo que le manda el mensaje listo al administrador para pedir el link del formulario. | 
| **HU-EXT-05** | **Compartir tarjeta de tutor por enlace directo o código QR** | Permite que cada tutor tenga un enlace directo (ej. `.../tutors?id=juan-perez`) para que él mismo pueda compartir su perfil verificado en grupos de WhatsApp o Facebook de la comunidad. | 
| **HU-EXT-06** | **Instalación como App en el celular (PWA) con modo oscuro circular** | Aprovecha lo que ya trae el repositorio de [DICIS-Tracker](https://github.com/moraxh/DICIS-Tracker/tree/main) (`@ducanh2912/next-pwa` y `ThemeToggle`) para que tu plataforma se instale como aplicación en Android/iOS gratis. | 

# DETALLE DE LAS HISTORIAS EXTRA PROPUESTAS (FORMATO `user_stories.md`)

# HU-EXT-01-Filtrar y ordenar tutores por tarifa de media hora u hora completa

**Prioridad:** Media | **Rol:** Estudiante

## Historia de usuario

Como estudiante, quiero filtrar u ordenar a los tutores según su precio base por 30 minutos o por 1 hora (incluyendo la distinción de quiénes tienen horas gratuitas bajo `#TutorPar` o dan asesorías gratuitas), para encontrar un asesor que se ajuste a mi presupuesto.

## Criterios de aceptación

### CA-001-Mostrar precios claros junto con la etiqueta Tutor Par cuando aplique

Given que el tutor registró en el formulario su tarifa por 30 minutos y por 1 hora
When el estudiante visualiza la tarjeta del tutor
Then debe ver ambos precios claramente formateados en pesos mexicanos (por ejemplo, `$50 / 30 min · $90 / 1 h`) o la etiqueta `"Gratuito"` si colocó `$0`
And si además cuenta con la etiqueta `#TutorPar`, debe mostrar ambos indicadores para que el alumno sepa que tiene horas de beca gratuitas y tarifas para horas extra

### CA-002-Ordenar de menor a mayor precio

Given que existen varios tutores para la etiqueta seleccionada (por ejemplo, `#Cálculo`)
When el estudiante selecciona ordenar por "Menor precio"
Then el listado debe ordenarse colocando primero a los tutores con `#TutorPar` / gratuitos y posteriormente de menor a mayor tarifa por hora

# HU-EXT-02-Mostrar salones vacíos compatibles directamente dentro del horario del tutor presencial

**Prioridad:** Alta | **Rol:** Estudiante / Tutor

## Historia de usuario

Como estudiante o tutor, quiero que al ver los bloques de horario disponibles dentro del perfil de un tutor de `#DICIS` que ofrece modalidad `#Presencial`, el sistema me muestre automáticamente qué salones de su sede están vacíos en cada uno de esos bloques, para elegir el horario y el salón en un solo paso antes de abrir WhatsApp.

## Criterios de aceptación

### CA-001-Cruzar disponibilidad del tutor presencial con salones libres de la sede

Given que un tutor con etiqueta `#DICIS` y modalidad `#Presencial` en la sede Salamanca indicó en el formulario que tiene disponibilidad los miércoles de 10:00 a 12:00
When el estudiante abre el perfil de ese tutor
Then junto al bloque "Miércoles 10:00 - 12:00" el sistema debe mostrar cuántos salones están vacíos en ese mismo horario y sugerir los primeros disponibles (por ejemplo, `Salones libres: 101, B202, C104`)

### CA-002-Omitir sugerencia de salones de la UG para tutores exclusivamente virtuales o externos

Given que un tutor tiene únicamente la etiqueta `#Virtual` o la etiqueta `#Externo`
When el estudiante consulta sus bloques de horario en el perfil
Then el sistema debe mostrar sus horarios disponibles con el indicador `"Sesión Virtual / Punto a acordar"` sin asignarle salones internos de la universidad

# HU-EXT-03-Procesar y optimizar automáticamente las fotos de perfil y portada desde Google Drive

**Prioridad:** Alta | **Rol:** Administrador (Sistema Automático)

## Historia de usuario

Como desarrollador, quiero que el script de sincronización transforme automáticamente los enlaces de archivos subidos en Google Forms (foto de perfil y banner de portada tipo Facebook) en imágenes públicas optimizadas, para que todas las fotos carguen rápido y sin errores de permisos en la página web.

## Criterios de aceptación

### CA-001-Transformación de enlaces de Google Drive a imagen directa

Given que un tutor subió una imagen de perfil y una imagen de portada en el Google Form
When el script de Python procesa la fila correspondiente de Google Sheets
Then debe extraer el ID del archivo de Google Drive y generar la URL pública de visualización directa (o descargar y comprimir la imagen en el repositorio)

### CA-002-Respaldo ante enlace inválido o privado

Given que la imagen subida por el tutor fue eliminada o no es un formato de imagen válido
When se renderiza el perfil en el navegador
Then el componente debe cargar automáticamente la imagen de portada o avatar por defecto

# HU-EXT-04-Sección informativa "Quiero ser Tutor" con solicitud de formulario a los administradores

**Prioridad:** Alta | **Rol:** Tutor / Administrador

## Historia de usuario

Como aspirante a tutor, quiero encontrar dentro de la página web una sección o ventana modal llamada "Quiero ser Tutor" donde se expliquen los requisitos y tenga botones claros ("Soy de la comunidad DICIS / UG o Tutor Par" y "Soy Asesor Externo") para solicitar el enlace del formulario a los administradores, agilizando mi verificación inicial.

## Criterios de aceptación

### CA-001-Mostrar aviso de acceso bajo solicitud y botones diferenciados

Given que un usuario presiona el botón "Quiero ser Tutor" en la página web
When se despliega la ventana informativa
Then debe leer claramente que el formulario de alta se entrega únicamente bajo solicitud a los administradores para verificar su pertenencia
And debe contar con una opción para solicitar el formulario como miembro de la comunidad (`#DICIS` / UG / `#TutorPar`) y otra opción para solicitar el formulario como asesor `#Externo`

# HU-EXT-05-Compartir el perfil de un tutor mediante enlace directo

**Prioridad:** Baja (Posterior) | **Rol:** Tutor / Estudiante

## Historia de usuario

Como tutor o estudiante, quiero poder copiar un enlace directo que abra la plataforma con el perfil de un tutor específico ya desplegado, para compartirlo fácilmente en grupos de WhatsApp o redes sociales de la universidad.

## Criterios de aceptación

### CA-001-Abrir perfil automáticamente desde parámetro en la URL

Given que un usuario entra a un enlace con el identificador del tutor (por ejemplo, `/tutors?id=abc123`)
When carga la página
Then debe abrirse automáticamente el modal o vista completa del perfil de ese tutor mostrando su portada, foto, etiquetas (`#DICIS` o `#Externo`, `#TutorPar`, `#Presencial` / `#Virtual`), precios y botón de WhatsApp

# HU-EXT-06-Instalar la plataforma como aplicación móvil (PWA) con soporte de tema claro y oscuro

**Prioridad:** Baja (Posterior) | **Rol:** Estudiante / Tutor

## Historia de usuario

Como estudiante o tutor, quiero poder instalar la página web como una aplicación en la pantalla de inicio de mi teléfono (PWA) y alternar entre modo claro y oscuro, para consultar tutores y salones vacíos cómodamente desde mi celular sin gastar espacio de almacenamiento.

## Criterios de aceptación

### CA-001-Permitir instalación como PWA y conservar el tema visual

Given que el usuario accede a la plataforma desde un navegador móvil o de escritorio compatible
When selecciona "Instalar aplicación" o "Agregar a la pantalla de inicio" y elige su preferencia de tema (Claro, Oscuro o Sistema)
Then la aplicación debe abrirse en ventana independiente como app nativa y recordar el tema visual seleccionado en futuras visitas


## 4. Diseño Exacto de los Formularios (Google Forms), Hoja de Control (Google Sheets) y Esquema JSON

Para que puedas crear los dos formularios en minutos y conectarlos con el repositorio sin capturar datos a mano, aquí tienes la especificación exacta de preguntas, validaciones, columnas de control y el formato final de `tutors.json` y `reviews.json`.

### 4.1 Flujo Previo en la Web: Cómo Solicitan el Formulario a los Administradores

En la página web, al presionar **"Quiero ser Tutor"**, el usuario no entra a un formulario público sin control, sino que ve una tarjeta con las reglas y **dos botones de solicitud por WhatsApp/Correo hacia los administradores**:

* **Botón A — "Soy de la comunidad DICIS / UG (o Tutor Par)":** Abre un mensaje prellenado para el administrador: *"Hola, quiero registrarme como tutor de la comunidad #DICIS en Tutores DICIS. Mi correo institucional es [ @ugto.mx ] y [sí / no] participo en el programa #TutorPar."* Tras verificarlo en segundos, el administrador le pasa el enlace del formulario con su código/origen `#DICIS` (y `#TutorPar` si aplica).
* **Botón B — "Soy Asesor Externo":** Abre un mensaje prellenado: *"Hola, soy asesor externo a la UG y me gustaría publicar mis asesorías con la etiqueta #Externo en la plataforma."* El administrador le comparte el enlace prellenado que fija automáticamente su etiqueta como `#Externo`.

### 4.2 Formulario 1 — Registro y Actualización de Tutores (Google Forms)

Puedes usar **un solo Google Form** (usando enlaces prellenados para fijar `#DICIS`, `#TutorPar` o `#Externo`) o dos formularios separados que guarden respuestas en la misma hoja de Google Sheets. Estas son las preguntas exactas que debe llevar:

| # | Pregunta en el Google Form | Tipo de campo en Forms | Regla de validación / Propósito en el sistema |
| :--- | :--- | :--- | :--- |
| **1** | **Correo electrónico (Institucional `@ugto.mx` para comunidad UG, o personal para externos)** | Respuesta corta | **Obligatorio (Validación de correo).** Funciona como llave única: si el tutor vuelve a llenar el form con el mismo correo, el script actualiza su perfil en vez de duplicarlo. |
| **2** | **Nombre completo (o nombre como quieres aparecer en tu tarjeta)** | Respuesta corta | **Obligatorio (Máx. 60 caracteres).** Se muestra como título principal del perfil. |
| **3** | **Origen / Pertenencia validada** | Varias opciones *(o prellenado por el admin)* | **Obligatorio.** Opciones: `Comunidad UG - DICIS (#DICIS)` (escalable a más campus UG) o `Asesor Independiente (#Externo)`. |
| **4** | **¿Participas actualmente en el programa institucional de Asesorías Entre Pares (Beca de Comunidad Universitaria UG)?** | Varias opciones | **Obligatorio.** Opciones: `Sí, cuento con horas de Asesoría Par gratuita (#TutorPar)` / `No`. *(El script solo activa `#TutorPar` si su origen es `#DICIS`/UG).* |
| **5** | **Carrera, posgrado o perfil profesional** | Desplegable / Respuesta corta | **Obligatorio.** Ejemplo: *Ing. en Sistemas Computacionales*, *Ing. Mecánica*, *Ing. en Comunicaciones y Electrónica*, *Egresado / Docente*, etc. |
| **6** | **Semestre actual o grado académico** | Desplegable | **Obligatorio.** Opciones: `1° a 10° Semestre`, `Egresado(a)`, `Posgrado (Maestría/Doctorado)`, `Docente / Asesor Externo`. |
| **7** | **Modalidad en la que impartes tus asesorías** | Casillas de verificación | **Obligatorio (Mínimo 1).** Opciones: `Presencial (#Presencial)` y `Virtual / En línea (#Virtual)`. |
| **8** | **Sede principal para asesorías presenciales** | Desplegable | **Obligatorio.** Opciones: `Salamanca`, `Yuriria`, `Solo Virtual / Punto externo a acordar`. |
| **9** | **Número de WhatsApp (10 dígitos, sin espacios ni +52)** | Respuesta corta | **Obligatorio.** Validación por expresión regular `^\d{10}$`. Sirve para armar el botón directo `https://wa.me/52...`. |
| **10** | **Precio base por 30 minutos (en pesos MXN)** | Respuesta corta (Número) | **Obligatorio (Número `>= 0`).** *Nota en el form:* "Si eres `#TutorPar`, tus compañeros verán que tienes horas gratuitas por beca, pero puedes indicar tu tarifa para horas extra o sesiones particulares extensas. Pon `0` si no cobras". |
| **11** | **Precio base por 1 hora (en pesos MXN)** | Respuesta corta (Número) | **Obligatorio (Número `>= 0`).** |
| **12** | **Nota breve sobre tus precios o condiciones de `#TutorPar` (Opcional)** | Respuesta corta | **Opcional (Máx. 120 caracteres).** Ejemplo: *"1 hora gratis por semana en horario de Tutor Par; sesiones de 2+ horas $80/h"*. |
| **13** | **Etiquetas de materias que impartes** | Casillas de verificación | **Obligatorio (Mínimo 1).** Opciones: `Cálculo`, `Probabilidad`, `Álgebra Lineal`, `Ecuaciones Diferenciales`, `Física`, `Programación`, `Circuitos / Electrónica`, `Termodinámica`, `Química`, `Inglés`, más campo `Otros`. |
| **14** | **Sobre mí / Experiencia y temas específicos que dominas** | Párrafo | **Obligatorio (Máx. 350 caracteres).** Aparece en la descripción del perfil del tutor. |
| **15** | **Horarios disponibles por día (Lunes a Sábado)** | Cuadrícula de casillas de verificación | **Obligatorio.** Filas: `Lunes` a `Sábado`. Columnas: bloques de `08:00–10:00`, `10:00–12:00`, `12:00–14:00`, `14:00–16:00`, `16:00–18:00`. Permite cruzar su horario con los **salones vacíos**. |
| **16** | **Foto de perfil (Formato cuadrado recomendado)** | Subir archivo | **Opcional (Solo imagen, máx. 5 MB).** Si no sube una, se asigna un avatar por defecto. |
| **17** | **Imagen de fondo / Portada estilo Facebook (Formato horizontal 16:9 recomendado)** | Subir archivo | **Opcional (Solo imagen, máx. 5 MB).** Se muestra como banner superior en su tarjeta y modal de perfil. |

### 4.3 Formulario 2 — Comentarios y Calificaciones de Alumnos (Google Forms con Enlace Prellenado)

Para que el comentario de un alumno se asigne automáticamente al tutor correcto sin que el desarrollador intervenga, en Google Forms usas la opción **"Obtener enlace prellenado"**. Cuando el alumno hace clic en **"Calificar a este tutor"** dentro del perfil del profesor en la web, se abre este formulario de 5 preguntas:

| # | Pregunta en el Google Form de Reseñas | Tipo de campo | Cómo funciona automáticamente |
| :--- | :--- | :--- | :--- |
| **1** | **ID del Tutor (No modificar)** | Respuesta corta *(Prellenado desde la URL)* | La página web inyecta automáticamente el hash del tutor en el link (ej. `?entry.1001=a8f9c2...`). El alumno ya lo ve lleno. |
| **2** | **Nombre del Tutor evaluado** | Respuesta corta *(Prellenado desde la URL)* | Muestra el nombre del tutor (ej. `Ing. Carlos Mendoza`) para que el alumno confirme visualmente a quién está calificando. |
| **3** | **Calificación general de la asesoría** | Escala lineal (`1` a `5` estrellas) | **Obligatorio.** `1 = Muy mala`, `5 = Excelente`. El script de Python promedia todas las respuestas de ese `tutorId`. |
| **4** | **Materia o etiqueta en la que tomaste la asesoría y modalidad** | Respuesta corta / Desplegable | **Obligatorio.** Ejemplo: `Cálculo · Presencial (Tutor Par)`. Se muestra como subtítulo de la reseña. |
| **5** | **Tu comentario o recomendación para otros estudiantes** | Párrafo | **Obligatorio (Entre 10 y 300 caracteres).** El script verifica que no contenga insultos y lo agrega a la lista de reseñas del tutor. |

### 4.4 Columnas de Control del Administrador en Google Sheets

En la hoja de **Google Sheets** donde caen las respuestas del Formulario 1 (Tutores), tú y los demás administradores solo agregan **3 columnas al final de la tabla** (con valores por defecto automáticos) para tener el control total desde el celular o la PC sin abrir código:

* **`Columna Aprobado_Admin` (`SÍ` / `NO`):** Si alguien ajeno llegara a conseguir el link del formulario sin permiso, su fila queda en `NO` hasta que verifiques su solicitud. Si algún día quieres dar de baja a un tutor, cambias `SÍ` por `NO`.
* **`Columna Etiqueta_Comunidad_Confirmada` (`DICIS` / `Externo`):** Confirma si el tutor lleva la etiqueta institucional `#DICIS` o si lleva obligatoriamente la etiqueta `#Externo`.
* **`Columna Tutor_Par_Confirmado` (`SÍ` / `NO`):** Confirma si el tutor tiene derecho a mostrar la insignia `#TutorPar` del programa de *Asesorías Entre Pares UG*.

### 4.5 Estructura del Archivo `frontend/src/data/tutors.json` que Generará el Script

Así lucirá cada registro dentro de `tutors.json` generado automáticamente por GitHub Actions a partir de Google Sheets, listo para ser leído por tus componentes de React igual que `professors.json` y `rooms.json` en [DICIS-Tracker](https://github.com/moraxh/DICIS-Tracker/tree/main):

```json
[
  {
    "id": "t_9f8e7d6c5b4a3210",
    "fullName": "Alejandro Morales Rivera",
    "academicProfile": "Ingeniería en Sistemas Computacionales · 7° Semestre",
    "communityTag": "DICIS",
    "isExternal": false,
    "isTutorPar": true,
    "verified": true,
    "modalities": ["PRESENCIAL", "VIRTUAL"],
    "headquarters": "Salamanca",
    "whatsapp": "4641234567",
    "pricing": {
      "halfHour": 45,
      "fullHour": 80,
      "currency": "MXN",
      "tutorParNote": "Asesorías gratuitas dentro de mi horario de Beca Tutor Par (máx. 1 h por sesión). Sesiones particulares o extensas: $45 / 30 min · $80 / 1 h."
    },
    "subjectTags": [
      "Cálculo",
      "Probabilidad",
      "Programación",
      "Álgebra Lineal"
    ],
    "bio": "Asesor Par en DICIS con 2 semestres apoyando en Cálculo Diferencial e Integral, Probabilidad y programación en Python/C++.",
    "avatarUrl": "/tutors/avatars/t_9f8e7d6c5b4a3210.webp",
    "coverUrl": "/tutors/covers/t_9f8e7d6c5b4a3210.webp",
    "availability": [
      { "day": "MONDAY", "start": "12:00", "end": "14:00" },
      { "day": "WEDNESDAY", "start": "10:00", "end": "12:00" },
      { "day": "FRIDAY", "start": "12:00", "end": "14:00" }
    ],
    "rating": {
      "average": 4.9,
      "count": 14
    },
    "reviews": [
      {
        "id": "r_101",
        "subjectTag": "Probabilidad",
        "modality": "PRESENCIAL",
        "stars": 5,
        "comment": "Explica muy claro los temas de variables aleatorias y nos vimos en un salón libre del edificio B.",
        "date": "2026-10-28"
      }
    ]
  }
]
```