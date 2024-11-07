let shapes = [];
let birdSound, waterSound, rainSound;
let isRaining = false; // Track if rainSound is playing
let raindrops = []; // Array to hold raindrops
let amplitude; // For measuring volume levels
let fft; // For frequency analysis of waterSound
let waterButton; // Play/pause button for waterSound

// preload() function to load sounds
function preload() {
  birdSound = loadSound('asset/birdeffect.wav');
  waterSound = loadSound('asset/watereffect.mp3');
  rainSound = loadSound('asset/nighteffect.mp3');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupShapes(); // Recreate shapes based on the new window size
}

// Function to set up shapes and adjust positions based on canvas size
function setupShapes() {
  shapes = []; // Clear the existing shapes

    //create the sky and water
    for (let y = 0; y < height / 2; y += 10) {
      let skyColor = lerpColor(color(25, 60, 150), color(255, 190, 120), y / (height / 2));
      shapes.push(new BauhausRect(0, y, width, 10, skyColor)); 
    }
  
   //create the water
    for (let y = height / 2; y < height; y += 10) {
      let waterColor = lerpColor(color(255, 150, 100), color(0, 100, 150), (y - height / 2) / (height / 2));
      shapes.push(new BauhausRect(0, y, width, 10, waterColor)); 
    }
  
    //create the building
    shapes.push(new BauhausRect(240, 235, 30, 100, color(0, 0, 0))); //left part
    shapes.push(new BauhausRect(220, 295, 80, 80, color(20, 10, 60))); // middle part
    shapes.push(new BauhausRect(190, 335, 300, 120, color(50, 30, 80))); // right part
  
    // Add the reflection of the building on the water
    shapes.push(new BauhausRect(220, 405, 80, 200, color(0, 0, 0, 80))); // top reflection, transparent black
    shapes.push(new BauhausRect(230, 500, 50, 80, color(20, 10, 60, 80))); // middle reflection, transparent purple
    shapes.push(new BauhausRect(250, 550, 30, 60, color(150, 30, 80, 80))); // bottom reflection, transparent red
  
    // Add wave
    for (let i = 0; i < 20; i++) {
      shapes.push(new BauhausLine(random(width), random(height / 2, height), random(50, 150), 0, color(20, 10, 60, 180))); 
    }
  
    // Add the sun
    shapes.push(new BauhausCircle(width * 0.75, height * 0.15, height * 0.1, color(255, 200, 50, 180))); // Sun
  
    // Add the clouds
    shapes.push(new BauhausCloud(100, 70, 90, 200)); // The first cloud
    shapes.push(new BauhausCloud(300, 50, 120, 230)); // The second cloud
    shapes.push(new BauhausCloud(500, 100, 100, 180)); // The third cloud
    shapes.push(new BauhausCloud(650, 80, 130, 200)); // The fourth cloud
    shapes.push(new BauhausCloud(750, 120, 85, 220)); // The fifth cloud
}

// Call setupShapes initially in setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  loop();

  amplitude = new p5.Amplitude();
  amplitude.setInput(waterSound);

  fft = new p5.FFT(0.8, 64);
  fft.setInput(waterSound);

  waterButton = createButton('PLAY');
  waterButton.position(10, 10);
  waterButton.mousePressed(toggleWaterSound);

  setupShapes(); // Create shapes initially based on window size

  // Play bird sound initially
  birdSound.loop();
}

// Detect mouse over the sun
function mouseOverSun() {
  // Find the sun in the shapes array (assuming it’s the last added shape or at a known index)
  let sun = shapes.find(shape => shape instanceof BauhausCircle);

  if (sun) {
    // Calculate distance between mouse and sun's center
    let d = dist(mouseX, mouseY, sun.x, sun.y);
    return d < sun.size / 2; // Check if within radius
  }
  return false;
}

// Add interaction when clicking the Sun
function mousePressed() {
  if (mouseOverSun()) {
    isRaining = !isRaining; // Toggle raining state
    
    if (isRaining) {
      rainSound.loop(); // Play the rain sound
      birdSound.stop(); // Stop bird sound when it starts raining
    } else {
      rainSound.stop();
      birdSound.loop(); // Resume bird sound when it stops raining
    }
  }
}

