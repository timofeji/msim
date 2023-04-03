import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();

class Terrain {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = this.generateMap();
  }

  generateMap() {
    const map = new Array(this.height).fill(null).map(() => new Array(this.width).fill(' '));
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const elevation = simplex.noise2D(x / 10, y / 10);
        if (elevation > 0.1) {
          map[y][x] = '▒';
        }
      }
    }
    return map;
  }
}

export default Terrain;
