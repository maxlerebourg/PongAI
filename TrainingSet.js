class TrainingSet {
  constructor(genome) {
    let Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        Events = Matter.Events,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    let engine = Engine.create(),
        world = engine.world;


    // create renderer
    let render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: config.width,
            height: config.height,
            wireframes: !false,
            showAngleIndicator: false,
        }
    });
    setTimeout(function () {
        Render.run(render);
    }, 500);


    // create runner
    let runner = Runner.create();
    Runner.run(runner, engine);
    engine.world.gravity.y = 0;



    // IA
    var perso1 =  Bodies.rectangle(15, config.height / 2, 5, config.height / 8, {isStatic: true, id: 50, score: 0, restitution: .99 });
    // BOT
    var perso2 =  Bodies.rectangle(config.width - 15, config.height / 2, 5, config.height / 8, {isStatic: true, id: 60, restitution: .99});

      this.ball = Bodies.circle(config.width / 2, config.height / 2, 5, {
          render: {
            fillStyle: config.ball_color
            },
            alive: true,
            id: 100,
            friction: 0.3,
            frictionAir: 0.0005,
            restitution: 0.99
        });
      this.player = new Player(genome, perso1);
      let wallWidth = 10;
      var topWall = Bodies.rectangle(config.width / 2, 0, config.width, wallWidth, { isStatic: true });
      var botWall = Bodies.rectangle(config.width / 2, config.height, config.width, wallWidth, { isStatic: true });

      setInterval(() => {
        if ((this.ball.position.x < - 10 || this.ball.position.x > config.width + 10 || this.ball.position.y < - 10 || this.ball.position.y > config.height + 10) && this.ball.alive){
          console.log('ball left');
          this.ball.alive = false;
        }
        let x = this.ball.velocity.x, y = this.ball.velocity.y, limit = 0.5;
        if (x < limit && y < limit && x > - limit && y > - limit && this.ball.alive)
          Body.setVelocity(this.ball, {x: x * 2, y: y * 2})
        if (x === 0 && y === 0 && this.ball.alive)
          Body.setVelocity(this.ball, {x: -1, y: (Math.random() * - 1 + .5)});
        if (!this.ball.alive) 
          Body.setVelocity(this.ball, {x: 0, y: 0})
      }, 100);


      Events.on(engine, 'tick', () => {
        this.ball.alive ? Body.setPosition(perso2, {x: perso2.position.x, y: this.ball.position.y}) : null;  
      });

      Events.on(engine, 'collisionStart', function(e) {
          let pairs = e.pairs;
          for (let pair of pairs) {
              if (pair.bodyA.id === 50 && pair.bodyB.id === 100){
                pair.bodyA.score += 100;
                // Body.setVelocity(pair.BodyB, {x: pair.BodyB.velocity.x - 10, y: pair.BodyB.velocity.y + 10 })
              }
              if (pair.bodyA.id === 60 && pair.bodyB.id === 100){
                // Body.setVelocity(pair.BodyB, {x: pair.BodyB.velocity.x - 10, y: pair.BodyB.velocity.y + 10 })
              }
              if ( pair.bodyA.id === 100 && pair.bodyB.id === 50) {
                pair.bodyB.score += 100;
                // Body.setVelocity(pair.BodyA, {x: pair.BodyA.velocity.x - 10, y: pair.BodyA.velocity.y + 10 })
              }
              if ( pair.bodyA.id === 100 && pair.bodyB.id === 60) {
                // Body.setVelocity(pair.BodyA, {x: pair.BodyA.velocity.x - 10, y: pair.BodyA.velocity.y + 10 })
              }
          }
      });

      setTimeout(() => {Body.setVelocity(this.ball, {x: -1, y: Math.random() * - 1 + 0.5 })}, 500);
      World.add(engine.world, [topWall, botWall, this.ball, this.player.body, perso2]);

  }

  ia() {
    this.player.ia(this.ball);
  }

  again(brain) {
    this.ball.alive = true;
    this.player.brain = brain;
    this.player.body.score = 0;
    Body.setPosition(this.player.body, {x: 15, y: config.height / 2});
    Body.setPosition(this.ball, {x: config.width / 2, y: config.height / 2});
    Body.setVelocity(this.ball, {x: 0, y: 0});
    setTimeout(() => {Body.setVelocity(this.ball, {x: -1, y: (Math.random() * - 1 + .5)})}, 500);
  }
}
