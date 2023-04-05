
const CHUNK_SIZE = 10; // Define your desired chunk size


const fs = require('fs');
const path = require('path');

class WorldView {
  constructor( X, Y, viewWidth, viewHeight, world) {
    this.x = X;
    this.y = Y;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.visibleChunks = new Map();
    this.world = world;
    this.updateVisibleChunks();
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
        const cell = await this.world.getCellData(x, y);
        cells.push(cell);
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
    const chunksDir = path.join(__dirname, 'chunks');
    const chunkPath = path.join(chunksDir, `${chunkId}.txt`);

    // Create the 'chunks' directory if it doesn't exist
    if (!fs.existsSync(chunksDir)) {
      fs.mkdirSync(chunksDir);
    }

    if (!fs.existsSync(chunkPath)) {
      const defaultChunkData = this.generateEmptyChunk();
      fs.writeFileSync(chunkPath, defaultChunkData, 'utf8');
    }

    const chunkData = fs.readFileSync(chunkPath, 'utf8');
    return chunkData;
  }

  generateEmptyChunk() {
    const defaultChar = "空";
    let chunkData = "";
    for (let row = 0; row < CHUNK_SIZE; row++) {
      for (let col = 0; col < CHUNK_SIZE; col++) {
        chunkData += defaultChar;
      }
      if (row < CHUNK_SIZE - 1) {
        chunkData += "\n";
      }
    }
    return chunkData;
  }

  async getCellData(x, y) {
    const chunkId = this.getChunkId(x, y);
    const chunk = this.chunks[chunkId];

    // If the chunk is not loaded, return a default character
    if (!chunk) {
      return "chunk error";
    }

    const localX = x % CHUNK_SIZE;
    const localY = y % CHUNK_SIZE;

    // If the coordinates are within the loaded chunk, return the character at that position
    if (chunk[localX] && chunk[localX][localY]) {
      return chunk[localX][localY];
    }

    // If the coordinates are outside of the loaded chunk, return a default character
    return "Z";
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