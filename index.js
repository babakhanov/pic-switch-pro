let images;
let src;

function saveImage(dataUrl) {
  src = dataUrl;
  images.unshift(dataUrl);
  chrome.storage.local.set({ images });
}

function onFileInputChange(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      const maxDim = 200;

      if (width > height) {
        if (width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL();
      saveImage(dataUrl);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

async function main() {
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", onFileInputChange);

  images = (await chrome.storage.local.get("images"))?.images;
  console.log(images);

  if (typeof(images) !== "array") {
    images = [];
  }
}

main();
