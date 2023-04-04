const bodyParser = require('body-parser');
const express = require('express');
const WebSocket = require('ws');
const createServer = require("http");

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

// Parse JSON request bodies
app.use(bodyParser.json());


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
