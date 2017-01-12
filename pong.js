var width = 700;
var height = 600;
var pi = Math.PI;
var UpArrow = 38;
var DownArrow = 40;
var turn = 1;
var start = false;
var pause = false;
var wins = 0;
var loss = 0;

var player = {
    x:null,
    y:null,
    width: 20,
    height: 100,

    update: function(){
        if (keystate[UpArrow]) this.y -= 7;
        if (keystate[DownArrow]) this.y += 7;
     
    },
    draw: function(){
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
};
var ball = {
    x:null,
    y:null,
    val:null,
    side: 20,
    speed: 5,
    serve: function(side){
        var r = Math.random();
        this.x = side === 1 ? player.x : ai.x - this.side;
        this.y = (height - this.side)*r;
        var reflect = 0.1 *pi*(1-2 * r);
        this.val = {
            x: side*this.speed*Math.cos(reflect),
            y: this.speed*Math.sin(reflect),
        }
    },
    update: function(){
        this.x += this.val.x;
        this.y += this.val.y;

        if ( 0 > this.y || this.y + this.side > height ){
            var offset = this.val.y < 0 ? 0 - this.y : height - (this.y+this.side);
            this.y += 2*offset;
            this.val.y *= -1;
        }
        var intersect = function(ax,ay,aw,ah,bx,by,bw,bh){
            return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
        };
        var pdle = this.val.x < 0 ? player : ai;
        if (
            intersect(pdle.x, pdle.y, pdle.width, pdle.height, 
            this.x, this.y, this.side, this.side)
            )
        {
            this.x = pdle === player ? player.x + player.width : ai.x - this.side;
            var angle = (this.y + this.side - pdle.y)/(pdle.height + this.side);
            var reflect = 0.25*pi*(2*angle - 1);

            var smash = Math.abs(reflect) > 0.2*pi ? 1.5 : 1 ;
            this.val.x = smash*(pdle === player ? 1 : -1)* this.speed*Math.cos(reflect);
            this.val.y = smash*this.speed*Math.sin(reflect)
        }

        if (0 > this.x + this.side){
            turn = -1;
            loss += 1;
            document.getElementById("com").innerHTML = loss;
            init();
            
        }
        if (this.x > width){
            turn = 1;
            wins += 1;
            document.getElementById("player").innerHTML = wins;
            init();
            
        }

    },
    draw: function(){
        ctx.fillRect(this.x,this.y,this.side,this.side);
    }
};
var ai = {
    x:null,
    y:null,
    width: 20,
    height: 100,

    update: function(){
        var desty = ball.y - (this.height - ball.side)*0.5;
        this.y += (desty - this.y) * 0.05;
    },
    draw: function(){
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
};


function main(){
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    keystate = {};
    
        document.addEventListener("keydown",function(evt){
            keystate[evt.keyCode] = true;
            
        });

        document.addEventListener("keyup",function(evt){
            delete keystate[evt.keyCode];
        });
    

    init();
    
    var loop = function(){
        draw();
        if (start) update();
        window.requestAnimationFrame(loop,canvas);
        
    };
    window.requestAnimationFrame(loop,canvas);
}

function init(){
    player.x = player.width;
    player.y = (height - player.height)/2;

    ai.x = width - (player.width + ai.width);
    ai.y = (height - ai.height)/2;

    ball.x = (width - ball.side)/2;
    ball.y = (height - ball.side)/2;
    ball.serve(turn)
    


}

function update(){
    player.update();
    ball.update();
    ai.update();

}

function draw(){
    ctx.fillRect(0,0,width,height);

    ctx.save();

    ctx.fillStyle = "#fff";
    player.draw();
    ball.draw();
    ai.draw();

    var w = 4;
    var x = (width - w)*0.5;
    var y = 0;
    var step = height/20;
    while(y < height){
        ctx.fillRect(x,y + step*0.25,w,step*0.5);
        y+=step;
    }

    ctx.restore();

 

}
function dub(){
    if(!start)start = true;
    else start = false;
}
main();
