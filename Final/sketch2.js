//---- MAIN OBJECTS
var fishy; // our player variable
var pinks; // will hold pink enemy fish
var jellies; // will hold jellyfish

//---- SEFCONDARY OBJECTS
var kelp1; //
var kelp2;
var bubbles; 

//---- GAME LOGISTICS + UI
var collectibles; // fish food for points ; 250 points = new heart ?
var lives; // will hold lives
var score; // will hold score
var scene; // end game scene
var gameUi; // will load score on top of this

//---- GAME "PHYSICS"
var buffer = 30; // just a constant
var dy; // default y-coordinate
var jx; // jellyfish x
var px; // pink fish x
var py; // pink fish y
var cx; // coin x
var cy; // coin y

//---- Colors for background (https://p5js.org/examples/color-linear-gradient.html)
var b1, b2, c1, c2; // defined below

//----  SOUNDS
var collectsound; // sound when colect coin
var zappy; // sound on death 
var delay; // to delay zapp sound
var pool; // underwater pool

function preload() {
  //--- static images
  gameUi = loadImage("assets/Score.png"); 
  kelp1 = loadImage("assets/BGkelp.png"); 
  kelp2 = loadImage("assets/FGkelp.png"); 
  bubbles = loadImage("assets/bubbles.png"); 
  bubbles2 = loadImage("assets/bubbles2.png"); 
  //--- mp3 files
  zappy = loadSound("sounds/electric.wav");
  pool = loadSound("sounds/pool.wav");  
  collectsound = loadSound("sounds/coins.ogg"); // https://gamesounds.xyz/?dir=Kenney%27s%20Sound%20Pack/RPG%20Sounds/OGG  
}

//---- SETUP
function setup() {
  createCanvas(600, 400);
  
  //-- sounds
  pool.loop();
  
  zappy.disconnect(); 
  delay = new p5.Delay();
  delay.process(zappy, .12, .7, 2300);
  delay.setType('lowpass'); // a stereo effect
  
  // setting BG gradient colors
  b1 = color(140, 237, 255);
  b2 = color(43, 110, 148);

  c1 = color(77, 98, 201);
  c2 = color(6, 10, 16);
  
  // setting score + scene
  score = 0;
  scene = -1; // -1
  dy = -buffer;
  
  // create empty groups
  lives = new Group();
  pinks = new Group();
  jellies = new Group();
  collectibles = new Group();

  // create player/ fishy
  fishy = createSprite(400,150);
  fishy.setDefaultCollider();
  fishy.addAnimation('swim','assets/Fishy1.png', 'assets/Fishy2.png','assets/Fishy1.png','assets/Fishy3.png');
}

//---- RESET SKETCH | Dan Shiffman taught me: https://www.youtube.com/watch?v=lm8Y8TD4CTM
// function resetSketch() {
//   resetSketch();  
//   var button = createButton('RESET');
//   button.mousePressed(resetSketch);
// }

//---- SET GRADIENT BACKGROUND
function setGradient(x, y, w, h, b1, b2) { // function will make gradient
  noFill();
  // Top to bottom gradient
  for (var i = y; i <= y + h; i++) {
      var inter = map(i, y, y + h, 0, 1);
      var b = lerpColor(b1, b2, inter);
      stroke(b);
      line(x, i, x + w, i);
    }
}

