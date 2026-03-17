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
