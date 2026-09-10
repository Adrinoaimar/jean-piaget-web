/* I.E.P. Jean Piaget Sullana. Interacciones del sitio. */
(function () {
  "use strict";

  var FORM = {
    ACCESS_KEY: "",
    ENDPOINT: "https://api.web3forms.com/submit",
    EMAIL: "informes@jeanpiagetsullana.edu.pe",
    WHATSAPP: "https://wa.me/51969123456"
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initPhotos() {
    var page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    var style = document.createElement("style");
    style.textContent =
      ".media.media--photo{padding:0;overflow:hidden;background:var(--surface-sunken)}" +
      ".media.media--photo::after{display:none}" +
      ".media.media--photo img{display:block;width:100%;height:100%;object-fit:cover}";
    document.head.appendChild(style);

    var photos = {
      hero: { src: "img/portada-estudiante.webp", alt: "Estudiante del I.E.P. Jean Piaget Sullana participando en una actividad escolar.", position: "center 42%", eager: true },
      aula: { src: "img/aula-aprendizaje.webp", alt: "Estudiantes del I.E.P. Jean Piaget Sullana durante una actividad de aprendizaje guiado.", position: "center 43%" },
      comunidad: { src: "img/comunidad-piaget.webp", alt: "Comunidad educativa del I.E.P. Jean Piaget Sullana durante una actividad institucional.", position: "center 42%" },
      inicial: { src: "img/inicial-arte.webp", alt: "Estudiante del nivel Inicial desarrollando una actividad artística.", position: "center 40%" },
      proyecto: { src: "img/proyecto-estudiantes.webp", alt: "Estudiantes del I.E.P. Jean Piaget participando en una actividad práctica y colaborativa.", position: "center 42%" },
      vida: { src: "img/vida-escolar.webp", alt: "Estudiante del I.E.P. Jean Piaget participando en una actividad de vida escolar.", position: "center 40%" }
    };

    function replaceByLabel(fragment, photo) {
      var labels = Array.prototype.slice.call(document.querySelectorAll("[aria-label]"));
      var target = labels.find(function (el) {
        return (el.getAttribute("aria-label") || "").toLowerCase().indexOf(fragment) !== -1;
      });
      if (!target) return;
      var media = target.classList.contains("media") ? target : target.querySelector(".media");
      if (!media) return;

      target.removeAttribute("role");
      target.removeAttribute("aria-label");
      media.removeAttribute("role");
      media.removeAttribute("aria-label");
      media.classList.add("media--photo");
      media.innerHTML = "";

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.decoding = "async";
      img.loading = photo.eager ? "eager" : "lazy";
      img.style.objectPosition = photo.position || "center";
      if (photo.eager) img.setAttribute("fetchpriority", "high");
      media.appendChild(img);
    }

    if (page === "index.html") {
      replaceByLabel("estudiantes del colegio", photos.hero);
      replaceByLabel("taller de robótica", photos.proyecto);
      replaceByLabel("fachada del colegio", photos.comunidad);
    } else if (page === "niveles.html") {
      replaceByLabel("aula de inicial", photos.inicial);
      replaceByLabel("aula de primaria", photos.aula);
    } else if (page === "innovacion.html") {
      replaceByLabel("aula de cómputo", photos.aula);
      replaceByLabel("taller de robótica", photos.proyecto);
    } else if (page === "vida-escolar.html") {
      replaceByLabel("actividades deportivas", photos.vida);
    } else if (page === "galeria.html") {
      var gallery = document.querySelector(".gallery");
      if (gallery) {
        gallery.innerHTML = [
          '<figure class="media media--tall media--photo"><img src="img/portada-estudiante.webp" alt="Estudiante del I.E.P. Jean Piaget en una actividad escolar." loading="lazy" decoding="async" style="object-position:center 42%"></figure>',
          '<figure class="media media--wide media--photo"><img src="img/aula-aprendizaje.webp" alt="Estudiantes durante una actividad de aprendizaje guiado." loading="lazy" decoding="async" style="object-position:center 43%"></figure>',
          '<figure class="media media--wide media--photo"><img src="img/comunidad-piaget.webp" alt="Comunidad educativa del I.E.P. Jean Piaget en una actividad institucional." loading="lazy" decoding="async" style="object-position:center 42%"></figure>',
          '<figure class="media media--tall media--photo"><img src="img/inicial-arte.webp" alt="Estudiante del nivel Inicial realizando una actividad artística." loading="lazy" decoding="async" style="object-position:center 40%"></figure>',
          '<figure class="media media--square media--photo"><img src="img/proyecto-estudiantes.webp" alt="Estudiantes participando en una actividad práctica y colaborativa." loading="lazy" decoding="async" style="object-position:center 42%"></figure>',
          '<figure class="media media--tall media--photo"><img src="img/vida-escolar.webp" alt="Estudiante participando en una actividad de vida escolar." loading="lazy" decoding="async" style="object-position:center 40%"></figure>'
        ].join("");
      }
      var heroText = document.querySelector(".page-hero p");
      if (heroText) heroText.textContent = "Una selección de momentos reales que muestran el aprendizaje, la creatividad y la vida escolar de nuestra comunidad educativa.";
      var noticeText = document.querySelector(".notice p");
      if (noticeText) noticeText.textContent = "Fotografías seleccionadas para representar de forma natural las experiencias y actividades de nuestros estudiantes.";
    }
  }

  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");
    if (!toggle || !links) return;
    var icon = toggle.querySelector("i");

    function setOpen(open) {
      links.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      if (icon) {
        icon.classList.toggle("ph-list", !open);
        icon.classList.toggle("ph-x", open);
      }
    }

    setOpen(false);
    toggle.addEventListener("click", function () {
      setOpen(links.getAttribute("data-open") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    var desktop = window.matchMedia("(min-width: 1021px)");
    if (desktop.addEventListener) desktop.addEventListener("change", function (e) { if (e.matches) setOpen(false); });
  }

  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el, i) {
      if (el.getAttribute("data-reveal-group")) el.style.setProperty("--reveal-delay", (i % 4) * 70 + "ms");
      observer.observe(el);
    });
  }

  function initForms() {
    var forms = document.querySelectorAll("form.form");
    if (!forms.length) return;

    function messageFor(input) {
      var v = input.validity;
      if (v.valueMissing) return "Este campo es obligatorio.";
      if (v.typeMismatch && input.type === "email") return "Escribe un correo válido, por ejemplo nombre@correo.com";
      if (v.typeMismatch && input.type === "tel") return "Escribe un número de teléfono válido.";
      if (v.tooShort) return "Escribe al menos " + input.minLength + " caracteres.";
      if (v.patternMismatch) return "El formato no es válido.";
      return "Revisa este campo.";
    }

    function validate(input) {
      var slot = document.getElementById(input.id + "-error");
      var ok = input.checkValidity();
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      if (slot) slot.textContent = ok ? "" : messageFor(input);
      return ok;
    }

    function setStatus(el, text, kind) {
      if (!el) return;
      el.textContent = text;
      el.dataset.kind = kind || "info";
    }

    forms.forEach(function (form) {
      var fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"));
      var status = form.querySelector(".form__status");
      var submit = form.querySelector('button[type="submit"]');
      var submitLabel = submit ? submit.textContent : "";

      fields.forEach(function (input) {
        input.addEventListener("blur", function () { validate(input); });
        input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") validate(input); });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var firstBad = null;
        fields.forEach(function (input) { if (!validate(input) && !firstBad) firstBad = input; });
        if (firstBad) {
          setStatus(status, "Revisa los campos marcados antes de enviar.", "error");
          firstBad.focus();
          return;
        }
        if (!FORM.ACCESS_KEY) {
          setStatus(status, "El envío automático todavía no está activo. Escríbenos a " + FORM.EMAIL + " o por WhatsApp y te respondemos.", "error");
          return;
        }

        var payload = new FormData(form);
        payload.append("access_key", FORM.ACCESS_KEY);
        payload.append("subject", form.dataset.subject || "Mensaje desde la web del colegio");
        payload.append("from_name", "Web I.E.P. Jean Piaget Sullana");
        if (submit) { submit.disabled = true; submit.textContent = "Enviando"; }
        setStatus(status, "Enviando tu mensaje.", "info");

        fetch(FORM.ENDPOINT, { method: "POST", body: payload })
          .then(function (res) { return res.json().catch(function () { return {}; }); })
          .then(function (data) {
            if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
            if (data && data.success) {
              setStatus(status, "Recibimos tu mensaje. Te respondemos dentro de las próximas 48 horas hábiles.", "ok");
              form.reset();
              fields.forEach(function (input) {
                input.setAttribute("aria-invalid", "false");
                var slot = document.getElementById(input.id + "-error");
                if (slot) slot.textContent = "";
              });
            } else {
              setStatus(status, "No pudimos enviar el mensaje. Escríbenos a " + FORM.EMAIL + " o por WhatsApp.", "error");
            }
          })
          .catch(function () {
            if (submit) { submit.disabled = false; submit.textContent = submitLabel; }
            setStatus(status, "No pudimos enviar el mensaje. Revisa tu conexión, o escríbenos a " + FORM.EMAIL + ".", "error");
          });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPhotos();
    initNav();
    initReveal();
    initForms();
  });
})();
