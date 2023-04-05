import { simulation_types } from "./simulation/types.js";

const tileSize = 20;

const canvas = document.getElementById("game-canvas");
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

const inputBox = document.getElementById('game-input');

var ctx = canvas.getContext("2d");
// ctx.font = `${tileSize}px 'Courier New', monospace`; // Use a monospace font
// ctx.textBaseline = 'middle'; // Adjust text rendering
// ctx.textAlign = 'center';

 // Define the padding values
 const paddingRatio = 0.4;
 const xPadding = tileSize * paddingRatio;
 const yPadding = tileSize * paddingRatio;

 // Adjust the character size to include the padding
 ctx.font = `${tileSize}px 'Noto Sans Mono CJK SC'`;
 ctx.textBaseline = "top";

var commandBuffer = [];
var worldArray;

async function fetchWorldData() {
  const response = await fetch('/world');
  worldArray = await response.json();

  // Trigger the render function to render the worldArray data

  render();
}
fetchWorldData();


// function getTerrainColor(char) {
//   // Get the current time in seconds
//   const currentTime = new Date().getTime() / 1000;

//   // Calculate the color offset based on the current time
//   const colorOffset = Math.floor(currentTime * 50) % 360;

//   // Define the base hue for each character type
//   const baseHue = {
//     山: 0, // Red
//     水: 240, // Blue
//     田: 120, // Green
//     木: 60, // Yellow-Green
//     人: 300, // Purple
//     房: 180, // Cyan
//     市: 30, // Orange
//   };

//   // Calculate the new hue based on the base hue and color offset
//   const newHue = (baseHue[char] + colorOffset) % 360;

//   // Return the new color as an HSL value
//   return `hsl(${newHue}, 100%, 50%)`;
// }

function getTerrainColor(char) {
  return simulation_types[char] || "black";
}




function isCellSelected(cell) {
  if (!selectionRectangle.start || !selectionRectangle.end) return false;

  const minX = Math.min(selectionRectangle.start.x, selectionRectangle.end.x);
  const maxX = Math.max(selectionRectangle.start.x, selectionRectangle.end.x);
  const minY = Math.min(selectionRectangle.start.y, selectionRectangle.end.y);
  const maxY = Math.max(selectionRectangle.start.y, selectionRectangle.end.y);

  return (
    cell.x >= minX && cell.x <= maxX && cell.y >= minY && cell.y <= maxY
  );
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (worldArray) {
    for (const cell of worldArray) {
      const [x, y, character] = cell.split(",");
      const isSelected = isCellSelected({ x, y });
      ctx.fillStyle = isSelected ? "white" : getTerrainColor(character);
      ctx.fillText(character, x * tileSize, y * tileSize);
    }
  }
}

let isMouseDown = false;

let selectionRectangle = {
  start: null,
  end: null,
};

function getCellFromCoordinates(offsetX, offsetY) {
  const x = Math.floor(offsetX / tileSize);
  const y = Math.floor(offsetY / tileSize);

  return { x, y };
}

function handleMouseDown(event) {
  const { offsetX, offsetY } = event;
  const cell = getCellFromCoordinates(offsetX, offsetY);

  if (cell) {
    isMouseDown = true;
    selectionRectangle.start = cell;
    selectionRectangle.end = cell;
  }
}

function handleMouseMove(event) {
  if (!isMouseDown) return;

  const { offsetX, offsetY } = event;
  const cell = getCellFromCoordinates(offsetX, offsetY);

  if (cell) {
    selectionRectangle.end = cell;
  }

  render();
}

function handleMouseUp(event) {
  isMouseDown = false;
}


function handleInput(inputText) {
  // Remove leading and trailing whitespace and split the input into words
  const words = inputText.trim().split(/\s+/);
  const commandName = words[0].toLowerCase();
  const args = words.slice(1);

  // Create a command object with the command name and arguments
  const command = {
    name: commandName,
    args: args,
  };

  // Add the command object to the command buffer
  commandBuffer.push(command);

}

inputBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleInput(inputBox.value);
    inputBox.value = '';
  }
});

function setCanvasSize() {
  const inputBoxHeight = inputBox.getBoundingClientRect().height;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - inputBoxHeight;
}

window.addEventListener('resize', () => {
  setCanvasSize();
});

setCanvasSize();
// setInterval(render, 500);

async function processCommands() {
  while (commandBuffer.length > 0) {
    const command = commandBuffer.shift();
    const response = await fetch('/process-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    // Handle the response from the server
    const result = await response.json();
    console.log(result);
  }
}
setInterval(processCommands, 1000);

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x: x, y: y };
}

function getCellAtPosition(mousePos) {
  const cellX = Math.floor(mousePos.x / tileSize);
  const cellY = Math.floor(mousePos.y / tileSize);
  if (cellX >= 0 && cellX < tileSize && cellY >= 0 && cellY < tileSize) {
    return { x: cellX, y: cellY };
  } else {
    return null;
  }
}
