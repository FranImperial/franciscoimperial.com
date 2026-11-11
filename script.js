// Lightbox: abre cualquier imagen de la galería a pantalla completa
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');

document.querySelectorAll('.shot').forEach((shot) => {
  shot.addEventListener('click', () => {
    const img = shot.querySelector('img');
    lightboxImg.src = shot.dataset.full;
    lightboxImg.alt = img.alt;
    lightbox.showModal();
  });
});

lightbox.addEventListener('click', (e) => {
  // Cierra al pulsar fuera de la imagen o en la ×
  if (e.target !== lightboxImg) lightbox.close();
});

// Menú del móvil: abre a pantalla completa y se cierra al elegir sección o con Esc
const toggle = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');

const behindMenu = document.querySelectorAll('main, footer');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'Cerrar' : 'Menú';
  // Se bloquea en <html>: en <body> lo convertiría en contenedor de scroll y la barra fija se iría
  document.documentElement.style.overflow = open ? 'hidden' : '';
  // Con el menú abierto, lo de detrás no recibe foco ni lo lee el lector de pantalla
  behindMenu.forEach((el) => { el.inert = open; });
  if (open) document.querySelector('.nav__links a').focus();
}

toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
document.querySelectorAll('.nav__logo, .nav__links a').forEach((a) => a.addEventListener('click', () => {
  if (nav.classList.contains('is-open')) setMenu(false);
}));

// El foco no sale del menú abierto: del último enlace vuelve al botón, y al revés
nav.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
  const items = [...nav.querySelectorAll('.nav__logo, .nav__toggle, .nav__links a')];
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    toggle.focus();
  }
});

// Botón de pausa de la cinta de marcas (contenido en movimiento > 5 s debe poder pararse)
// (solo existe en la portada; las páginas de caso no la tienen)
const brands = document.querySelector('.brands');
const brandsPause = document.querySelector('.brands__pause');
brandsPause?.addEventListener('click', () => {
  const paused = brands.classList.toggle('is-paused');
  brandsPause.textContent = paused ? 'Reanudar' : 'Pausar';
  brandsPause.setAttribute('aria-pressed', String(paused));
});

// Visor 360° del casco: 6 vistas en orden de giro + la superior al final
const VIEWS = [
  ['frente', 'Frente'], ['tres-cuartos-izq', '3/4 izquierda'], ['lateral-izq', 'Lateral'],
  ['trasera-izq', 'Trasera izq.'], ['trasera-der', 'Trasera der.'], ['tres-cuartos-der', '3/4 derecha'],
  ['superior', 'Superior'],
];
const TURN_VIEWS = 6; // al arrastrar se gira solo entre las 6 vistas laterales
const viewer = document.querySelector('.viewer');

if (viewer) {
  const img = viewer.querySelector('.viewer__img');
  const range = viewer.querySelector('.viewer__range');
  const label = viewer.querySelector('.viewer__label');
  const stage = viewer.querySelector('.viewer__stage');
  const srcset = (name) => `img/casco-${name}-540.webp 540w, img/casco-${name}-1080.webp 1080w`;
  let current = 0;

  function showView(i) {
    current = (i + VIEWS.length) % VIEWS.length;
    const [name, text] = VIEWS[current];
    img.srcset = srcset(name);
    img.src = `img/casco-${name}-540.webp`;
    img.alt = `Casco Kioto Cómic, vista ${text.toLowerCase()}`;
    range.value = current;
    range.setAttribute('aria-valuetext', text);
    label.textContent = text;
  }

  range.addEventListener('input', () => showView(Number(range.value)));
  viewer.querySelectorAll('.viewer__btn').forEach((btn) => {
    btn.addEventListener('click', () => showView(current + Number(btn.dataset.step)));
  });

  // Arrastrar: cada 40 px de desplazamiento horizontal pasa a la vista siguiente
  let dragX = null;
  stage.addEventListener('pointerdown', (e) => { dragX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', (e) => {
    if (dragX === null) return;
    const steps = Math.trunc((e.clientX - dragX) / 40);
    if (!steps) return;
    dragX += steps * 40;
    const base = current >= TURN_VIEWS ? 0 : current;
    showView((((base - steps) % TURN_VIEWS) + TURN_VIEWS) % TURN_VIEWS);
  });
  ['pointerup', 'pointercancel'].forEach((ev) => stage.addEventListener(ev, () => { dragX = null; }));

  // Precarga las vistas cuando el visor se acerca a la pantalla, para que el giro no parpadee
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    VIEWS.forEach(([name]) => { const p = new Image(); p.sizes = img.sizes; p.srcset = srcset(name); });
    obs.disconnect();
  }, { rootMargin: '400px' }).observe(viewer);
}

