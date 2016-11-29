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
            this.state = state.clone();
            this.p1_move = p1_move;
            this.p2_move = p2_move;
    }

    contains(player : goofspiel.Player, move : goofspiel.Card) : boolean{
        for(let i = 0; i < this.children.length; i++){
            let child = this.children[i];
            if(player.id === "p1"){
                if(child.p1_move.value === move.value){
                    return true;
                }
            }
            else{
                if(child.p2_move.value === move.value){
                    return true;
                }
            }
        }
        return false;
    }

    contains_node(p1_move : goofspiel.Card, p2_move : goofspiel.Card) : Node | null{
        for(let i = 0; i < this.children.length; i++){
            let child = this.children[i];
            if(child.p1_move.value === p1_move.value && child.p2_move.value === p2_move.value){
                return child;
            }
        }
        return null;
    }
}

function selection(root : Node){
    //

    let current_node = root;
    while(true){

        let p1 = current_node.state.p1;
        let p1_chosen_move = individual_player_selection(p1, current_node);

        let p2 = current_node.state.p2;
        let p2_chosen_move = individual_player_selection(p2, current_node);

        //with two moves chosen, a child node can be created
        //we only need each row and column in the move matrix to selected
        //one to begin using ucb1

        //check if the node exists
        let child_node = current_node.contains_node(p1_chosen_move, p2_chosen_move);
        if(child_node){
            //if it does, then move to that node and continue
            current_node = child_node;
        }
        else{
            //if it doesn't, create a new node
            let new_node = new Node(current_node, current_node.state, p1_chosen_move, p2_chosen_move);
            //add as child to parent node
            current_node.children.push(new_node);
            return new_node;
        }
    }
}

function individual_player_selection(player : goofspiel.Player, node : Node) : goofspiel.Card{
    let potential_moves = node.state.legal_moves(player);

    let fully_explored = true;
    let unchosen : goofspiel.Card[] = [];
    for(let i = 0; i < potential_moves.length; i++){
        let move = potential_moves[i];
        if(!node.contains(player, move)){
            fully_explored = false;
            unchosen.push(move);
        }
    }

    if(fully_explored){
        //return the ucb max
    }
    else{
        return ai.choose_random(unchosen);
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