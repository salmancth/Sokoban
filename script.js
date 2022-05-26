 var numberOfGoalTiles = 0;
 var levelDone = false;

 /*
  * player - Track of players current position
  */
 var player = {
     xPos: 0,
     yPos: 0
 }

 /*
  * Class Position - track of the next 2 tiles
  * in the direction the player is moving.
  */
 function Position(x, y) {
     this.x = x;
     this.y = y;
     this.xx = x + x;
     this.yy = y + y;
 }


 /*
  * When draws the game map.
  */
 function createMap() {

     var mapContainer = $("#mapContainer");

     for (var i = 0; i < tileMap01.mapGrid.length; i++) {

         for (var j = 0; j < tileMap01.mapGrid[i].length; j++) {

             if (tileMap01.mapGrid[i][j] == 'P') {
                 player.yPos = i;
                 player.xPos = j;
                 var tile = $("<div></div>");
                 tile.addClass(Entities.Character);
                 tile.attr("id", "X" + j + "Y" + i);
                 mapContainer.append(tile);
             }

             if (tileMap01.mapGrid[i][j] == 'W') {
                 var tile = $("<div></div>");
                 tile.addClass(Tiles.Wall);
                 tile.attr("id", "X" + j + "Y" + i);
                 mapContainer.append(tile);
             } else if (tileMap01.mapGrid[i][j] == 'B') {
                 var tile = $("<div></div>");
                 tile.addClass(Entities.Block);
                 tile.attr("id", "X" + j + "Y" + i);
                 mapContainer.append(tile);
             } else if (tileMap01.mapGrid[i][j] == 'G') {
                 var tile = $("<div></div>");
                 tile.addClass(Tiles.Goal);
                 tile.attr("id", "X" + j + "Y" + i);
                 mapContainer.append(tile);
                 numberOfGoalTiles++;

             } else if (tileMap01.mapGrid[i][j] == ' ') {
                 var tile = $("<div></div>");
                 tile.addClass(Tiles.Space);
                 tile.attr("id", "X" + j + "Y" + i);
                 mapContainer.append(tile);
             }
         }
         $("#mapContainer").append("<br>");
     }
 }

 function movePlayer(e) {

     switch (e.keyCode) {
         case 37: //LEFT
             e.preventDefault();
             var nextPos = new Position(-1, 0);
             checkPosition(nextPos);
             break;

         case 38: //UP
             e.preventDefault();
             var nextPos = new Position(0, -1);
             checkPosition(nextPos);
             break;

         case 39: //RIGHT
             e.preventDefault();
             var nextPos = new Position(1, 0);
             checkPosition(nextPos);
             break;

         case 40: //DOWN
             e.preventDefault();
             var nextPos = new Position(0, 1);
             checkPosition(nextPos);
             break;

         default:
             return;
     }
 }


 function inputManager(e) {

     e.preventDefault();

     if (e.key == "R") restartCurrentLevel("left");

     // Check for the game end after each input
     checkGameWon();
 }

 function checkPosition(nextPos) {
     var nextElement = $("#X" + (player.xPos + nextPos.x) + "Y" + (player.yPos + nextPos.y));

     if (nextElement.hasClass(Tiles.Wall)) { //Return FALSE if nextElement is of class Wall.
         return;
     } else if (nextElement.hasClass(Entities.Block)) { //Next element is of class Block
         var afterNextElement = $("#X" + (player.xPos + nextPos.xx) + "Y" + (player.yPos + nextPos.yy));

         if (afterNextElement.hasClass(Tiles.Wall) || afterNextElement.hasClass(Entities.Block)) { //Return false if element after next is a wall or another block.
             return;
         } else {
             moveBlockElement(nextElement, afterNextElement);
             movePlayerElement(nextPos);
         }
     } else movePlayerElement(nextPos);

 }

 function isLevelDone() {
     if (numberOfGoalTiles == $(".entity-block-goal").length) {
         return true;
     } else return false;
 }

 function updatePlayerPos(nextPos) {
     player.xPos += nextPos.x;
     player.yPos += nextPos.y;
 }

 function moveBlockElement(nextElement, afterNextElement) {
     nextElement.removeClass(Entities.Block);

     if (nextElement.hasClass("tile-goal")) {
         nextElement.removeClass(Entities.BlockDone);
     }

     afterNextElement.addClass(Entities.Block);
     afterNextElement.removeClass(Tiles.Space);

     if (afterNextElement.hasClass("tile-goal")) {
         afterNextElement.addClass(Entities.BlockDone);
         levelDone = isLevelDone();
     }
 }

 function movePlayerElement(nextPos) {
     var playerElement = $(".entity-player");
     playerElement.addClass(Tiles.Space);
     playerElement.removeClass(Entities.Character);

     updatePlayerPos(nextPos);

     var newPlayer = $("#X" + player.xPos + "Y" + player.yPos);
     newPlayer.addClass(Entities.Character);
     newPlayer.removeClass(Tiles.Space);
     if (levelDone) {
         win();
     }
 }

 function win() {
     $("body").off();
     $(".blackBox").fadeTo(100, 0.6, function() {

         setTimeout(function() {
             $(".winText").animate({
                 opacity: '1',
                 fontSize: "7em"
             }, "slow");
         }, 100)

     });
 }

 $(document).ready(function() {
     createMap();

     $("body").keydown(function(event) {
         movePlayer(event);
     });

 })