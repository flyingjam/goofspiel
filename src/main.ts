import * as goofspiel from "./goofspiel"


let game = new goofspiel.GoofSpielState();
let p1 = game.p1;
let p2 = game.p2;

console.log("" + game);

game.choose(p1, new goofspiel.Card(1));
game.choose(p2, new goofspiel.Card(2));

console.log("" + game);

console.log("Hello World!");