let pieces = [];
let pawnImg;
let colours;
let selected;

function preload() {
  colours = {
    "white": imgPawnWhite = loadImage("pawnWhite.png"),
    "black": imgPawnBlack = loadImage("pawnBlack.png")
  }
}

function setup() {
  createCanvas(500, 500);
  
  //Initialize board state
  for (let y = 0; y < 8; y++) {
    pieces.push([])
    for (let x = 0; x < 8; x++) {
      pieces[y].push(null)
    }
  }
  
  for (let x = 0; x < 8; x++) {
    pieces[1][x] = new Pawn("black", "pawn")
  }
  for (let x = 0; x < 8; x++) {
    pieces[6][x] = new Pawn("white", "pawn")
  }
  
}


let boardCols = ["#363636", "#F0D9B5", "#B58863"];

function draw() {
  background(boardCols[0]);

  //Draw board
  noStroke();
  fill(boardCols[2]);
  rect(50, 50, 400);
  fill(boardCols[1]);
  for (let x = 1; x <= 4; x++) {
    for (let y = 1; y <= 8; y++) {
      rect(100 * x - 50 * (y % 2), 50 * y, 50);
    }
  }
  
  //Display pieces
  for (let y = 0; y < pieces.length; y++) {
    for (let x = 0; x < pieces[y].length; x++)
      if (pieces[y][x] != null){
        if (selected == pieces[y][x]) { //Highlight selected
          fill("rgba(18,243,149,0.74)")
          rect(50 * x + 50, 50 * y + 50, 50)
        }
        pieces[y][x].display();
      }
  }
  
  if (selected != null){
    moves = legalMoves(selected);
    fill("#5050504C")
    for (let i = 0; i < moves.length; i++) {
      circle(50 * (moves[i][0]) + 75, 
             50 * (moves[i][1]) + 75, 20)
    }
  }
}

class Pawn {
  constructor(colour, type) {
    this.col = colour
    this.hasMoved = false
    this.type = type
  }
  
  display() {
    let pos = findIndex(this)
    image(colours[this.col], pos[0] * 50 + 52,
          pos[1] * 50 + 52, 46, 46)
  }
}

//Find board coords of piece
function findIndex(item) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x ++) {
      if (pieces[y][x] == item) {
        return [x,y]
      }
    }
  }
}

function mouseClicked() {
  if (49<mouseY && mouseY<450 && 49<mouseX && mouseX<450) {
    mX = floor(mouseX/50)-1
    mY = floor(mouseY/50)-1
    target = pieces[mY][mX]
    if (selected != null) {
      if (checkIncludes(legalMoves(selected),[mX,mY])) {
        selected.hasMoved = true
        pos = findIndex(selected)
        pieces[pos[1]][pos[0]] = null
        pieces[mY][mX] = selected
        target = null
        }
    }
    selected = target
  }
}

function legalMoves(piece) {
  pos = findIndex(piece)
  moves = []
  
  //Pawn
  if (piece.type == "pawn") {
    dir = 1
    if (piece.col == "white") {
      dir = -1
    }
    //Normal move
    m = [pos[0],pos[1]+1*dir]
    if (-1<m[0] && m[0]<8 && -1<m[1] && m[1]<8) {
      moves.push([pos[0],pos[1]+1*dir])
    }
    //Double move
    if (!piece.hasMoved) {
      m = [pos[0],pos[1]+1*dir]
      if (-1<m[0] && m[0]<8 && -1<m[1] && m[1]<8) {
        moves.push([pos[0],pos[1]+2*dir])
      }
    }
  }
  
  return moves
}

//Check if array is within a 2D array
function checkIncludes(array, item) {
  for (i = 0; i < array.length; i++) {
    for (j = 0; j < array[i].length; j++) {
      if (item[j] != array[i][j]) {
        break
      }
      if (j == array[i].length-1) {
        return true
      }
    }
  }
  return false
}




