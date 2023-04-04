import Player from "./simulation/player.js";
import Terrain from "./simulation/terrain.js";
import Render from "./simulation/render.js";

const canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
canvas.font = "30px Arial";
canvas.strokeText("Hello World", 10, 50);

const renderer = new Render(canvas);
var player = new Player(renderer);
var terrain = new Terrain(player);

function handleInput(e) {
  const key = e.key.toLowerCase();
  switch (key) {
    case "w":
      player.move(0, -1);
      break;
    case "a":
      player.move(-1, 0);
      break;
    case "s":
      player.move(0, 1);
      break;
    case "d":
      player.move(1, 0);
      break;
  }
}

window.requestAnimationFrame = () => {
  terrain.update();
  
}


document.addEventListener("keydown", handleInput);