// Selector de versiones de color del Kioto: [archivo, nombre, color de la muestra]
const COLORWAYS = {
  Foodie: [
    ['foodie-azul', 'Azul', '#0a6cb5'], ['foodie-rojo', 'Rojo', '#e30b47'], ['foodie-violeta', 'Violeta', '#3d2783'],
    ['foodie-turquesa', 'Turquesa', '#55bbb2'], ['foodie-petroleo', 'Petróleo', '#0b3a4b'],
    ['foodie-gris', 'Gris', '#5c6670'], ['foodie-blanco', 'Blanco', '#ffffff'],
  ],
  Doodle: [['doodle-amarillo', 'Amarillo', '#e8e00b'], ['doodle-negro', 'Negro', '#000000'], ['doodle-blanco', 'Blanco', '#ffffff']],
  Cómic: [['comic-a', 'Versión A', '#5fd13b']],
};
const swatcher = document.querySelector('.swatcher');

if (swatcher) {
  const tabs = swatcher.querySelector('.swatcher__tabs');
  const swatches = swatcher.querySelector('.swatcher__swatches');
  const img = swatcher.querySelector('.swatcher__img');
  const label = swatcher.querySelector('.swatcher__label');

  function showColorway(series, index) {
    const [file, name] = COLORWAYS[series][index];
    img.srcset = `img/kioto-${file}-600.webp 600w, img/kioto-${file}-1200.webp 1200w`;
    img.src = `img/kioto-${file}-600.webp`;
    img.alt = `Gráfica ${series} para el casco Kioto, versión ${name.toLowerCase()}`;
    label.textContent = `${series} · ${name}`;
    swatches.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === index));
  }

  function showSeries(series) {
    tabs.querySelectorAll('button').forEach((t) => t.setAttribute('aria-selected', t.textContent === series));
    swatches.innerHTML = '';
    COLORWAYS[series].forEach(([, name, color], i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatcher__swatch';
      b.style.setProperty('--sw', color);
      b.setAttribute('aria-label', name);
      b.addEventListener('click', () => showColorway(series, i));
      swatches.append(b);
    });
    showColorway(series, 0);
  }

  Object.keys(COLORWAYS).forEach((series) => {
    const t = document.createElement('button');
    t.type = 'button';
    t.className = 'swatcher__tab';
    t.setAttribute('role', 'tab');
    t.textContent = series;
    t.addEventListener('click', () => showSeries(series));
    tabs.append(t);
  });
  showSeries('Foodie');
}

// Carruseles (colecciones y publicaciones): los botones avanzan casi una pantalla del suyo
document.querySelectorAll('.collection__controls .viewer__btn').forEach((btn) => {
  const track = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: Number(btn.dataset.dir) * track.clientWidth * 0.8, behavior: smooth ? 'smooth' : 'auto' });
  });
});

// El menú cambia a negro cuando pasa por encima de un bloque oscuro
function updateNavColor() {
  if (nav.classList.contains('is-open')) return;
  // Rediseño: el menú es crema, y se vuelve negro sobre los bloques oscuros (.is-dark y el pie)
  const below = document.elementFromPoint(innerWidth / 2, nav.offsetHeight + 10);
  nav.classList.toggle('nav--dark', !!below?.closest('.is-dark, .case-block--violet, .case-next, footer'));
  // Sobre la foto de portada el menú va transparente
  const film = document.querySelector('.hero--film');
  nav.classList.toggle('is-top', !!film && scrollY < film.offsetHeight - nav.offsetHeight);
}

