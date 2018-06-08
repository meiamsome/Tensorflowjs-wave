let current, previous;
let kernel;

const dampening = 0.999;

function setup() {
  let canvas = createCanvas(600, 400);
  current = tf.zeros([height, width, 1], 'float32');
  previous = tf.zerosLike(current);
  kernel = tf.tensor2d([
    [0.0, 0.5, 0.0],
    [0.5, 0.0, 0.5],
    [0.0, 0.5, 0.0],
  ]).as4D(3, 3, 1, 1);
}

async function draw() {
  if(mouseIsPressed) {
    let buffer = current.buffer();
    // This doesn't seem right to me that this just works
    buffer.set(10, mouseY, mouseX, 0);
  }
  current = tf.tidy(() => {
    let temp1 = tf.conv2d(current, kernel, 1, 'same');
    let temp2 = temp1.sub(previous).mul(tf.scalar(dampening));
    previous.dispose();
    previous = current;
    return temp2;
  });
  // limit to 0 to 1, otherwise you get errors
  let clipped = tf.tidy(() => current.clipByValue(-10, 10).add(tf.scalar(10)).div(tf.scalar(20)));
  await tf.toPixels(clipped, canvas);
  clipped.dispose();
  if(frameCount % 100 === 0) {
    console.log(tf.memory().numTensors, frameRate());
  }
}
