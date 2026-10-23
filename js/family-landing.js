(function () {
  "use strict";

  var menuToggle = document.querySelector(".family-menu-toggle");
  var mobileMenu = document.getElementById("family-mobile-menu");

  if (menuToggle && mobileMenu) {
    var menuIcon = menuToggle.querySelector("i");
    var closeMenu = function (returnFocus) {
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      if (menuIcon) {
        menuIcon.classList.remove("ph-x");
        menuIcon.classList.add("ph-list");
      }
      if (returnFocus) menuToggle.focus();
    };

    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu(false);
        return;
      }
      mobileMenu.hidden = false;
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Cerrar menú");
      if (menuIcon) {
        menuIcon.classList.remove("ph-list");
        menuIcon.classList.add("ph-x");
      }
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !mobileMenu.hidden) closeMenu(true);
    });
    document.addEventListener("click", function (event) {
      if (!mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu(false);
    });
  }

  var revealItems = document.querySelectorAll(
    ".family-section__heading, .family-activity, .family-info-band__grid > div, .family-signup__photo, .family-contact-wrap, .family-benefits article, .family-questions details, .family-limited"
  );
  if (revealItems.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach(function (item, index) {
      item.classList.add("family-reveal");
      item.style.setProperty("--family-delay", (index % 4) * 90 + "ms");
    });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -18px 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }
}());
