let shapes = [];
let birdSound, waterSound, rainSound;
let isRaining = false; // Track if rainSound is playing

let amplitude; // For measuring volume levels

// preload() function to load sounds
function preload() {
  birdSound = loadSound('asset/birdeffect.wav');
  waterSound = loadSound('asset/watereffect.mp3');
  rainSound = loadSound('asset/nighteffect.mp3');
}

// setup() function
function setup() {
  createCanvas(800, 600);
  loop(); 

  amplitude = new p5.Amplitude(); // Initialize amplitude analyzer
  amplitude.setInput(rainSound); // Attach to rain sound

  // Create the sky and water
  for (let y = 0; y < height / 2; y += 10) {
    let skyColor = lerpColor(color(25, 60, 150), color(255, 190, 120), y / (height / 2));
    shapes.push(new BauhausRect(0, y, width, 10, skyColor)); 
  }

  // Create the water
  for (let y = height / 2; y < height; y += 10) {
    let waterColor = lerpColor(color(255, 150, 100), color(0, 100, 150), (y - height / 2) / (height / 2));
    shapes.push(new BauhausRect(0, y, width, 10, waterColor)); 
  }

  // Create the building
  shapes.push(new BauhausRect(220, 80, 30, 100, color(0, 0, 0))); // Left part
  shapes.push(new BauhausRect(210, 120, 50, 80, color(20, 10, 60))); // Middle part
  shapes.push(new BauhausRect(190, 180, 300, 120, color(50, 30, 80))); // Right part

  // Add the reflection of the building on the water
  shapes.push(new BauhausRect(220, 300, 80, 200, color(0, 0, 0, 80))); // Top reflection, transparent black
  shapes.push(new BauhausRect(230, 450, 50, 80, color(20, 10, 60, 80))); // Middle reflection, transparent purple
  shapes.push(new BauhausRect(250, 500, 30, 60, color(150, 30, 80, 80))); // Bottom reflection, transparent red

  // Add the windows of the building
  for (let i = 0; i < 20; i++) {
    shapes.push(new BauhausLine(random(width), random(height / 2, height), random(50, 150), 0, color(255, 100, 50, 100))); 
  }

  // Add the sun
  shapes.push(new BauhausCircle(600, 100, 80, color(255, 200, 50, 180))); 

  // Add the clouds
  shapes.push(new BauhausCloud(100, 70, 90, 200)); // The first cloud
  shapes.push(new BauhausCloud(300, 50, 120, 230)); // The second cloud
  shapes.push(new BauhausCloud(500, 100, 100, 180)); // The third cloud
  shapes.push(new BauhausCloud(650, 80, 130, 200)); // The fourth cloud
  shapes.push(new BauhausCloud(750, 120, 85, 220)); // The fifth cloud
}

// Detect mouse over the sun
function mouseOverSun() {
  let d = dist(mouseX, mouseY, 600, 100); // Sun's position
  return d < 40; // Radius of the sun
}

// Add interaction when clicking the Sun
function mousePressed() {
  if (mouseOverSun()) {
    isRaining = !isRaining; // Toggle raining state
    
    if (isRaining) {
      rainSound.loop(); // Play the rain sound
    } else {
      rainSound.stop();
    }
  }
}

// Function to draw raindrops with size based on volume level
function drawRaindrops() {
  let volume = amplitude.getLevel(); // Get the volume level
  let raindropSize = map(volume, 0, 1, 5, 20); // Map volume to raindrop size
  
  for (let i = 0; i < 100; i++) { // Draw raindrops
    let x = random(width);
    let y = random(height / 2, height);
    fill(173, 216, 230, 150); // Light blue raindrops
    noStroke();
    ellipse(x, y, raindropSize, raindropSize * 1.5); // Raindrop shape
  }
}

// draw() function
function draw() {
  if (isRaining) {
    background(0, 0, 139); // Change the background to dark blue if raining
  } else {
    background(255); // Initial background color
  }

  // Draw all shapes
  for (let shape of shapes) {
    shape.draw();
    if (shape instanceof BauhausCloud) {
      shape.move(); // Move the clouds
    }
  }

  // If it’s raining, draw the raindrops
  if (isRaining) {
    drawRaindrops();
  }
}

// BauhausShape class
class BauhausShape {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

// BauhausRect class
class BauhausRect extends BauhausShape {
  constructor(x, y, width, height, color) {
    super(x, y, color);
    this.width = width;
    this.height = height;
  }

  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}

// BauhausCircle class
class BauhausCircle extends BauhausShape {
  constructor(x, y, size, color) {
    super(x, y, color);
    this.size = size;
  }
// Draw the circle
  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

// BauhausLine class
class BauhausLine {
  constructor(x, y, length, angle, color) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.color = color;
  }
// Draw the line
  draw() {
    stroke(this.color);
    strokeWeight(2);
    push();
    translate(this.x, this.y);
    rotate(radians(this.angle));
    line(0, 0, this.length, 0);
    pop();
  }
}

// Cloud class，Use multiple circles to form clouds and add motion effects
class BauhausCloud extends BauhausShape {
  constructor(x, y, size, alpha) {
    super(x, y, color(255, 255, 255, alpha)); 
    this.size = size; // The size of the cloud
    this.speedX = random(0.2, 1); // The random speed of the cloud on the x-axis (move left and right)
    this.speedY = random(-0.2, 0.2); // The random speed of the cloud on the y-axis (move up and down)
  }

  // Draw the cloud
  draw() {
    noStroke();
    fill(this.color);

    // Draw the cloud with multiple ellipses
    ellipse(this.x, this.y, this.size, this.size * 0.5); 
    ellipse(this.x - this.size * 0.4, this.y + this.size * 0.2, this.size * 0.6, this.size * 0.4); // The left ellipse
    ellipse(this.x + this.size * 0.4, this.y + this.size * 0.2, this.size * 0.6, this.size * 0.4); // The right ellipse
    ellipse(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.5, this.size * 0.3); // The top ellipse
    ellipse(this.x + this.size * 0.2, this.y - this.size * 0.2, this.size * 0.5, this.size * 0.3); // The bottom ellipse
  }

  // Move the cloud
  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // If the cloud moves out of the left edge of the canvas, reset its position to the right edge
    if (this.x > width + this.size) {
      this.x = -this.size;
    }
    // If the cloud moves out of the top or bottom edge of the canvas, reverse its moving direction
    if (this.y > height / 2 || this.y < 0) {
      this.speedY *= -1;
    }
  }
}