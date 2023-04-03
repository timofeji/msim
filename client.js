import Player from './player.js';
import Terrain from './terrain.js';

const playerCharacter = '⛹';
const player = new Player(2, 2);

const terrain = new Terrain(30, 30);
displayWorld();

function displayWorld() {
  const output = document.getElementById('output');
  output.innerHTML = '';

  const lines = [];
  terrain.map.forEach((row, y) => {
    let line = '';
    row.forEach((cell, x) => {
      if (player.x === x && player.y === y) {
        line += `<span class="player">${playerCharacter}</span>`;
      } else {
        line += cell;
      }
    });
    lines.push(line);
  });

  output.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
}

document.addEventListener('keydown', handleInput);

function handleInput(event) {
  switch (event.key.toUpperCase()) {
    case 'W':
      player.moveUp();
      break;
    case 'A':
      player.moveLeft();
      break;
    case 'S':
      player.moveDown();
      break;
    case 'D':
      player.moveRight();
      break;
  }

  displayWorld();
}
