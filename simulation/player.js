class WorldView {
  constructor(player, viewWidth, viewHeight) {
    this.player = player;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
  }

  getView() {
    // const startX = Math.max(0, this.player.x - Math.floor(this.viewWidth / 2));
    // const endX = Math.min(this.worldMap[0].length, this.player.x + Math.ceil(this.viewWidth / 2));

    // const startY = Math.max(0, this.player.y - Math.floor(this.viewHeight / 2));
    // const endY = Math.min(this.worldMap.length, this.player.y + Math.ceil(this.viewHeight / 2));

    // const slice = [];

    // for (let y = startY; y < endY; y++) {
    //   const row = [];
    //   for (let x = startX; x < endX; x++) {
    //     row.push(this.worldMap[y][x]);
    //   }
    //   slice.push(row);
    // }

    // return slice;
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.cmdBuffer = [];
  }
}

module.exports = WorldView;
