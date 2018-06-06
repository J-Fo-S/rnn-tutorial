// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
var capture;
var tracker
var w = 640, h = 480;
var face = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
var browL = [15, 16, 17, 18];
var browR = [19, 20, 21, 22];
var eyeR = [23, 63, 24, 64, 25, 65, 26, 66, 23];
var pupilR = 27;
var eyeL = [30, 68, 29, 67, 28, 70, 31, 69];
var pupilL = 32;
var noseV = [33, 41, 62];
var noseW = [34, 35, 36, 42, 37, 43, 38, 39, 40];
var mouthWR = 44;
var mouthWL = 50;
var uppLipUp = [mouthWR, 45, 46, 47, 48, 49, mouthWL];
var uppLipBot = [mouthWR, 61, 60, 59, mouthWL];
var botLipUp = [mouthWR, 56, 57, 58, mouthWL];
var botLipBot = [mouthWR, 55, 54, 53, 52, 51, mouthWL];

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  
  colorMode(HSB);
  
  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(capture.elt);
  console.log(pModel);
}

function draw() {
  image(capture, 0, 0, w, h);
  var positions = tracker.getCurrentPosition();

  noFill();
  stroke(255);
  
  if (positions.length > 0){
    beginShape();
    for (var i=0; i<face.length; i++) {
      vertex(positions[face[i]][0], positions[face[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<browL.length; i++) {
      vertex(positions[browL[i]][0], positions[browL[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<browR.length; i++) {
      vertex(positions[browR[i]][0], positions[browR[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<eyeR.length; i++) {
      vertex(positions[eyeR[i]][0], positions[eyeR[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<noseW.length; i++) {
      vertex(positions[noseW[i]][0], positions[noseW[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<noseV.length; i++) {
      vertex(positions[noseV[i]][0], positions[noseV[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<uppLipUp.length; i++) {
      vertex(positions[uppLipUp[i]][0], positions[uppLipUp[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<uppLipBot.length; i++) {
      vertex(positions[uppLipBot[i]][0], positions[uppLipBot[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<botLipUp.length; i++) {
      vertex(positions[botLipUp[i]][0], positions[botLipUp[i]][1]);
    }
    endShape();

    beginShape();
    for (var i=0; i<botLipBot.length; i++) {
      vertex(positions[botLipBot[i]][0], positions[botLipBot[i]][1]);
    }
    endShape();

    noStroke();
    for (var i=0; i<positions.length; i++) {
      fill(map(i, 0, positions.length, 0, 360), 50, 100);
      ellipse(positions[i][0], positions[i][1], 4, 4);
      text(i, positions[i][0], positions[i][1]);
    }
  }
  
  if(positions.length > 0) {
    var mouthLeft = createVector(positions[44][0], positions[44][1]);
    var mouthRight = createVector(positions[50][0], positions[50][1]);
    var smile = mouthLeft.dist(mouthRight);
    // rect(20, 20, smile * 3, 20);
  }
}
