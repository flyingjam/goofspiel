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

    //a node is a possible gamestate
    //it contains a list of the possible moves for both players
    parent : Node | null;

    player1_children : goofspiel.Card[];
    player2_children : goofspiel.Card[];

    //the moves that led here
    p1_move : goofspiel.Card;
    p2_move : goofspiel.Card;

    state : goofspiel.GoofSpielState;
    constructor(parent : Node, game_state : goofspiel.GoofSpielState){
        this.state = game_state;
        this.player1_children = game_state.legal_moves(game_state.p1);
        this.player2_children = game_state.legal_moves(game_state.p2);
        this.parent = parent;
    }

    clone(){
        //neccesary, since playouts must be done on "clones" of states
        let node = new Node(this.parent, this.state);
        node.parent = this.parent;
        return node;
    }

}

function selection(parent : Node){
    let current_state = parent.clone();

    let p1_visited_moves = [];
    let p2_visited_moves = [];

    while(true){

        //we only need to find highest value, so sorting is unnecessary
        //but it gives more information


        let p1_total = 
        let p1_ucb1 = current_state.player1_children.sort((a, b) => ai.ucb1())
        
    }
    
}

function expansion(){

}

function backpropagate(){

}