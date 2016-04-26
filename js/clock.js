var widthOfCanvas = 1000;
var heightOfCanvas = 500;
var radius = 6;
var startTop = 150;
var startLeft = 70;
var curDate = new Date();
var balls = new Array();
var colors = ['red','blue','#f0f','green','#0ff'];
window.onload = function () {
	var canvas = document.getElementById('can');
	widthOfCanvas = document.body.clientWidth;
	canvas.height = heightOfCanvas;
	startLeft = Math.round(widthOfCanvas/5)
	context = canvas.getContext("2d");	
	curDate = getTime();
	setInterval(function(){
		clockSet();
		update();
	},50);
}
//画单个小球
function drawSingleNum(num,startX,startY,context){	
	context.fillStyle = '#099';
	for (var i = 0; i < digit[num].length; i++) {
		for (var  j = 0;  j< digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				context.beginPath();
				context.arc(startX + j*2*(radius+1)+radius+1 ,startY+i*2*(radius+1)+radius+1 , radius ,0, 2*Math.PI);
				context.closePath();
				context.fill();
			}
		}	
	}
}
//获取当前时间
function getTime() {
	var date =  new Date();
	return date;
}
//根据时间控制小球们的绘制
function update() {
	var nextDate = getTime();

	var nextHour = nextDate.getHours();
	var nextMinute = nextDate.getMinutes();
	var nextSecond = nextDate.getSeconds();

	var curHour = curDate.getHours();
	var curMinute = curDate.getMinutes();
	var curSecond = curDate.getSeconds();

	if (nextSecond != curSecond) {
		curDate = nextDate;

		if (nextSecond%10 != curSecond%10) {
			addBall(curSecond%10,startLeft + 50*(radius+1)*2,startTop);
		}
		if (parseInt(nextSecond/10) != parseInt(curSecond/10)) {
			addBall(parseInt(curSecond/10),startLeft + 42*(radius+1)*2,startTop);
		}
		if (parseInt(nextMinute%10) != parseInt(curMinute%10)) {
			addBall(parseInt(curSecond%10),startLeft + 29*(radius+1)*2,startTop);
		}
		if (parseInt(nextMinute/10) != parseInt(curMinute/10)) {
			addBall(parseInt(curSecond/10),startLeft + 21*(radius+1)*2,startTop);
		}
		if (parseInt(nextHour%10) != parseInt(curHour%10)) {
			addBall(parseInt(curHour%10),startLeft + 8*(radius+1)*2,startTop);
		}
		if (parseInt(nextHour/10) != parseInt(curHour/10)) {
			addBall(parseInt(curHour/10),startLeft + 0,startTop);
		}
	}

	updateBall();
}
//改变小球的位置
function updateBall() {
	var countOfInside = 0;//小球必然运动出去，运动出去之后将其放回数组最前面，把超出限制数量的球pop掉，用于性能优化
	for (var i = 0; i < balls.length; i++) {
		balls[i].x+=balls[i].vx;
		balls[i].y+=Math.floor(balls[i].vy);
		balls[i].vy+=balls[i].g;

		if (balls[i].y > heightOfCanvas-balls[i].r) {

			balls[i].y = heightOfCanvas-balls[i].r;
			balls[i].vy *= -0.6;			
			balls[i].vx *= 0.9;
			balls[i].vx = Math.round(balls[i].vx);
		}
	}
	/*性能优化*/
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].y - balls[i].r > 0 ) {
			balls[countOfInside++] = balls[i];
		}
	}
	while(balls.length > countOfInside){//Math.min(300,countOfInside)这种方法只会更新秒的数字？？？
		balls.pop();
	}
}
//添加小球
function addBall(num,startX,startY) {
	for (var i = 0; i < digit[num].length; i++) {
		for (var  j = 0;  j< digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				var aBall = {
					x:startX + j*2*(radius+1)+radius+1,
					y:startY+i*2*(radius+1)+radius+1,
					vx: Math.pow(-1, Math.floor(Math.random()*10) )*Math.floor(Math.random()*5+1),
					vy: Math.pow(-1, Math.floor(Math.random()*10) )*6,
					g:-3,
					r:radius
				};

				balls.push(aBall);
			}
		}	
	}
}
//改变数字状态
function clockSet() {

	var hour = curDate.getHours();
	var minute = curDate.getMinutes();
	var second = curDate.getSeconds();
 	context.clearRect(0,0,widthOfCanvas,heightOfCanvas);

	drawSingleNum(parseInt(hour/10),startLeft + 0,startTop,context);
	drawSingleNum(hour%10,startLeft + 8*(radius+1)*2,startTop,context);
	drawSingleNum(10,startLeft + 16*(radius+1)*2,startTop,context);
	drawSingleNum(parseInt(minute/10),startLeft + 21*(radius+1)*2,startTop,context);
	drawSingleNum(minute%10,startLeft + 29*(radius+1)*2,startTop,context);
	drawSingleNum(10,startLeft + 37*(radius+1)*2,startTop,context);
	drawSingleNum(parseInt(second/10),startLeft + 42*(radius+1)*2,startTop,context);
	drawSingleNum(second%10,startLeft + 50*(radius+1)*2,startTop,context);


	for (var i = 0; i < balls.length; i++) {
		context.beginPath();
		context.fillStyle = colors[Math.floor(Math.random()*colors.length)];
		context.arc(balls[i].x,balls[i].y,radius,0,Math.PI * 2);
		context.closePath();
		context.fill();
	}
}