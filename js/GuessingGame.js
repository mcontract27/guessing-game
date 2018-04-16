function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.playersGuessSubmission = function(guess){
    guess = Number(guess);
    if (guess === NaN || guess > 100 || guess < 1){
        throw("That is an invalid guess.");
    } else {
        this.playersGuess = guess;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function(){
    if (this.pastGuesses.indexOf(this.playersGuess) >= 0) {
        return "You have already guessed that number.";
    } else {
        this.pastGuesses.push(this.playersGuess);
        if (this.difference() === 0){
            return "You Win!";
        } else if (this.pastGuesses.length >= 5) {
            return "You Lose.";
        }
    }
    if (this.difference() < 10){
        return "You're burning up!";
    } else if (this.difference() < 25){
        return "You're lukewarm.";
    } else if (this.difference() < 50){
        return "You're a bit chilly.";
    } else {
        return "You're ice cold!";
    }
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function(){
    return (this.playersGuess < this.winningNumber); 
}

Game.prototype.provideHint = function(){
    arr = [generateWinningNumber(), generateWinningNumber(), this.winningNumber];
    return shuffle(arr);    
}

function generateWinningNumber(){
    return Math.floor(Math.random() * 100) + 1;    
}

function newGame(){
    return new Game();
}

function shuffle(arr){
    i = arr.length;
    while (i > 0){
        n = Math.floor(Math.random() * i);
        i--;
        temp = arr[n];
        arr[n] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

var game;

function endGame(){
    $('#headerbot').text("Press the reset button to play again.")
    $('#submit, #hint, #parent-input').prop('disabled', true);
}

function submitGuess(){
    str = game.playersGuessSubmission($('#parent-input').val());
    $('#glist li:nth-child(' + game.pastGuesses.length + ')').text($('#parent-input').val());
    if (str === "You Win!"){
        $('#headertop').text(str);
        endGame();
    } else if (str === "You Lose."){
        $('#headertop').text(str + "  The correct number was " + game.winningNumber + ".");
        endGame();
    } else {
        $('#parent-input').val("");
        $('#headerbot').text(str);
        if (game.isLower()){
            $('#headertop').text("Guess is too low");                
        } else {
            $('#headertop').text("Guess is too high");
        }
    }
}

$(document).ready(function() {
    game = newGame();
    console.log(game.winningNumber);
    
    $('#submit').click(function(){
        submitGuess();
    });

    $(document).keypress(function(e){
        if (e.which == 13){
            submitGuess();
        }
    });

    $('#reset').click(function() {
        game = newGame();
        console.log(game.winningNumber);
        $('#headertop').text("Guessing game!");
        $('#headerbot').text("Guess a number between 1 - 100");
        $('#hint, #submit, #parent-input').prop('disabled', false);
        $('#parent-input').val("");
        $('.guess').text('-');
    })

    $('#hint').click(function(){
        var arr = game.provideHint();
        $('#headertop').text('The correct number is ' + arr[0] +', ' + arr[1]+ ' or ' + arr[2] + '.');
    });
})