
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

  async updateVisibleChunks() {
    this.visibleChunks = [];
    const chunkIds = this.getChunkIdsInView();
    for (let i = 0; i < chunkIds.length; i++) {
      try {
        const chunkData = await this.world.getChunk(chunkIds[i]);
        this.visibleChunks.push(chunkData);
      } catch (error) {
        console.error(`Error loading chunk ${chunkIds[i]}:`, error);
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
    const chunkFilePath = path.join(this.chunksDirectory, `${chunkId}.txt`);

    if (!fs.existsSync(chunkFilePath)) {
      // If the file doesn't exist, generate default chunk data and save it
      const defaultChunkData = this.generateDefaultChunkData(chunkId);
      this.saveChunkData(chunkId, defaultChunkData);
      return defaultChunkData;
    } else {
      // If the file exists, read it and return the chunk data
      const fileContent = fs.readFileSync(chunkFilePath, "utf8");
      const lines = fileContent.split("\n").filter((line) => line);

      const chunkData = {};
      lines.forEach((line) => {
        const [cord, cell] = line.split(",");
        chunkData[cord] = cell;
      });

      return chunkData;
    }
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


module.exports = {
  WorldView : WorldView,
  World : World
}