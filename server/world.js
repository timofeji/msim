
const CHUNK_SIZE = 10; // Define your desired chunk size


const fs = require('fs');
const path = require('path');

class WorldView {
  constructor(X, Y, viewWidth, viewHeight, world) {
    this.x = X;
    this.y = Y;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.visibleChunks = new Map();
    this.world = world;
    this.updateVisibleChunks();

  }

  //   async updateVisibleChunks() {
  //     this.visibleChunks = [];
  //     const chunkIds = this.getChunkIdsInView();
  //     for (let i = 0; i < chunkIds.length; i++) {
  //       try {
  //         const chunkData = await this.world.getChunk(chunkIds[i]);
  //         this.visibleChunks.push(chunkData);
  //       } catch (error) {
  //         console.error(`Error loading chunk ${chunkIds[i]}:`, error);
  //       }
  //     }
  //   }
  updateVisibleChunks() {
    const chunkIdsInView = this.getChunkIdsInView();

    this.visibleChunks = chunkIdsInView.map((chunkId) => {
      if (!this.world.chunks[chunkId]) {
        this.world.loadChunkData(chunkId);
      }
      return chunkId;
    });
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
    this.chunksDirectory = "chunks/";
  }

  getChunkId(position) {
    const chunkX = Math.floor(position.x / CHUNK_SIZE);
    const chunkY = Math.floor(position.y / CHUNK_SIZE);
    return `${chunkX},${chunkY}`;
  }

  async getChunk(chunkId) {
    try {
      const chunkData = await this.loadChunkData(chunkId);
      return chunkData;
    } catch (error) {
      if (error.code === "ENOENT") {
        // Chunk file not found, generate default chunk data
        const defaultChunkData = this.generateDefaultChunkData(chunkId);
        // Save default chunk data to disk
        this.saveChunkData(chunkId, defaultChunkData);
        return defaultChunkData;
      } else {
        // Unexpected error, rethrow
        throw error;
      }
    }
  }

  saveChunkData(chunkId, chunkData) {
    const chunkFilePath = path.join(this.chunksDirectory, `${chunkId}.txt`);

    // Convert the chunkData object to a string
    let chunkDataString = "";
    for (const [cord, cell] of Object.entries(chunkData)) {
      chunkDataString += `${cord},${cell}\n`;
    }

    // Write the chunk data string to a file
    fs.writeFileSync(chunkFilePath, chunkDataString);
  }

  loadChunkData(chunkId) {
    const filePath = path.join(this.chunksDirectory, `${chunkId}.txt`);
    let chunkData;

    try {
      chunkData = fs.readFileSync(filePath, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        // File does not exist, generate default chunk data
        chunkData = this.generateDefaultChunkData();
        this.saveChunkData(chunkId, chunkData);
      } else {
        console.error(`Error loading chunk ${chunkId}:`, error);
        return;
      }
    }

    this.chunks[chunkId] = chunkData;
  }

  generateDefaultChunkData() {
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
  getCellData(world, x, y) {

    let chunkX = Math.floor(x / CHUNK_SIZE);
    let chunkY = Math.floor(y / CHUNK_SIZE);

    let cellX = x % CHUNK_SIZE;
    let cellY = y % CHUNK_SIZE;


    if (this.chunks.hasOwnProperty(`${chunkX},${chunkY}`)) {
      let chunk = world.chunks[`${chunkX},${chunkY}`];

    console.log(chunk);
      let cell = chunk.cells[`${cellX},${cellY}`];
      if (cell) {
        return cell;
      }
    }
    return "error chunk";
  }
}


module.exports = {
  WorldView : WorldView,
  World : World
}