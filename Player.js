class Player {
  constructor(brain, body) {
    this.brain = brain;
		this.brain.score = 0;
    this.body = body;
  }

  ia(ball) {
    if (ball.alive){
      this.brain.score = this.body.score;
      let output = this.brain.activate(ball.position.x - this.body.position.x, ball.position.y - this.body.position.y);
      if (output > .55) Body.translate(this.body, {x: 0, y:  (this.body.position.y > 15 ? config.move_speed : 0)});
      if (output < .45) Body.translate(this.body, {x: 0, y: (this.body.position.y < config.height - 15 ? - config.move_speed : 0)});
    }
  }
}
