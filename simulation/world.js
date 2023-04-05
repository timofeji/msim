const fs = require('fs');

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


module.exports = World;
