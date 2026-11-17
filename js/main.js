// Home page "Representing" list: hovering (or tabbing to) an artist's name
// moves the blue highlight to it and shows that artist's image.
const names = document.querySelectorAll('.representing__name');
const artImg = document.getElementById('representing-img');

names.forEach((name) => {
  const activate = () => {
    if (name.classList.contains('is-active')) return;
    names.forEach((n) => n.classList.remove('is-active'));
    name.classList.add('is-active');

    artImg.src = name.dataset.image;
    artImg.alt = name.textContent + ' artwork';
    // restart the slide-in animation
    artImg.style.animation = 'none';
    artImg.offsetHeight;
    artImg.style.animation = '';
  };
  name.addEventListener('mouseenter', activate);
  name.addEventListener('focus', activate);
});
