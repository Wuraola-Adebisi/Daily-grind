/* Daily Grind interactions: motion, navigation, and button feedback. */

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".main-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-bar");

  /* Preserve the existing menu-image fade and handle cached or failed images. */
  document.querySelectorAll("#menu img").forEach((img) => {
    const markLoaded = () => img.classList.add("is-loaded");
    if (img.complete) {
      markLoaded();
    } else {
      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    }
  });

  /* Existing fixed-header effect. */
  const updateHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* Mobile navigation, with accessible state and Escape/outside-click closing. */
  if (menuButton && nav) {
    const closeNav = () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    };

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
    document.addEventListener("click", (event) => {
      if (nav.classList.contains("open") && !nav.contains(event.target) && !menuButton.contains(event.target)) {
        closeNav();
      }
    });
  }

  /* Toast feedback is announced to assistive technology. */
  const toast = document.createElement("div");
  toast.className = "interaction-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("aria-atomic", "true");
  document.body.appendChild(toast);

  let toastTimeout;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  };

  /* Reveal existing content as it enters the viewport. */
  const revealTargets = [
    "#about h2", "#about > p", "#about blockquote",
    "#menu > h2", "#menu .drink h3", "#menu .food h3", "#menu .menu-card",
    "#book-pick .book-pick-photo", "#book-pick .book-pick-text > *",
    "#gallery .gallery-header > *", "#gallery .gallery-item",
    "#event > div", "#contact > div"
  ];

  const elementsToReveal = new Set();
  revealTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => elementsToReveal.add(element));
  });

  document.querySelectorAll("#menu .menu-card").forEach((card, index) => {
    card.style.setProperty("--reveal-delay", (index % 3) * 75 + "ms");
  });

  const revealElements = Array.from(elementsToReveal);
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    revealElements.forEach((element) => element.classList.add("reveal-on-scroll"));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    revealElements.forEach((element) => observer.observe(element));
  }

  /* Enable hero animation only after setup; the page stays readable without JS. */
  if (!reducedMotion) document.body.classList.add("motion-ready");

  /* Visual order-preview feedback only: no cart or checkout backend exists. */
  document.querySelectorAll(".menu-card .add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".menu-card");
      const itemName = card ? card.dataset.name || "This item" : "This item";
      button.classList.add("is-added");
      button.textContent = "Added";
      button.setAttribute("aria-label", itemName + " added to order preview");
      showToast(itemName + " added to your order preview.");

      window.setTimeout(() => {
        button.classList.remove("is-added");
        button.textContent = "Add to Cart";
        button.removeAttribute("aria-label");
      }, 2200);
    });
  });

  /* Event acknowledgement only: this does not reserve a seat or submit data. */
  document.querySelectorAll(".event-info button").forEach((button) => {
    button.addEventListener("click", () => {
      const eventCard = button.closest(".event-1, .event-2, .event-3");
      const heading = eventCard ? eventCard.querySelector(".event-info h3") : null;
      const eventName = heading ? heading.textContent.trim() : "This event";
      const wasSaved = button.classList.contains("is-saved");
      button.classList.toggle("is-saved", !wasSaved);
      button.textContent = wasSaved ? "Save My Spot" : "Interest Noted";
      showToast(wasSaved
        ? "Removed your interest in " + eventName + "."
        : "Interest noted for " + eventName + ". No booking has been submitted.");
    });
  });
});
