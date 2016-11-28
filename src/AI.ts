import * as goofspiel from "./goofspiel"

type ai =  (player : goofspiel.Player, state : goofspiel.GoofSpielState) => goofspiel.Card;

export function random(player : goofspiel.Player, state : goofspiel.GoofSpielState) : goofspiel.Card{
    let possible_moves = state.legal_moves(player);
    let random_index = Math.random() * possible_moves.length;
    return possible_moves[random_index];
}

export { ai }