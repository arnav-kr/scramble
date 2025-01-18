import './style.css'
import { shuffle, download } from './utils.js'

const form = document.getElementById("f");
const output = document.getElementById("cv");
let canvas;
let ctx = output.getContext("2d");

function elById(id) {
  return document.getElementById(id);
}

elById("im").addEventListener("change", (e) => {
  let file = e.target.files[0];
  let img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    output.width = img.width;
    output.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
});

elById("di").addEventListener("click", async () => { download(await new Promise(resolve => output.toBlob(resolve)), "scrambled.png") });
elById("dd").addEventListener("click", () => { download(new Blob([JSON.stringify(pixels)], { type: "application/json" }), "pixels.json") });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let file = elById("im").files[0];

  let img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    canvas = new OffscreenCanvas(img.width, img.height);
    let octx = canvas.getContext("2d", {
      willReadFrequetly: true,
    });
    octx.drawImage(img, 0, 0);
    // get image data
    let imageData = octx.getImageData(0, 0, canvas.width, canvas.height);
    // split image data in chunks of 4
    let pixels = Array.from(imageData.data).reduce((acc, curr, i) => {
      if (i % 4 === 0) acc.push([curr]);
      else acc[acc.length - 1].push(curr);
      return acc;
    }, []);

    // shuffle pixels and draw to output canvas
    pixels = shuffle(pixels);

    let imageDataOut = new ImageData(new Uint8ClampedArray(pixels.flat()), canvas.width, canvas.height);
    for (let p of pixels) {
      imageData.data.set(p);
    }
    output.width = canvas.width;
    output.height = canvas.height;
    ctx.putImageData(imageDataOut, 0, 0);
    elById("ac").style.display = "flex";
  };
});