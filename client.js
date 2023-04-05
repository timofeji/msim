import { simulation_types } from "./simulation/types.js";

const tileSize = 20;

const canvas = document.getElementById("game-canvas");
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



function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (worldArray) {
    for (const cell of worldArray) {
      const [x, y, character] = cell.split(",");
      const xPos = x * tileSize;
      const yPos = y * tileSize;
      ctx.fillStyle = getTerrainColor(character);
      ctx.fillText(character, xPos, yPos);
      console.log(cell);
    }
  }




  // for (let y = 0; y < testGrid.length; y++) {
  //   for (let x = 0; x < testGrid[y].length; x++) {
  //     const character = testGrid[y][x];
  //   }
  // }
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

  console.log(commandBuffer);
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

// Call the processCommands function periodically
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



function renderHighlight(ctx, cellPos) {
  if (cellPos) {
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(cellPos.x * tileSize, cellPos.y * tileSize, tileSize, tileSize);
  }
}

canvas.addEventListener('mousemove', function(event) {
  const mousePos = getCursorPosition(canvas, event);
  const cellPos = getCellAtPosition(mousePos);
  const ctx = canvas.getContext('2d');
  renderHighlight(ctx, cellPos);
});