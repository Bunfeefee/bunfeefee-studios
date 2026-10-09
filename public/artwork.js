const animation = document.querySelector('[data-animation]');
const toggle = document.querySelector('[data-animation-toggle]');

if (animation instanceof HTMLImageElement && toggle instanceof HTMLButtonElement) {
  const still = animation.src;
  const animated = animation.dataset.animation;
  if (!animated) {
    throw new Error('Cake stand animation source is missing');
  }
  toggle.hidden = false;

  const stop = () => {
    animation.src = still;
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'Play animation';
  };

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-pressed') === 'true') {
      stop();
    } else {
      animation.src = animated;
      toggle.setAttribute('aria-pressed', 'true');
      toggle.textContent = 'Pause animation';
    }
  });

  animation.addEventListener('error', () => {
    console.error('Could not load cake stand artwork:', animation.src);
    stop();
    toggle.disabled = true;
    toggle.textContent = 'Animation unavailable';
  }, { once: true });

  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
    if (event.matches) stop();
  });
}
