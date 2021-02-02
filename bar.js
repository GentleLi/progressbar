var ProgressBar = {

	hor_margin: 2,
	ver_margin: 8,
	MAX: 100,
	bar_state: states.idle,
	currProgress: 0,
	max_width: 300,

	init: function() {
		var _this = this
		var btnPlay = document.getElementById("btn_play")
		var btnRelay = document.getElementById("btn_replay")
		var btnForward = document.getElementById("btn_forward")
		var c = document.getElementById("canvas")
		var bar = document.getElementById("bar")
		// c.width = c.parentNode.width * 0.7
		console.log("bar : " + bar.offsetWidth)
		c.width = bar.offsetWidth - 120
		var ctx = c.getContext("2d")
		_this.max_width = c.width - 2 * _this.hor_margin
		//播放 or 暂停逻辑
		btnPlay.onclick = function() {
			if (_this.bar_state == states.idle) { //如果当前是闲置或者暂停状态
				_this.bar_state = states.play
				btnPlay.src = "http://127.0.0.1:8848/progressbar/img/pause.svg"
			} else if (_this.bar_state == states.play) { //如果当前是闲置状态
				_this.bar_state = states.idle
				btnPlay.src = "http://127.0.0.1:8848/progressbar/img/play.svg"
			} else { //如果是快进状态，也设置为暂停
				_this.bar_state = states.play
				btnPlay.src = "http://127.0.0.1:8848/progressbar/img/pause.svg"
			}
			_this.setProgress(_this.currProgress)
		}
		//重新播放
		btnRelay.onclick = function() {
			_this.setProgress(0)
		}
		//快进逻辑
		btnForward.onclick = function() {

		}
		//捕获鼠标事件，实现拖动功能
		c.onmousedown = function(ev) {
			//event的兼容性
			var ev = ev || event;
			//获取鼠标按下的坐标
			var x1 = ev.clientX;
			var y1 = ev.clientY;
			//获取元素的left，top值
			var l = c.offsetLeft + bar.offsetLeft;
			var t = c.offsetTop + bar.offsetTop;

			console.log("l : " + l + " t : " + t)
			//给可视区域添加鼠标的移动事件
			document.onmousemove = function(ev) {
				//event的兼容性
				var ev = ev || event;
				//获取鼠标移动时的坐标
				var x2 = ev.clientX - l;
				var y2 = ev.clientY - t;
				if (x2 >= 0 && x2 <= c.width && y2 > 0 && y2 < c.height) {
					_this.currProgress = (x2 - _this.hor_margin) * _this.MAX / _this.max_width
					_this.onDraw(x2)
				}
			}
			//清除
			document.onmouseup = function(ev) {
				//event的兼容性
				var ev = ev || event;
				//获取鼠标移动时的坐标
				var x2 = ev.clientX - l;
				var y2 = ev.clientY - t;
				console.log("onmouseup  x2 : " + x2 + " y2 : " + y2)
				if (x2 >= 0 && x2 <= c.width && y2 > 0 && y2 < c.height) {
					_this.currProgress = (x2 - _this.hor_margin) * _this.MAX / _this.max_width
					_this.onDraw(x2)
				}
				document.onmousemove = null;
			}
		}
		//初始化进度条
		_this.onDraw(0)
		return _this
	},
	//进度条初始化;
	// init()
	onDraw: function(x) {

		console.log("onDraw x : " + x)
		var _this = this
		var c = document.getElementById("canvas")
		var ctx = c.getContext("2d")
		ctx.lineCap = 'round'
		ctx.fillStyle = "#aa55ff"
		ctx.fillRect(0, 0, c.width, c.height)
		ctx.fillStyle = "#aaaa7f";
		ctx.fillRect(_this.hor_margin, _this.ver_margin, c.width - 2 * _this.hor_margin, c.height - 2 * _this.ver_margin) //绘制点
		_this.progressWidth = x - _this.hor_margin
		ctx.fillStyle = "#0F0";
		ctx.fillRect(_this.hor_margin, _this.ver_margin, _this.progressWidth, c.height - 2 * _this.ver_margin) //绘制点
		//绘制圆点
		ctx.fillStyle = "#ff55ff";
		ctx.beginPath();
		ctx.arc(x, c.height / 2, (c.height - 2 * _this.ver_margin) / 2 + 5, 0, 2 * Math.PI);
		ctx.fill();
	},

	setProgress: function(progress) {
		var _this = this
		if (progress > _this.MAX) {
			progress = _this.MAX
		} else if (progress < 0) {
			progress = 0
		}
		console.log("progress : " + progress)
		_this.currProgress = progress
		//计算实际的x坐标
		var progressWidth = _this.currProgress * _this.max_width / _this.MAX
		_this.onDraw(progressWidth + _this.hor_margin)
	}

}
