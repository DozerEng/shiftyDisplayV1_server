/*
 *  Constants
 */
const ROW_COUNT = 18;
const COL_COUNT = 54;
const LED_WIDTH = 25;
const LED_GAP = 5;
const BORDER_WIDTH = 25;
const LED_ON = 1;
const LED_OFF = 0;
// Colours
const LED_OFF_COLOUR = 50;
const LED_ON_COLOUR = 'red';
const BACKGROUND_COLOUR = 40;

/*
 *  Global Variables
 */

// Create 2D array to represent LED display, fill with zeros
let led_states = Array.from(Array(ROW_COUNT), () => new Array(COL_COUNT).fill(0));

/*
 *  Setup
 */
function setup() {
  //colorMode(HSB);
  let display_width = 2 * BORDER_WIDTH + COL_COUNT * LED_WIDTH + (COL_COUNT - 1) * LED_GAP;
  let display_height = 2 * BORDER_WIDTH + ROW_COUNT * LED_WIDTH + (ROW_COUNT - 1) * LED_GAP;
  const liveDisplayCanvas = createCanvas(display_width, display_height);
  liveDisplayCanvas.parent('liveDisplay');
  // Disable right click context menu over canvas
  liveDisplayCanvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());
}

/*
 *  Draw canvas
 */

function draw() {
  background(BACKGROUND_COLOUR);
  if(mouseIsPressed) {
    updateDisplay();
  }
  // Draw all the LEDs in the off state
  for (let row = 0; row < ROW_COUNT; row++ ) {
    for(let col = 0; col < COL_COUNT; col++){
      // Set LED position
      let x = col * (LED_WIDTH + LED_GAP) + LED_WIDTH * 0.5 + BORDER_WIDTH;
      let y = row * (LED_WIDTH + LED_GAP) + LED_WIDTH * 0.5 + BORDER_WIDTH;
      if(led_states[row][col] === LED_ON){
        fill(LED_ON_COLOUR);
      } else {
        fill(LED_OFF_COLOUR);
      }
      // Draw a rounded key
      circle(x, y, LED_WIDTH);
    }
  }
}

/*
 *  Toggle LED colour when and LED is clicked
 */
function mousePressed() {
  //updateDisplay();
}

/*
 *  Update display calculates where a mouse is clicked and acts accordingly
 */
function updateDisplay() {

  /*
   *  An attempt at improving performance however the draw() time is the bottleneck for refresh rate
   *  Ignoring the gaps between LEDs means dragging the mouse across the display quickly may miss more LEDs then when gaps aren't ignored
   */
  const IGNORE_GAPS = true;
  // Check if mouse click is inside the LED
  if(mouseX > BORDER_WIDTH &&
    mouseX < (COL_COUNT * (LED_WIDTH + LED_GAP) + BORDER_WIDTH - LED_GAP) &&
    mouseY > BORDER_WIDTH &&
    mouseY < (ROW_COUNT * (LED_WIDTH + LED_GAP) + BORDER_WIDTH - LED_GAP)) {

    let col;
    let row;
    // Calculate row and column based on if you are ignoring the gaps between LEDs
    if(IGNORE_GAPS === false) {
      col = Math.floor((mouseX - BORDER_WIDTH + LED_GAP * 0.5) / (LED_WIDTH + LED_GAP));
      row = Math.floor((mouseY - BORDER_WIDTH + LED_GAP * 0.5) / (LED_WIDTH + LED_GAP));
    } else if (IGNORE_GAPS === true) {
      col = (mouseX - BORDER_WIDTH) / (LED_WIDTH + LED_GAP);
      row = (mouseY - BORDER_WIDTH) / (LED_WIDTH + LED_GAP);
      const col_decimal = col % 1;
      const row_decimal = row % 1;
      const led_width_gap_ratio = LED_WIDTH/(LED_WIDTH + LED_GAP)
      
      // Exit if click was in a gap and not on an LED
      if(col_decimal % 1 > led_width_gap_ratio || row_decimal % 1 > led_width_gap_ratio) {
        return;
      }
      col = col - col_decimal;
      row = row - row_decimal;
    } else {
      console.log('Error: Invalid "IGNORE_GAPS" =', IGNORE_GAPS);
      return;
    }

    // Left mouse button turns LED on, right mouse button turns LED off
    if (mouseButton === LEFT) {
      led_states[row][col] = LED_ON;
    } else if (mouseButton === RIGHT) {
      led_states[row][col] = LED_OFF;
    } 
  }  
  return; // Exit now so you don't have to comment or remove alternate method
  
  /*
   *  This method may or may not be slower, but doesn't really matter since draw() takes much longer to execute
   *  This method is clearer and easier to read or modify
   */

  // Loop through each LED
  for (let row = 0; row < ROW_COUNT; row++ ) {
    for(let col = 0; col < COL_COUNT; col++){
      // Set LED minimum position
      // Uncomment the values on the right to allow gap clicking to turn on/off LEDs
      let x_min = col * (LED_WIDTH + LED_GAP) + BORDER_WIDTH ;//- 0.5 * LED_GAP;
      let y_min = row * (LED_WIDTH + LED_GAP) + BORDER_WIDTH ;//- 0.5 * LED_GAP;
      let x_max = col * (LED_WIDTH + LED_GAP) + BORDER_WIDTH + LED_WIDTH ;//+ 0.5 * LED_GAP;
      let y_max = row * (LED_WIDTH + LED_GAP) + BORDER_WIDTH + LED_WIDTH ;//+ 0.5 * LED_GAP;

    // Check if the mouse is over an LED
    if (mouseX > x_min && 
      mouseX < x_max &&
      mouseY > y_min && 
      mouseY < y_max ) {
        // Left mouse button turns LED on, right mouse button turns LED off
        if (mouseButton === LEFT) {
          led_states[row][col] = LED_ON;
        } else if (mouseButton === RIGHT) {
          led_states[row][col] = LED_OFF;
        }
      } // EO check if mouse is over an LED
    } // EO Loop through each LED col loop
  } // EO Loop through each LED row loop 
} // EO updateDisplay()