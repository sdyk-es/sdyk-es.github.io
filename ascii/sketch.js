//#cf1332

//CONSTANTS
// let CANVAS_W = window.innerWidth;
// let CANVAS_H = window.innerHeight;
let CHAR_W = 20;
let CHAR_H = CHAR_W;

//Global Variables
let charArray = [];
let colArray = [];


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  generateArrays(window.innerWidth/CHAR_W, window.innerHeight/CHAR_H)
}

function draw() {
  // background("#202020");
  background("#21191b")
  noStroke();
  fill("rgb(230,230,230)")
  textSize(CHAR_W)
  textFont("monospace")
  textAlign(LEFT,TOP);
  
  for (i = 0; i<charArray.length; i++) {
    for (j = 0; j<charArray[i].length; j++){
      col = colArray[i][j]
      rgb = HSBToRGB(col[0],col[1],col[2])
      fill(rgb)
      
      text(charArray[i][j],i*CHAR_W, j*CHAR_H)
      colArray[i][j][2] = constrain(colArray[i][j][2]+random(-5,5),50,100)
    }
  }
}

function generateArrays(width, height){
  //Generate charArray
  charArray = []
  for (i = 0; i<width; i++) {
    charArray.push([])
    for (j = 0; j<height; j++) {
     charArray[i].push(String.fromCharCode(floor(random(33,127))))
    }
  }
  //Generate colArray
  colArray = []
  for (i = 0; i<width; i++) {
    colArray.push([])
    for (j = 0; j<height; j++) {
      colArray[i].push([350, 83, random(50,100)])
    }
  }
}

function mouseToGrid(){
  return [constrain(floor(mouseX/CHAR_W),0,CANVAS_W/CHAR_W-1),
          constrain(floor(mouseY/CHAR_H),0,CANVAS_H/CHAR_H-1)]
}

const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  generateArrays(window.innerWidth/CHAR_W, window.innerHeight/CHAR_H)
}
