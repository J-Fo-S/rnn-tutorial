// Basic Example of Unconditional Handwriting Generation.
var sketch = function( p ) { 
  "use strict";

  // variables we need for this demo
  var dx, dy; // offsets of the pen strokes, in pixels
  var pen, prev_pen; // keep track of whether pen is touching paper
  var x, y; // absolute coordinates on the screen of where the pen is

  var rnn_state; // store the hidden states of rnn's neurons
  var pdf; // store all the parameters of a mixture-density distribution
  var temperature = 0.65; // controls the amount of uncertainty of the model

  var screen_width, screen_height; // stores the browser's dimensions
  var line_color;
  var reset_counter = 0;
  var line_buffer = [];
  var max_lb_len = 400;

  var restart = function() {
    // reinitialize variables before calling p5.js setup.

    // make sure we enforce some minimum size of our demo
    screen_width = Math.max(window.innerWidth, 480);
    screen_height = Math.max(window.innerHeight, 320);

    // start drawing from somewhere in middle of the canvas
    x = 50;
    y = p.random(100, screen_height-100);

    // initialize the scale factor for the model. Bigger -> large outputs
    Model.set_scale_factor(10.0);

    // initialize pen's states to zero.
    [dx, dy, prev_pen] = Model.zero_input(); // the pen's states

    // randomize the rnn's initial states
    rnn_state = Model.random_state();

    // define color of line
    line_color = p.color(0, 0, p.random(64, 224), 10)

  };

  p.setup = function() {
    restart(); // initialize variables for this demo
    p.createCanvas(screen_width, screen_height);
    p.frameRate(60);
    p.background(10);
    p.fill(255, 255, 255, 255);
  };

  p.draw = function() {

    // using the previous pen states, and hidden state, get next hidden state 
    rnn_state = Model.update([dx, dy, prev_pen], rnn_state);

    // get the parameters of the probability distribution (pdf) from hidden state
    pdf = Model.get_pdf(rnn_state);

    // sample the next pen's states from our probability distribution
    [dx, dy, pen] = Model.sample(pdf, temperature);

    line_buffer.push([x, y]);
    // keep the last elements

    console.log(line_buffer.length);


    /*var xSpot = screen_width/2;
    var xLimit = xSpot * x/screen_width;
    var xSpotConstrain = xSpot - xLimit;*/
    //console.log(xSpot,xLimit, xSpotConstrain);
    p.stroke(p.random(40, 255), p.random(4, 44), p.random(4, 184));

    // only draw on the paper if the pen is touching the paper
    for (var i = 0; i < line_buffer.length; i++) {
    if (prev_pen == 0) {
      p.strokeWeight(4.0);
      p.translate(0, 0);
      p.line(line_buffer[i][0], line_buffer[i][1], line_buffer[i][0], line_buffer[i][1]+dy);
      }  

    }

    // update the absolute coordinates from the offsets
    x += dx;
    y += dy;

    // update the previous pen's state to the current one we just sampled
    prev_pen = pen;

    // if the rnn starts drawing close to the right side of the canvas, reset demo
    if (x > screen_width - 50) {
      line_buffer.length = 0;
      restart();
    }

    if (p.frameCount % 30 == 0) {
      p.background(10, 16); // fade out a bit.
    }

  };

};
var custom_p5 = new p5(sketch, 'sketch');
