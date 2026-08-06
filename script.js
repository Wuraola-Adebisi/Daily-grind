document.querySelectorAll("#menu img").forEach((img) => {
  if (img.complete) {
    img.classList.add("is-loaded");
  } else {
    img.addEventListener("load", () => img.classList.add("is-loaded"));
  }
});

const header = document.querySelector(".main-header");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-bar");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav-bar a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});
