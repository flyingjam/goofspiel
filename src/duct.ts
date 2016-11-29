import * as ai from "./AI"
import * as goofspiel from "./goofspiel"
//four parts are
//selection
//expansion
//simulation
//update
//
//Selection and update and really the only differences

class Node{
    //represents a node
    //contains the usual parent, children
    //but also a copy of the game state and the moves that led to it
    //as well as the usual stats
    parent : Node | null;
    children : Node[];
    state : goofspiel.GoofSpielState;
    p1_move : goofspiel.Card;
    p2_move : goofspiel.Card;

    win_value : number = 0;
    num_plays : number = 0;

    constructor(parent : Node, 
        state : goofspiel.GoofSpielState, 
        p1_move : goofspiel.Card,
        p2_move : goofspiel.Card){
            this.parent = parent;
            this.state = state;
            this.p1_move = p1_move;
            this.p2_move = p2_move;
    }
}

function back_propogate(leaf : Node, win_value : number){
    let node = leaf;
    while(node.parent !== null){
        //update stats of node
        node.win_value += win_value;
        node.num_plays += 1;
        node = node.parent;
    }
}