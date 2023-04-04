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

const commandBuffer = [];


const testGrid = [
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "A", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "B", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
  ["山", "山", "山", "山", "山", "山", "山", "山", "山", "山", "木", "木", "木", "木", "木", "木", "木", "木", "木", "木", "田", "田", "田", "田", "田", "田", "田", "田", "田", "田", "水", "水", "水", "水", "水", "水", "水", "水", "水", "水"],
];



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
  for (let y = 0; y < testGrid.length; y++) {
    for (let x = 0; x < testGrid[y].length; x++) {
      const character = testGrid[y][x];
      const xPos = x * tileSize;
      const yPos = y * tileSize;
      ctx.fillStyle = getTerrainColor(character);
      ctx.fillText(character, xPos, yPos);
    }
  }
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
setInterval(render, 500);

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