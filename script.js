
 const board = document.querySelector(".board");
const scoreElement = document.querySelector("#Score");
const highScoreElement = document.querySelector("#HighScore");   // HTML mein id="HighScore" kar dena (space hata ke)
const timeElement = document.querySelector("#Time");

const blockHeight = 50;
const blockWidth = 50;

const row = Math.floor(board.clientHeight/blockHeight);
const col = Math.floor(board.clientWidth/blockWidth);

const blocks = {};

for( let i = 0; i < row; i++){
      for(let j = 0; j < col; j++){ 
      const block = document.createElement('div');
      block.classList.add('block');
      board.appendChild(block);
      blocks[`${i}-${j}`] = block;
}
}

//**Intilisation **//
 let snake = [{x : 1 ,y : 3}];
 let food = { x : Math.floor(Math.random()*row), y : Math.floor(Math.random()*col)};   
 let direction = "right";
 let setintervalId = null;
 let timerId = null;
 let score = 0;
 let time = 0;
 let highScore = Number(localStorage.getItem("highScore")) || 0;
 highScoreElement.innerText = highScore;

 function render(){
 snake.forEach(segment => {
      blocks[`${segment.x}-${segment.y}`].classList.add("fill");
 });
      blocks[`${food.x}-${food.y}`].classList.add("food");
 }

 // time ko 00-00 (minutes-seconds) format mein dikhane ke liye
 function formatTime(totalSeconds){
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;

      if(minutes < 10){
           minutes = "0" + minutes;
      }
      if(seconds < 10){
           seconds = "0" + seconds;
      }

      return minutes + "-" + seconds;
 }

 function gameOver(){
      clearInterval(setintervalId);
      clearInterval(timerId);
      alert("GAME OVER");
 }

  render();

  timerId = setInterval(() => {
      time++;
      timeElement.innerText = formatTime(time);
  }, 1000);

  // **snake movement calculate** //
  setintervalId = setInterval(() =>{
  snake.forEach(segment => {
      blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
 });
 let head = null;
 if(direction === "right"){
      head = {x : snake[0].x , y: snake[0].y + 1};
 }else if(direction === "left"){
      head = {x : snake[0].x , y: snake[0].y-1};
 }else if(direction == "up"){
      head = { x: snake[0].x -1 , y : snake[0].y};
 }else{
      head = {x : snake[0].x+1 , y : snake[0].y};
 }

 let hitWall = head.x < 0 || head.x >= row || head.y < 0 || head.y >= col;
 let hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

 if(hitWall || hitSelf){
      render();
      gameOver();
      return;
 }

 snake.unshift(head);

 if(head.x === food.x  && head.y === food.y){
   blocks[`${food.x}-${food.y}`].classList.remove("food");

   let newFood = { x : Math.floor(Math.random()*row), y : Math.floor(Math.random()*col)};
   while(snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)){
        newFood = { x : Math.floor(Math.random()*row), y : Math.floor(Math.random()*col)};
   }
   food = newFood;

   score++;
   scoreElement.innerText = score;
   if(score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreElement.innerText = highScore;
   }
 }else{
 snake.pop();
 }

 render();
 },300)

 //** snake movement control with key**//
 addEventListener("keydown",(event) =>{
    if(event.key === "ArrowUp" && direction !== "down"){
      direction = "up";
    }else if(event.key === "ArrowDown" && direction !== "up"){
      direction = "down";
    }else if(event.key === "ArrowLeft" && direction !== "right"){
      direction = "left";
    }else if(event.key === "ArrowRight" && direction !== "left"){
      direction = "right";
    }
});