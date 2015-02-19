$(function() {
	initPage();
	$('.start-btn').on('click', function() {
		startClimb();
		$('.start-btn').fadeOut(1500);
	});
});

var sections = 0;
initPage = function() {
	$.getJSON('data/load.json').done(function(data) {
		awardImg = data['award-img'];
		flagCount = data['flag-count'];
		if(flagCount > 3) flagCount = parseInt(flagCount) + 1;
		sections = flagCount * 2;
		buildGround(sections + 1);
		$('.badge img').attr('src', awardImg);
	});
}

buildGround = function(count) {
	var isFlag = false;
	var topVal = 0;
	var leftVal = 0;
	var bottomVal = -200;
	for(var i=0; i < count; i++) {
		$('.wrapper').append('<div class="ground" id="ground'+i+'" style="top:'+topVal+'px; left:'+leftVal+'px;"></div>');
		$('.wrapper').append('<div class="trees" id="trees'+i+'" style="bottom:'+bottomVal+'px; left:'+leftVal+'px;"></div>');
		if(isFlag) {
			$('#ground'+i).append('<div class="flag" id="flag'+i+'" style="top:375px; left:350px;" />');
			isFlag = false;
		}
		else {
			isFlag = true;
		}
		topVal = topVal - 355;
		bottomVal = bottomVal + 355;
		leftVal = leftVal + 700;
	}
}

var startClimb = function() {
	$('.the-dude').animate({
		top: '-=120px',
		left: '+=250px'		
	}, 3500, 'linear', function() {
		animateGround();

		if(sections >= 4) {
			setTimeout(function() {
				boulderSeq();
			}, 11000);
		}
		
		if(sections >= 6) {
			setTimeout(function() {
				goatSeq();
			}, 26000);
		}
		
		if(sections  >= 10) {
			setTimeout(function() {
				eagleSeq();
			}, 48500); //48500
		}
	});
	setTimeout(function() {
		stopAnimateGround();
		showAward();
	}, (sections * 7000) - 1000);
}

var sectionCount = 0;
animateGround = function() {
	var left = 700 * sections;
	var top = 355 * sections;
	var time = 7000 * sections;
	$('.ground').animate({
		top: '+='+top+'px',
		left: '-='+left+'px'
	}, time, 'linear', function() {
	});
	
	$('.trees').animate({
		bottom: '-='+top+'px',
		left: '-='+left+'px'
	}, time, 'linear', function() {
	});
	
	setInterval(function() {
		var wrapperLeft = $('.wrapper').offset().left;
		var flag1 = $('#flag1').offset().left - wrapperLeft;
		if(flag1 > 300) {
			if(flag1 <= 350) {
			//	triggerFlag(100, 1);
			}
		}
		var flag3 = $('#flag3').offset().left - wrapperLeft;
		if(flag3 > 300) {
			if(flag3 <= 350) {
			//	triggerFlag(200, 3);
			}
		}
		var flag5 = $('#flag5').offset().left - wrapperLeft;
		if(flag5 > 300) {
			if(flag5 <= 350) {
			//	triggerFlag(300, 5);
			}
		}
		var flag9 = $('#flag9').offset().left - wrapperLeft;
		if(flag9> 300) {
			if(flag9 <= 350) {
			//	triggerFlag(400, 9);
			}
		}
	}, 250);
}

stopAnimateGround = function() {
	$('.ground').stop();
	$('.trees').stop();
}

startAnimateGround = function() {
	animateGround();
}

jump = function() {
	$('.the-dude').animate({
		top: '-=200px'
	}, 1500, function() {
		$('.the-dude').animate({
			top: '+=200px'
			}, 1500);
	});
}

boulderSeq = function() {
	$('.wrapper').append('<div class="boulder" style="top:255px; left:700px;"></div>');
	setFrown();
	jump();
	var angle = 0;
	setInterval(function(){
		 angle-=3;
		 $(".boulder").rotate(angle);
	},30);
	$('.boulder').animate({
		top: '+=395px',
		left: '-=820px'		
	}, 4000, 'linear', function() {
		setSmile();
	});
}

goatSeq = function() {
	$('.wrapper').append('<div class="ram" style="top:625px; left:-200px;"></div>');
	setFrown();
	jump();
	$('.ram').animate({
		top: '-=375px',
		left: '+=920px'		
	}, 3000, 'linear', function() {
		setSmile();
	});
}

eagleSeq = function() {
$('.wrapper').append('<div class="eagle" style="top:0; left:0;"></div>');
	setFrown();
	stopAnimateGround();
	var bezier_params = {
		start: { 
		  x: 350, 
		  y: -300
		},  
		end: { 
		  x:200,
		  y:-300, 
		  angle: 75, 
		  length: 7.00
		}
	 }
	 setTimeout(function() {
		$('#flag7').hide();
		$('.eagle').css('background-image', 'url(../images/mountain-climber/eagle-flag.png)');
	 },1200);
	$('.eagle').animate({path : new $.path.bezier(bezier_params)}, 2000, 'linear', function() {
		startAnimateGround();
		setSmile();
	});
}

setFrown = function() {
	$('.the-dude').css('background-image', 'url(../images/mountain-climber/the-dude-frown.png)');
}

setSmile = function() {
	$('.the-dude').css('background-image', 'url(../images/mountain-climber/the-dude.png)');
}

triggerFlag = function(value, flagid) {
	$('#flag'+flagid).after('<div class="award">+ '+value+'</div>');
}

showAward = function() {
	$('.badge').fadeIn();
}