let navTicking = false;
addEventListener('scroll', () => {
  if (navTicking) return;
  navTicking = true;
  requestAnimationFrame(() => { updateNavColor(); navTicking = false; });
}, { passive: true });
addEventListener('resize', updateNavColor);
addEventListener('load', updateNavColor);
addEventListener('pageshow', () => requestAnimationFrame(updateNavColor)); // las fuentes y las imágenes pueden mover lo que hay bajo el menú
updateNavColor();

// Marca en el menú la sección que se está viendo (la que cruza el centro de la pantalla)
const navLinks = new Map(
  [...document.querySelectorAll('.nav__links a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a])
);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.removeAttribute('aria-current'));
    // data-nav: secciones sin enlace propio que cuentan como otra (Experiencia → Sobre mí)
    navLinks.get(entry.target.dataset.nav || entry.target.id)?.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main > section').forEach((s) => sectionObserver.observe(s));

// Aparición suave de los bloques al entrar en pantalla
const targets = document.querySelectorAll('.project, .chapter, .about__text, .about__photo, .timeline li, .edu-now, .edu-card, .case-step, .case-task');
targets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -10% 0px' }); // por píxeles y no por porcentaje: los bloques muy altos nunca llegaban al 12 % visible

targets.forEach((el) => observer.observe(el));

// Bucles de vídeo (logo, infografía): se reproducen solo en pantalla y nunca con «reducir movimiento»
const loops = document.querySelectorAll('video[data-loop]');
if (loops.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const loopObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: 0.4 });
  loops.forEach((v) => loopObserver.observe(v));
}

// Animación de entrada: un clic o Esc la salta
const intro = document.querySelector('.intro');
if (intro) {
  const skip = () => { intro.classList.add('is-skipped'); removeEventListener('keydown', onKey); };
  // Cualquier tecla de navegación la salta, para no tapar la portada a quien usa el teclado
  const onKey = (e) => { if (['Escape', 'Tab', 'Enter', ' '].includes(e.key)) skip(); };
  intro.addEventListener('click', skip);
  addEventListener('keydown', onKey);
  intro.addEventListener('animationend', (e) => { if (e.target === intro) skip(); });
}

// Protección de las piezas: sin menú contextual ni arrastre sobre imágenes y vídeos
// (evita el «Guardar imagen como…»; no impide una captura de pantalla)
const isMedia = (el) => el instanceof Element && el.closest('img, video, picture, .shot, .lightbox, .intro');
document.addEventListener('contextmenu', (e) => { if (isMedia(e.target)) e.preventDefault(); });
document.addEventListener('dragstart', (e) => { if (isMedia(e.target)) e.preventDefault(); });

// Parallax suave en las imágenes grandes (capítulos de la portada y cabeceras de proyecto)
const parallax = document.querySelectorAll('.chapter__media img, .chapter__media video, .case-hero__media img, .case-hero__media video');
if (parallax.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  const move = () => {
    ticking = false;
    parallax.forEach((el) => {
      const box = el.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      // -1 cuando la imagen entra por abajo, 1 cuando sale por arriba
      const p = (innerHeight - box.top) / (innerHeight + box.height) * 2 - 1;
      el.style.setProperty('--py', `${(p * 5).toFixed(2)}%`);
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  addEventListener('resize', move);
  move();
}

// Vídeos decorativos (portada y cabecera de Vídeo): solo se mueven al pasar el ratón o al llegar con el teclado
document.querySelectorAll('video[data-hover-play]').forEach((v) => {
  const area = v.closest('.chapter, .case-hero') || v;
  const play = () => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {}); };
  const stop = () => v.pause();
  area.addEventListener('mouseenter', play);
  area.addEventListener('mouseleave', stop);
  area.addEventListener('focusin', play);
  area.addEventListener('focusout', stop);
});
