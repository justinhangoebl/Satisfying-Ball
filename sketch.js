let balls = []; // Array to hold all ball objects
let circles = [];
const numCircles = 50; // Increased circles a bit for more interaction
const initialBallSpeed = 4; // Slightly adjusted speed
const ballSize = 25;
const circleMinSize = 35;
const circleMaxSize = 90;
const maxBalls = 50; // Limit the number of balls

function setup() {
  createCanvas(windowWidth, windowHeight);
  createInitialBall();
  createCircles(numCircles);
}

function draw() {
  background(0); // Clear background
  for (let i = balls.length - 1; i >= 0; i--) {
    let b = balls[i];

    // Update ball position
    b.x += b.vx;
    b.y += b.vy; // vy is now positive (downward)

    // --- Collision Detection (Ball vs Circles) ---
    for (let j = circles.length - 1; j >= 0; j--) {
      let c = circles[j];
      let distance = dist(b.x, b.y, c.x, c.y);

      if (distance < b.size / 2 + c.size / 2) {
        // --- Collision ---
        circles.splice(j, 1); // Remove circle

        // Spawn new ball if under limit
        if (balls.length < maxBalls) {
          // Spawn new ball slightly above collision point, moving down
          spawnBall(b.x, b.y - b.size / 2);
        }

        b.color = color(random(255), random(255), random(255)); // Flash color
        break; // Ball hits only one circle per frame
      }
    }
    
    if(spawned != second() && second()%2 == 0) {
        spawned = second()
        spawnBall(0, 0);
    }
    noStroke();
    fill(b.color);
    ellipse(b.x, b.y, b.size, b.size);

    // --- Remove Off-Screen Balls (Check Bottom, Left, Right) ---
    if (b.y > height + b.size || b.x < -b.size || b.x > width + b.size) {
      balls.splice(i, 1); // Remove the ball
      // console.log("Removed ball. Balls remaining:", balls.length); // Debug log
    }

  } // End ball loop

  // --- Draw Remaining Circles ---
  for (let c of circles) {
    noFill();
    stroke(c.color);
    strokeWeight(3);
    ellipse(c.x, c.y, c.size, c.size);
  }

  // --- Reset Condition ---
  // If the balls array is empty (meaning the last ball went off-screen), reset.
  if (balls.length === 0 && !mouseIsPressed) { // Added !mouseIsPressed to avoid conflict during click-reset
      // console.log("All balls gone. Resetting sketch."); // Debug log
      resetSketch();
  }
}

// Function to create the very first ball (Starts at Top)
function createInitialBall(amount = 1) {
    // console.log("Creating initial ball."); // Debug log
    // Create a single ball at the top of the screen
    // balls = []; // Clear existing balls  
    balls = []; // Clear existing balls
    for (let i = 0; i < amount; i++) {
    balls.push({

      x: width / 2,
      y: -ballSize, // Start just above the screen top
      size: ballSize,
      color: color(255, 0, 0), // Red
      vx: random(-initialBallSpeed * 0.3, initialBallSpeed * 0.3), // Slight initial horizontal variation
      vy: initialBallSpeed    // Positive velocity = moving DOWN
    });
}
}

// Function to spawn a new ball (Starts at specific location, moves Down)
function spawnBall(x, y) {
    balls.push({
        x: width/2 + random(-width/4, width/4), // Random horizontal spawn
        y: 0,
        size: ballSize * random(0.8, 1.2),
        color: color(random(150, 255), random(150, 255), random(150, 255)),
        // Randomized downward velocity
        vx: random(-initialBallSpeed * 0.6, initialBallSpeed * 0.6), // More horizontal variation for spawned balls
        vy: initialBallSpeed * random(0.8, 1.4) // Positive velocity = moving DOWN
    });
}


// Function to create the initial set of circles (Spread more vertically)
function createCircles(count) {
  circles = [];
  for (let i = 0; i < count; i++) {
    circles.push({
      x: random(width * 0.05, width * 0.95),
      // Spread circles more throughout the screen height, avoiding very top/bottom
      y: random(height *0.15, height*0.975),
      size: random(circleMinSize, circleMaxSize),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
  // Sort circles by y-position (optional)
  circles.sort((a, b) => a.y - b.y);
}

// Function to reset the animation
function resetSketch() {
  createInitialBall(1); // Reset to one initial ball at the top
}

// Mouse interaction to reset
function mousePressed() {
    resetSketch();
}

