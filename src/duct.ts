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
    children : Node[] = [];
    state : goofspiel.GoofSpielState;
    p1_move : goofspiel.Card;
    p2_move : goofspiel.Card;

    p1_win_value : number = 0;
    p2_win_value : number = 0;

    p1_num_plays : number = 0;
    p2_num_plays : number = 0;

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

function value(player : goofspiel.Player, result : goofspiel.GameCondition) : number{
    switch(result){
        case goofspiel.GameCondition.P1Win:
            {
                if(player.id == "p1")
                    return 1;
                else
                    return 0;
            }
       case goofspiel.GameCondition.P2Win:
            {
                if(player.id == "p2")
                    return 1;
                else
                    return 0;
            }
      case goofspiel.GameCondition.Tie:
        return 0.5;
      default:
        return 0;
    }

}

function search(player : goofspiel.Player, state : goofspiel.GoofSpielState){
    let current_time = Date.now();
    let thinking = 1000; //1 second
    let start_node = new Node(null, state, null, null);
    while(Date.now() - current_time < thinking){

        //selection and expansion
        let selected_node = selection(start_node);

        //simulation
        let result = ai.random_simulation(selected_node.state, player);
        //back propogate the results
        back_propogate(selected_node, result);
    }

    console.log(start_node.p1_num_plays);
    for(let i = 0; i < start_node.children.length; i++){
        let child = start_node.children[i];
        console.log("wins " + child.p1_win_value + " played " + child.p1_num_plays);
    }
}

function selection(root : Node) : Node{

    let current_node = root;
    while(true){
        //if current node is terminal (i.e game has ended)
        if(current_node.state.end()){
            //return the node
            return current_node;
        }

        let p1 = current_node.state.p1;
        let p1_chosen_move = individual_player_selection(p1, current_node, root);

        let p2 = current_node.state.p2;
        let p2_chosen_move = individual_player_selection(p2, current_node, root);

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
            //advance the state
            new_node.state.choose(p1, p1_chosen_move);
            new_node.state.choose(p2, p2_chosen_move);
            //add as child to parent node
            current_node.children.push(new_node);
            return new_node;
        }
    }
}

function ucb1_max(nodes : Node[], root : Node, player : goofspiel.Player) : goofspiel.Card{
    let best_ucb1 = 0;
    let best_node = nodes[0];
    if(player.id == "p1"){
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i];
            let ucb1_value = ai.ucb1(node.p1_win_value, node.p1_num_plays, root.p1_num_plays);
            if(ucb1_value > best_ucb1){
                best_ucb1 = ucb1_value;
                best_node = node;
            }
        }
        return best_node.p1_move;
    }

    else{
        for(let i = 0; i < nodes.length; i++){
            let node = nodes[i];
            let ucb1_value = ai.ucb1(node.p2_win_value, node.p2_num_plays, root.p2_num_plays);
            if(ucb1_value > best_ucb1){
                best_ucb1 = ucb1_value;
                best_node = node;
            }
        }
        return best_node.p2_move;
    }
    
}

function individual_player_selection(player : goofspiel.Player, node : Node, root : Node) : goofspiel.Card{
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

        return ucb1_max(node.children, root, player);

    }
    else{
        return ai.choose_random(unchosen);
    }
}

function back_propogate(leaf : Node, result : goofspiel.GameCondition){
    let node = leaf;
    do{
        //update stats of node
        //each player holds its own individual statistics for each node
        node.p1_win_value += value(node.state.p1, result);
        node.p1_num_plays += 1;

        node.p2_win_value += value(node.state.p2, result);
        node.p2_num_plays += 1;
        //node.win_value += win_value;
        //node.num_plays += 1;
        node = node.parent;
    }while(node !== null)
}

export { value }
export { search }