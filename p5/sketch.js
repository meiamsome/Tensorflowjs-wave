let current, previous;

const dampening = 0.999;

function createBuffer() {
  let buffer = createGraphics(width, height);
  buffer.noStroke();
  buffer.fill(0);
  buffer.rect(0, 0, width, height);
  buffer.loadPixels();
  return buffer;
}

function setup() {
  pixelDensity(1);
  let canvas = createCanvas(600, 400);
  current = createBuffer();
  previous = createBuffer();
}

function mouseDragged() {
  current.pixels[4 * width * mouseY + 4 * mouseX + 0] = 255;
  current.pixels[4 * width * mouseY + 4 * mouseX + 1] = 255;
  current.pixels[4 * width * mouseY + 4 * mouseX + 2] = 255;
}

function draw() {
  let temp = current;
  current = previous;
  previous = temp;
  for(let x = 1; x < width - 1; x++) {
    for(let y = 1; y < height - 1; y++) {
      for(let off = 0; off < 3; off++) {
        let sum = 0;
        sum += previous.pixels[4 * width * y + 4 * (x - 1) + off];
        sum += previous.pixels[4 * width * y + 4 * (x + 1) + off];
        sum += previous.pixels[4 * width * (y - 1) + 4 * x + off];
        sum += previous.pixels[4 * width * (y + 1) + 4 * x + off];
        let currVal = current.pixels[4 * width * y + 4 * x + off];
        current.pixels[4 * width * y + 4 * x + off] = dampening * (sum / 2 - currVal);
      }
    }
  }
  current.updatePixels();
  image(current, 0, 0);
}
