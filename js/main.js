/* I.E.P. Jean Piaget Sullana. Interacciones del sitio. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Navegacion movil ------------------------------------------------- */
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

    // Cerrar con Escape y devolver el foco al boton
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Al volver a escritorio, limpiar el estado movil
    var desktop = window.matchMedia("(min-width: 1021px)");
    desktop.addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* --- Entradas al hacer scroll ----------------------------------------- */
  /* IntersectionObserver, nunca un listener de scroll. */
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
      // Cascada corta dentro de un mismo grupo, no un retardo global creciente
      var group = el.getAttribute("data-reveal-group");
      if (group) el.style.setProperty("--reveal-delay", (i % 4) * 70 + "ms");
      observer.observe(el);
    });
  }

  /* --- Validacion de formularios ---------------------------------------- */
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

    forms.forEach(function (form) {
      var fields = form.querySelectorAll("input, select, textarea");
      var status = form.querySelector(".form__status");

      fields.forEach(function (input) {
        // Validar al salir del campo, y en vivo solo si ya estaba en error
        input.addEventListener("blur", function () { validate(input); });
        input.addEventListener("input", function () {
          if (input.getAttribute("aria-invalid") === "true") validate(input);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var firstBad = null;
        fields.forEach(function (input) {
          if (!validate(input) && !firstBad) firstBad = input;
        });

        if (firstBad) {
          if (status) {
            status.textContent = "Revisa los campos marcados antes de enviar.";
            status.style.color = "var(--accent)";
          }
          firstBad.focus();
          return;
        }

        // El sitio es estatico: no hay backend todavia.
        if (status) {
          status.textContent = "Gracias por escribirnos. Te responderemos dentro de las próximas 48 horas hábiles.";
          status.style.color = "var(--leaf)";
        }
        form.reset();
        fields.forEach(function (input) {
          input.setAttribute("aria-invalid", "false");
          var slot = document.getElementById(input.id + "-error");
          if (slot) slot.textContent = "";
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initForms();
  });
})();
