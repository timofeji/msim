/*
 * Copyright (c) 2023 MSIM. All rights reserved.
 *
 * Author: Timofej Jermolaev
 * 
 * Purpose: The purpose of this file is to represent the world
 * We define two classes, World and WorldView:
 *    World represents a chunking system that divides the game simulation into 
 *    infinite parcels called 'Chunks,' each chunk is saved to file and represents a 
 *    square matrix of size CHUNK_SIZE^2 
 *    
 *    WorldView represents a single in memory slice of the world that the player can read/write
 *    the world through. It's also responsible for loading world chunks. We load a sliding kernel of world chunks
 *    around the players coordinates as the player moves.
 *    
 */


const CHUNK_SIZE = 10; // Define your desired chunk size


const fs = require('fs');
const path = require('path');
const { createNoise2D } = require('simplex-noise');

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
    // Write the chunk data string to a file
    fs.writeFileSync(chunkFilePath, chunkData);
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
    var defaultChar = "空";
    const noise2D = createNoise2D();
    let chunkData = "";
    for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE; i++) {
      chunkData += defaultChar;
      const nx = i / CHUNK_SIZE;
      const ny = nx / CHUNK_SIZE;
      let elevation = noise2D(nx, ny);
      if (elevation > 0) {
        defaultChar = "田";
      } else if (elevation > 0.4) {
        defaultChar = "山";
      } else if (elevation > -0.2) {
        defaultChar = "木";
      } else {
        defaultChar = "水";
      }
      if ((i + 1) % CHUNK_SIZE == 0) {
        chunkData += "\n";
      }
    }
    return chunkData;
  }
  getCellData(x, y) {
    let chunkX = Math.floor(x / CHUNK_SIZE);

    let chunkY = Math.floor(y / CHUNK_SIZE);

    let cellX = x % CHUNK_SIZE;
    let cellY = y % CHUNK_SIZE;

    console.log(`${x},${y}`);

    if (this.chunks.hasOwnProperty(`${chunkX},${chunkY}`)) {
      let chunk = this.chunks[`${chunkX},${chunkY}`];
      return chunk;
    }
    return "error chunk";
  }
}


module.exports = {
  WorldView : WorldView,
  World : World
}