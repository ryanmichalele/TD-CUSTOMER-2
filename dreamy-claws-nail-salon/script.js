(function () {
  "use strict";

  // Mobile nav toggle
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // Back to top button
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("visible", window.scrollY > 600);
    });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // Booking form (front-end only — wire up to a real booking provider such as
  // Vagaro, Fresha, Square, or Boulevard before going live)
  var bookForm = document.getElementById("bookForm");
  var formStatus = document.getElementById("formStatus");
  if (bookForm && formStatus) {
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = bookForm.querySelector("#bookName").value.trim();
      formStatus.setAttribute("data-state", "success");
      formStatus.textContent =
        "Thank you, " + (name || "friend") + "! Your request has been received — our team will " +
        "confirm your appointment by phone or email within one business day.";
      bookForm.reset();
    });
  }

  // Only one open service accordion at a time (optional, keeps the page tidy)
  var serviceDetails = document.querySelectorAll(".service-card");
  serviceDetails.forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (details.open) {
        serviceDetails.forEach(function (other) {
          if (other !== details) other.removeAttribute("open");
        });
      }
    });
  });
})();
