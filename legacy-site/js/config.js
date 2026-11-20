/* ============================================================
   EDIT THIS FILE. It holds everything personal on the site.
   Leave a value as "" and that part simply does not appear.
   ============================================================ */
window.SITE = {
  name: "Angello",                       // big name in the hero (use your own name if you prefer)
  github: "https://github.com/itz-angello",
  discord: "",                            // your Discord username, e.g. "angello"
  email: "",                              // shown as text only if you fill it in
  cv: "",                                 // e.g. "assets/cv.pdf" (put the file in the assets folder)
  photo: "",                              // e.g. "assets/me.png" (replaces the drawn browser in the hero)

  // Contact form:
  //  - On Netlify it works as is (Netlify Forms). Messages appear in your Netlify dashboard.
  //  - To use Formspree instead, paste its URL here: "https://formspree.io/f/xxxxxxx"
  formAction: "",

  projects: [
    {
      kind: { en: "Company", es: "Empresa" },
      name: "WebForge",
      desc: { en: "My own studio. Websites built for small businesses.", es: "Mi propio estudio. Páginas web para pequeños negocios." },
      tags: [],                           // e.g. ["HTML", "CSS", "JavaScript"]
      url: "",                            // link to the live site
      image: ""                           // e.g. "assets/webforge.png"
    },
    {
      kind: { en: "Client", es: "Cliente" },
      name: "Chapin Stock",
      desc: { en: "A website built for a client.", es: "Una página web hecha para un cliente." },
      tags: [],
      url: "",
      image: ""
    },
    {
      kind: { en: "Personal", es: "Personal" },
      name: "Para Boo",
      desc: { en: "A personal project.", es: "Un proyecto personal." },
      tags: [],
      url: "",
      image: ""
    }
  ],

  // Only list what you really use. group: "languages", "tools" or "craft"
  skills: [
    { name: "HTML",              group: "languages", note: { en: "Page structure and content.", es: "Estructura y contenido de las páginas." } },
    { name: "CSS",               group: "languages", note: { en: "Layout, colors and animation.", es: "Diseño, colores y animación." } },
    { name: "JavaScript",        group: "languages", note: { en: "Interactive parts of a site.", es: "Las partes interactivas de un sitio." } },
    { name: "Git",               group: "tools",     note: { en: "Version control for every project.", es: "Control de versiones en cada proyecto." } },
    { name: "GitHub",            group: "tools",     note: { en: "Where the code of each project lives.", es: "Donde vive el código de cada proyecto." } },
    { name: "Responsive design", group: "craft",     note: { en: "Sites that work on phone, tablet and desktop.", es: "Sitios que funcionan en teléfono, tableta y computadora." } },
    { name: "Website restoration", group: "craft",   note: { en: "Rebuilding old or broken sites.", es: "Reconstruir sitios viejos o rotos." } }
  ]
};
