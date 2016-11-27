
class Card{
    readonly value : number;
    constructor(value : number){
        this.value = value;
    }

    clone(){
        return new Card(this.value);
    }

    toString() : string{
        return this.value.toString();
    }
}

class Deck{
    cards : Card[];
    constructor(){
        this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((x) => new Card(x))
    }

    shuffle(){
        //Fisher-Yates Shuffle
        let current_index = this.cards.length, temporary_value, random_index;
        while(current_index !== 0){
            random_index = Math.floor(Math.random() * current_index);
            current_index -= 1;

            temporary_value = this.cards[current_index];
            this.cards[current_index] = this.cards[random_index];
            this.cards[random_index] = temporary_value;
        }
    }
    pop() : Card{
        if(this.cards.length > 0){
            return this.cards.pop()
        }
        else{
            return new Card(0);
        }
    }

    peek() : Card{
        if(this.cards.length > 0){
            return this.cards[this.cards.length - 1]
        }
        else{
            return new Card(0);
        }
    }

    remove(card : Card){
        let to_be_removed = this.cards.findIndex((x) => x.value === card.value);
        if(to_be_removed < 0){
            return;
        }
        this.cards = this.cards.splice(to_be_removed, 1);
    }

    clone() : Deck{
        let temp = new Deck();
        for(let i = 0; i < temp.cards.length; i++){
            temp.cards[i] = this.cards[i].clone();
        }
        return temp;
    }
}

class Player{
    readonly id : string;
    total_score : number = 0;
    deck : Deck = new Deck();
    constructor(name : string){
        this.id = name;
    }

    toString() : string{
        return "Player: " + this.id + " Total Score: " + this.total_score;
    }

    clone() : Player{
        let temp = new Player(this.id);
        temp.total_score = this.total_score;
        temp.deck = this.deck.clone();
        return temp;
    }
}

class GoofSpielState{
    p1 : Player = new Player("p1");
    p2 : Player = new Player("p2");

    p1_choice : Card = null;
    p2_choice : Card = null;

    prize_deck : Deck = new Deck();
    
    constructor(){
        this.prize_deck.shuffle();
    }

    choose(player : Player, card : Card){
        if(player.id === "p1"){
            this.p1_choice = card;
        }
        else if (player.id == "p2"){
            this.p2_choice = card;
        }

        if(this.both_chosen()){
            this.advance_state();
        }
    }

    both_chosen() : boolean{
        return (this.p1_choice !== null && this.p2_choice !== null)
    }

    advance_state(){
        let winning_player : Player;
        if(this.p1_choice.value > this.p2_choice.value){
            winning_player = this.p1;
        }
        else if (this.p1_choice.value < this.p2_choice.value){
            winning_player = this.p2;
        }
        else{
            //a tie
            //reset state and then end;
            this.end_turn();
            return;
        }
        winning_player.total_score += this.prize_deck.pop().value;
        this.end_turn();
    }

    end_turn(){
        this.p1.deck.remove(this.p1_choice);
        this.p2.deck.remove(this.p2_choice);
        this.p1_choice = null;
        this.p2_choice = null;
    }

    clone(){
        let temp = new GoofSpielState();

        temp.p1 = this.p1.clone();
        temp.p2 = this.p2.clone();

        if(this.p1_choice !== null)
            temp.p1_choice = this.p1_choice.clone();

        if(this.p2_choice !== null)
            temp.p2_choice = this.p2_choice.clone();
        
 
        temp.prize_deck = this.prize_deck.clone();
        return temp;
    }

    public toString = () : string => {
        let str = "\n";
        str += "Current Prize Card" + this.prize_deck.peek();
        str += "\n" + this.p1.toString();
        if(this.p1_choice !== null)
            str += "\nCurrent choice: " + this.p1_choice.toString();
        str += "\n" + this.p2.toString();
        if(this.p2_choice !== null)
            str += "\nCurrent choice: " + this.p2_choice.toString();

        return str;
    }
}

export { GoofSpielState }
export { Deck }
export { Card }