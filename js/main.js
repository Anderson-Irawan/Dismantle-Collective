// Home page "Representing" list: hovering (or tabbing to) an artist's name
// moves the highlight to it, shows that artist's image, and paints the
// portrait border and pixel shapes in the artist's colour (--rep, set per
// name in css/styles.css). The pixel shapes then pop back in one by one, the
// same cube build-up as the hover effect in js/cubes.js.
//
// Tuned values (change only on request):
//   PX_STEP_MS 35: delay between pixel shapes popping in, the same step as
//     the hover cubes, so the two read as one effect.
const PX_STEP_MS = 35;

const section = document.querySelector('.representing');
const names = document.querySelectorAll('.representing__name');
const artImg = document.getElementById('representing-img');
const pixels = document.querySelectorAll('.representing__art .px');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let popTimers = [];

function paint(name) {
  const color = getComputedStyle(name).getPropertyValue('--rep').trim();
  if (color) section.style.setProperty('--rep-accent', color);
}

function popPixels() {
  popTimers.forEach(clearTimeout);
  popTimers = [];
  if (reduceMotion.matches) return;
  pixels.forEach((px, i) => {
    px.classList.add('is-off');
    popTimers.push(setTimeout(() => px.classList.remove('is-off'), (i + 1) * PX_STEP_MS));
  });
}

if (section && artImg) {
  const current = document.querySelector('.representing__name.is-active');
  if (current) paint(current);

  names.forEach((name) => {
    const activate = () => {
      if (name.classList.contains('is-active')) return;
      names.forEach((n) => n.classList.remove('is-active'));
      name.classList.add('is-active');

      artImg.src = name.dataset.image;
      artImg.alt = name.textContent + ' artwork';
      paint(name);
      popPixels();
    };
    name.addEventListener('mouseenter', activate);
    name.addEventListener('focus', activate);
  });
}
