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

// AI AREA
let population = [];
let neat = null;
let intervalGame = null;
let hightestScore = 0;
let begin = true;

let config = {
  move_speed: -8,
  ball_color: '#FF0',
  player_color: "#000",
  height: 150,
  width: 200
}

let iaInit = () => {
  neat = new neataptic.Neat(2, 1, popu => {console.log(popu.brain.score)},
      {
          mutation: neataptic.methods.mutation.ALL,
          popsize: 8,
          elitism: Math.round(0.2 * 10),
          network: new neataptic.architect.Random(2, 6, 1)
      }
  );
  iaStart();
};


let iaStart = () => {
  // start();
  let i = 0;
  //population = [];
  for(let genome of neat.population){
      //genome = neat.population[genome];
    if (!begin) {
      population[i].again(genome);
      i++;
    }
    else {
      let birdo = new TrainingSet(genome);
      population.push(birdo);
    }
  }
  begin = false;
  intervalGame = setInterval(ia, 50);
};

let ia = () => {
  let i = false;
  //console.log(pop[1].getData());
  population.map(el => {
      el.ia();
      el.ball.alive ? i = true : null;
  });
  if (!i) iaEnd();
};


let i = 0;

let iaEnd = () => {
  clearInterval(intervalGame);
  neat.sort();
  population.map(el => {hightestScore < el.player.brain.score ? hightestScore = el.player.brain.score: null;});
  console.log('Generation:', neat.generation, '- average score:', neat.getAverage() + '- hightest score:' + hightestScore);
  hightestScore = 0;
  let newPopulation = [];
  // Elitism
  for(let i = 0; i < neat.elitism; i++){
      newPopulation.push(neat.population[i]);
  }
  // Breed the next individuals
  for(let i = 0; i < neat.popsize - neat.elitism; i++){
      newPopulation.push(neat.getOffspring());
  }
  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();
  neat.generation++;
  //if (i < 1)
    iaStart();
  //i++;
};

iaInit();
