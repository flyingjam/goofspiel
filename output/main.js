"use strict";
const goofspiel = require("./goofspiel");
const duct = require("./duct");
const readline = require('readline-sync');
let g = new goofspiel.GoofSpielState();
duct.search(g.p1, g);
