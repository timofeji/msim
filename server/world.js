
const CHUNK_SIZE = 10; // Define your desired chunk size


const fs = require('fs');
class WorldView {
  constructor(playerID, X, Y, viewWidth, viewHeight, world) {
    this.player = playerID;
    this.x = X;
    this.y = Y;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.visibleChunks = new Map();
    this.world = world;
  }

  async updateVisibleChunks() {
    const chunkIds = this.getChunkIdsInView();

    // Load all chunks within the view that are not already loaded
    for (const chunkId of chunkIds) {
      if (!this.visibleChunks.has(chunkId)) {
        const chunkData = await this.world.getChunk(chunkId);
        this.visibleChunks.set(chunkId, chunkData);
      }
    }

    // Remove chunks that are no longer in view
    for (const [chunkId] of this.visibleChunks) {
      if (!chunkIds.includes(chunkId)) {
        this.visibleChunks.delete(chunkId);
      }
    }
  }

  getChunkIdsInView() {
    const topLeftChunk = this.world.getChunkId({ x: this.x - this.viewWidth / 2, y: this.y - this.viewHeight / 2 });
    const bottomRightChunk = this.world.getChunkId({ x: this.x + this.viewWidth / 2, y: this.y + this.viewHeight / 2 });

    const [topLeftChunkX, topLeftChunkY] = topLeftChunk.split(",").map(Number);
    const [bottomRightChunkX, bottomRightChunkY] = bottomRightChunk.split(",").map(Number);

    const visibleChunkIds = [];

    for (let x = topLeftChunkX; x <= bottomRightChunkX; x++) {
      for (let y = topLeftChunkY; y <= bottomRightChunkY; y++) {
        visibleChunkIds.push(`${x},${y}`);
      }
    }

    return visibleChunkIds;
  }

  async getCellsInView() {
    const startX = Math.max(this.x - Math.floor(this.viewWidth / 2), 0);
    const startY = Math.max(this.y - Math.floor(this.viewHeight / 2), 0);
    const endX = startX + this.viewWidth;
    const endY = startY + this.viewHeight;

    const cells = [];

    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const cell = this.getCell(x, y);
        cells.push({ x, y, char: cell });
      }
    }

    return cells;
  }
}
class World {
  constructor() {
    this.chunks = {};
    this.players = {};
  }

  getChunkId(position) {
    const chunkX = Math.floor(position.x / CHUNK_SIZE);
    const chunkY = Math.floor(position.y / CHUNK_SIZE);
    return `${chunkX},${chunkY}`;
  }

  async getChunk(chunkId) {
    if (this.chunks[chunkId]) {
      return this.chunks[chunkId];
    }

    const chunkData = await this.loadChunkData(chunkId);
    this.chunks[chunkId] = chunkData;
    return chunkData;
  }

  async loadChunkData(chunkId) {
    try {
      const chunkData = await fs.promises.readFile(`./chunks/${chunkId}.txt`, "utf8");
      return JSON.parse(chunkData);
    } catch (error) {
      console.error(`Error loading chunk data for chunk ID ${chunkId}:`, error);
      return this.generateEmptyChunk();
    }
  }

  generateEmptyChunk() {
    const chunkData = {};
    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        const cellId = `${x},${y}`;
        chunkData[cellId] = defaultCharacter;
      }
    }
    return chunkData;
  }

}



// class World {
//   constructor() {
//     this.worldMap = new Map();
//   }

//   set(x, y, character) {
//     const key = `${x},${y}`;
//     this.worldMap.set(key, character);
//   }

//   get(x, y) {
//     const key = `${x},${y}`;
//     return this.worldMap.get(key);
//   }

//   delete(x, y) {
//     const key = `${x},${y}`;
//     this.worldMap.delete(key);
//   }

//   has(x, y) {
//     const key = `${x},${y}`;
//     return this.worldMap.has(key);
//   }

//   loadFromFile(filePath) {
//     const fileContent = fs.readFileSync(filePath, "utf8");
//     const lines = fileContent.trim().split("\n");

//     for (let y = 0; y < lines.length; y++) {
//       const line = lines[y];
//       for (let x = 0; x < line.length; x++) {
//         const character = line[x];
//         this.set(x, y, character);
//       }
//     }
//   }
// }

module.exports = {
  WorldView : WorldView,
  World : World
}