$(function(){
	
//	node.insertBefore(newnode,existingnode)
//	newnode Node 对象 必需。需要插入的节点对象。
//	prepend()
	// 获取事件对象
	var getEvent = function ( event ) {
		// 标准浏览器返回event，IE下window.event
		return event || window.event;
	}
	var preventDefault = function ( event ) {
		var event = getEvent( event );
		// 标准浏览器
		if ( event.preventDefault ) {
			event.preventDefault();
		// IE浏览器
		} else {
			event.returnValue = false;
		}
	}
	
	// 阻止浏览器默认行为 --- 图片拖动
	$('img').on('mousedown', function(e){
		preventDefault(e);
	})
	
	let startX = 0;                             // 初始鼠标位置
	let moveX = 0;                              // 移动中鼠标位置
	let index = 1;                				// 当前图片index
	let dragState = false;                      // 拖拽状态， 为true拖拽中
	let clickState = true;                     // 是否触发点击,为true, 可以触发点击事件
	let deviationX = 0;                        // 鼠标偏移量
	let scroll = 0;                            // 当前滚动量
	let squareIndex = 0;							   // 当前圆点的index
	let WIDTH = $(".slider-img").width();      // 一个图片的宽度
	let parentBox = $("#sliderBox");
	let sliderChildren = $(".slider-img");
	let pointChildren = $(".point");
	
	parentBox.append(sliderChildren.first().clone(true)).prepend(sliderChildren.last().clone(true));
	parentBox.css({"transform":"translateX(-"+ WIDTH +"px)", "transition-duration":"0s"}); // 默认显示第一张
	
	// 鼠标按下
	parentBox.on("mousedown", function(e) {
		if(e.target.tagName === 'IMG' && e.button === 0) {
			dragState = true;
			clickState = true;
			deviationX = 0;
			startX = e.pageX;
			const str = e.currentTarget.style.transform.replace(/[^0-9]/ig,"");
			scroll = parseInt(str);
			if ( scroll === WIDTH * ( parentBox.children().length - 1 ) ) {
				index = 1;
				parentBox.css({"transform":"translateX(-"+ WIDTH +"px)", "transition-duration":"0s"});
				scroll = WIDTH;
			}
			if ( scroll === 0 ) {
				index = sliderChildren.length;
				squareIndex = pointChildren.length - 1;
				parentBox.css({"transform":"translateX(-"+ WIDTH * sliderChildren.length +"px)", "transition-duration":"0s"});
				scroll = WIDTH * sliderChildren.length;
			}
		}
	});
	
	// 鼠标移动
	parentBox.on("mousemove", function(e) {
		if (dragState) {
			clickState = false;
			moveX = e.pageX;
			deviationX = startX - moveX;
			parentBox.css({"transform":"translateX(-"+ ( scroll + deviationX ) +"px)", "transition-duration":"0s"});
		}
	});
	
	// 鼠标移开
	parentBox.on("mouseleave", function(e) {
		if(dragState) {
			clickState = true;
			dragState = false;
			deviationX > 0 ? index++ && squareIndex++ : index-- && squareIndex--;
			if(squareIndex < 0) {
				squareIndex = pointChildren.length - 1;
			}else if (squareIndex > pointChildren.length - 1) {
				squareIndex = 0;
			}
			parentBox.css({"transform":"translateX(-"+ ( WIDTH * index ) +"px)", "transition-duration":"0.3s"});
			pointChildren.removeClass("current").eq(squareIndex).addClass("current");
		}
	});
	
	// 鼠标松开
	parentBox.on("mouseup", function(e) {
		dragState = false;
		if (clickState && e.button === 0) {
			console.log("点击了");
		}else if ( !clickState && e.button === 0 ) {
			if (Math.abs(deviationX) > WIDTH / 6) {
				deviationX > 0 ? index++ && squareIndex++ : index-- && squareIndex--;
				if(squareIndex < 0) {
					squareIndex = pointChildren.length - 1;
				}else if (squareIndex > pointChildren.length - 1) {
					squareIndex = 0;
				}
			}
			parentBox.css({"transform":"translateX(-"+ ( WIDTH * index ) +"px)", "transition-duration":"0.3s"});
			pointChildren.removeClass("current").eq(squareIndex).addClass("current");
		}
	});
	
	// 轮播图自动播放
	function autoSlider() {
		if( index < parentBox.children().length - 1 ) {
			index++;
		}
		if ( squareIndex < pointChildren.length - 1 ) {
			squareIndex++;
		}else if( squareIndex === pointChildren.length - 1 ){
			squareIndex = 0;
		}
		parentBox.css({"transform":"translateX(-"+ ( WIDTH * index ) +"px)", "transition-duration":"0.3s"});
		pointChildren.removeClass("current").eq(squareIndex).addClass("current");
	};
	
	parentBox.bind("transitionend", function() {
		const autoStr = parentBox[0].style.transform.replace(/[^0-9]/ig,"");
		const autoScroll = parseInt(autoStr);
		if ( autoScroll === WIDTH * ( parentBox.children().length - 1 ) ) {
			index = 1;
			parentBox.css({"transform":"translateX(-"+ WIDTH +"px)", "transition-duration":"0s"});
		}
	});
	
	let timer = setInterval(function() {
		autoSlider();
	}, 3000);
	
	$(".box").hover(function() {
		if (timer) {
			clearInterval(timer);
		}
	}, function() {
		timer = setInterval(function() {
			autoSlider();
		}, 3000);
	});
	
	// 点击小圆点跳转
	$(document).on("click", ".point", function() {
		const clickIndex = $(this).index()
		squareIndex = clickIndex;
		index = clickIndex + 1;
		parentBox.css({"transform":"translateX(-"+ WIDTH * (clickIndex + 1) +"px)", "transition-duration":"0.3s"});
		pointChildren.removeClass("current").eq(clickIndex).addClass("current");
	});
	
	// 网页隐藏
	if(document.addEventListener){
		document.addEventListener('webkitvisibilitychange',function(){
			if( document.webkitVisibilityState === "hidden" ) {
				if(timer) {
					clearInterval(timer);
				}
			}else {
				timer = setInterval(function() {
					autoSlider();
				}, 3000);
			}
		
		});
	}
})
