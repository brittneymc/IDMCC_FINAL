//>>>> MAIN OBJECTS
var fishy; // our player variable
var pinks; // will hold pink enemy fish
var jellies; // will hold jellyfish

//>>>> GAME LOGISTICS 
var collectibles; // fish food for points ; 250 points = new heart ?
var lives; // will hold lives
var score; // will hold score
var scene; // end game scene

//>>>> GAME "PHYSICS"
var buffer = 30; // just a constant
var dy; // default y-coordinate
var jx; // jellyfish x
var px; // pink fish x
var py; // pink fish y
var cx; // coin x
var cy; // coin y

//>>>> Colors for background (https://p5js.org/examples/color-linear-gradient.html)
var b1, b2, c1, c2; // defined below


//>>>> SOUNDS
function preload() {
}

function setup() {
  createCanvas(600, 400);
  
  // setting BG gradient colors
  b1 = color(140, 237, 255);
  b2 = color(43, 110, 148);

  c1 = color(77, 98, 201);
  c2 = color(6, 10, 16);
  
  // setting score + scene
  score = 0;
  scene = 1;
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
} //>>> END SETUP <<<\\

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

function draw() {
  // setting the scene with background gradient + characters
  if(scene > 0){
    // Default BG if you do not collide with enemy
    setGradient(0, 0, windowWidth, 400, b1, b2); // setGradient(0, 0, windowWidth, 400, c1, c2, Y_AXIS); 
    // draw lives to screen
    for (var i = 0; i <3; i++) {
    //  createLife(20 +(i*26), 20);
    }
    // continuously create new jellyfish every random(50,200) frames
    if(frameCount%int(random(5,10))==0) { 
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
    // if(frameCount%int(random(100,290))==0) {  
    //   cx = random(0,width);
    //   cy = random(0,-50);
    //   createCoin(cx, cy); // creating coints/fish food randomly all over screen
    // }   
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
    // >>> INTERACTIONS BETWEEN OBJECTS <<< 
    // if fish overlap with food then 'collect'
    fishy.overlap(collectibles, coinCollect);
    fishy.overlap(jellies, Zap);

    //drawing the sprites
    drawSprites();
    
  } else {
    setGradient(0, 0, windowWidth, 400, c1, c2); 
    textAlign(CENTER);
    textSize(30);
    text('You scored '+ score + " points!" , width/2, 150);
  }
}

//>>>> FOOD / COIN COLLECTION <<<<///
/*function collect(collector, collected){ // removes fish food from screen / group
  collected.remove();
} */

function coinCollect(fishy, Coin) {
  Coin.remove();
  score +=1;
  console.log(score);  
}

function loseLife(fishy, life) {
  life.remove();
  lives = lives -1;  
  console.log("you have" + life + "remaining");
}

//>>>> CLASSES FOR THE MOVING OBJECTS <<<<///

function createJelly(x, y) { // create Jellyish at given X,Y
  var newJelly = createSprite(x,y);
  newJelly.addAnimation('floating','assets/Jelly2.png','assets/Jelly1.png');
  // speed intervals 
  newJelly.setSpeed(0.25); 
  newJelly.setVelocity(random(-1,2), random(1.2,1.8)); 
  // add to group
  newJelly.addToGroup(jellies);  
  console.log("you have" + jellies.length + "created");
  // return newJelly;
}

function createPinky(x, y) { // create pink fish at given X,Y going right
  var newPink = createSprite(x,y);
  newPink.addAnimation('assets/Pinky1.png', 'assets/Pinky2.png','assets/Pinky3.png');
  // speed intervals 
  newPink.setSpeed(0.8); 
  newPink.setVelocity(random(0.6,0.8), random(1.2,0.8)); 
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
  // add to group
  pinks.add(newPink); 
  return newPink;
}

function createCoin(x, y) { // create coin at given X,Y 
  var newCoin = createSprite(x,y);
  newCoin.addAnimation('floating', 'assets/food1.png', 'assets/food1.png');
  // speed intervals 
  newCoin.setSpeed(0.05); 
  newCoin.setVelocity(random(-0.5,0.3), random(0,.5)); 
  // add to group
  collectibles.add(newCoin);
  //return newCoin
}

function createLife(x, y) { // create coin at given X of at least 20+(i*26),20 pixels
  var heart = createSprite(x,y);
  heart.addAnimation('beat', 'assets/Life.png', 'assets/Life.png', 'assets/Life.png');
  lives.add(heart);
  
  
  
}

function Zap(Jelly, fish) {
  Jelly.remove();
  fish.remove();
  fill(255);
  text("YOU GOT ZAPPED!", width/2,height/2);
  //scene ++; 
}