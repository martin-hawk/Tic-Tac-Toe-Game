 var computer = { // computer player object
   player: "computer",
   mark: "",
   movesCount: 0,
   score: 0,
   moves: {
     TLTMTR: 0, // horizontal wins
     MLMMMR: 0,
     BLBMBR: 0,
     TLMLBL: 0, // vertical wins
     TMMMBM: 0,
     TRMRBR: 0,
     TLMMBR: 0, // diagonal wins
     TRMMBL: 0
   }
 };
 var user = { // user player object
   player: "user",
   mark: "",
   movesCount: 0,
   score: 0,
   moves: {
     TLTMTR: 0,
     MLMMMR: 0,
     BLBMBR: 0,
     TLMLBL: 0,
     TMMMBM: 0,
     TRMRBR: 0,
     TLMMBR: 0,
     TRMMBL: 0
   }
 };
 var currentPlayer; // current player variable
 var winner = false;
 var gameCount = 0;
 var availableMoves = ["#top-left", "#top-middle", "#top-right", "#middle-left", "#middle-middle", "#middle-right", "#bottom-left", "#bottom-middle", "#bottom-right"];
 var first = ""; // first always goes "X"
 var whoseTurn = [];

 if (gameCount == 0) { // first time show modal dialog
   $("#dialog").dialog({
     resizable: false,
     height: 200,
     width: 400,
     modal: true,
     buttons: {
       "X": function() {
         getUserMarkBack("X"); // get user's mark
         $(this).dialog("close");

       },
       "O": function() {
         getUserMarkBack("O");
         $(this).dialog("close");
       }
     }
   });
 }

 function getUserMarkBack(value) {
   if (value == "X") {
     user.mark = value; // set user's mark
     computer.mark = "O" // set computer's mark
     first = "P"; // set first player
   } else {
     user.mark = value;
     computer.mark = "X";
     first = "C"
   }
   playGame(); // start game
 }

 function getCurrentPlayer() { // returns current player according to whoseTurn array
   if (whoseTurn.length <= 0) { // if first move
     if (first == "P") {
       whoseTurn.push(first); // add first's initials to array
       return user;
     } else {
       whoseTurn.push(first);
       return computer;
     }
   } else {
     if (whoseTurn[whoseTurn.length - 1] == "C") { // check last initials and return current player
       whoseTurn.push("P");
       return user;
     } else {
       whoseTurn.push("C");
       return computer;
     }
   }
 }

 function putMark(move) { // make player move
   if (availableMoves.indexOf(move) > -1) { // if there are available moves
     availableMoves.splice(availableMoves.indexOf(move), 1); // delete current move
     currentPlayer.movesCount++; // increment moves counter
     $(move + " .cell").html(currentPlayer.mark); // display move on board
     switch (move) { // increment win combination counter
       case "#top-left": // if selected #top-left
         currentPlayer.moves.TLTMTR++; // increment all combinations with #top-left value
         currentPlayer.moves.TLMLBL++;
         currentPlayer.moves.TLMMBR++;
         break;
       case "#top-middle":
         currentPlayer.moves.TLTMTR++;
         currentPlayer.moves.TMMMBM++;
         break;
       case "#top-right":
         currentPlayer.moves.TLTMTR++;
         currentPlayer.moves.TRMRBR++;
         currentPlayer.moves.TRMMBL++;
         break;
       case "#middle-left":
         currentPlayer.moves.MLMMMR++;
         currentPlayer.moves.TLMLBL++;
         break;
       case "#middle-middle":
         currentPlayer.moves.MLMMMR++;
         currentPlayer.moves.TMMMBM++;
         currentPlayer.moves.TLMMBR++;
         currentPlayer.moves.TRMMBL++;
         break;
       case "#middle-right":
         currentPlayer.moves.MLMMMR++;
         currentPlayer.moves.TRMRBR++;
         break;
       case "#bottom-left":
         currentPlayer.moves.BLBMBR++;
         currentPlayer.moves.TLMLBL++;
         currentPlayer.moves.TRMMBL++;
         break;
       case "#bottom-middle":
         currentPlayer.moves.BLBMBR++;
         currentPlayer.moves.TMMMBM++;
         break;
       case "#bottom-right":
         currentPlayer.moves.BLBMBR++;
         currentPlayer.moves.TRMRBR++;
         currentPlayer.moves.TLMMBR++;
         break;
     }
     if (currentPlayer.movesCount >= 3) checkWinner(); // when moves counter reaches 3, start to check for winner
   }
   playGame(); // continue play game
 }

 function checkWinner() { // check for winner
   var win = ""; // win combination
   for (var property in currentPlayer.moves) { // check if current player has combination equals 3 
     if (currentPlayer.moves.hasOwnProperty(property)) {
       if (currentPlayer.moves[property] == 3) {
         winner = true; // if yes, then winner is found
         win = property; // set win combination
       }
     }
   }
   if (winner == true) { // if winner is found
     currentPlayer.score++; // increase current player score
     if (currentPlayer.player == "user") { // display different board style for winner - if winner is user
       $(".board").css("background-color", "Green"); // green background
       drawLine(win); // draw winner's line
       setTimeout(function() { // after 2 seconds clear board
         resetBoard();
       }, 2000);
     } else { // if winner is computer
       $(".board").css("background-color", "Red"); // red background
       drawLine(win);
       setTimeout(function() {
         resetBoard();
       }, 2000);
     }
   } else { // if tie (no winner)
     if (availableMoves.length == 0 && winner == false) { // if there are no available moves left
       $(".board").css("background-color", "Grey"); // grey background
       setTimeout(function() {
         resetBoard();
       }, 2000);
     }
   }
 }

 function drawLine(win) { // draw winner's line
   switch (win) { // get win combination
     case "TLTMTR": // add html element according to win combination
       $("#top-left").append('<hr id="horizontal">');
       break;
     case "MLMMMR":
       $("#middle-left").append('<hr id="horizontal">');
       break;
     case "BLBMBR":
       $("#bottom-left").append('<hr id="horizontal">');
       break;
     case "TLMLBL":
       $("#top-left").append('<hr id="vertical">');
       break;
     case "TMMMBM":
       $("#top-middle").append('<hr id="vertical">');
       break;
     case "TRMRBR":
       $("#top-right").append('<hr id="vertical">');
       break;
     case "TLMMBR":
       $("#top-left").append('<hr id="left-diagonal">');
       break;
     case "TRMMBL":
       $("#top-right").append('<hr id="right-diagonal">');
       break;
   }
 }

 function resetBoard() { // reset board after win or tie
   computer.moves = { // reset objects' and variables' values
     TLTMTR: 0,
     MLMMMR: 0,
     BLBMBR: 0,
     TLMLBL: 0,
     TMMMBM: 0,
     TRMRBR: 0,
     TLMMBR: 0,
     TRMMBL: 0
   };
   user.moves = {
     TLTMTR: 0,
     MLMMMR: 0,
     BLBMBR: 0,
     TLMLBL: 0,
     TMMMBM: 0,
     TRMRBR: 0,
     TLMMBR: 0,
     TRMMBL: 0
   };
   computer.movesCount = 0;
   user.movesCount = 0;
   winner = false;
   availableMoves = ["#top-left", "#top-middle", "#top-right", "#middle-left", "#middle-middle", "#middle-right", "#bottom-left", "#bottom-middle", "#bottom-right"];
   whoseTurn = [];
   gameCount++; // increment game count
   $(".board").css("background-color", "Black"); // reset board style
   $("hr").remove(); // remove winner's line
   for (var i = 0; i < availableMoves.length; i++) { // clear cells
     $(availableMoves[i] + " .cell").html("&nbsp;");
   }
   $(".match").html("<b>Match:</b> " + gameCount); // display game resutls: match count, user and computer scores
   $(".userScore").html("<b>User score:</b> " + user.score);
   $(".computerScore").html("<b>Computer score:</b> " + computer.score);
   playGame(); // continue play game
 }

 function playGame() { // start play game
   currentPlayer = getCurrentPlayer(); // get current player
   if (winner === false) { // if there is no winner yet
     if (currentPlayer.player == "computer") { // if current player is computer
       var randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]; // get random move for computer
       setTimeout(function() { // let computer "think" before making move
         putMark(randomMove);
       }, 500);
     }
   }
 }

 // get user input (move) 
 $("#top-left .cell").click(function() {
   putMark("#top-left");
 });
 $("#top-middle .cell").click(function() {
   putMark("#top-middle");
 });
 $("#top-right .cell").click(function() {
   putMark("#top-right");
 });
 $("#middle-left .cell").click(function() {
   putMark("#middle-left");
 });
 $("#middle-middle .cell").click(function() {
   putMark("#middle-middle");
 });
 $("#middle-right .cell").click(function() {
   putMark("#middle-right");
 });
 $("#bottom-left .cell").click(function() {
   putMark("#bottom-left");
 });
 $("#bottom-middle .cell").click(function() {
   putMark("#bottom-middle");
 });
 $("#bottom-right .cell").click(function() {
   putMark("#bottom-right");
 });