const fs = require('fs');

class WorldView {
  constructor(playerID, viewWidth, viewHeight) {
    this.player = playerID;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
  }

  getView() {
    const startX = Math.max(0, this.player.x - Math.floor(this.viewWidth / 2));
    const endX = Math.min(this.worldMap[0].length, this.player.x + Math.ceil(this.viewWidth / 2));

    const startY = Math.max(0, this.player.y - Math.floor(this.viewHeight / 2));
    const endY = Math.min(this.worldMap.length, this.player.y + Math.ceil(this.viewHeight / 2));

    const slice = [];

    for (let y = startY; y < endY; y++) {
      const row = [];
      for (let x = startX; x < endX; x++) {
        row.push(this.worldMap[y][x]);
      }
      slice.push(row);
    }

    return slice;
  }
}


class World {
  constructor() {
    this.worldMap = new Map();
  }

  set(x, y, character) {
    const key = `${x},${y}`;
    this.worldMap.set(key, character);
  }

  get(x, y) {
    const key = `${x},${y}`;
    return this.worldMap.get(key);
  }

  delete(x, y) {
    const key = `${x},${y}`;
    this.worldMap.delete(key);
  }

  has(x, y) {
    const key = `${x},${y}`;
    return this.worldMap.has(key);
  }

  loadFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const lines = fileContent.trim().split("\n");

    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      for (let x = 0; x < line.length; x++) {
        const character = line[x];
        this.set(x, y, character);
      }
    }
  }
}

module.exports = {
  WorldView : WorldView,
  World : World
}