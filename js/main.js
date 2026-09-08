/* I.E.P. Jean Piaget Sullana. Interacciones del sitio. */
(function () {
  "use strict";

  /* =======================================================================
     CONFIGURACION DEL ENVIO DE FORMULARIOS

     El sitio es estatico y no tiene servidor propio, asi que los formularios
     se envian a traves de Web3Forms, que reenvia cada mensaje al correo de
     la institucion.

     Para activarlo:
       1. Entra a https://web3forms.com
       2. Escribe el correo donde quieres recibir los mensajes
          (por ejemplo informes@jeanpiagetsullana.edu.pe)
       3. Te llega una clave de acceso por correo
       4. Pega esa clave entre las comillas de ACCESS_KEY, aqui abajo

     Mientras la clave este vacia, el formulario no se rompe: le muestra al
     visitante el correo y el WhatsApp para escribir directamente.

     La clave de acceso no es secreta, es publica por diseno. Solo autoriza a
     enviar mensajes a ese correo, no da acceso a ninguna cuenta.
     ======================================================================= */
  var FORM = {
    ACCESS_KEY: "",
    ENDPOINT: "https://api.web3forms.com/submit",
    EMAIL: "informes@jeanpiagetsullana.edu.pe",
    WHATSAPP: "https://wa.me/51969123456"
  };

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

    function setStatus(el, text, kind) {
      if (!el) return;
      el.textContent = text;
      el.dataset.kind = kind || "info";
    }

    function clearErrors(fields) {
      fields.forEach(function (input) {
        input.setAttribute("aria-invalid", "false");
        var slot = document.getElementById(input.id + "-error");
        if (slot) slot.textContent = "";
      });
    }

    forms.forEach(function (form) {
      var fields = Array.prototype.slice.call(
        form.querySelectorAll("input, select, textarea")
      );
      var status = form.querySelector(".form__status");
      var submit = form.querySelector('button[type="submit"]');
      var submitLabel = submit ? submit.textContent : "";

      fields.forEach(function (input) {
        // Validar al salir del campo, y en vivo solo si ya estaba en error
        input.addEventListener("blur", function () { validate(input); });
        input.addEventListener("input", function () {
          if (input.getAttribute("aria-invalid") === "true") validate(input);
        });
      });

      function setBusy(busy) {
        if (!submit) return;
        submit.disabled = busy;
        submit.dataset.loading = busy ? "true" : "false";
        submit.textContent = busy ? "Enviando" : submitLabel;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var firstBad = null;
        fields.forEach(function (input) {
          if (!validate(input) && !firstBad) firstBad = input;
        });

        if (firstBad) {
          setStatus(status, "Revisa los campos marcados antes de enviar.", "error");
          firstBad.focus();
          return;
        }

        // Sin clave configurada no se simula un envio: se dice la verdad
        // y se le da al visitante una via real de contacto.
        if (!FORM.ACCESS_KEY) {
          setStatus(
            status,
            "El envío automático todavía no está activo. Escríbenos a " +
              FORM.EMAIL + " o por WhatsApp y te respondemos.",
            "error"
          );
          return;
        }

        var payload = new FormData(form);
        payload.append("access_key", FORM.ACCESS_KEY);
        payload.append("subject", form.dataset.subject || "Mensaje desde la web del colegio");
        payload.append("from_name", "Web I.E.P. Jean Piaget Sullana");

        setBusy(true);
        setStatus(status, "Enviando tu mensaje.", "info");

        fetch(FORM.ENDPOINT, {
          method: "POST",
          body: payload
        })
          .then(function (res) { return res.json().catch(function () { return {}; }); })
          .then(function (data) {
            setBusy(false);
            if (data && data.success) {
              setStatus(
                status,
                "Recibimos tu mensaje. Te respondemos dentro de las próximas 48 horas hábiles.",
                "ok"
              );
              form.reset();
              clearErrors(fields);
            } else {
              setStatus(
                status,
                "No pudimos enviar el mensaje. Escríbenos a " + FORM.EMAIL + " o por WhatsApp.",
                "error"
              );
            }
          })
          .catch(function () {
            setBusy(false);
            setStatus(
              status,
              "No pudimos enviar el mensaje. Revisa tu conexión, o escríbenos a " +
                FORM.EMAIL + ".",
              "error"
            );
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
