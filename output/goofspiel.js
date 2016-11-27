"use strict";
var Card = (function () {
    function Card(value) {
        this.value = value;
    }
    Card.prototype.clone = function () {
        return new Card(this.value);
    };
    Card.prototype.toString = function () {
        return this.value.toString();
    };
    return Card;
}());
exports.Card = Card;
var Deck = (function () {
    function Deck() {
        this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(function (x) { return new Card(x); });
    }
    Deck.prototype.shuffle = function () {
        var current_index = this.cards.length, temporary_value, random_index;
        while (current_index !== 0) {
            random_index = Math.floor(Math.random() * current_index);
            current_index -= 1;
            temporary_value = this.cards[current_index];
            this.cards[current_index] = this.cards[random_index];
            this.cards[random_index] = temporary_value;
        }
    };
    Deck.prototype.pop = function () {
        if (this.cards.length > 0) {
            return this.cards.pop();
        }
        else {
            return new Card(0);
        }
    };
    Deck.prototype.peek = function () {
        if (this.cards.length > 0) {
            return this.cards[this.cards.length - 1];
        }
        else {
            return new Card(0);
        }
    };
    Deck.prototype.clone = function () {
        var temp = new Deck();
        for (var i = 0; i < temp.cards.length; i++) {
            temp.cards[i] = this.cards[i].clone();
        }
        return temp;
    };
    return Deck;
}());
exports.Deck = Deck;
var Player = (function () {
    function Player(name) {
        this.total_score = 0;
        this.deck = new Deck();
        this.id = name;
    }
    Player.prototype.toString = function () {
        return "Player: " + this.id + " Total Score: " + this.total_score;
    };
    return Player;
}());
var GoofSpielState = (function () {
    function GoofSpielState() {
        var _this = this;
        this.p1 = new Player("p1");
        this.p2 = new Player("p2");
        this.p1_choice = null;
        this.p2_choice = null;
        this.prize_deck = new Deck();
        this.toString = function () {
            var str = "\n";
            str += "Current Prize Card" + _this.prize_deck.peek();
            str += "\n" + _this.p1.toString();
            if (_this.p1_choice !== null)
                str += "\nCurrent choice: " + _this.p1_choice.toString();
            str += "\n" + _this.p2.toString();
            if (_this.p2_choice !== null)
                str += "\nCurrent choice: " + _this.p2_choice.toString();
            return str;
        };
        this.prize_deck.shuffle();
    }
    GoofSpielState.prototype.choose = function (player, card) {
        if (player.id === "p1") {
            this.p1_choice = card;
        }
        else if (player.id == "p2") {
            this.p2_choice = card;
        }
        if (this.both_chosen()) {
            this.advance_state();
        }
    };
    GoofSpielState.prototype.both_chosen = function () {
        return (this.p1_choice !== null && this.p2_choice !== null);
    };
    GoofSpielState.prototype.advance_state = function () {
        var winning_player;
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
    };
    GoofSpielState.prototype.end_turn = function () {
        this.p1_choice = null;
        this.p2_choice = null;
    };
    return GoofSpielState;
}());
exports.GoofSpielState = GoofSpielState;