//---- DRAW TO SKETCH
function draw() {
  if(scene < 0){
    // Default BG if you do not collide with enemy
    setGradient(0, 0, windowWidth, 400, b1, b2); // setGradient(0, 0, windowWidth, 400, c1, c2, Y_AXIS); 
    // continuously create new jellyfish every random(50,200) frames
    if(frameCount%int(random(50,200))==0) { 
      jx = random(0,width-buffer);
      createJelly(jx, dy);
    }
    // continuously create new pink fish every random(100,150) frames
    if(frameCount%int(random(100,150))==0) {  
      px = random(-100,0);
      py = random(-height, height);
      createPinky(px, py); // pinks going to the right
    }
    // continuously create new pink fish every random(100,150) frames
    if(frameCount%int(random(200,350))==0) {  
      px = random(width,width+buffer);
      py = random(-height, height);
      createPinky2(px, py); // pinks going to the left
    }
    // generate coins for points!!!!!!!!!
    if(frameCount%int(random(100,290))==0) {  
      cx = random(0,width);   
      cy = random(0,-50);
      createCoin(cx, cy); // creating coints/fish food randomly all over screen
    }
    // Player Movement on X-Axis
    if(mouseX < fishy.position.x - 10) {
      fishy.changeAnimation('swim');
      // flip horizontally
      fishy.mirrorX(-1);
      // negative x velocity: move left
      fishy.velocity.x = -2;
    } else if(mouseX > fishy.position.x + 10) {
      fishy.changeAnimation('swim');
      // unflip
      fishy.mirrorX(1);
      fishy.velocity.x = 2;
    } else {
      // if close to the mouse, don't move
      fishy.changeAnimation('swim');
      fishy.velocity.x = 0;
      fishy.velocity.y = 0;
    }
    // Player Movement on Y-Axis
    if(mouseY < fishy.position.y) {
      fishy.velocity.y = -2;
    } else {
      (mouseY > fishy.position.y) 
      fishy.velocity.y = 2;
    }
    
    //----INTERACTIONS----//
    //fishy.bounce(pinks); // fish bounces of pink fish
    fishy.overlap(jellies, Zap); 
    fishy.overlap(pinks, Push); 
    fishy.overlap(collectibles, coinCollect);
    
    //drawing the sprites
    image(bubbles, 0,0);
    image(kelp1, 14, 254);
    drawSprites();
    image(kelp2, 254, 245);
    
    // draw game UI at top of screen + draw score on top
    image(gameUi, 209, 0);
    fill(0);
    textSize(40);
    textFont("Nanum Pen Script");
    text(score, width/2, 30);
    
  } else { //----GAME OVER SCENE----//
    setGradient(0, 0, windowWidth, 400, c1, c2); 
    image(bubbles, 0,0);
    pool.stop();
    textAlign(CENTER);
    
    fill(255);
    textSize(36);
    textFont("Anton");
    text('GAME OVER', width/2, 60);
    
    textSize(60);
    fill(194,251,255);
    textFont("Nanum Pen Script");
    text('You Got Zapped!', width/2, 150);
    
    fill(255);
    noStroke();
    textSize(32);
    textFont("Anton");
    text(' ' + score + ' ', width/2,200);
    textSize(20);
    text('score', width/2,220);
    //text('You scored '+ score + " points!" , width/2, 150);
  }
    
} 

//----INTERACTION FUNCTIONS----//
function Zap(Jelly, fish) {
  fill(255);
  zappy.play();
  console.log("YOU GOT ZAPPED!");
  scene += 2; 
}

function Push(Pink, fish) {
  fill(255);
  console.log("You lost a coin!");
  //scene += 2; 
}

function coinCollect(fishy, Coin) {
  Coin.remove();
  collectsound.play();
  score +=1;
  console.log(score);  
}

//----OBJECT CREATION----//
function createCoin(x, y) { // create coin at given X,Y 
  var newCoin = createSprite(x,y);
  newCoin.addAnimation('floating', 'assets/food1.png', 'assets/food1.png');
  // speed intervals 
  newCoin.setSpeed(0.05); 
  newCoin.setVelocity(random(-0.5,0.3), random(0,.5)); 
  // collision box
  newCoin.setDefaultCollider();
  // add to group
  collectibles.add(newCoin);
  //return newCoin
}

function createJelly(x, y) { // create Jellyish at given X,Y
  var newJelly = createSprite(x,y);
  newJelly.addAnimation('floating','assets/Jelly2.png','assets/Jelly1.png');
  // speed intervals 
  newJelly.setSpeed(0.25); 
  newJelly.setVelocity(random(-1,2), random(1.2,1.8)); 
  // collision box
  newJelly.setDefaultCollider();
  // add to group
  newJelly.addToGroup(jellies);  
  //console.log("There are" + jellies.length + "jellies");
  // return newJelly;
}

function createPinky(x, y) { // create pink fish at given X,Y going right
  var newPink = createSprite(x,y);
  newPink.addAnimation('assets/Pinky1.png', 'assets/Pinky2.png','assets/Pinky3.png');
  // speed intervals 
  newPink.setSpeed(0.8); 
  newPink.setVelocity(random(0.6,0.8), random(1.2,0.8)); 
  // collider
  newPink.setDefaultCollider();
  // add to group
  pinks.add(newPink); 
  return newPink;
}

function createPinky2(x, y) { // create pink fish at given X,Y going left
  var newPink = createSprite(x,y);
  newPink.addAnimation('assets/Pinky1.png', 'assets/Pinky2.png','assets/Pinky3.png');
  //flip horizontally
  newPink.mirrorX(-1);
  // speed intervals -- becomes update
  newPink.setSpeed(0.05); 
  newPink.setVelocity(random(-1,-2), random(-1.2,-1.8)); 
  // collider
  newPink.setDefaultCollider();
  // add to group
  pinks.add(newPink); 
  return newPink;
}