import * as goofspiel from "./goofspiel"
import * as ai from "./AI"

//dirty hack to get tsc to shut up about the lack of types
//on the library
declare function require(line : string) : any;
const readline : any  = require('readline-sync');

let g = new goofspiel.GoofSpielState();
ai.random_simulation(g, g.p1);


