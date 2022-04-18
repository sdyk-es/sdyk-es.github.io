let pieces = [];
let pawnImg;
let colours;
let selected;
let whiteTurn = true;

function preload() {
  images = {
    pawnwhite: (imgPawnWhite = loadImage("pawnWhite.png")),
    pawnblack: (imgPawnBlack = loadImage("pawnBlack.png")),
    rookwhite: (imgRookWhite = loadImage("rookWhite.png")),
    rookblack: (imgRookBlack = loadImage("rookBlack.png")),
    knightwhite: (imgKnightWhite = loadImage("knightWhite.png")),
    knightblack: (imgKnightBlack = loadImage("knightBlack.png")),
    bishopwhite: (imgBishopWhite = loadImage("bishopWhite.png")),
    bishopblack: (imgBishopBlack = loadImage("bishopBlack.png")),
    queenwhite: (imgQueenWhite = loadImage("queenWhite.png")),
    queenblack: (imgQueenBlack = loadImage("queenBlack.png")),
    kingwhite: (imgKingWhite = loadImage("kingWhite.png")),
    kingblack: (imgKingBlack = loadImage("kingBlack.png")),
  };
}

function setup() {
  createCanvas(500, 500);

  //Initialize board state
  for (let y = 0; y < 8; y++) {
    pieces.push([]);
    for (let x = 0; x < 8; x++) {
      pieces[y].push(null);
    }
  }

  pieces[0][0] = new Piece("black", "rook");
  pieces[0][1] = new Piece("black", "knight");
  pieces[0][2] = new Piece("black", "bishop");
  pieces[0][3] = new Piece("black", "queen");
  pieces[0][4] = new Piece("black", "king");
  pieces[0][5] = new Piece("black", "bishop");
  pieces[0][6] = new Piece("black", "knight");
  pieces[0][7] = new Piece("black", "rook");

  for (let x = 0; x < 8; x++) {
    pieces[1][x] = new Piece("black", "pawn");
  }

  pieces[7][0] = new Piece("white", "rook");
  pieces[7][1] = new Piece("white", "knight");
  pieces[7][2] = new Piece("white", "bishop");
  pieces[7][3] = new Piece("white", "queen");
  pieces[7][4] = new Piece("white", "king");
  pieces[7][5] = new Piece("white", "bishop");
  pieces[7][6] = new Piece("white", "knight");
  pieces[7][7] = new Piece("white", "rook");

  for (let x = 0; x < 8; x++) {
    pieces[6][x] = new Piece("white", "pawn");
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
      if (pieces[y][x] != null) {
        if (selected == pieces[y][x]) {
          //Highlight selected
          fill("rgba(18,243,149,0.75)");
          rect(50 * x + 50, 50 * y + 50, 50);
        }
        pieces[y][x].display();
      }
  }

  if (selected != null) {
    moves = legalMoves(selected);

    for (let i = 0; i < moves.length; i++) {
      if (moves[i][2] == 0) {
        fill("#5050504C");
        noStroke();
        circle(50 * moves[i][0] + 75, 50 * moves[i][1] + 75, 20);
      } else {
        noFill();
        stroke("#5050504C");
        strokeWeight(5);
        circle(50 * moves[i][0] + 75, 50 * moves[i][1] + 75, 40);
      }
    }
  }
}

class Piece {
  constructor(colour, type) {
    this.col = colour;
    this.hasMoved = false;
    this.type = type;
  }

  display() {
    let pos = findIndex(this);
    image(
      images[this.type + this.col],
      pos[0] * 50 + 55,
      pos[1] * 50 + 55,
      40,
      40
    );
  }
}

//Find board coords of piece
function findIndex(item) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (pieces[y][x] == item) {
        return [x, y];
      }
    }
  }
}

function mouseClicked() {
  if (49 < mouseY && mouseY < 450 && 49 < mouseX && mouseX < 450) {
    mX = floor(mouseX / 50) - 1;
    mY = floor(mouseY / 50) - 1;
    let target = pieces[mY][mX];

    if (selected != null) {
      if (checkIncludes(legalMoves(selected), [mX, mY])) {
        selected.hasMoved = true;
        pos = findIndex(selected);
        pieces[pos[1]][pos[0]] = null;
        pieces[mY][mX] = selected;
        target = null;
      }
    }
    selected = target;
  }
}

