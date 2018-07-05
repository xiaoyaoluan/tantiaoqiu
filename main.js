window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

// setup canvas

var canvas = document.querySelector('canvas');
var p = document.querySelector('p');
var ctx = canvas.getContext('2d');
var ballcount = 0;
var pattern = 0;
var m = 0;
var ballsnum = 20;
var end;
var endcontrol = 0;

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// 产生随机整数
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, exsit, velx, vely){
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.exsit = exsit;   //Shape (x, y, velx , velx, exsit)  EvilCicle(x, y, exsit, velx, vely,size, color) 将EvilCicle的参数传入
}                         //此时的EvilCicle的实例的this.exsit = undefined

function Ball(x, y, exsit, velx, vely,  size, color){
    Shape.call(this, x, y, exsit, velx, vely);
    this.size = size;
    this.color = color;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

function EvilCicle(x, y, exsit, velx, vely,size, color){
    Shape.call(this, x, y, exsit);
    this.velx = velx;
    this.vely = vely;
    this.size = size;
    this.color = color;
}

EvilCicle.prototype = Object.create(Shape.prototype);
EvilCicle.prototype.constructor = EvilCicle;

Ball.prototype.draw = function (){
    if(this.exsit === true){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, 0)
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

Ball.prototype.update = function (){
    if(this.exsit === true){
        //防止小球不动，没有vely增量
        if(this.velx === 0){
            this.velx = 5;
        }
        if((this.x + this.size) >= width){
            //防止在if条件成立下，初始化时velx < 0 导致小球的x只有两个值 做直线运动
            if(this.velx > 0){
                this.velx = -(this.velx);
            }
        }
        if((this.x - this.size) <= 0){
            //防止在if条件成立下，初始化时velx > 0 导致小球的x只有两个值 做直线运动
            if(this.velx < 0){
                this.velx = -(this.velx);            
            }
        }
        if(this.vely === 0){
            this.vely = 5;
        }
        if((this.y + this.size) >= height){
            if(this.vely > 0){
                this.vely = -(this.vely);
            }
        }
        if((this.y - this.size) <= 0){
            if(this.vely < 0){
                this.vely = -(this.vely);
            }
        }
        this.x += this.velx;
        this.y += this.vely;
    }
}

Ball.prototype.collisionDetect = function (){
    if(this.exsit === true){    //两个小球实际未碰撞时也变色  少了balls[j].exsit === true 判断语句
        for (var j = 0; j < balls.length; j++){
            if(this.x !== balls[j].x && balls[j].exsit === true){
                var dx = Math.abs(this.x - balls[j].x);
                var dy = Math.abs(this.y - balls[j].y);
                var distance = Math.sqrt(dx * dx + dy * dy);
                var dz = this.size + balls[j].size;
                if(distance <= dz ){
                    this.color = 'rgb('+ random(0, 255) +','+ random(0, 255) +','+ random(0, 255) +')';
                    balls[j].color = 'rgb('+ random(0, 255) +','+ random(0, 255) +','+ random(0, 255) +')'; 
                }
            }
        }
    }

}

EvilCicle.prototype.draw = function (){
    ctx.beginPath();
    linewidth = 5;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, 0)
    ctx.strokeStyle = this.color;
    ctx.stroke();
}

EvilCicle.prototype.checkBounds = function (){
    if((this.x + this.size) >= width){         //碰到边界时略微回弹
        //this.velx = -(this.velx);
        this.x = width - this.size;
    }
    if((this.x - this.size) <= 0){
        //this.velx = -(this.velx);
        this.x = this.size;
    }
    if((this.y + this.size) >= height){
        //this.vely = -(this.vely);
        this.y = height - this.size;
    }
    if((this.y - this.size) <= 0){
        //this.vely = -(this.vely);
        this.y = this.size;
    }

}

EvilCicle.prototype.setControls = function (){
    var _this = this;           // var _this = this  与  var that = {}  that.x = this.y that.y = this.y 
    //var _this = {};           // that.velx = this.velx  that.vely = this.vely 语句的区别
    //_this.x = this.x;         //每次运行loop(),that.x都被初始化为this.x 而this.x不会变化  不会动态变化
   // _this.y = this.y;         // _this = this 会动态变化 why?
   // _this.velx = this.velx;
   // _this.vely = this.vely;
    function keyDown(e){
        var currKey=0,e=e||event;  
        currKey=e.keyCode||e.which||e.charCode;
        if (currKey === 38){
            _this.y -= _this.vely;
            //that.y -= that.vely;
            console.log(_this.y)
        }
        if (currKey === 39){
            _this.x += _this.velx;
            //that.x += that.velx;
        }
        if (currKey === 40){
            _this.y += _this.vely;
            //that.y += that.vely;
        }
        if (currKey === 37){
            _this.x -= _this.velx;
            //that.x -= that.velx;
        }
    }
    window.onkeydown = keyDown; //document.onkeydown 与 window.onkeydown 的区别
    
}

EvilCicle.prototype.collisionDetect = function (){
    for(var j = 0; j < balls.length; j++){
        if(balls[j].exsit === true){
            var dx = Math.abs(this.x - balls[j].x);
            var dy = Math.abs(this.y - balls[j].y);
            var distance = Math.sqrt(dx * dx + dy * dy);
            var dmax = Math.max(this.size, balls[j].size);
            var dmin1 = Math.min(this.size, balls[j].size);
            var dmin2 = Math.abs(this.size - balls[j].size);//最难 distance === 0  //
            switch (pattern){
                case 1 :
                if (distance <= dmin1){
                    balls[j].exsit = false;
                    ballcount--;
                    endcontrol++;
                }
                break;
                case 2 :
                if (distance <= dmin2){
                    balls[j].exsit = false;
                    ballcount--;
                    endcontrol++;  
                }
                break;
                case 3 :
                if (distance <= 3){
                    balls[j].exsit = false;
                    ballcount--;
                    endcontrol++;                   
                }
                break;
                default:
                if (distance <= dmax){
                    balls[j].exsit = false;
                    ballcount--;
                    endcontrol++;
                }; 
              //balls.splice(j, 1);
              //ballsnum--;
            }
        }

    }
}

var balls = [];
//var ballsnum = 20;
//var evilcicles = [];
evilcicle = new EvilCicle(100, 100, true, 20, 20, 10, 'white');

function loop(){
    ctx.fillStyle = 'rgba(0, 0 ,0 ,0.25)';
    ctx.fillRect(0, 0, width, height);
    //evilcicle = new EvilCicle(100, 100, true, 20, 20, 10, 'white'); //每次都loop()都新建一个实例并将参数初始化
    //while(evilcicles.length < 1){
        //evilcicle = new EvilCicle(100, 100, true, 20, 20, 10, 'white');
        //evilcicles.push(evilcicle);
    //}
    //evilcicles[0].draw();
    //evilcicles[0].setControls();  //与现阶段等价
    p.innerHTML = 'Ball count: ' + ballcount ;
    p.style.color = 'white';
    evilcicle.draw();
    evilcicle.checkBounds();
//有可能velx和vely都为0 那么有小球不动，或者velx or vely 为 0 则其沿直线运动  
//在生产Ball的实例时 if x - size or y - size 小于0 且vely 大于0 则小球的 x or y 值在两个值中间循环 小球看起来沿直线运动
//在生产Ball的实例时 if x + size or y + size 大于width or height 且vely 小于0 则小球的 x or y 值在两个值中间循环 小球看起来沿直线运动
    while(balls.length < ballsnum ){  //ballsnum
        //另一种传入方式
        //var ball = new Ball(
        //Math.floor(Math.random()*width),
        //Math.floor(Math.random()*height),
        //Math.floor(Math.random()*14 - 7),
        //Math.floor(Math.random()*14 - 7),
        //Math.floor(Math.random()*20 + 10),
        //'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +', '+ Math.floor(Math.random()*255) +' )'
        //);
        var ball = new Ball(
            random(0, width),
            random(0, height),
            true,
            random(-7, 7),
            random(-7, 7),
            random(10, 20),
            'rgb('+ random(0, 255) +','+ random(0, 255) +','+ random(0, 255) +')'
        );
        ballcount++;
        balls.push(ball);
    }
    evilcicle.collisionDetect();
    for (var i = 0;i < balls.length;i++){
        balls[i].update();
        balls[i].draw();
        balls[i].collisionDetect();
    }
    end = requestAnimationFrame(loop);
}

var start = document.querySelectorAll('button');
(function mainPage(){
    start[0].addEventListener('click', Startgame, false);
    start[1].addEventListener('click', difficulty, false);
    for(var key of start){
        if(key.id !== 'bt1' && key.id !=='bt2'){
            key.disabled = true;
            key.style.opacity = '0';
        } else{
            key.disabled = false;
            key.style.opacity = '1';
        }
    };
    function Startgame(){
        for(var key of start){
            key.disabled = true;
            key.style.opacity = '0';
        }
        evilcicle.setControls();
        loop();
    };
 
    function difficulty (){
        for(var key of start){
            if(key.id !== 'bt1' && key.id !== 'bt2'){
                key.disabled = false;
                key.style.opacity = '1';
                if (m < 4 ){
                    switch (key.id){
                        case 'bt3' :
                        key.addEventListener('click', function(){ pattern = 1;Startgame();},false)
                        break;
                        case 'bt4' :
                        key.addEventListener('click', function(){ pattern = 2;Startgame();},false)
                        break;
                        case 'bt5' :
                        key.addEventListener('click', function(){ pattern = 3;Startgame();},false)
                        break;
                        case 'bt6' :
                        key.addEventListener('click', returnmainPage, false);
                        break;
                        default : ;
                    }
                    m++;
                }
            }else{
                key.disabled = true;
                key.style.opacity = '0';
            }
        }
    };
    function returnmainPage (){
        for(var key of start){
            if(key.id !== 'bt1' && key.id !=='bt2'){
                key.disabled = true;
                key.style.opacity = '0';
            } else{
                key.disabled = false;
                key.style.opacity = '1';
            }
        };
    }
})();
window.addEventListener('click',function (){
    if(endcontrol === ballsnum){
        endgame();
        endcontrol = 0;
    }}, false);
function endgame(){
      window.cancelAnimationFrame(end);
      ctx.clearRect(0, 0, width, height);
       balls = [];
       ballcount = 0;
       ballsnum  = 20;
      for(var key of start){
        if(key.id !== 'bt1' && key.id !=='bt2'){
            key.disabled = true;
            key.style.opacity = '0';
        } else{
            key.disabled = false;
            key.style.opacity = '1';
        }
    }
}
