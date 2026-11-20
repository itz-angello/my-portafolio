# Portafolio personal (Angello)

Sitio estático (HTML, CSS y JavaScript). No necesita instalar nada.

## Qué contiene
- Botón EN / ES que cambia todos los textos.
- Proyectos, habilidades con filtros, servicios y formulario de contacto.
- Animaciones al hacer scroll y una banda que se desplaza.

## Lo que tienes que editar
Todo lo personal está en **js/config.js**. Ábrelo con el Bloc de notas o con VS Code:
- `name`: el nombre grande de arriba.
- `discord` y `email`: se muestran solo si los llenas.
- `projects`: descripción, tecnologías (`tags`), link (`url`) e imagen (`image`) de cada proyecto.
- `skills`: deja solo lo que de verdad manejas.
- `photo` y `cv`: pon el archivo en la carpeta `assets` y escribe su ruta, por ejemplo `assets/me.png`.

Los textos generales (descripción, servicios) están en **js/main.js**, arriba, en la sección `Texts in both languages`.

## Probarlo en tu computador
Abre `index.html` con doble clic. El formulario no enviará mensajes hasta que esté publicado.

## Publicarlo gratis en Netlify
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta completa (la que contiene `index.html`).
3. Netlify te da un link. Ese es tu portafolio.
4. El formulario funciona solo. Los mensajes llegan a tu panel de Netlify, en la sección Forms.

## Formulario con Formspree (alternativa)
Crea un formulario en https://formspree.io, copia su URL y pégala en `formAction` dentro de `js/config.js`.

## Imágenes de los proyectos
Toma una captura de cada página, guárdala en `assets/` y escribe la ruta en `image`. Mejor en formato 16:10 y de menos de 400 KB.
