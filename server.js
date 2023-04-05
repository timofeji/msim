const bodyParser = require('body-parser');
const express = require('express');
const WebSocket = require('ws');
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

const fs = require('fs');

const { World, WorldView } = require("./server/world");

const world = new World();

app.use(express.static(__dirname));

// Parse JSON request bodies
app.use(bodyParser.json());



const worldViews = {};

// Define a route to serve the game world data
app.get("/world", async (req, res) => {
  const { viewWidth, viewHeight, playerID } = req.body;

  // Check if there's already a WorldView instance for this playerID
  if (!worldViews[playerID]) {
    // Initialize a WorldView instance and store it in the worldViews object
    worldViews[playerID] = new WorldView(playerID, viewWidth, viewHeight, world);
  }

  // Get the slice of world data for the playerID
  const view = await worldViews[playerID].getCellsInView();
  console.log(view);

  // Send the viewSlice back to the client
  res.json(view);
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
