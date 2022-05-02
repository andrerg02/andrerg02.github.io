let sizeX, sizeY;
let coordinates = [];
let update = true;
let index = 0;
let closed_trash, opened_trash;
let closed = true;

function setup() {
  sizeX = windowWidth;
  sizeY = windowHeight;
  createCanvas(sizeX, sizeY);
}

function draw() {
  if(update) {
    updateScreen();
    update = false;
  }
}

function updateScreen() {
  background(240);
  
  translate(sizeX/2,sizeY/2); // coordinate system with origin in center of the window
  
  image((closed) ? closed_trash : opened_trash, sizeX/2-35, sizeY/2-35, 25, 25);
  
  strokeWeight(1);
  stroke('black');
  drawingContext.setLineDash([10, 15]);
  
  line(0,-sizeY/2,0,sizeY/2); // y-axis
  line(-sizeX/2,0,sizeX/2,0); // x-axis
  
  strokeWeight(5);
  for(let points  of coordinates) {
    point(points[0],points[1]);
  }
 
  drawPolynomial();
}

function mousePressed() {
  for(let i = 0; i < coordinates.length; i++) {
    if(abs(mouseX-sizeX/2 - coordinates[i][0]) < 10 &&
       abs(mouseY-sizeY/2 - coordinates[i][1]) < 10) {
      index = i
      return;
    }
  }
  coordinates.push([mouseX-sizeX/2,mouseY-sizeY/2]);
  index = coordinates.length-1;
  update = true;
}

function mouseDragged() {
  coordinates[index][0] = mouseX-sizeX/2;
  coordinates[index][1] = mouseY-sizeY/2;
  if(sizeX/2 - 35 < mouseX-sizeX/2 && mouseX-sizeX/2 < sizeX/2 - 10 && 
     sizeY/2 - 35 < mouseY-sizeY/2 && mouseY-sizeY/2 < sizeY/2 - 10) {
    closed = false;
  }
  else {
    closed = true;
  }
  update = true;
}

function mouseReleased() {
  if(!closed) {
    coordinates.splice(index, 1);
    closed = true;
    update = true;
  }
}



function preload() {
  closed_trash = loadImage('https://cdn-icons-png.flaticon.com/512/18/18297.png');
  opened_trash = loadImage('https://pic.onlinewebfonts.com/svg/img_569538.png');
}

// calculates the polynomial with Lagrange's interpolation formula
function p(x) {
    let poly = 0;
    let n = coordinates.length;
  
    for(let k = 0; k < n; k++) { // iteration for the summation
      let prod = 1;
      
      for(let j = 0; j < n; j++) { // iteration for the product 
        if(j !== k) {
          prod *= (x - coordinates[j][0])/(coordinates[k][0] - coordinates[j][0]);
        }
      }
      
      poly += prod * coordinates[k][1];
    }
  
  return poly;
}

function drawPolynomial() {
  let count = 0;
  let xb = 0;
  let pb = 0;
  
  drawingContext.setLineDash([0, 1]);
  strokeWeight(1);
  stroke('blue');
  
  for(let x = -sizeX/2; x < sizeX/2; x++) {
    let pn = p(x);
    if(count != 0) {
      line(x,pn,xb,pb);
    }
    xb = x;
    pb = pn;
    count += 1;
  }
}