import { simulation_types } from "./simulation/types.js";

const tileSize = 20;
const canvas = document.getElementById("game-canvas");
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

const inputBox = document.getElementById('game-input');

var ctx = canvas.getContext("2d");
var commandBuffer = [];
var worldArray;

async function fetchWorldData() {
  const viewWidth = Math.ceil(canvas.width / tileSize);
  const viewHeight = Math.ceil(canvas.height / tileSize);
  const playerID = "player1"; // Replace this with a unique identifier for the player


  const response = await fetch("/world", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerID, viewWidth, viewHeight }),
  });
  if (response.ok) {
    worldArray = await response.json();
    render();
  } else {
    console.error("Error fetching world data");
  }
}

fetchWorldData();

function getTerrainColor(char) {
  return simulation_types[char] || "black";
}
function isCellSelected(cell) {
  if (!isMouseDown) return false;

  const minX = Math.min(selectionRectangle.start.x, selectionRectangle.end.x);
  const maxX = Math.max(selectionRectangle.start.x, selectionRectangle.end.x);
  const minY = Math.min(selectionRectangle.start.y, selectionRectangle.end.y);
  const maxY = Math.max(selectionRectangle.start.y, selectionRectangle.end.y);

  return (
    cell.x >= minX && cell.x <= maxX && cell.y > minY && cell.y <= maxY
  );
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (worldArray) {
    for (const cell of worldArray) {
      const [x, y, character] = cell.split(",");
      const isSelected = isCellSelected({ x, y });

      ctx.font = `${tileSize}px 'Noto Sans Mono CJK SC'`;
      ctx.textBaseline = "bottom";
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
  const container = document.getElementById("game-container");
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  canvas.width = containerWidth;
  canvas.height = containerHeight;
}

window.addEventListener('resize', () => {
  setCanvasSize();
});

setCanvasSize();

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
function updateTimestamp() {
  const timestampElement = document.getElementById('timestamp');
  const unixTimestamp = Math.floor(Date.now() / 1000);
  timestampElement.textContent = unixTimestamp;


  processCommands();
}
setInterval(updateTimestamp, 1000);

