//#cf1332

//CONSTANTS
// let CANVAS_W = window.innerWidth;
// let CANVAS_H = window.innerHeight;
let CHAR_W = 20;
let CHAR_H = CHAR_W;

//Global Variables
let charArray = [];
let colArray = [];
let glow = false;
let bright = 45;
let titleBright = 83;
let randCols = true;
let titleStart;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  generateArrays(window.innerWidth/CHAR_W, window.innerHeight/CHAR_H)
}

function draw() {
  // background("#202020");
  background("#212121")
  noStroke();
  fill("rgb(230,230,230)")
  textSize(CHAR_W)
  textFont("monospace")
  textAlign(LEFT,TOP);
  
  for (i = 0; i<charArray.length; i++) {
    for (j = 0; j<charArray[i].length; j++){
      if (randCols) {
        if (j == titleStart[1] && (titleStart[0]-1<i && i< titleStart[0]+7)) {
          colArray[i][j][2] = constrain(colArray[i][j][2]+random(-5,5),titleBright-20,titleBright+20)
        }
        else {
          colArray[i][j][2] = constrain(colArray[i][j][2]+random(-5,5),bright-20,bright+20)
          
        }
      }        

      
      col = colArray[i][j]
      rgb = HSBToRGB(col[0],col[1],col[2])
      fill(rgb)
      
      text(charArray[i][j],i*CHAR_W, j*CHAR_H)
    }
  }
  
  
  // Makes it look glowy. kinda slow
  if (glow) {
    filter(BLUR, 2)

    for (i = 0; i<charArray.length; i++) {
      for (j = 0; j<charArray[i].length; j++){
        col = colArray[i][j]
        rgb = HSBToRGB(col[0],col[1],col[2])
        fill(rgb)

        text(charArray[i][j],i*CHAR_W, j*CHAR_H)
      }
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
      // colArray[i].push([350, 83, random(50,100)])
      if (randCols) {
        colArray[i].push([350, 0, random(bright-30,bright+30)])
      }
      else {
        colArray[i].push([350, 0, bright]) 
      }
    }
  }
  
  //Add title
  titleStart = [floor(random(charArray.length-7)),floor(random(charArray[0].length-2)+1)]
  let a = ["s","d","y","k",".","e","s"]
  
  for (let i = 0; i < a.length; i++) {
  charArray[titleStart[0]+i][titleStart[1]] = a[i]
  colArray[titleStart[0]+i][titleStart[1]][1] = 83
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

function keyPressed() {
  if (key == " ") {
    glow = !glow;
  }
}
