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
}
