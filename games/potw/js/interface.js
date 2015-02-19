// requestAnimationFrame polyfill
;(function(){var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame']}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall)},timeToCall);lastTime=currTime+timeToCall;return id};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(id){clearTimeout(id)}}());

// Balloon Pop button related variables
var $btnBalloonPop = $('#game-select-btn-balloon-pop'), // Balloon Pop button
    btnBalloonPopOver = false, // Needed to stop the cloud animation in the Balloon Pop button
    $btnBalloonBlue = $('#btn-title-balloon-blue'), // blue balloon
    $btnBalloonPink = $('#btn-title-balloon-pink'), // pink balloon
    $btnBalloonBurst = $('#btn-title-pop'), // balloon popped image
    $csf = $('#clouds-small-fore'), // front cloud layer
    $csb = $('#clouds-small-back'), // back cloud layer
    csfPos = 0, // front cloud layer left position
    csbPos = 0, // top cloud layer left position
    $pointerBP = $('#pointer-balloon-pop'), // Balloon Pop pointer
    $bPopBack = $('#balloon-pop-back'), // Back to game select text

// Plinko button related varables
    $btnPlinko = $('#game-select-btn-plinko'), // Plinko button
    $chipSmall = $('#btn-plinko-chip-small'), // Plinko chip that will animate
    $pointerPl = $('#pointer-plinko'), // Plinko Pointer
    $plinkoBack = $('#plinko-back'), // Back to game select text

// Big Prize Wheel button relate varables
    $btnPrizeWheel = $('#game-select-btn-prizewheel'), // Big Prize Wheel button
    $btnWheelTitle = $('#btn-prizewheel-title'), // Prize Wheel title graphic that will spin
    $pointerBPW = $('#pointer-prize-wheel'), // Big Prize Wheel Pointer
    $BPWBack = $('#prize-wheel-back'), // Back to game select text

// varable for the fading image rotation in the game description area
    $imgContentBalloon = $('#image-rotation-balloon img'), // the div that contains the images to rotate through
    imgIndexBalloon = 0, // keeps track of currently displayed image
    imgLengthBalloon = $imgContentBalloon.length, // number of images
    imgRotaterDelay = 3000, // delay between fades
    timerBalloon = '';

    $imgContentPlinko = $('#image-rotation-plinko img'), // the div that contains the images to rotate through
    imgIndexPlinko = 0, // keeps track of currently displayed image
    imgLengthPlinko = $imgContentPlinko.length, // number of images
    timerPlinko = '';
    
    $imgContentWheel = $('#image-rotation-wheel img'), // the div that contains the images to rotate through
    imgIndexWheel = 0, // keeps track of currently displayed image
    imgLengthWheel = $imgContentWheel.length, // number of images
    timerWheel = '';

// Misc varables
    $outer = $('#game-select-outer-container'),
    $pointerText = $('#game-select-pointers div p.p-text'),
    points = $('#prize-plays-amount').text(), // Holds the number of Prize Plays Points
    $prizePlaysAmount = $('#prize-plays-amount'),
    gameInfo = 'balloon-pop', // which info is currently displayed - 3 possible values: balloon-pop, plinko, prize-wheel
    bgAngle = 0; // used to rotate the background image

// hide game info layers
$('#plinko-info').hide();
$('#prize-wheel-info').hide();

// hide 'back to game selection' text
$bPopBack.hide();
$plinkoBack.hide();
$BPWBack.hide();



// Attach event listeners to buttons and associated pointers
function addBtnListeners() {
    $btnBalloonPop.on('mouseenter', btnBalloonPopEnter);
    $pointerBP.on('mouseenter', btnBalloonPopEnter);
    $btnBalloonPop.on('mouseleave', btnBalloonPopLeave);
    $pointerBP.on('mouseleave', btnBalloonPopLeave);
    $btnBalloonPop.on('click', slideInBalloon);
    $pointerBP.on('click', slideInBalloon);

    $btnPlinko.on('mouseenter', btnPlinkoEnter);
    $pointerPl.on('mouseenter', btnPlinkoEnter);
    $btnPlinko.on('mouseleave', btnPlinkoLeave);
    $pointerPl.on('mouseleave', btnPlinkoLeave);
    $btnPlinko.on('click', slideInPlinko);
    $pointerPl.on('click', slideInPlinko);

    $btnPrizeWheel.on('mouseenter', btnPrizeWheelEnter);
    $pointerBPW.on('mouseenter', btnPrizeWheelEnter);
    $btnPrizeWheel.on('mouseleave', btnPrizeWheelLeave);
    $pointerBPW.on('mouseleave', btnPrizeWheelLeave);
    $btnPrizeWheel.on('click', slideInBPW);
    $pointerBPW.on('click', slideInBPW);
}
function removeBtnListeners() {
    $btnBalloonPop.off('mouseenter', btnBalloonPopEnter);
    $pointerBP.off('mouseenter', btnBalloonPopEnter);
    $btnBalloonPop.off('mouseleave', btnBalloonPopLeave);
    $pointerBP.off('mouseleave', btnBalloonPopLeave);
    $btnBalloonPop.off('click', slideInBalloon);
    $pointerBP.off('click', slideInBalloon);

    $btnPlinko.off('mouseenter', btnPlinkoEnter);
    $pointerPl.off('mouseenter', btnPlinkoEnter);
    $btnPlinko.off('mouseleave', btnPlinkoLeave);
    $pointerPl.off('mouseleave', btnPlinkoLeave);
    $btnPlinko.off('click', slideInPlinko);
    $pointerPl.off('click', slideInPlinko);

    $btnPrizeWheel.off('mouseenter', btnPrizeWheelEnter);
    $pointerBPW.off('mouseenter', btnPrizeWheelEnter);
    $btnPrizeWheel.off('mouseleave', btnPrizeWheelLeave);
    $pointerBPW.off('mouseleave', btnPrizeWheelLeave);
    $btnPrizeWheel.off('click', slideInBPW);
    $pointerBPW.off('click', slideInBPW);
}
addBtnListeners();



// Do not do the background rotation for older versions of IE. It breaks everything.
// iOS also repositions the background off center
if ( !($.browser.msie && $.browser.version < '9.0') ){
    setInterval(function(){
          bgAngle += .1;
         $('#interface-bg').rotate(bgAngle);
    },80);
}



// Check points available and add 'disabled' class to any elements that should not be selectable
// 5 points: Big Prize Wheel
// 3 points: Plinko
// 1 point : Balloon Pop
function disableGames() {
    if (points < 5) {
        $btnPrizeWheel.addClass('disabled');
        $pointerBPW.addClass('disabled');
        if (points < 3) {
            $btnPlinko.addClass('disabled');
            $pointerPl.addClass('disabled');
            if (points < 1) {
                $btnBalloonPop.addClass('disabled');
                $pointerBP.addClass('disabled');
            }
        }
    }
}
// disableGames();


// change opacity of interface elements that are disabled (not enough prize plays)
$('.disabled').children().css({ opacity: 0.5 });

/**
 *  Plinko animations and loading functions
 */
function slideInPlinko(e) {
    $('#plinko-board').attr("src", "/portal/importantprograms/prizeIsRightOct2012GamesPlinko.action");
    removeBtnListeners(); // remove event listeners on game select buttons
    btnPlinkoLeave(); // reset the plinko button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerPl.animate({left: '+=925'}, 1500, 'linear', function(){   // 1: slide the Plinko pointer to the right edge
        $('#plinko-container').animate({left: 160}, 1500, function(){ // 2: slide the Plinko game board into view and pull the pointer back from the edge
            // At this point the Plinko container is in place and any AJAX can occur
            // to load any needed assets. Prize Play Points should be updated as soon
            // as the Plinko chip is dropped.
        });
        $pointerPl.animate({left: '-=840'}, 1500, function(){
            // Commented out: these will get called from the plinko game after the chip lands
            $plinkoBack.fadeIn(500); // show the back to game select text
            $plinkoBack.on('click', slideOutPlinko); // add event listener
        });
        $('#plinko-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerBP.animate({left: '-=233'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerBPW.animate({left: '-=263'}, 1000, 'linear');
}
function slideOutPlinko(e) {
    $plinkoBack.fadeOut(500); //fade back text out
    $plinkoBack.off('click', slideOutPlinko); // remove event listener
    $('#plinko-container').animate({left: 1000}, 1500, function() { // move plinko container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            //addBtnListeners(); // reattach event listeners
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Plinko container has moved off the screen and can be cleared out.
        $('#plinko-board').attr("src", "/portal/html/game-board-placeholder.html");
    });
    $('#plinko-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-195px'}, 1500); // move pointers back to their original positions
    $pointerBP.animate({left: '-127px'}, 1500);
    $pointerBPW.animate({left: '-97px'}, 1500);
    prizeRefreshAmount();
}


/**
 *  Balloon Pop animations and loading functions
 */
function slideInBalloon(e) {
    // $('#balloon-pop-board').attr("src", "balloon-pop/balloon-pop.html"); // wangler
	$('#balloon-pop-board').attr("src", "/portal/importantprograms/prizeIsRightOct2012GamesBalloon.action");
    
    removeBtnListeners(); // remove event listeners on game select buttons
    btnBalloonPopLeave(); // reset the button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerBP.animate({left: '+=857'}, 1500, 'linear', function(){ // 1: slide the balloon pop pointer to the right edge

        $('#balloon-pop-container').animate({left: 160}, 1500, function(){ // 2: slide the game board into view and pull the pointer back from the edge
            // At this point the Balloon pop container is in place
        });
        $pointerBP.animate({left: '-=840'}, 1500, function(){
            // Commented out: these will get called from the balloon pop game itself after a balloon is hit
             $bPopBack.fadeIn(500); // show the back to game select text
             $bPopBack.on('click', slideOutBalloon); // add event listener
        });
        $('#balloon-pop-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerPl.animate({left: '-=165'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerBPW.animate({left: '-=263'}, 1000, 'linear');
}
function slideOutBalloon(e) {
	$bPopBack.fadeOut(500); //fade back text out
    $bPopBack.off('click', slideOutBalloon); // remove event listener
    $('#balloon-pop-container').animate({left: 1000}, 1500, function() { // move plinko container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            //addBtnListeners(); // reattach event listeners
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Ballon Pop container has moved off the screen and can be cleared out.
        $('#balloon-pop-board').attr("src", "/portal/html/game-board-placeholder.html");
    });
    $('#balloon-pop-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-195px'}, 1500); // move pointers back to their original positions
    $pointerBP.animate({left: '-127px'}, 1500);
    $pointerBPW.animate({left: '-97px'}, 1500);
	prizeRefreshAmount();
}


/**
 *  Big Prize Wheel animations and loading functions
 */
function slideInBPW(e) {
    // $('#prize-wheel-board').attr("src", "prize-wheel/prize-wheel.html");  // wangler
    $('#prize-wheel-board').attr("src", "/portal/importantprograms/prizeIsRightOct2012GamesWheel.action");
    removeBtnListeners(); // remove event listeners on game select buttons
    btnPrizeWheelLeave(); // reset the button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerBPW.animate({left: '+=835'}, 1500, 'linear', function(){ // 1: slide the balloon pop pointer to the right edge

        $('#prize-wheel-container').animate({left: 160}, 1500, function(){ // 2: slide the game board into view and pull the pointer back from the edge
            // At this point the Big Prize Wheel container is in place
        });
        $pointerBPW.animate({left: '-=848'}, 1500);
        $('#prize-wheel-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerPl.animate({left: '-=165'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerBP.animate({left: '-=263'}, 1000, 'linear');
    $BPWBack.fadeIn(500); // show the back to game select text
    $BPWBack.on('click', slideOutBPW); // add event listener
}
function slideOutBPW(e) {
	$BPWBack.fadeOut(500); //fade back text out
	$BPWBack.off('click', slideOutPlinko); // remove event listener

    $('#prize-wheel-container').animate({left: 1000}, 1500, function() { // move prize wheel container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            //addBtnListeners(); // reattach event listeners
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Ballon Pop container has moved off the screen and can be cleared out.
        $('#prize-wheel-board').attr("src", "/portal/html/game-board-placeholder.html");
    });
    $('#prize-wheel-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-195px'}, 1500); // move pointers back to their original positions
    $pointerBP.animate({left: '-127px'}, 1500);
    $pointerBPW.animate({left: '-97px'}, 1500);
    prizeRefreshAmount();
}


// Balloon Pop game select button behaviors
function btnBalloonPopEnter(e) {
    btnBalloonPopOver = true;
    if ($btnBalloonPop.hasClass('disabled')) {return;} // do nothing if disabled
    showPrizes('B');
    requestAnimationFrame(slideClouds);
    

    // Balloons are animated along a path using jQuery.path plugin.
    // https://github.com/weepy/jquery.path
    $btnBalloonBlue.stop().animate({
        path : new $.path.bezier({
            start: { x: 212, y: 150, angle: 50 },
            end:   { x: 163, y: 7, angle: 50, length: 0.20 }
        }
    )}, 1200);
    $btnBalloonPink.stop().animate({
        path : new $.path.bezier({
            start: { x: 160, y: 150, angle: 50 },
            end:   { x: 132, y: 17, angle: 50, length: 0.20 }
        }
    )}, 1500);
    $btnBalloonBurst.stop().css('background-position', '-60px 0').animate({
        path : new $.path.bezier({
            start: { x: 160, y: 150, angle: 50 },
            end: { x: 38, y: 59, angle: 50, length: 0.20 }
        }
    )}, 1700, function() {
        $btnBalloonBurst.css('background-position', '0 0')
    });

    // animate associated pointer
    $pointerBP.stop().animate({left: -97}, 300, 'easeOutBounce');
    checkGameInfo('balloon-pop');
}
function btnBalloonPopLeave(e) {
    btnBalloonPopOver = false;
    if ($btnBalloonPop.hasClass('disabled')) {return;} // do nothing if disabled
    $csf.css("left", '0px')
    $csb.css("left", '0px');
    csfPos = 0;
    csbPos = 0;
    $pointerBP.stop().animate({left: -127}, 300, 'easeOutBounce'); // put the pointer back to its default position (left: -127px)
}

function slideClouds(e) {
    csfPos -= .4;
    csbPos -= .2;
    if (csfPos < -274) { // prevent clouds from moving too far
        csfPos = -274;
        btnBalloonPopOver = false;
    }
    $csf.css("left", csfPos +'px')
    $csb.css("left", csbPos +'px')
    if (!btnBalloonPopOver) {return;}
    requestAnimationFrame(slideClouds);
}



// Plinko game select button behaviors
function btnPlinkoEnter(e) {
    if ($btnPlinko.hasClass('disabled')) {return;} // do nothing if disabled
    showPrizes('P');
    $chipSmall.stop().animate({path : new $.path.bezier({
        start: {
            x: 135, // start from just outside of parent div at
            y: -26, // rougly the center of the top
            angle: -100
        },  
        end: { 
            x: 198,
            y: 61, 
            angle: 40, 
            length: 0.30
        }
    })}, 800, 'easeOutBounce');
    $pointerPl.stop().animate({left: -165}, 300, 'easeOutBounce');
    checkGameInfo('plinko');
}
function btnPlinkoLeave(e) {
    if ($btnPlinko.hasClass('disabled')) {return;} // do nothing if disabled
    $chipSmall.stop().css({
        top: '-26px',
        left: '135px'
    });
    $pointerPl.stop().animate({left: -195}, 300, 'easeOutBounce');
}



// Big Prize Wheel game select button behaviors
function btnPrizeWheelEnter(e) {
    if ($btnPrizeWheel.hasClass('disabled')) {return;} // do nothing if disabled
    showPrizes('W');
    $btnWheelTitle.stop().animate({
        top: 0},
        1800, 'easeOutCirc', function(){
            $btnWheelTitle.css('top', '-1350px');
        });
    $pointerBPW.stop().animate({left: -67}, 300, 'easeOutBounce');
    checkGameInfo('prize-wheel');
}
function btnPrizeWheelLeave(e) {
    if ($btnPrizeWheel.hasClass('disabled')) {return;} // do nothing if disabled
    $btnWheelTitle.css('top', '-1350px');
    $pointerBPW.stop().animate({left: -97}, 300, 'easeOutBounce');
}



// Handle the hiding and showing of game info
// @param game can be 'balloon-pop', 'plinko', or 'prize-wheel"
function checkGameInfo(game) {
    if (game !== gameInfo) {
        $('#' + gameInfo + '-info').hide();
        $('#' + game + '-info').fadeIn(300);
        gameInfo = game;
    }
}



// Replace Prize Plays amount with number images
function replacePPNums() {
    var ppNumsWidth = 0;

    $('#prize-plays-amount').each(function(){
        var $this = $(this);
        $this.html($this.html().replace(/1/g, '<div class="prize-play-nums pp-1"></div>'));
        $this.html($this.html().replace(/2/g, '<div class="prize-play-nums pp-2"></div>'));
        $this.html($this.html().replace(/3/g, '<div class="prize-play-nums pp-3"></div>'));
        $this.html($this.html().replace(/4/g, '<div class="prize-play-nums pp-4"></div>'));
        $this.html($this.html().replace(/5/g, '<div class="prize-play-nums pp-5"></div>'));
        $this.html($this.html().replace(/6/g, '<div class="prize-play-nums pp-6"></div>'));
        $this.html($this.html().replace(/7/g, '<div class="prize-play-nums pp-7"></div>'));
        $this.html($this.html().replace(/8/g, '<div class="prize-play-nums pp-8"></div>'));
        $this.html($this.html().replace(/9/g, '<div class="prize-play-nums pp-9"></div>'));
        $this.html($this.html().replace(/0/g, '<div class="prize-play-nums pp-0"></div>'));
    });

    // Need to set the width of #prize-plays-amount so it centers properly
    $('.prize-play-nums').each(function(){
        ppNumsWidth += $(this).width();
    });
    $('#prize-plays-amount').width(ppNumsWidth);
}
replacePPNums();

function showPrizes(g) {
	$imgContentBalloon.each(function() {$(this).hide();}); // hide all of the images
	$imgContentPlinko.each(function() {$(this).hide();}); // hide all of the images
	$imgContentWheel.each(function() {$(this).hide();}); // hide all of the images
	clearInterval(timerBalloon);
	clearInterval(timerPlinko);
	clearInterval(timerWheel);

	if (g == 'B') {
		rotateBalloon = 'Y';
		rotatePlinko = 'N';
		rotateWheel = 'N';
		imgIndexBalloon = 0;
		$imgContentBalloon.eq(imgLengthBalloon-1).show();
		timerBalloon = setInterval(imgRotaterBalloon,imgRotaterDelay);
	}
	if (g == 'P') {
		rotateBalloon = 'N';
		rotatePlinko = 'Y';
		rotateWheel = 'N';
		imgIndexPlinko = 0;
		$imgContentPlinko.eq(imgLengthPlinko-1).show();
		timerPlinko = setInterval(imgRotaterPlinko,imgRotaterDelay);
	}
	if (g == 'W') {
		rotateBalloon = 'N';
		rotatePlinko = 'N';
		rotateWheel = 'Y';
		imgIndexWheel = 0;
		$imgContentWheel.eq(imgLengthWheel-1).show();
		timerWheel = setInterval(imgRotaterWheel,imgRotaterDelay);
	}
}

// Set up and start the fading image rotation
$imgContentBalloon.each(function() {$(this).hide();}); // hide all of the images
$imgContentPlinko.each(function() {$(this).hide();}); // hide all of the images
$imgContentWheel.each(function() {$(this).hide();}); // hide all of the images

//$imgContentBalloon.eq(imgLengthBalloon-1).show(); // show last image in the sequence
//$imgContentPlinko.eq(imgLengthPlinko-1).show(); // show last image in the sequence
//$imgContentWheel.eq(imgLengthWheel-1).show(); // show last image in the sequence

function imgRotaterBalloon() { // after initial delay, last image will fade out, and first image will fade in
    var prev = imgIndexBalloon - 1;
    if (prev < 0) {
        prev = imgLengthBalloon-1;
    }
    window.status = 'balloon=' + prev;
    $imgContentBalloon.eq(prev).fadeOut(400);
    $imgContentBalloon.eq(imgIndexBalloon).fadeIn(400);
    imgIndexBalloon += 1;
    if (imgIndexBalloon >= imgLengthBalloon) {
        imgIndexBalloon = 0; // reset index
    }
}

function imgRotaterPlinko() { // after initial delay, last image will fade out, and first image will fade in
    var prev = imgIndexPlinko - 1;
    if (prev < 0) {
        prev = imgLengthPlinko-1;
    }
    window.status = 'plinko=' + prev;
    $imgContentPlinko.eq(prev).fadeOut(400);
    $imgContentPlinko.eq(imgIndexPlinko).fadeIn(400);
    imgIndexPlinko += 1;
    if (imgIndexPlinko >= imgLengthPlinko) {
        imgIndexPlinko = 0; // reset index
    }
}

function imgRotaterWheel() { // after initial delay, last image will fade out, and first image will fade in
    var prev = imgIndexWheel - 1;
    if (prev < 0) {
        prev = imgLengthWheel-1;
    }
    window.status = 'wheel=' + prev;
    $imgContentWheel.eq(prev).fadeOut(400);
    $imgContentWheel.eq(imgIndexWheel).fadeIn(400);
    imgIndexWheel += 1;
    if (imgIndexWheel >= imgLengthWheel) {
        imgIndexWheel = 0; // reset index
    }
}
 
function printObject(obj) { 
    var str = '';
	for(prop in obj)
	{
		str+='NAME=' + prop + " VALUE="+ obj[prop]+"\n";
	}

}

function prizeRefreshAmount() {
	var url = '/portal/importantprograms/prizeIsRightOct2012RefreshPrizePlays.action';
	$.ajax({
	    type: "GET",
	    cache: false,
	    async: false,
	    dataType: "text",
	    url: url,
	    success: function(data){
	    	$('#prize-plays-amount').text(data);
	    	replacePPNums();
	    	var balloonValue = parseInt($('#prizePlayGameValueBalloonId').html());
	    	var plinkoValue = parseInt($('#prizePlayGameValuePlinkoId').html());
	    	var wheelValue = parseInt($('#prizePlayGameValueWheelId').html());
	    	
	    	$btnBalloonPop.on('mouseenter', btnBalloonPopEnter);
			$pointerBP.on('mouseenter', btnBalloonPopEnter);
			$btnBalloonPop.on('mouseleave', btnBalloonPopLeave);
			$pointerBP.on('mouseleave', btnBalloonPopLeave);

			$btnPlinko.on('mouseenter', btnPlinkoEnter);
			$pointerPl.on('mouseenter', btnPlinkoEnter);
			$btnPlinko.on('mouseleave', btnPlinkoLeave);
			$pointerPl.on('mouseleave', btnPlinkoLeave);

			$btnPrizeWheel.on('mouseenter', btnPrizeWheelEnter);
			$pointerBPW.on('mouseenter', btnPrizeWheelEnter);
			$btnPrizeWheel.on('mouseleave', btnPrizeWheelLeave);
			$pointerBPW.on('mouseleave', btnPrizeWheelLeave);
			
	    	
	    	if (parseInt(data) >= balloonValue) {
	    		self.setTimeout(function(){
					$btnBalloonPop.on('click', slideInBalloon);
					$pointerBP.on('click', slideInBalloon);
	    			},2500);
	    	}
		    else {
				$('#pointer-balloon-pop').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;margin-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
		    }
	
	    	if (parseInt(data) >= plinkoValue) {
	    		self.setTimeout(function(){
					$btnPlinko.on('click', slideInPlinko);
					$pointerPl.on('click', slideInPlinko);
	    			},2500);
	    	}
	    	else {
				$('#pointer-plinko').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;margin-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
	    	}

	
	    	if (parseInt(data) >= wheelValue) {
	    		self.setTimeout(function(){
					$btnPrizeWheel.on('click', slideInBPW);
					$pointerBPW.on('click', slideInBPW);
	    			},2500);
			}
	    	else {
				$('#pointer-prize-wheel').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;margin-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
	    	}
	    }
	});
}
	
//setTimeout(imgRotaterBalloon, imgRotaterDelay);
//setTimeout(imgRotaterPlinko, imgRotaterDelay);
//setTimeout(imgRotaterWheel, imgRotaterDelay);