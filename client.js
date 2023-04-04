import Player from "./game/player.js";
import Terrain from "./game/terrain.js";
import Render from "./game/render.js";

const output = document.getElementById("game-canvas");

const renderer = new Render(output);
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
