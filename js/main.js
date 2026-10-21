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

  function initDesign() {
    document.querySelectorAll('.split').forEach(function (split) {
      split.querySelectorAll(':scope > .reveal').forEach(function (el, i) {
        el.dataset.reveal = i === 0 ? 'left' : 'right';
      });
    });
    document.querySelectorAll('.gallery .reveal').forEach(function (el, i) {
      el.dataset.reveal = 'scale';
      el.style.setProperty('--reveal-delay', (i % 3) * 80 + 'ms');
    });
    var header = document.querySelector('.site-header');
    if (header && 'IntersectionObserver' in window) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;width:1px;height:1px;pointer-events:none';
      document.body.prepend(sentinel);
      new IntersectionObserver(function (entries) {
        header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
      }).observe(sentinel);
    }
  }

  function initGallery() {
    var images = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
    if (!images.length || typeof HTMLDialogElement === 'undefined') return;
    var dialog = document.createElement('dialog');
    if (typeof dialog.showModal !== 'function') return;
    dialog.className = 'gallery-dialog';
    dialog.setAttribute('aria-labelledby', 'gallery-dialog-title');
    dialog.setAttribute('aria-describedby', 'gallery-dialog-caption');
    dialog.innerHTML = '<div class="gallery-dialog__bar"><h2 id="gallery-dialog-title">Nuestra galería</h2><button type="button" class="gallery-dialog__close" aria-label="Cerrar fotografía">×</button></div>' +
      '<div class="gallery-dialog__stage"><button type="button" class="gallery-dialog__arrow gallery-dialog__arrow--prev" aria-label="Fotografía anterior">‹</button><img class="gallery-dialog__image" alt=""><button type="button" class="gallery-dialog__arrow gallery-dialog__arrow--next" aria-label="Fotografía siguiente">›</button></div>' +
      '<p class="gallery-dialog__caption" id="gallery-dialog-caption" aria-live="polite"></p>';
    document.body.appendChild(dialog);
    var selected = 0;
    var opener = null;
    var preview = dialog.querySelector('.gallery-dialog__image');
    var caption = dialog.querySelector('.gallery-dialog__caption');
    var title = dialog.querySelector('#gallery-dialog-title');
    var close = dialog.querySelector('.gallery-dialog__close');
    function show(index) {
      selected = (index + images.length) % images.length;
      var source = images[selected];
      preview.src = source.currentSrc || source.src;
      preview.alt = source.alt;
      var label = source.closest('figure').querySelector('figcaption');
      caption.textContent = label ? label.textContent : source.alt;
      title.textContent = 'Fotografía ' + (selected + 1) + ' de ' + images.length;
    }
    images.forEach(function (img, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'photo-open';
      button.setAttribute('aria-label', 'Ampliar: ' + img.alt);
      img.before(button);
      button.appendChild(img);
      button.addEventListener('click', function () {
        opener = button;
        show(index);
        dialog.showModal();
        document.body.classList.add('gallery-is-open');
        close.focus();
      });
    });
    close.addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.gallery-dialog__arrow--prev').addEventListener('click', function () { show(selected - 1); });
    dialog.querySelector('.gallery-dialog__arrow--next').addEventListener('click', function () { show(selected + 1); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        show(selected + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('gallery-is-open');
      if (opener) opener.focus({ preventScroll: true });
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
    initNav();
    initDesign();
    initReveal();
    initGallery();
    initForms();
  });
})();
