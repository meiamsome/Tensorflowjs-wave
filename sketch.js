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

function mouseDragged() {
  let buffer = current.buffer();
  // This doesn't seem right to me that this just works
  buffer.set(1, mouseY, mouseX, 0);
}

function draw() {
  current = tf.tidy(() => {
    let temp1 = tf.conv2d(current, kernel, 1, 'same');
    let temp2 = temp1.sub(previous).mul(tf.scalar(dampening));
    previous.dispose();
    previous = current;
    // limit to 0 to 1, otherwise you get errors
    return tf.clipByValue(temp2, 0, 1);
  });
  // This is leaking memory, so don't leave it running too long...
  tf.tidy(() => (tf.toPixels(current, canvas), null));
  console.log(tf.memory().numTensors);
}
