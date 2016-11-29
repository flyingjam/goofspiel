import * as goofspiel from "./goofspiel"

type ai =  (player : goofspiel.Player, state : goofspiel.GoofSpielState) => goofspiel.Card;

function get_random_int(min : number, max : number) : number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function choose_random(legal_moves : goofspiel.Card[]){
    let random_index = get_random_int(0, legal_moves.length);
    return legal_moves[random_index];
}

function random(player : goofspiel.Player, state : goofspiel.GoofSpielState) : goofspiel.Card{
    let possible_moves = state.legal_moves(player);
    console.log("Possible moves: " + possible_moves);
    return choose_random(possible_moves);
}

function random_simulation(state : goofspiel.GoofSpielState, player : goofspiel.Player) : goofspiel.GameCondition{

    let copy = state.clone();

    while(!copy.end()){
        //choose two random legal moves
        let p1_move = random(copy.p1, copy);
        let p2_move = random(copy.p2, copy);
        console.log("Choose " + p1_move + " and " + p2_move);
        copy.choose(copy.p1, p1_move);
        copy.choose(copy.p2, p2_move);
    }

    console.log(copy.toString());

    return copy.condition();
}

function ucb1(win_value : number, num_played : number, total_played : number, c? : number) : number{
    if(!c) c = Math.sqrt(2);

    if(num_played === 0){
        //a node which has not been played is assumed a ucb1 value of Infinity
        //i.e explore all child nodes at least once
        return Infinity;
    }

    let mean_value = win_value / num_played;
    return (mean_value + c*Math.sqrt(Math.log(total_played)/num_played));
}

export { ai }
export { random }
export { choose_random }
export { random_simulation }