const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-layer]'));
let latestScroll = 0;
let ticking = false;

const updateParallax = () => {
  layers.forEach((layer) => {
    const depth = Number(layer.dataset.depth ?? '0.2');
    const translate = latestScroll * depth * -0.03;
    layer.style.transform = `translate3d(0, ${translate}px, 0)`;
  });
  ticking = false;
};

const handleScroll = () => {
  latestScroll = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
};

window.addEventListener('scroll', handleScroll, { passive: true });
updateParallax();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

Array.from(document.querySelectorAll<HTMLElement>('[data-animate]')).forEach((el) => observer.observe(el));

const tree = document.querySelector<HTMLElement>('[data-skill-tree]');
if (tree) {
  let active: HTMLElement | null = null;
  tree.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('.skill-node');
    if (!target || !target.dataset.skillId) return;
    event.preventDefault();
    if (active === target) {
      target.removeAttribute('data-active');
      active = null;
      return;
    }
    active?.removeAttribute('data-active');
    target.setAttribute('data-active', 'true');
    active = target;
  });
}

const stripEls = Array.from(document.querySelectorAll<HTMLElement>('[data-endorsement-strip] .endorsed-track'));
const updateStripDurations = () => {
  stripEls.forEach((track) => {
    const width = track.scrollWidth;
    const duration = Math.max(18, width / 40);
    track.style.animationDuration = `${duration}s`;
  });
};

updateStripDurations();
window.addEventListener('resize', updateStripDurations);
