class PlayerCommand {
  execute() {}
}
class MoveCommand extends Command {
  constructor(player, x, y) {
    super();
    this.player = player;
    this.x = x;
    this.y = y;
  }

  execute() {
    this.player.move(this.x, this.y);
  }
}
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.cmdBuffer = [];
  }
}

export default Player;