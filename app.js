/* ============================================================
   Myo Family Health — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Reviews top bar (tap to expand on touch) ---------- */
  var reviewsBar = document.querySelector(".reviews-bar");
  if (reviewsBar) {
    var strip = reviewsBar.querySelector(".reviews-strip");
    strip.addEventListener("click", function () {
      reviewsBar.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!reviewsBar.contains(e.target)) reviewsBar.classList.remove("open");
    });
  }

  /* ---------- Sticky nav state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  function closeMenu() {
    toggle.classList.remove("open");
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = toggle.classList.toggle("open");
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
  // Safety net: guarantee above-the-fold content reveals even if the
  // observer never fires (e.g. non-painted iframes, print/export contexts).
  function revealVisible() {
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) * 1.05) el.classList.add("in");
    });
  }
  window.addEventListener("load", function () { setTimeout(revealVisible, 300); });
  setTimeout(revealVisible, 1400);

  /* ---------- Active nav link on scroll ---------- */
  var sections = ["home", "about", "resources", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  function syncActive() {
    var pos = window.scrollY + window.innerHeight * 0.32;
    var current = sections[0] ? sections[0].id : "";
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", syncActive, { passive: true });
  syncActive();

  /* ---------- About badge popovers ---------- */
  var popBtns = Array.prototype.slice.call(document.querySelectorAll("[data-pop]"));
  function closeAllPops(except) {
    popBtns.forEach(function (b) {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      b.closest(".badge-wrap").classList.remove("open");
    });
  }
  popBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var wrap = btn.closest(".badge-wrap");
      var isOpen = wrap.classList.contains("open");
      closeAllPops(btn);
      wrap.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".badge-wrap")) closeAllPops(null);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllPops(null);
  });

  /* ---------- Modals ---------- */
  var openModalEl = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    openModalEl = m;
  }
  function closeModal() {
    if (!openModalEl) return;
    openModalEl.classList.remove("open");
    openModalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openModalEl = null;
  }
  document.querySelectorAll("[data-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(trigger.getAttribute("data-modal"));
    });
  });

  /* ---------- Review cards -> full review modal ---------- */
  var revModal = document.getElementById("review-modal");
  if (revModal) {
    var revText = document.getElementById("review-modal-text");
    document.querySelectorAll(".review-card").forEach(function (card) {
      function openReview() {
        var full = card.querySelector(".review-full");
        revText.textContent = full ? full.textContent : card.querySelector("p").textContent;
        openModal("review-modal");
      }
      card.addEventListener("click", openReview);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReview(); }
      });
    });
  }

  /* ---------- Symptom cards -> enlarge modal ---------- */
  var symModal = document.getElementById("symptom-modal");
  if (symModal) {
    var symUse = document.getElementById("symptom-modal-use");
    var symTitle = document.getElementById("symptom-modal-title");
    var symDesc = document.getElementById("symptom-modal-desc");
    document.querySelectorAll(".check-item").forEach(function (card) {
      card.addEventListener("click", function () {
        var icon = card.getAttribute("data-icon");
        symUse.setAttribute("href", "#" + icon);
        symTitle.innerHTML = card.getAttribute("data-title");
        symDesc.textContent = card.getAttribute("data-desc");
        openModal("symptom-modal");
      });
    });
  }
  document.querySelectorAll(".modal [data-close]").forEach(function (el) {
    el.addEventListener("click", function () { closeModal(); });
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Contact widget tabs ---------- */
  var widget = document.querySelector(".contact-widget");
  if (widget) {
    var tabs = widget.querySelectorAll(".widget-tab");
    var panels = widget.querySelectorAll(".widget-frame");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var name = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", String(on));
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== name;
        });
      });
    });
  }

  /* ---------- Form validation ---------- */
  var form = document.getElementById("consult-form");
  if (form) {
    var fields = form.querySelectorAll("[data-validate]");

    function validateField(field) {
      var wrap = field.closest(".field");
      var value = field.value.trim();
      var type = field.getAttribute("data-validate");
      var ok = true;
      if (value === "") ok = false;
      else if (type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      else if (type === "phone") ok = value.replace(/[^0-9]/g, "").length >= 10;
      wrap.classList.toggle("invalid", !ok);
      return ok;
    }

    fields.forEach(function (f) {
      f.addEventListener("blur", function () { validateField(f); });
      f.addEventListener("input", function () {
        var wrap = f.closest(".field");
        if (wrap.classList.contains("invalid")) validateField(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allOk = true;
      fields.forEach(function (f) { if (!validateField(f)) allOk = false; });
      if (!allOk) {
        var firstBad = form.querySelector(".field.invalid [data-validate]");
        if (firstBad) firstBad.focus();
        return;
      }
      var card = document.querySelector(".contact-form");
      form.style.display = "none";
      var success = document.querySelector(".form-success");
      if (success) success.classList.add("show");
      if (card) card.scrollIntoView ? null : null; // no scrollIntoView per guidelines
    });
  }
})();