// Function to draw raindrops with size based on volume level
function drawRaindrops() {
  // Analyze the sound spectrum to determine raindrop length
  let spectrum = fft.analyze();

  // Calculate the average frequency level for the lower half of the spectrum
  let raindropIntensity = 0;
  for (let i = 0; i < spectrum.length / 2; i++) {
    raindropIntensity += spectrum[i] * 10;
  }
  raindropIntensity = raindropIntensity / (spectrum.length / 2); // Get the average

  // Map the intensity to the raindrop length
  let raindropLength = map(raindropIntensity, 0, 255, 5, 30); // Adjust max length for effect

  // Add new raindrops at random positions along the top
  for (let i = 0; i < 5; i++) { // Control the rate of new raindrops
    let x = random(width);
    let speed = random(2, 5); // Random speed for falling
    raindrops.push({ x: x, y: 0, width: 3, height: raindropLength, speed: speed });
  }

  // Update and draw each raindrop
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let raindrop = raindrops[i];
    raindrop.y += raindrop.speed; // Move raindrop down

    fill(173, 216, 230, 150); // Light blue raindrop color
    noStroke();
    rect(raindrop.x, raindrop.y, raindrop.width, raindrop.height); // Draw the raindrop as a rectangle

    // Remove raindrop if it goes off-screen
    if (raindrop.y > height) {
      raindrops.splice(i, 1);
    }
  }
}

// Toggle water sound play/pause
function toggleWaterSound() {
  if (!waterSound.isPlaying()) {
    waterSound.loop();
    birdSound.stop();
    waterButton.html("PAUSE");
  } else {
    waterSound.stop();
    birdSound.loop();
    waterButton.html("PLAY");
  }
}

// draw() function
function draw() {
  if (isRaining) {
    background(0, 0, 139); // Change the background to dark blue if raining
  } else {
    background(255); // Initial background color
  }

  let amplitudeLevel = amplitude.getLevel(); // Get the amplitude level of waterSound
  
  // Analyze the frequency spectrum of the audio
  let spectrum = fft.analyze(); // Get an array of frequency values
  
  // Update and move each shape
  let lineCount = 0;
  for (let shape of shapes) {
    if (shape instanceof BauhausLine) {
      // Update line length based on frequency spectrum
      let freqValue = spectrum[lineCount % spectrum.length];
      shape.updateLength(freqValue); // Adjust length based on frequency
      shape.move(); // Horizontal movement only
      lineCount++;
    } else if (shape instanceof BauhausRect) {
      shape.animateHeight(amplitudeLevel); // Animate height based on amplitude
    } else if (shape instanceof BauhausCloud) {
      shape.move(); // Move the clouds
    }
    shape.draw(); // Draw each shape
  }

  // If it’s raining, draw the raindrops
  if (isRaining) {
    drawRaindrops();
  }
}

// Inside drawAudioVisualization function
function drawAudioVisualization() {
  let spectrum = fft.analyze(); // Get frequency spectrum

  noFill();
  for (let i = 0; i < spectrum.length; i++) {
    let y = map(spectrum[i], 0, 255, height, 0); // Map frequency to height
    
    // Use colors that blend into the sky background, with low opacity
    let blendedColor = color(255, 190, 120, 50); // Light orange with low opacity
    fill(blendedColor);
    stroke(0, 100, 150, 70); // Soft blue outline for subtle contrast
    rect(i * 10, y, 10, height - y); // Draw a bar for each frequency
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

// Inside BauhausRect class's animateHeight method
class BauhausRect extends BauhausShape {
  constructor(x, y, width, height, color) {
    super(x, y, color);
    this.width = width;
    this.baseHeight = height; // Store the base height
    this.height = height; // Current height, which will oscillate
  }

  animateHeight(amplitudeLevel) {
    // Increase the height variation range for a more pronounced effect
    let heightVariation = map(amplitudeLevel, 0, 1, -this.baseHeight * 0.4, this.baseHeight * 0.6);
    this.height = this.baseHeight + heightVariation;
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
    this.baseLength = length; // Store the original length
    this.length = length;      // Current length, will be adjusted based on frequency
    this.angle = angle;
    this.color = color;
    
    // Set a random speed for horizontal movement
    this.speedX = random(0.5, 2); // Horizontal speed only
  }

  // Update length based on a frequency value
  updateLength(freqValue) {
    // Adjust length based on frequency; higher values create larger length changes
    this.length = this.baseLength + map(freqValue, 0, 255, -20, 80); // Adjust the range as needed
  }

  // Move the line horizontally across the canvas
  move() {
    this.x += this.speedX;

    // Horizontal boundary check to wrap the line around the canvas
    if (this.x > width + this.length) {
      this.x = -this.length; // Reset to the left edge if it moves past the right edge
    }
    if (this.x < -this.length) {
      this.x = width + this.length; // Reset to the right edge if it moves past the left edge
    }
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