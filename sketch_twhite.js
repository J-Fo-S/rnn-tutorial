//http://bl.ocks.org/dribnet/f27c6167fcf4157cd0da0d9d5d016aa7

// variables we need for this demo
var dx, dy; // offsets of the pen strokes, in pixels
var pen, prev_pen; // keep track of whether pen is touching paper
var start_x, start_y;
var end_x, end_y;
var x, y;

var rnn_state; // store the hidden states of rnn's neurons
var pdf; // store all the parameters of a mixture-density distribution
var temperature = 0.65; // controls the amount of uncertainty of the model

var screen_width=960, screen_height=500; // stores the browser's dimensions
var line_color, line_color2;
var reset_counter = 0;

var line_buffer = [];

var restart = function() {
  // reinitialize variables before calling p5.js setup.

  // initialize the scale factor for the model. Bigger -> large outputs
  Model.set_scale_factor(10.0);

  // initialize pen's states to zero.
  [dx, dy, prev_pen] = Model.zero_input(); // the pen's states

  // randomize the rnn's initial states
  rnn_state = Model.random_state();

  // define color of line
  // line_color = color(random(64, 224), random(64, 224), random(64, 224))
  line_color = color(10)
  line_color2 = color(150, 150, 150, 100)
  line_color3 = color(10, 10, 10, 100)
  fill_r = focusedRandom(190, 210, 2.0)
  fill_g = focusedRandom(210, 230, 2.0)
  fill_b = focusedRandom(235, 255, 2.0, 255)
  fill(fill_r, fill_g, fill_b, 255);

  strokeWeight(10)
};

function setup () {
  restart(); // initialize variables for this demo
  createCanvas(960, 500);
  frameRate(60);
  background(255, 255, 255, 255);
  fill(200, 220, 255, 255);
}

var min_lb_len = 20;
var max_lb_len = 400;
function draw () {
  clear();
  // using the previous pen states, and hidden state, get next hidden state 
  rnn_state = Model.update([dx, dy, prev_pen], rnn_state);

  // get the parameters of the probability distribution (pdf) from hidden state
  pdf = Model.get_pdf(rnn_state);

  // sample the next pen's states from our probability distribution
  sample = Model.sample(pdf, temperature);
  [dx, dy, prev_pen] = sample;
  line_buffer.push(sample);
  // keep the last elements
  while(line_buffer.length > max_lb_len) {
    var s = line_buffer.shift();
    y += s[1];
  }

  if(line_buffer.length < min_lb_len) {
    return;
  }

  // scan line and get total dx, dy for scaling
  var total_dx = 0;
  var total_dy = 0;
  for(var i=1; i<line_buffer.length;i++) {
    [dx, dy, pen] = line_buffer[i];
    total_dx += dx;
    total_dy += dy;
  }

  var start_x = 0.1 * screen_width;
  var start_y = 0.5 * screen_height;
  var scale_x = 0.8 * screen_width / total_dx;
  var slant_y = total_dy  / line_buffer.length;
  var cur_x = start_x;
  var cur_y = start_y;
  // var cur_y = screen_height / 2 - total_dy / 2;
  var cur_pen = line_buffer[0][2];

  noStroke();
  beginShape();
  vertex(0, 0.5 * screen_height);
  for(var i=1; i<line_buffer.length;i++) {
    vertex(cur_x, cur_y);
    [dx, dy, pen] = line_buffer[i];
    var s_x = dx * scale_x;
    cur_x += s_x;
    cur_y += dy - slant_y;
  }
  vertex(screen_width, 0.5 * screen_height);
  vertex(screen_width, screen_height);
  vertex(0, screen_height);
  endShape(CLOSE);
  strokeWeight(10)

  cur_x = start_x;
  cur_y = start_y;
  stroke(line_color3);
  line(0, 0.5 * screen_height, 0.1 * screen_width, 0.5 * screen_height);
  line(0.9 * screen_width, 0.5 * screen_height, screen_width, 0.5 * screen_height);
  for(var i=1; i<line_buffer.length;i++) {
    [dx, dy, pen] = line_buffer[i];
    // only draw on the paper if the pen is touching the paper
    if (cur_pen == 0) {
      stroke(line_color);
    }
    else {
      stroke(line_color2);
    }
    var s_x = dx * scale_x;
    line(cur_x, cur_y, cur_x+s_x, cur_y+dy); // draw line connecting prev point to current point.
    cur_x += s_x;
    cur_y += dy - slant_y;
    cur_pen = pen;
  }
  reset_counter += 1;
  if(reset_counter > 3600) {
    restart();
    reset_counter = 0;
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
  else if (key == '#') {
    console.log("RESET")
    restart()
  }
}