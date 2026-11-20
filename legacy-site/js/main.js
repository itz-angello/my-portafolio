(function () {
  var C = window.SITE || {};

  /* ---------- Texts in both languages ---------- */
  var T = {
    en: {
      skip: "Skip to content", menu: "Menu",
      nav_about: "About", nav_projects: "Projects", nav_skills: "Skills", nav_services: "Services", nav_contact: "Contact",
      hero_tag: "I'm a web developer from Guatemala. I build websites for small businesses and freelance clients.",
      hero_cta: "Contact me",
      marquee: "Websites|Landing pages|Redesigns|Fast loading|Mobile first|Updates and fixes",
      about_title: "About",
      about_lead: "I make websites that load fast, look good on a phone and are easy for customers to use.",
      about_1: "I'm a web developer based in Guatemala. I build and restore websites for small businesses and take freelance projects from clients abroad.",
      about_2: "I am open to freelance projects and long-term clients.",
      cv: "Download CV",
      projects_title: "Projects", live: "Live project",
      skills_title: "Skills", all: "All", languages: "Languages", tools: "Tools", craft: "Craft",
      skill_count: "{n} skills shown", skill_pick: "Select a skill to read more.",
      services_title: "Services",
      s1_t: "Business websites", s1_d: "A full site for a shop, restaurant or service business, built to load fast and read well on a phone.",
      s2_t: "Landing pages", s2_d: "One focused page for a product, an offer or an event, with a clear button for the visitor to press.",
      s3_t: "Website restoration", s3_d: "If your current site is old, broken or hard to use on a phone, I rebuild it and keep what already works.",
      s4_t: "Updates and fixes", s4_d: "Text changes, new sections, bug fixes and small improvements after your site is live.",
      contact_title: "Need a website?",
      contact_text: "Tell me about your business and what you need.",
      f_name: "Name", f_email: "Email", f_msg: "Message", f_send: "Send",
      sending: "Sending...", sent: "Message sent. Thank you.",
      fail: "The message could not be sent. Try again or write to me on GitHub or Discord.",
      footer: "Built in Guatemala."
    },
    es: {
      skip: "Saltar al contenido", menu: "Menú",
      nav_about: "Sobre mí", nav_projects: "Proyectos", nav_skills: "Habilidades", nav_services: "Servicios", nav_contact: "Contacto",
      hero_tag: "Soy desarrollador web en Guatemala. Creo páginas web para pequeños negocios y clientes freelance.",
      hero_cta: "Contáctame",
      marquee: "Páginas web|Landing pages|Rediseños|Carga rápida|Pensado para el celular|Mejoras y arreglos",
      about_title: "Sobre mí",
      about_lead: "Hago páginas web que cargan rápido, se ven bien en el celular y son fáciles de usar para los clientes.",
      about_1: "Soy desarrollador web en Guatemala. Creo y restauro páginas web para pequeños negocios y tomo proyectos freelance de clientes en el extranjero.",
      about_2: "Estoy abierto a proyectos freelance y a clientes a largo plazo.",
      cv: "Descargar CV",
      projects_title: "Proyectos", live: "Ver proyecto",
      skills_title: "Habilidades", all: "Todas", languages: "Lenguajes", tools: "Herramientas", craft: "Oficio",
      skill_count: "{n} habilidades", skill_pick: "Elige una habilidad para leer más.",
      services_title: "Servicios",
      s1_t: "Páginas para negocios", s1_d: "Un sitio completo para una tienda, restaurante o negocio de servicios, hecho para cargar rápido y leerse bien en el celular.",
      s2_t: "Landing pages", s2_d: "Una página enfocada en un producto, una oferta o un evento, con un botón claro para el visitante.",
      s3_t: "Restauración de páginas", s3_d: "Si tu página actual es vieja, está rota o es difícil de usar en el celular, la reconstruyo y conservo lo que ya funciona.",
      s4_t: "Cambios y arreglos", s4_d: "Cambios de texto, secciones nuevas, errores corregidos y pequeñas mejoras cuando tu página ya está publicada.",
      contact_title: "¿Necesitas una página web?",
      contact_text: "Cuéntame sobre tu negocio y qué necesitas.",
      f_name: "Nombre", f_email: "Correo", f_msg: "Mensaje", f_send: "Enviar",
      sending: "Enviando...", sent: "Mensaje enviado. Gracias.",
      fail: "No se pudo enviar el mensaje. Intenta de nuevo o escríbeme por GitHub o Discord.",
      footer: "Hecho en Guatemala."
    }
  };

  var lang = "en";
  try {
    var saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "es") lang = saved;
    else if ((navigator.language || "").toLowerCase().indexOf("es") === 0) lang = "es";
  } catch (e) {}

  function t(k) { return (T[lang] && T[lang][k]) || T.en[k] || k; }
  function pick(o) { return typeof o === "string" ? o : (o && (o[lang] || o.en)) || ""; }
  function $(s) { return document.querySelector(s); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  /* ---------- Static pieces ---------- */
  var name = C.name || "Angello";
  $("#logoName").textContent = name;
  $("#wordmark").textContent = name;
  $("#footName").textContent = name;

  if (C.photo) {
    var art = $("#heroArt");
    art.innerHTML = "";
    var img = el("img", "photo");
    img.src = C.photo; img.alt = name;
    art.appendChild(img);
  }
  if (C.cv) { var cv = $("#cvLink"); cv.href = C.cv; cv.hidden = false; cv.setAttribute("download", ""); }

  /* ---------- Marquee ---------- */
  function renderMarquee() {
    var words = t("marquee").split("|");
    var m = $("#marquee");
    m.innerHTML = "";
    for (var r = 0; r < 4; r++) words.forEach(function (w) { m.appendChild(el("span", "", w + " /")); });
  }

  /* ---------- Projects ---------- */
  function renderProjects() {
    var stack = $("#stack");
    stack.innerHTML = "";
    var variants = ["", "v2", "v3"];
    (C.projects || []).forEach(function (p, i) {
      var card = el("article", "card reveal");
      var info = el("div");
      info.appendChild(el("p", "kind", pick(p.kind)));
      info.appendChild(el("h3", "", p.name));
      info.appendChild(el("p", "desc", pick(p.desc)));
      if (p.tags && p.tags.length) {
        var ul = el("ul", "tags");
        p.tags.forEach(function (g) { ul.appendChild(el("li", "", g)); });
        info.appendChild(ul);
      }
      if (p.url) {
        var a = el("a", "pill", t("live"));
        a.href = p.url; a.target = "_blank"; a.rel = "noopener";
        info.appendChild(a);
      }
      var shot;
      if (p.image) {
        shot = el("img", "shot"); shot.src = p.image; shot.alt = p.name; shot.loading = "lazy";
      } else {
        shot = el("div", "shot " + variants[i % 3]); shot.setAttribute("aria-hidden", "true");
        shot.innerHTML = '<div class="bar big"></div><div class="bar" style="width:80%"></div><div class="bar" style="width:55%"></div><div class="tiles"><b></b><b></b><b></b></div>';
      }
      card.appendChild(info); card.appendChild(shot);
      stack.appendChild(card);
    });
    observeReveal();
  }

  /* ---------- Skills ---------- */
  var filter = "all", selected = null;
  function renderSkills() {
    var f = $("#filters");
    f.innerHTML = "";
    ["all", "languages", "tools", "craft"].forEach(function (g) {
      var b = el("button", "", t(g)); b.type = "button";
      b.setAttribute("aria-pressed", String(filter === g));
      b.onclick = function () { filter = g; selected = null; renderSkills(); };
      f.appendChild(b);
    });
    var list = (C.skills || []).filter(function (s) { return filter === "all" || s.group === filter; });
    var tiles = $("#skillTiles");
    tiles.innerHTML = "";
    list.forEach(function (s) {
      var b = el("button", "tile", s.name); b.type = "button";
      b.setAttribute("aria-pressed", String(selected === s.name));
      b.appendChild(el("small", "", t(s.group)));
      b.onclick = function () { selected = s.name; renderSkills(); };
      tiles.appendChild(b);
    });
    var d = $("#skillDetail");
    d.innerHTML = "";
    var cur = list.filter(function (s) { return s.name === selected; })[0];
    if (cur) {
      d.appendChild(el("h3", "", cur.name));
      d.appendChild(el("p", "", pick(cur.note)));
    } else {
      d.appendChild(el("p", "", t("skill_pick")));
    }
    d.appendChild(el("p", "count", t("skill_count").replace("{n}", list.length)));
  }

  /* ---------- Contact links ---------- */
  function renderLinks() {
    var box = $("#links");
    box.innerHTML = "";
    if (C.github) { var a = el("a", "cta", "GitHub"); a.href = C.github; a.target = "_blank"; a.rel = "noopener"; box.appendChild(a); }
    if (C.discord) box.appendChild(el("span", "plain", "Discord: " + C.discord));
    if (C.email) box.appendChild(el("span", "plain", C.email));
  }

  /* ---------- Language ---------- */
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.getAttribute("data-i18n-aria"))); });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    document.title = name + (lang === "es" ? " | Desarrollador web en Guatemala" : " | Web developer in Guatemala");
    renderMarquee(); renderProjects(); renderSkills(); renderLinks();
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.onclick = function () {
      lang = b.getAttribute("data-lang");
      try { localStorage.setItem("lang", lang); } catch (e) {}
      apply();
    };
  });

  /* ---------- Menu (phone) ---------- */
  var menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.onclick = function () { var o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o)); };
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

  /* ---------- Reveal on scroll and active link ---------- */
  var io = null;
  function observeReveal() {
    var items = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { items.forEach(function (n) { n.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
    setTimeout(function () { document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); }); }, 4000);
  }
  if ("IntersectionObserver" in window) {
    var links = {};
    document.querySelectorAll("nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
          links[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* ---------- Contact form ---------- */
  var form = $("#form"), status = $("#status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "status"; status.textContent = t("sending");
    var data = new FormData(form);
    var req;
    if (C.formAction) {
      req = fetch(C.formAction, { method: "POST", body: data, headers: { Accept: "application/json" } });
    } else {
      req = fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });
    }
    req.then(function (r) {
      if (!r.ok) throw new Error("bad status");
      form.reset(); status.className = "status ok"; status.textContent = t("sent");
    }).catch(function () { status.className = "status err"; status.textContent = t("fail"); });
  });

  apply();
})();
