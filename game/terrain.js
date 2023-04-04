import SimplexNoise from 'simplex-noise';

class Terrain {
  constructor(seed, chunkSize, chunkCount) {
    this.width = width;
    this.height = height;
    this.heightmap = [];
    this.generateHeightmap();
    this.seed = seed;
    this.chunkSize = chunkSize;
    this.chunkCount = chunkCount;
    this.simplex = new SimplexNoise(this.seed);
    this.chunks = {};
  }

  generateChunk(chunkX, chunkY) {
    const startX = chunkX * this.chunkSize;
    const startY = chunkY * this.chunkSize;

    const map = [];
    for (let y = 0; y < this.chunkSize; y++) {
      map[y] = [];
      for (let x = 0; x < this.chunkSize; x++) {
        const nx = (startX + x) / 50;
        const ny = (startY + y) / 50;
        const elevation = this.simplex.noise2D(nx, ny);
        if (elevation > 0.4) {
          map[y][x] = '⛰️';
        } else if (elevation > -0.2) {
          map[y][x] = '🌲';
        } else {
          map[y][x] = '🌊';
        }
      }
    }

    const chunkId = this.getChunkId(chunkX, chunkY);
    this.chunks[chunkId] = map;
  }

  getChunkId(chunkX, chunkY) {
    return `${chunkX},${chunkY}`;
  }

  getTile(x, y) {
    const chunkX = Math.floor(x / this.chunkSize);
    const chunkY = Math.floor(y / this.chunkSize);
    const tileX = x % this.chunkSize;
    const tileY = y % this.chunkSize;
    const chunkId = this.getChunkId(chunkX, chunkY);
    if (!this.chunks[chunkId]) {
      this.generateChunk(chunkX, chunkY);
    }
    return this.chunks[chunkId][tileY][tileX];
  }
}

export default Terrain;
