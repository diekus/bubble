const fileInput = document.getElementById('fileInput');
const sky = document.getElementById('sky');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    sky.setAttribute('src', e.target.result);
  };
  reader.readAsDataURL(file);
});

// loads an image into the sky element from a given URL
function loadImageFromUrl(url, skyElementId = 'sky') {
  const sky = document.getElementById(skyElementId);
  if (sky && url) {
    sky.setAttribute('src', url);
  }
}

//initialize with a default image
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if(isDarkMode) {
  loadImageFromUrl('./images/start-dark.jpg');
} else {
  loadImageFromUrl('./images/start.jpg');
}

// file handling: OS "Open with" / double-click on an image file launches bubble with it loaded
if ('launchQueue' in window) {
  window.launchQueue.setConsumer(async (launchParams) => {
    if (!launchParams.files || !launchParams.files.length) return;
    const file = await launchParams.files[0].getFile();
    loadImageFromUrl(URL.createObjectURL(file));
  });
}

// web share target: image shared from another app is handed off by the service worker via the cache
if (new URLSearchParams(window.location.search).get('shared') === '1') {
  const SHARE_CACHE = 'bubble-share-target';
  caches.open(SHARE_CACHE).then(async (cache) => {
    const response = await cache.match('/shared-image');
    if (!response) return;
    const blob = await response.blob();
    loadImageFromUrl(URL.createObjectURL(blob));
    await cache.delete('/shared-image');
    history.replaceState(null, '', window.location.pathname);
  });
}

// demo gallery: bottom-sheet picker over GALLERY_IMAGES (see gallery-data.js)
const galleryButton = document.getElementById('galleryButton');
const galleryOverlay = document.getElementById('galleryOverlay');
const galleryClose = document.getElementById('galleryClose');
const galleryGrid = document.getElementById('galleryGrid');
const galleryHeader = document.querySelector('header');
const galleryMain = document.querySelector('main');
let lastFocusedElement = null;

function renderGallery() {
  galleryGrid.innerHTML = '';
  GALLERY_IMAGES.forEach(({ title, src, alt }) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy"><span>${title}</span>`;
    item.addEventListener('click', () => {
      loadImageFromUrl(src);
      closeGallery();
      galleryHeader.classList.add('hidden');
    });
    galleryGrid.appendChild(item);
  });
}

function onGalleryKeydown(e) {
  if (e.key === 'Escape') closeGallery();
}

function openGallery() {
  lastFocusedElement = document.activeElement;
  galleryHeader.setAttribute('inert', '');
  galleryMain.setAttribute('inert', '');
  galleryOverlay.removeAttribute('inert');
  galleryOverlay.removeAttribute('aria-hidden');
  galleryOverlay.classList.add('open');
  galleryClose.focus();
  document.addEventListener('keydown', onGalleryKeydown);
}

function closeGallery() {
  galleryOverlay.classList.remove('open');
  galleryOverlay.setAttribute('inert', '');
  galleryOverlay.setAttribute('aria-hidden', 'true');
  galleryHeader.removeAttribute('inert');
  galleryMain.removeAttribute('inert');
  document.removeEventListener('keydown', onGalleryKeydown);
  if (lastFocusedElement) lastFocusedElement.focus();
}

galleryButton.addEventListener('click', openGallery);
galleryClose.addEventListener('click', closeGallery);
galleryOverlay.addEventListener('click', (e) => {
  if (e.target === galleryOverlay) closeGallery();
});

renderGallery();

// toggle menu visibility on double click (desktop) or double tap (mobile)
const menu = document.querySelector('header');
document.addEventListener('dblclick', () => {
  menu.classList.toggle('hidden');
});

let lastTap = 0;

document.addEventListener('touchend', function(e) {
  const now = Date.now();
  const DOUBLE_TAP_DELAY = 300; // ms between taps

  if (now - lastTap < DOUBLE_TAP_DELAY) {
    // Double tap detected!
    e.preventDefault();
    menu.classList.toggle('hidden');
  }

  lastTap = now;
});
