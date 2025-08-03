let dealerSum = 0;
let playerSum = 0;
let initialDealerSum = 0;

let hidden;
let deck;

let dealerAceCount = 0;
let yourAceCount = 0;

let canHit = true;

window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

/* 
A deck of 52 playing cards is created consisting of 
13 values each having 4 different suits
*/
function buildDeck(){
    let values = ["2", "3" ,"4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    let suits = ["D", "H", "C", "S"];
    deck = [];

    for (let i = 0; i < suits.length; i++){
        for (let j = 0; j < values.length; j++){
            deck.push(values[j] + "-" + suits[i]);
        }
    }


}

/* 
The deck is shuffled randomizing the order of the cards
*/
function shuffleDeck(){
    for (let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    console.log(deck);
}

/* 
After the deck has been built and shuffled the game begins
The dealer and player are now each given two cards
With the dealer only showing one
*/
function startGame(){
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    
    let cardImg = document.createElement("img");
    let card = deck.pop();

    cardImg.src = "Cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealers-cards").append(cardImg);
    initialDealerSum = dealerSum - getValue(hidden);
    

    for (i = 0; i < 2; i++){
        let cardImg = document.createElement("img");
        let card = deck.pop();

        cardImg.src = "Cards/" + card + ".png";
        playerSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    document.getElementById("dealers-sum").innerText = initialDealerSum;
    document.getElementById("your-sum").innerText = playerSum;
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("new-game").addEventListener("click", newGame);
}

// The new game button reloads the page when hit restarting the game
function newGame(){
    location.reload();

}

/* 
The hit button is an action by the player
where they can decide whether they would
like another card. 
(This action can be repeated as long as the player does not exceed 21)
*/
function hit(){
    if (!canHit){
        return;
    }
    let cardImg = document.createElement("img");
        let card = deck.pop();

        cardImg.src = "Cards/" + card + ".png";
        console.log("before player sum", playerSum,card);
        playerSum += getValue(card);
        console.log("1 after player sum", playerSum);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        [dealerSum, dealerAceCount] = reduceAce(dealerSum, dealerAceCount);
        [playerSum, yourAceCount] = reduceAce(playerSum, yourAceCount);
        console.log("after player sum", playerSum);
    if (playerSum > 21){
        canHit = false;
        let message = "Bust";
        document.getElementById("results").innerText = message;
    }
    document.getElementById("your-sum").innerText = playerSum;
}

/* 
The stay button allows the player
to decide whether they would like no more cards.
Once hit the dealer now draws cards
*/
function stay(){
    while (dealerSum < 17){
        let cardImg = document.createElement("img");
        let card = deck.pop();

        cardImg.src = "Cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealers-cards").append(cardImg);
    }
    
    [dealerSum, dealerAceCount] = reduceAce(dealerSum, dealerAceCount);
    [playerSum, yourAceCount] = reduceAce(playerSum, yourAceCount);
    canHit = false;

    document.getElementById("hidden").src = "Cards/" + hidden + ".png";

    // compares the score of the player to the dealer to determine a winner
    let message = "";
    if(playerSum > 21){
        message = "You Lose";
    } 
    else if (playerSum == dealerSum){
        message = "Push";
    }
    else if (playerSum == 21){
        message = "BlackJack!"
    }
    else if (playerSum > dealerSum && playerSum <= 21){
        message = "You Win!";
    } 
    else if (playerSum < dealerSum && dealerSum <= 21){
        message = "You Lose";
    }
    else if (playerSum < dealerSum && dealerSum > 21){
        message = "You Win!";
    }
    else if (playerSum > dealerSum && playerSum > 21){
        message = "You Lose";
    }
    
    document.getElementById("dealers-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = playerSum;
    document.getElementById("results").innerText = message;
}

/*
If the player has an ace and exceeds 21
This function reduces the ace value from 11
to 1
*/
function reduceAce(sum, aceCount){
    if(sum > 21 && aceCount > 0){
        sum -= 10;
        aceCount -= 1;
    
    }
    return [sum, aceCount];
}


/*
This function gets the value of the
card through the image name
*/
function getValue(card){
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)){
        if (value == "A"){
            return 11;
        }
        return 10

    }
    return parseInt(value);
}

function checkAce(card){
    if(card[0] == "A"){
        return 1;
    } else {
        return 0;
    }

}