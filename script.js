document.querySelectorAll('#menu img').forEach((img) => {
  if (img.complete) {
    img.classList.add('is-loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('is-loaded'));
  }
});