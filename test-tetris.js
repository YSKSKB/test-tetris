const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const ROW = 20;
const COL = 10;
const VACANT = "WHITE";


function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*30,y*30,30,30);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*30,y*30,30,30);
}

let matrix = [];
for( r = 0; r <ROW; r++){
    matrix[r] = [];
    for(c = 0; c < COL; c++){
        matrix[r][c] = VACANT;
    }
}

function drawMatrix(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,matrix[r][c]);
        }
    }
}

drawMatrix();

const I = [
	[
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	[
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
		[0, 0, 1, 0],
	],
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
	],
	[
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
	]
];

const J = [
	[
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 1],
		[0, 1, 0],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 0]
	]
];

const L = [
	[
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[1, 0, 0]
	],
	[
		[1, 1, 0],
		[0, 1, 0],
		[0, 1, 0]
	]
];

const O = [
	[
		[0, 0, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0],
	]
];

const S = [
	[
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 0, 1]
	],
	[
		[0, 0, 0],
		[0, 1, 1],
		[1, 1, 0]
	],
	[
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const T = [
	[
		[0, 1, 0],
		[1, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 1, 0],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[0, 1, 0]
	]
];

const Z = [
	[
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0]
	],
	[
		[0, 0, 1],
		[0, 1, 1],
		[0, 1, 0]
	],
	[
		[0, 0, 0],
		[1, 1, 0],
		[0, 1, 1]
	],
	[
		[0, 1, 0],
		[1, 1, 0],
		[1, 0, 0]
	]
];

const pieces = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

function randomPiece(){
    let r = randomNumber = Math.floor(Math.random() * pieces.length)
    return new piece( pieces[r][0],pieces[r][1]);
}

let p = randomPiece();

function piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 4;
    this.y = -2;
}

piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

piece.prototype.draw = function(){
    this.fill(this.color);
}

piece.prototype.erase = function(){
    this.fill(VACANT);
}

piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.erase();
        this.y++;
        this.draw();
    }else{
        this.lock();
        p = randomPiece();
    }
    
}

piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.erase();
        this.x++;
        this.draw();
    }
}

piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.erase();
        this.x--;
        this.draw();
    }
}

piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let wallKick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            wallKick = -1;
        }else{
            wallKick = 1;
        }
    }
    
    if(!this.collision(wallKick,0,nextPattern)){
        this.erase();
        this.x += wallKick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            if( !this.activeTetromino[r][c]){
                continue;
            }
            if(this.y + r < 0){
                alert("Game Over");
                gameOver = true;
                break;
            }
            matrix[this.y+r][this.x+c] = this.color;
        }
    }

    for(r = 0; r < ROW; r++){
        let FulledRow = true;
        for( c = 0; c < COL; c++){
            FulledRow = FulledRow && (matrix[r][c] != VACANT);
        }
        if(FulledRow){
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    matrix[y][c] = matrix[y-1][c];
                }
            }
            for( c = 0; c < COL; c++){
                matrix[0][c] = VACANT;
            }

            score += 10;
        }
    }
    drawMatrix();

    scoreElement.innerHTML = score;
}

piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            if(!piece[r][c]){
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            if(newY < 0){
                continue;
            }
            if( matrix[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

document.addEventListener("keydown",CONTROL);
function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let dropRate = now - dropStart;
    if(dropRate > 800){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();
