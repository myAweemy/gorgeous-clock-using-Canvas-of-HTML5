var widthOfCanvas = 1000;
var heightOfCanvas = 450;
var radius = 6;
var startTop = 150;
var startLeft = 70;
var remainingSec = 0;
var endTime = new Date(2017,3,27,22,44,0);;//设置目标时间
var balls = new Array();
var colors = ['#C63A20','#794E7B','#f0f','#CCE83C','#0ff','#867969'];
var timeSetBtn = null, yearSetTxt = null;
var oDaysLeft = null,oDaysLeftData = null,oDaysLeftTip = null;
var headTxt = null;
window.onload = function () {
	widthOfCanvas = document.body.clientWidth;
	startLeft = Math.round(widthOfCanvas/5);
	var canvas = document.getElementById('can');
	canvas.width = widthOfCanvas;
	canvas.height = heightOfCanvas;
	context = canvas.getContext("2d");	

	headTxt = document.getElementById('headTxt');
	headTxt.innerHTML = '距离' + endTime.getFullYear() + '年' + (endTime.getMonth()+1) + '月' + 
		endTime.getDate() + '日'+ endTime.getHours() + '时' + endTime.getMinutes() + '分' + '还有：';
	timeSetBtn = document.getElementById('timeSet-btn');
	yearSetTxt = document.getElementById('yearSet');
	monthSetTxt = document.getElementById('monthSet');
	daySetTxt = document.getElementById('daySet');
	hourSetTxt = document.getElementById('hourSet');
	minuteSetTxt = document.getElementById('minuteSet');

	inputControl();//控制键盘的输入，除了数字、左右键、删除键之外都不能输入

	timeSetBtn.onclick = function(){
		var year = yearSetTxt.value;
		var month = monthSetTxt.value - 1;
		var day = daySetTxt.value;
		var hour = hourSetTxt.value;
		var minute = minuteSetTxt.value;
		//更新目标时间
		endTime = new Date(year,month,day,hour,minute,0);//设置目标时间
		headTxt.innerHTML = '距离' + endTime.getFullYear() + '年' + (endTime.getMonth()+1) + '月' + 
		endTime.getDate() + '日'+ endTime.getHours() + '时' + endTime.getMinutes() + '分' + '还有：';
	};

	remainingSec = getRemainingSec();
	//设置剩余的天数
	oDaysLeft = document.getElementById('days-left');
	oDaysLeft.style.top = startTop - oDaysLeft.offsetHeight + 100 + 'px';
	oDaysLeft.style.left = startLeft  + 'px';
	oDaysLeftData = document.getElementById('data');
	oDaysLeftTip = document.getElementById('tip');
	oDaysLeftData.innerHTML = Math.floor(remainingSec/86400);
	//控制每秒钟的数字改变
	setInterval(function(){
		clockSet();
		update();
	},40);
}
//绘制单个数字
function drawSingleNum(num,startX,startY,context){	
	context.fillStyle = '#0ff';
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
//获取剩余时间
function getRemainingSec() {
	var date =  new Date();
	var re = Math.round((endTime.getTime() - date.getTime())/1000);
	date = null;//手动回收
	return re>0?re:0;
}
//改变应该显示的时间
function update() {
	var nextRemainingSec = getRemainingSec();

	var nextDay = parseInt(nextRemainingSec/86400);
	var nextHour = parseInt((nextRemainingSec%86400)/3600);
	var nextMinute = parseInt((nextRemainingSec%3600)/60);
	var nextSecond = nextRemainingSec%60;

	var curDay = parseInt(remainingSec/86400);
	var curHour = parseInt((remainingSec%86400)/3600);
	var curMinute = parseInt((remainingSec%3600)/60);
	var curSecond = remainingSec%60;

	if (nextSecond != curSecond) {
		remainingSec = nextRemainingSec;

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
	var countOfInside = 0;//小球必然运动出去，运动出去之后将其放回数组最前面，把超出限制数量的球pop掉
	for (var i = 0; i < balls.length; i++) {
		balls[i].vy= (balls[i].vy>0)?Math.floor(balls[i].vy):Math.ceil(balls[i].vy);//vy用哪个取整方法由其是否大于零
		balls[i].vy+=balls[i].g;
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;

		if (balls[i].y > heightOfCanvas-balls[i].r) {

			balls[i].y = heightOfCanvas-balls[i].r;
			balls[i].vy *= -0.8;			
			balls[i].vx *= 0.9;
			balls[i].vx = Math.round(balls[i].vx);
		}
	}
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].x - balls[i].r > 0 && balls[i].x - balls[i].r < widthOfCanvas) {
			balls[countOfInside++] = balls[i];
		}
	}
	while(balls.length > countOfInside){//Math.min(300,countOfInside)这种方法只会更新秒的数字？？？
		balls.pop();
	}
}
//根据数字生成落下的小球们
function addBall(num,startX,startY) {
	for (var i = 0; i < digit[num].length; i++) {
		for (var  j = 0;  j< digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				var aBall = {
					x:startX + j*2*(radius+1)+radius+1,
					y:startY+i*2*(radius+1)+radius+1,
					vx: Math.pow(-1, Math.floor(Math.random()*10) )*Math.floor(Math.random()*5+1),
					vy: Math.pow(-1, Math.floor(Math.random()*10) )*6,
					g:3,
					r:radius
				};

				balls.push(aBall);
			}
		}	
	}//添加单个
}
//总的控制数字的形成
function clockSet() {

	var day = parseInt(remainingSec/86400);
    var hour = parseInt((remainingSec%86400)/3600);
	var minute = parseInt((remainingSec%3600)/60);
	var second = remainingSec%60;
	oDaysLeftData.innerHTML = day;
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

function inputControl() {//控制键盘的输入，除了数字、左右键、删除键之外都不能输入
	var aInputs = document.getElementsByTagName('input');

	for (var i = 0; i < aInputs.length; i++) {
		aInputs[i].onkeydown = function (ev) {
			var event = ev||event;
			if(!(event.keyCode>=48&&event.keyCode<=57) && event.keyCode != 8 &&event.keyCode!=37 &&event.keyCode!=39)
				return false;
		}
	}
}