class PlayerCommand {

}


class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  moveUp() {
    this.y--;
  }

  moveDown() {
    this.y++;
  }

  moveLeft() {
    this.x--;
  }

  moveRight() {
    this.x++;
  }
}

export default Player;