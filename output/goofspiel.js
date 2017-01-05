"use strict";
class Card {
    constructor(value) {
        this.value = value;
    }
    clone() {
        return new Card(this.value);
    }
    toString() {
        return this.value.toString();
    }
}
exports.Card = Card;
class Deck {
    constructor() {
        this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((x) => new Card(x));
    }
    shuffle() {
        let current_index = this.cards.length, temporary_value, random_index;
        while (current_index !== 0) {
            random_index = Math.floor(Math.random() * current_index);
            current_index -= 1;
            temporary_value = this.cards[current_index];
            this.cards[current_index] = this.cards[random_index];
            this.cards[random_index] = temporary_value;
        }
    }
    pop() {
        if (this.cards.length > 0) {
            return this.cards.pop();
        }
        else {
            return new Card(0);
        }
    }
    peek() {
        if (this.cards.length > 0) {
            return this.cards[this.cards.length - 1];
        }
        else {
            return new Card(0);
        }
    }
    remove(card) {
        let to_be_removed = this.cards.findIndex((x) => x.value === card.value);
        if (to_be_removed < 0) {
            return;
        }
        this.cards.splice(to_be_removed, 1);
    }
    clone() {
        let temp = new Deck();
        for (let i = 0; i < this.cards.length; i++) {
            temp.cards[i] = this.cards[i].clone();
        }
        return temp;
    }
}
exports.Deck = Deck;
class Player {
    constructor(name) {
        this.total_score = 0;
        this.deck = new Deck();
        this.id = name;
    }
    toString() {
        return "Player: " + this.id + " Total Score: " + this.total_score;
    }
    clone() {
        let temp = new Player(this.id);
        temp.total_score = this.total_score;
        temp.deck = this.deck.clone();
        return temp;
    }
}
exports.Player = Player;
var GameCondition;
(function (GameCondition) {
    GameCondition[GameCondition["P1Win"] = 0] = "P1Win";
    GameCondition[GameCondition["P2Win"] = 1] = "P2Win";
    GameCondition[GameCondition["Tie"] = 2] = "Tie";
    GameCondition[GameCondition["Ongoing"] = 3] = "Ongoing";
})(GameCondition || (GameCondition = {}));
exports.GameCondition = GameCondition;
class GoofSpielState {
    constructor() {
        this.p1 = new Player("p1");
        this.p2 = new Player("p2");
        this.p1_choice = null;
        this.p2_choice = null;
        this.prize_deck = new Deck();
        this.toString = () => {
            let str = "\n";
            str += "Current Prize Card " + this.prize_deck.peek();
            str += "\n" + this.p1.toString();
            str += "\n Current cards available: " + this.p1.deck.cards;
            if (this.p1_choice !== null)
                str += "\nCurrent choice: " + this.p1_choice.toString();
            str += "\n" + this.p2.toString();
            str += "\n Current cards available: " + this.p2.deck.cards;
            if (this.p2_choice !== null)
                str += "\nCurrent choice: " + this.p2_choice.toString();
            str += "\nCondition: " + this.condition();
            return str;
        };
        this.prize_deck.shuffle();
    }
    choose(player, card) {
        if (player.id === "p1") {
            this.p1_choice = card;
        }
        else if (player.id == "p2") {
            this.p2_choice = card;
        }
        if (this.both_chosen()) {
            this.advance_state();
        }
    }
    both_chosen() {
        return (this.p1_choice !== null && this.p2_choice !== null);
    }
    advance_state() {
        let winning_player;
        if (this.p1_choice.value > this.p2_choice.value) {
            winning_player = this.p1;
        }
        else if (this.p1_choice.value < this.p2_choice.value) {
            winning_player = this.p2;
        }
        else {
            this.end_turn();
            return;
        }
        winning_player.total_score += this.prize_deck.pop().value;
        this.end_turn();
    }
    end_turn() {
        this.p1.deck.remove(this.p1_choice);
        this.p2.deck.remove(this.p2_choice);
        this.p1_choice = null;
        this.p2_choice = null;
    }
    clone() {
        let temp = new GoofSpielState();
        temp.p1 = this.p1.clone();
        temp.p2 = this.p2.clone();
        if (this.p1_choice !== null)
            temp.p1_choice = this.p1_choice.clone();
        if (this.p2_choice !== null)
            temp.p2_choice = this.p2_choice.clone();
        temp.prize_deck = this.prize_deck.clone();
        return temp;
    }
    condition() {
        if (this.end()) {
            if (this.p1.total_score > this.p2.total_score) {
                return GameCondition.P1Win;
            }
            else if (this.p2.total_score > this.p1.total_score) {
                return GameCondition.P2Win;
            }
            else {
                return GameCondition.Tie;
            }
        }
        return GameCondition.Tie;
    }
    end() {
        return (this.p1.deck.cards.length <= 0 || this.p2.deck.cards.length <= 0);
    }
    legal_moves(player) {
        return player.deck.cards;
    }
}
exports.GoofSpielState = GoofSpielState;
