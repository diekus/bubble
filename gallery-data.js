// Single source of truth for the demo gallery. Consumed by app.js (renders the
// picker) and by service-worker.js (importScripts, to precache these images
// for offline use). Add new demo images here only — `src` is relative to the
// site root.
const GALLERY_IMAGES = [
  { title: 'Default (Light)', src: 'images/start.jpg', alt: 'Bright equirectangular test scene' },
  { title: 'Default (Dark)', src: 'images/start-dark.jpg', alt: 'Dark equirectangular test scene' },
  { title: 'Morgins, Switzerland', src: 'images/gallery/morgins-ski-bubble.jpg', alt: 'Rock the Pistes, Morgins Ski Resort' },
  { title: 'Annecy, France', src: 'images/gallery/annecy-bubble.jpg', alt: 'Annecy, 2025' },
];
