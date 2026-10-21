(function () {
  "use strict";

  var form = document.getElementById("family-form");
  var mobileCta = document.querySelector(".family-mobile-cta");
  var signup = document.getElementById("reservar");

  if (mobileCta && signup && "IntersectionObserver" in window) {
    var signupObserver = new IntersectionObserver(function (entries) {
      mobileCta.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.02 });
    signupObserver.observe(signup);
  }

  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    var data = new FormData(form);
    var message = [
      "Hola, quisiera recibir información sobre el próximo taller familiar del I.E.P. Jean Piaget Sullana.",
      "Nombre de la persona adulta: " + data.get("adulto"),
      "Personas que asistirían: " + data.get("grupo"),
      "¿Podrían confirmarme fecha, sede, horario y disponibilidad?"
    ].join("\n");
    var status = document.getElementById("family-form-status");
    if (status) status.textContent = "WhatsApp abrirá un mensaje para revisar antes de enviarlo.";
    window.open("https://wa.me/51969123456?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  });
}());
