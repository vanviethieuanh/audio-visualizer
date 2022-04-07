"use strict";

var maxVolume = 0.3;
var song;
var fft;
var line_width;
var line_gap;
var column_space;
var calculated_width;

function preload() {
  song = loadSound('../Shelter.mp3');
}

function setup() {
  // hsb
  colorMode(HSB);
  strokeCap(ROUND);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  var lines = pow(2, 6);
  line_width = 3;
  line_gap = 25;
  column_space = line_width + line_gap;
  calculated_width = (lines - 16) * column_space;
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.8, lines);
  song.setVolume(maxVolume);
  song.play();
  background(10);
}

function draw() {
  background('rgba(0%,0%,0%,0.05)');
  spectrum = fft.analyze();
  offset = (width - calculated_width) / 2; // sum of spectrum from -16 to -1

  var sum = 0;

  for (var i = spectrum.length - 15; i < spectrum.length; i++) {
    sum += spectrum[i];
  }

  if (sum > 0) {
    push();
    stroke(map(sum, 0, 255 * 15, 160, 360), 50, 100);
    noFill();
    circle(width / 2, height / 2, sum);
    pop();
  }

  push(); // loop through spectrum array

  for (var _i = 0; _i < spectrum.length - 16; _i++) {
    var amp = spectrum[_i]; // let y = map(amp, 0, 255, 0, height / 2)

    var y = map(amp, 0, 255, 0, height);
    stroke(map(_i, 0, spectrum.length, 160, 360), 50, 100);
    strokeWeight(line_width); // point(offset + line_gap + column_space * i, height / 2 - y)
    // point(offset + line_gap + column_space * i, height / 2 + y)
    // point(offset + line_gap + column_space * i, height - y)

    push();
    noStroke();
    fill(map(_i, 0, spectrum.length, 160, 360), 50, 100);
    text('' + int(random(0, 9)), offset + line_gap + column_space * _i, height - y);
    pop();
    noFill();

    if (sum > 0) {
      if (height - y < map(_i, 0, spectrum.length, height / 2, height - height / 4)) {
        strokeWeight(1);
        line(offset + line_gap + column_space * _i, height, offset + line_gap + column_space * _i, height - y);
      }
    }
  }

  pop();
  fill(255);
}