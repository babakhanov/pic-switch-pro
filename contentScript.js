let src;

function processImage(image) {
  image.src = src;
  image.__processed = true;
  if (image.srcset) {
    image.srcset = src;
  }
}

async function lookup() {
  src = ((await chrome.storage.local.get("images"))?.images || [])[0];
  if (!src) {
    return;
  }
  const images = document.querySelectorAll('img');
  for (let c = 0; c < images.length; c += 1) {
    const image = images[c];
    if (image.src === src) {
      continue;
    }
    processImage(image);
  }
}

let lookupInterval = null;

function onVisibilityChange() {
  if (document.hidden) {
    clearInterval(lookupInterval);
  } else {
    lookupInterval = setInterval(lookup, 1000);
  }
}

async function main() {
  document.addEventListener('visibilitychange', onVisibilityChange);
  document.addEventListener('DOMContentLoaded', lookup);
  setInterval(lookup, 1000);
  lookup();
}

main();
