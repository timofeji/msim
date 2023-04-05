import SimplexNoise from 'simplex-noise';


// function getTerrainColor(char) {
//   // Get the current time in seconds
//   const currentTime = new Date().getTime() / 1000;

//   // Calculate the color offset based on the current time
//   const colorOffset = Math.floor(currentTime * 50) % 360;

//   // Define the base hue for each character type
//   const baseHue = {
//     山: 0, // Red
//     水: 240, // Blue
//     田: 120, // Green
//     木: 60, // Yellow-Green
//     人: 300, // Purple
//     房: 180, // Cyan
//     市: 30, // Orange
//   };

//   // Calculate the new hue based on the base hue and color offset
//   const newHue = (baseHue[char] + colorOffset) % 360;

//   // Return the new color as an HSL value
//   return `hsl(${newHue}, 100%, 50%)`;
// }

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
