const bodyParser = require('body-parser');
const express = require('express');
const WebSocket = require('ws');
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

const fs = require('fs');

const World = require('./simulation/world')


const world = new World();
world.loadFromFile('world.txt');

app.use(express.static(__dirname));

// Parse JSON request bodies
app.use(bodyParser.json());



// Define a route to serve the game world data
app.get('/world', (req, res) => {
  // Convert the world map data to an array
  const worldArray = [];
  for (const [key, character] of world.worldMap.entries()) {
    const [x, y] = key.split(',').map(Number);
    const cell =  `${x},${y},${character}`;
    worldArray.push(cell);
  }

  // Return the world map data as JSON
  res.json(worldArray);
});


// Create an endpoint to process commands
app.post('/process-command', (req, res) => {
  const command = req.body;

  // Process the command
  console.log('Received command:', command);

  // Return a response to the client
  res.json({
    message: 'Command processed',
    command: command,
  });
});



wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    broadcast(message, socket);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

function broadcast(message, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}



const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
