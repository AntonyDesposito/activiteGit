/*Snake Game JavaScript part */

window.onload = function (){
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blocksize = 30;
  var canvas;
  var ctx;
  var delay = 100;
  var xcoord = 0;
  var ycoord = 0;
  var snakee;
  var applee;
  var widthInBlocks = canvasWidth/blocksize;
  var heightInBlocks = canvasHeight/blocksize;
  var score;
  var timeout;

  init();

  function init(){
    canvas = document.createElement('Canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "20px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    snakee = new Snake([[7,4],[6,4],[5,4],[4,4]], "right");
    applee = new Apple([10,10]);
    score = 0;
    refreshCanvas();
  }

  function refreshCanvas (){
    snakee.advance();
    if (snakee.checkCollision()){
      gameOver();
    }
    else {
      if (snakee.isEating(applee)){
        score++;
        snakee.ateApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      };
      ctx.clearRect(0,0, canvasWidth,canvasHeight);
      drawScore();
      snakee.draw();
      applee.draw();
      timeout = setTimeout(refreshCanvas,delay);
    }

  }
  function gameOver() {
    ctx.save();
    ctx.font = "bold 80px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centreX = canvasWidth/2;
    var centreY = canvasHeight/2;
    ctx.strokeText("Game Over", centreX, centreY - 180);
    ctx.fillText("Game Over", centreX, centreY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX , centreY - 120);
    ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX , centreY - 120);

    ctx.restore();
  }

  function restart() {
    snakee = new Snake([[7,4],[6,4],[5,4],[4,4]], "right");
    applee = new Apple([10,10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  };

  function drawScore() {
    var scoreL = score.toString();
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centreX = canvasWidth/2;
    var centreY = canvasHeight/2;
    ctx.fillText(scoreL, centreX, centreY);
    ctx.restore();
  }

  function drawBlock(ctx, position) {
    var x = position[0] * blocksize;
    var y = position[1] * blocksize;
    ctx.fillRect(x,y, blocksize, blocksize);

  };
  function Snake(body,direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function(){
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (var i=0; i<this.body.length;i++) {
        drawBlock(ctx,this.body[i]);
      }
      ctx.restore();
    }
    this.advance = function(){
      var nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -=1;
          break;
        case "right":
          nextPosition[0] +=1;
          break;
        case "down" :
          nextPosition[1] +=1;
          break;
        case "up" :
          nextPosition[1] -=1;
          break;
        default:
          throw("Invalid Direction");
      }
      this.body.unshift(nextPosition);
      if(!this.ateApple) {
        this.body.pop();
      }
      else {
        this.ateApple = false;
      }

    }
    this.setDirection = function(newDirection) {
      var allowDirection;
      switch (this.direction) {
        case "left":
        case "right":
          allowDirection = ["up","down"];
          break;
        case "down" :
        case "up" :
          allowDirection = ["left","right"];
          break;
        default:
          throw("Invalid Direction");
      }
      if (allowDirection.indexOf(newDirection) > -1){
        this.direction = newDirection;
      }
    }

    this.checkCollision = function(){
      var wallcollision = false;
      var snakecollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks-1;
      var maxY = heightInBlocks-1;
      var inbwH = snakeX < 0 || snakeX > maxX;
      var inbwV = snakeY < 0 || snakeY > maxY;
      if (inbwH || inbwV){
        wallcollision = true;
      }
      for (var i=0; i < rest.length; i++){
        if (snakeX === rest[i][0] && snakeY === rest[i][1])
        {
          snakecollision = true;
        }
      }
      return wallcollision || snakecollision;
    }
    this.isEating = function (appleToEat){
      var head = this.body[0];
      if (head[0] === appleToEat.position[0] && head[1]=== appleToEat.position[1]){
        return true;
      }
      else{
        return false;
      }
    }
  }

  function Apple(position){
    this.position = position;
    this.draw = function(){
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      var radius = blocksize/2;
      var x = this.position[0]*blocksize + radius;
      var y = this.position[1]*blocksize + radius;
      ctx.arc(x,y, radius, 0, Math.PI*2, true);
      ctx.fill();
      ctx.restore();
    }
    this.setNewPosition = function (){
      var newX = Math.round(Math.random()*(widthInBlocks-1));
      var newY = Math.round(Math.random()*(heightInBlocks-1));
      this.position = [newX,newY];
    }
    this.isOnSnake = function (snackecheck){
      var isOnSnake = false;
      for (var i = 0; i<snackecheck.body.length;i++){
        if (this.position[0] === snackecheck.body[i][0] && this.position[1] === snackecheck.body[i][1]){
          isOnSnake = true;
        }
      }
      return isOnSnake;
    }
  }

  document.onkeydown = function handleKeyDown (e){
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  }
}
