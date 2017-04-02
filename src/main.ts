import * as goofspiel from "./goofspiel"
import * as ai from "./AI"
import * as duct from "./duct"
//dirty hack to get tsc to shut up about the lack of types
//on the library
declare function require(line : string) : any;
const readline : any  = require('readline-sync');

let g = new goofspiel.GoofSpielState();
g.choose(g.p1, new goofspiel.Card(0))
//ai.random_simulation(g, g.p1);
