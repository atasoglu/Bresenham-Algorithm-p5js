let XPTS;
let YPTS;;
let scl, sclIndex;
let w, h;

let p1, p2;
let points;

let check = false;
let bresenhamCheck = false;

// printing...
let pSize, pInfo;
let button;

function setup() {
  let myCanvas = createCanvas(640, 640);
  myCanvas.parent('container');
  strokeWeight(1);
  frameRate(60);
  
  XPTS = YPTS = floor(width/2);

  scl = [width];
  for (let i = 10; i <= XPTS; i++) {
    if (width % i == 0) {
      scl.push(i);
      if (i == XPTS) sclIndex = scl.length - 1;
    }
  }

  setWH(XPTS, YPTS);
  
  p1 = new Point();
  p2 = new Point();
  points = [];
  
  // printing...
  pSize = document.getElementById('size');
  pInfo = document.getElementById('info');
  pInfo.innerHTML = "Kanvas üzerinde iki nokta seçin.<br>Çözünürlüğü değiştirmek için AŞAĞI-YUKARI ok tuşlarını kullanın."; 

  button = createButton('Temizle');
  button.parent('btn');
  button.mousePressed(clearPoints);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    if (!check) {
      p1.setX(mouseX - mouseX % w);
      p1.setY(mouseY - mouseY % h);
      points.push(p1.getXY());
    } else {
      p2.setX(mouseX - mouseX % w);
      p2.setY(mouseY - mouseY % h);
      points.push(p2.getXY());
      bresenhamCheck = true;
    }
    check = !check;
  }
  // console.log(p1, p2);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    sclIndex = (sclIndex + 1) % scl.length;
    XPTS = scl[sclIndex];
    YPTS = XPTS;
    setWH(XPTS, YPTS);
    clearPoints();
  } 
  else if (keyCode === DOWN_ARROW) {
    sclIndex = (sclIndex - 1) % scl.length;
    if (sclIndex < 0) sclIndex = scl.length - 1;
    XPTS = scl[sclIndex];
    YPTS = XPTS;
    setWH(XPTS, YPTS);
    clearPoints();
  }
}

function draw() {
  background(220);
  applyGrid();
  fillRect();
  fillPoints();
  if (bresenhamCheck) { // Bresenham's ready to go!
    runBresenham();
    bresenhamCheck = false;
  }
  pSize.innerHTML = "Çözünürlük: " + XPTS + "x" + YPTS + " piksel.";
}

function runBresenham() { // Bresenham Algoritması Başladı...
  let x, y, dx, dy;
  let s1, s2;
  
  x = p1.getX();
  y = p1.getY();
  dx = abs(p2.getX() - p1.getX()) / w;
  dy = abs(p2.getY() - p1.getY()) / h;

  s1 = getSign(p2.getX() - p1.getX()) * w;
  s2 = getSign(p2.getY() - p1.getY()) * h;
  let interchange;
  
  if (dy > dx) {
    let temp = dy;
    dy = dx;
    dx = temp;
    interchange = 1;
  }
  
  let err = 2 * dy - dx;
  
  for (let i = 0; i < (dx - 1); ++i) {
    if (err > 0) {
      if (interchange == 1) x += s1;
      else y += s2;
      err -= 2 * dx;
    }
    
    if (interchange == 1) y += s2;
    else x += s1;
    
    err += 2 * dy;
    
    points.push([x, y]);
  }
}

function getSign(x) {
  if (x < 0) return -1;
  return 1;
}

// İkincil araçlar ...

function applyGrid() {
  stroke(200);
  for (let i = 1; i < XPTS; i++) {
    line(w * i, 0, w * i, height); // vertical
    line(0, h * i, width, h * i); // horizontal
  }
}

function fillRect() {
  noStroke();
  fill(255, 0, 0);
  let x = mouseX - mouseX % w;
  let y = mouseY - mouseY % h;
  rect(x, y, w, h);
}

function fillPoints() {
  noStroke();
  fill(0);
  for (let i = 0; i < points.length; i++) {
    rect(points[i][0], points[i][1], w, h); 
  }
}

function setWH(xpts, ypts) {
  w = floor(width / xpts);
  h = floor(height / ypts);
}

function clearPoints() {
  points = []; 
  check = false;
}

// İkincil araçlar ...

class Point {
  constructor(x, y) {
    this.x;
    this.y;
  }
  setXY(x, y) {this.x = x; this.y = y;}
  setX(x) {this.x = x}
  setY(y) {this.y = y}
  getXY() {return [this.x, this.y];}
  getX() {return this.x;}
  getY() {return this.y;}
}