function legalMoves(piece) {
  pos = findIndex(piece);
  moves = [];

  //Pawn
  if (piece.type == "pawn") {
    dir = 1;
    if (piece.col == "white") {
      dir = -1;
    }

    //Straight - Runs twice if first move
    for (let i = 0; i < 2 - piece.hasMoved; i++) {
      let m = [pos[0], pos[1] + (1 + i) * dir];
      if (-1 < m[0] && m[0] < 8 && -1 < m[1] && m[1] < 8) {
        if (pieces[m[1]][m[0]] == null) {
          moves.push([m[0], m[1], 0]);
        }
      }
    }
    //Diagonal
    for (let i = -1; i < 2; i = i + 2) {
      let m = [pos[0] + i, pos[1] + dir];
      if (-1 < m[0] && m[0] < 8 && -1 < m[1] && m[1] < 8) {
        if (pieces[m[1]][m[0]] != null && pieces[m[1]][m[0]].col != piece.col) {
          moves.push([m[0], m[1], 1]);
        }
      }
    }
  }
  //Rook
  else if (piece.type == "rook") {
    //Repeat 4 times, once for each direction
    let a = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (let i = 0; i < 4; i++) {
      let m = a[i][0];
      let n = a[i][1];
      while (
        -1 < pos[0] + m &&
        pos[0] + m < 8 &&
        -1 < pos[1] + n &&
        pos[1] + n < 8
      ) {
        move = [pos[0] + m, pos[1] + n];
        m += a[i][0];
        n += a[i][1];

        let target = pieces[move[1]][move[0]];
        if (target != null) {
          if (target.col != piece.col) {
            moves.push([move[0], move[1], 1]);
            break;
          } else {
            break;
          }
        } else {
          moves.push([move[0], move[1], 0]);
        }
      }
    }
  }
  //Bishop
  else if (piece.type == "bishop") {
    //Repeat 4 times, once for each direction
    let a = [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ];
    for (let i = 0; i < 4; i++) {
      let m = a[i][0];
      let n = a[i][1];
      while (
        -1 < pos[0] + m &&
        pos[0] + m < 8 &&
        -1 < pos[1] + n &&
        pos[1] + n < 8
      ) {
        move = [pos[0] + m, pos[1] + n];
        m += a[i][0];
        n += a[i][1];

        let target = pieces[move[1]][move[0]];
        if (target != null) {
          if (target.col != piece.col) {
            moves.push([move[0], move[1], 1]);
            break;
          } else {
            break;
          }
        } else {
          moves.push([move[0], move[1], 0]);
        }
      }
    }
  }
  //Knight
  else if (piece.type == "knight") {
    let a = [
      [-1, -2],
      [1, -2],
      [2, -1],
      [2, 1],
      [-1, 2],
      [1, 2],
      [-2, 1],
      [-2, -1],
    ];
    for (i = 0; i < a.length; i++) {
      let m = [pos[0] + a[i][0], pos[1] + a[i][1]];
      if (-1 < m[0] && m[0] < 8 && -1 < m[1] && m[1] < 8) {
        let target = pieces[m[1]][m[0]];
        if (target != null) {
          if (target.col != piece.col) {
            moves.push([m[0], m[1], 1]);
          }
        } else {
          moves.push([m[0], m[1], 0]);
        }
      }
    }
  }
  //Queen
  else if (piece.type == "queen") {
    //Repeat 8 times, once for each direction
    let a = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];
    for (let i = 0; i < a.length; i++) {
      let m = a[i][0];
      let n = a[i][1];
      while (
        -1 < pos[0] + m &&
        pos[0] + m < 8 &&
        -1 < pos[1] + n &&
        pos[1] + n < 8
      ) {
        move = [pos[0] + m, pos[1] + n];
        m += a[i][0];
        n += a[i][1];

        let target = pieces[move[1]][move[0]];
        if (target != null) {
          if (target.col != piece.col) {
            moves.push([move[0], move[1], 1]);
            break;
          } else {
            break;
          }
        } else {
          moves.push([move[0], move[1], 0]);
        }
      }
    }
  }
  //King
  else if (piece.type == "king") {
    //Repeat 8 times, once for each direction
    let a = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ];
    for (let i = 0; i < a.length; i++) {
      let m = a[i][0];
      let n = a[i][1];
      if (
        -1 < pos[0] + m &&
        pos[0] + m < 8 &&
        -1 < pos[1] + n &&
        pos[1] + n < 8
      ) {
        move = [pos[0] + m, pos[1] + n];
        m += a[i][0];
        n += a[i][1];

        let target = pieces[move[1]][move[0]];
        if (target != null) {
          if (target.col != piece.col) {
            moves.push([move[0], move[1], 1]);
          }
        } else {
          moves.push([move[0], move[1], 0]);
        }
      }
    }
  }

  return moves;
}

//Check if array is within a 2D array - only works with legal moves array lol
function checkIncludes(array, item) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < 2; j++) {
      if (item[j] != array[i][j]) {
        break;
      }
      if (j == 1) {
        return true;
      }
    }
  }
  return false;
}
