// requestAnimationFrame polyfill
;(function(){var lastTime=0;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame']||window[vendors[x]+'CancelRequestAnimationFrame']}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(callback,element){var currTime=new Date().getTime();var timeToCall=Math.max(0,16-(currTime-lastTime));var id=window.setTimeout(function(){callback(currTime+timeToCall)},timeToCall);lastTime=currTime+timeToCall;return id};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(id){clearTimeout(id)}}());

// Mountain Climber button related variables
var $btnMC = $('#game-select-btn-mountain-climber'), // Mountain Climber button
    btnMCOver = false, // Needed to stop the cloud animation in the Mountain Climber button
    $csf = $('#clouds-small-fore'), // front cloud layer
    $csm = $('#clouds-small-mid'), // mid cloud layer
    $csb = $('#clouds-small-back'), // back cloud layer
    csfPos = 0, // front cloud layer left position
    csmPos = 0, // middle cloud layer left position
    csbPos = 0, // top cloud layer left position
    $pointerMC = $('#pointer-mountain-climber'), // Mountain Climber pointer
    $MCBack = $('#mountain-climber-back'), // Back to game select text

// Plinko button related varables
    $btnPlinko = $('#game-select-btn-plinko'), // Plinko button
    $chipSmall = $('#btn-plinko-chip-small'), // Plinko chip that will animate
    $pointerPl = $('#pointer-plinko'), // Plinko Pointer
    $plinkoBack = $('#plinko-back'), // Back to game select text

// Punch a PerQ button variables
    $btnPunch = $('#game-select-btn-punch'),
    $pointerPP = $('#pointer-punch-perq'), // Punch a PerQ pointer
    $punchPerqBack = $('#punch-perq-back'), // Back to game select text
    $punchBubble = $('#btn-punch-bubble'),

// Big Prize Wheel button relate varables
    $btnPrizeWheel = $('#game-select-btn-prizewheel'), // Big Prize Wheel button
    $btnWheelTitle = $('#btn-prizewheel-title'), // Prize Wheel title graphic that will spin
    $pointerBPW = $('#pointer-prize-wheel'), // Big Prize Wheel Pointer
    $BPWBack = $('#prize-wheel-back'), // Back to game select text

// varable for the fading image rotation in the game description area
    $imgContent = $('#image-rotation img'), // the div that contains the images to rotate through
    imgIndex = 0, // keeps track of currently displayed image
    imgLength = $imgContent.length, // number of images
    imgRotaterDelay = 6000, // delay between fades

// Misc varables
    $outer = $('#game-select-outer-container'),
    $pointerText = $('#game-select-pointers div p.p-text'),
    points = $('#prize-plays-amount').text(), // Holds the number of Prize Plays Points
    $prizePlaysAmount = $('#prize-plays-amount'),
    gameInfo = 'mountain-climber', // which info is currently displayed
    bgAngle = 0, // used to rotate the background image

// varable for the fading image rotation in the game description area
    $imgRotate = $("#image-rotation");
    $imgContentClimber = $('#image-rotation-climber img'), // the div that contains the images to rotate through
    imgIndexClimber = 0, // keeps track of currently displayed image
    imgLengthClimber = $imgContentClimber.length, // number of images
    imgRotaterDelay = 3000, // delay between fades
    timerClimber = '';

    $imgContentPlinko = $('#image-rotation-plinko img'), // the div that contains the images to rotate through
    imgIndexPlinko = 0, // keeps track of currently displayed image
    imgLengthPlinko = $imgContentPlinko.length, // number of images
    timerPlinko = '';

    $imgContentPunch = $('#image-rotation-punch img'), // the div that contains the images to rotate through
    imgIndexPunch = 0, // keeps track of currently displayed image
    imgLengthPunch = $imgContentPunch.length, // number of images
    timerPunch = '';
    
    $imgContentWheel = $('#image-rotation-wheel img'), // the div that contains the images to rotate through
    imgIndexWheel = 0, // keeps track of currently displayed image
    imgLengthWheel = $imgContentWheel.length, // number of images
    timerWheel = '';

// Paths to the games
    plinkoActionPath = "/portal/importantprograms/prizeIsRightOct2012GamesPlinko.action",
    MCActionPath = "/portal/importantprograms/",
    punchActionPath = "/portal/importantprograms/",
    BPWActionPath = "/portal/importantprograms/prizeIsRightOct2012GamesWheel.action";


// hide game info layers
$('#plinko-info').hide();
$('#prize-wheel-info').hide();
$('#punch-info').hide();


// hide 'back to game selection' text
$MCBack.hide();
$plinkoBack.hide();
$punchPerqBack.hide();
$BPWBack.hide();



// Attach event listeners to buttons and associated pointers
function addBtnListeners() {
    $btnMC.on('mouseenter', btnMCEnter);
    $pointerMC.on('mouseenter', btnMCEnter);
    $btnMC.on('mouseleave', btnMCLeave);
    $pointerMC.on('mouseleave', btnMCLeave);
    $btnMC.on('click', slideInMC);
    $pointerMC.on('click', slideInMC);

    $btnPlinko.on('mouseenter', btnPlinkoEnter);
    $pointerPl.on('mouseenter', btnPlinkoEnter);
    $btnPlinko.on('mouseleave', btnPlinkoLeave);
    $pointerPl.on('mouseleave', btnPlinkoLeave);
    $btnPlinko.on('click', slideInPlinko);
    $pointerPl.on('click', slideInPlinko);

    $btnPunch.on('mouseenter', btnPunchEnter);
    $pointerPP.on('mouseenter', btnPunchEnter);
    $btnPunch.on('mouseleave', btnPunchLeave);
    $pointerPP.on('mouseleave', btnPunchLeave);
    $btnPunch.on('click', slideInPunch);
    $pointerPP.on('click', slideInPunch);

    $btnPrizeWheel.on('mouseenter', btnPrizeWheelEnter);
    $pointerBPW.on('mouseenter', btnPrizeWheelEnter);
    $btnPrizeWheel.on('mouseleave', btnPrizeWheelLeave);
    $pointerBPW.on('mouseleave', btnPrizeWheelLeave);
    $btnPrizeWheel.on('click', slideInBPW);
    $pointerBPW.on('click', slideInBPW);
}
function removeBtnListeners() {
    $btnMC.off('mouseenter', btnMCEnter);
    $pointerMC.off('mouseenter', btnMCEnter);
    $btnMC.off('mouseleave', btnMCLeave);
    $pointerMC.off('mouseleave', btnMCLeave);
    $btnMC.off('click', slideInMC);
    $pointerMC.off('click', slideInMC);

    $btnPlinko.off('mouseenter', btnPlinkoEnter);
    $pointerPl.off('mouseenter', btnPlinkoEnter);
    $btnPlinko.off('mouseleave', btnPlinkoLeave);
    $pointerPl.off('mouseleave', btnPlinkoLeave);
    $btnPlinko.off('click', slideInPlinko);
    $pointerPl.off('click', slideInPlinko);

    $btnPunch.off('mouseenter', btnPunchEnter);
    $pointerPP.off('mouseenter', btnPunchEnter);
    $btnPunch.off('mouseleave', btnPunchLeave);
    $pointerPP.off('mouseleave', btnPunchLeave);
    $btnPunch.off('click', slideInPunch);
    $pointerPP.off('click', slideInPunch);

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
// 1 point : Mountain Climber
// function disableGames() {
//     if (points < 5) {
//         $btnPrizeWheel.addClass('disabled');
//         $pointerBPW.addClass('disabled');
//         if (points < 3) {
//             $btnPlinko.addClass('disabled');
//             $pointerPl.addClass('disabled');
//             if (points < 1) {
//                 $btnMC.addClass('disabled');
//                 $pointerMC.addClass('disabled');
//             }
//         }
//     }
// }
// disableGames();


// change opacity of interface elements that are disabled (not enough prize plays)
$('.disabled').children().css({ opacity: 0.5 });


/**
 *  Plinko animations and loading functions
 */
function slideInPlinko(e) {
    $('#plinko-board').attr("src", plinkoActionPath);
    removeBtnListeners(); // remove event listeners on game select buttons
    btnPlinkoLeave(); // reset the plinko button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerPl.animate({left: '+=825'}, 1500, 'linear', function(){   // 1: slide the Plinko pointer to the right edge
        $('#plinko-container').animate({left: 160}, 1500, function() {
            $plinkoBack.fadeIn(500);
            $plinkoBack.on('click', slideOutPlinko);
        });
        $pointerPl.animate({left: '-=840'}, 1500);
        $('#plinko-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerMC.animate({left: '-=260'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerBPW.animate({left: '-=260'}, 1000, 'linear');
    $pointerPP.animate({left: '-=260'}, 1000, 'linear');
    $imgRotate.css('display', 'none');
}
function slideOutPlinko(e) {
    $plinkoBack.fadeOut(500); //fade back text out
    $plinkoBack.off('click', slideOutPlinko); // remove event listener
    $('#plinko-container').animate({left: 1000}, 1500, function() { // move plinko container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            addBtnListeners(); // reattach event listeners
            $imgRotate.css('display', 'block');
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Plinko container has moved off the screen and can be cleared out.
        $('#plinko-board').attr("src", "game-board-placeholder.html");
    });
    $('#plinko-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-174px'}, 1500); // move pointers back to their original positions
    $pointerMC.animate({left: '-174px'}, 1500);
    $pointerBPW.animate({left: '-174px'}, 1500);
    $pointerPP.animate({left: '-174px'}, 1500);
    prizeRefreshAmount();
}



/**
 *  Mountain Climber animations and loading functions
 */
function slideInMC(e) {
    $('#mountain-climber-board').attr("src", MCActionPath);
    removeBtnListeners(); // remove event listeners on game select buttons
    btnMCLeave(); // reset the button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerMC.animate({left: '+=825'}, 1500, 'linear', function(){ // 1: slide the Mountain Climber pointer to the right edge
        $('#mountain-climber-container').animate({left: 160}, 1500, function() {
            $MCBack.fadeIn(500);
            $MCBack.on('click', slideOutMC);
        });
        $pointerMC.animate({left: '-=840'}, 1500);
        $('#mountain-climber-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerPl.animate({left: '-=260'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerBPW.animate({left: '-=260'}, 1000, 'linear');
    $pointerPP.animate({left: '-=260'}, 1000, 'linear');
    $imgRotate.css('display', 'none');
}
function slideOutMC(e) {
    $MCBack.fadeOut(500); //fade back text out
    $MCBack.off('click', slideOutMC); // remove event listener
    $('#mountain-climber-container').animate({left: 1000}, 1500, function() { // move plinko container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            addBtnListeners(); // reattach event listeners
            $imgRotate.css('display', 'block');
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Ballon Pop container has moved off the screen and can be cleared out.
        $('#mountain-climber-board').attr("src", "game-board-placeholder.html");
    });
    $('#mountain-climber-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-174px'}, 1500); // move pointers back to their original positions
    $pointerMC.animate({left: '-174px'}, 1500);
    $pointerBPW.animate({left: '-174px'}, 1500);
    $pointerPP.animate({left: '-174px'}, 1500);
    prizeRefreshAmount();
}



/**
 *  Punch a PerQ animations and loading functions
 */
function slideInPunch(e) {
    $('#punch-perq-board').attr("src", punchActionPath);
    removeBtnListeners(); // remove event listeners on game select buttons
    btnPunchLeave(); // reset the button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerPP.animate({left: '+=825'}, 1500, 'linear', function(){ // 1: slide the Punch a PerQ pointer to the right edge
        $('#punch-perq-container').animate({left: 160}, 1500, function() {
            $punchPerqBack.fadeIn(500);
            $punchPerqBack.on('click', slideOutPunch);
        });
        $pointerPP.animate({left: '-=840'}, 1500);
        $('#punch-perq-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerPl.animate({left: '-=260'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerMC.animate({left: '-=260'}, 1000, 'linear');
    $pointerBPW.animate({left: '-=260'}, 1000, 'linear');
    $imgRotate.css('display', 'none');
}
function slideOutPunch(e) {
    $punchPerqBack.fadeOut(500); //fade back text out
    $punchPerqBack.off('click', slideOutMC); // remove event listener
    $('#punch-perq-container').animate({left: 1000}, 1500, function() { // move punch a perq container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            addBtnListeners(); // reattach event listeners
            $imgRotate.css('display', 'block');
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Ballon Pop container has moved off the screen and can be cleared out.
        $('#punch-perq-board').attr("src", "game-board-placeholder.html");
    });
    $('#punch-perq-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-174px'}, 1500); // move pointers back to their original positions
    $pointerMC.animate({left: '-174px'}, 1500);
    $pointerBPW.animate({left: '-174px'}, 1500);
    $pointerPP.animate({left: '-174px'}, 1500);
    prizeRefreshAmount();
}



/**
 *  Big Prize Wheel animations and loading functions
 */
function slideInBPW(e) {
    $('#prize-wheel-board').attr("src", BPWActionPath);
    removeBtnListeners(); // remove event listeners on game select buttons
    btnPrizeWheelLeave(); // reset the button
    $outer.animate({ // slide game select container off the screen
        left: -740
    }, 1500, 'linear');
    $('#select-left').animate({width: 0}, 700, 'linear', function() { // apply cheap trickery to fake 3d perspective
        $('#select-right').animate({width: 60}, 1000, 'linear');
    });
    $pointerText.fadeOut(500); // fade pointer text out
    $pointerBPW.animate({left: '+=825'}, 1500, 'linear', function(){ // 1: slide the Mountain Climber pointer to the right edge
        $('#prize-wheel-container').animate({left: 160}, 1500, function() {
            $BPWBack.fadeIn(500);
            $BPWBack.on('click', slideOutBPW);
        });
        $pointerBPW.animate({left: '-=840'}, 1500);
        $('#prize-wheel-left').animate({width: 20}, 1500); // fake perspective edge
    });
    $pointerPl.animate({left: '-=260'}, 1000, 'linear'); // Slide the other pointers back out of view
    $pointerMC.animate({left: '-=260'}, 1000, 'linear');
    $pointerPP.animate({left: '-=260'}, 1000, 'linear');
    $imgRotate.css('display', 'none');
}
function slideOutBPW(e) {
    $BPWBack.fadeOut(500); //fade back text out
    $BPWBack.off('click', slideOutMC); // remove event listener
    $('#prize-wheel-container').animate({left: 1000}, 1500, function() { // move prize wheel container off screen
        $outer.animate({ // move game select container back
            left: '0px'
        }, 1500, 'linear', function(){
            $pointerText.fadeIn(500); // fade the pointer text back in
            addBtnListeners(); // reattach event listeners
            $imgRotate.css('display', 'block');
        });
        $('#select-right').animate({width: 0}, 700, 'linear', function() { // fake the perspective
            $('#select-left').animate({width: 60}, 1000, 'linear');
        });

        // At this point the Ballon Pop container has moved off the screen and can be cleared out.
        $('#prize-wheel-board').attr("src", "game-board-placeholder.html");
    });
    $('#prize-wheel-left').animate({width: 60}, 1000); // fake perspective edge
    $pointerPl.animate({left: '-174px'}, 1500); // move pointers back to their original positions
    $pointerMC.animate({left: '-174px'}, 1500);
    $pointerBPW.animate({left: '-174px'}, 1500);
    $pointerPP.animate({left: '-174px'}, 1500);
    prizeRefreshAmount();
}








// Mountain Climber game select button behaviors
function btnMCEnter(e) {
    btnMCOver = true;
    if ($btnMC.hasClass('disabled')) {return;} // do nothing if disabled
    showPrizes('B');
    requestAnimationFrame(slideClouds);

    // animate associated pointer
    $pointerMC.stop().animate({left: -154}, 300, 'easeOutBounce');
    checkGameInfo('mountain-climber');
}
function btnMCLeave(e) {
    btnMCOver = false;
    if ($btnMC.hasClass('disabled')) {return;} // do nothing if disabled
    $csf.css("left", '0px');
    $csm.css("left", '0px');
    $csb.css("left", '0px');
    csfPos = 0;
    csmPos = 0;
    csbPos = 0;
    $pointerMC.stop().animate({left: -174}, 300, 'easeOutBounce'); // put the pointer back to its default position (left: -174px)
}

function slideClouds(e) {
    csfPos -= .3;
    csmPos -= .2;
    csbPos -= .1;
    if (csfPos < -274) { // prevent clouds from moving too far
        csfPos = -274;
        btnMCOver = false;
    }
    $csf.css("left", csfPos +'px');
    $csm.css("left", csmPos +'px');
    $csb.css("left", csbPos +'px');
    if (!btnMCOver) {return;}
    requestAnimationFrame(slideClouds);
}



// punch a perq game select button behaviors
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
    $pointerPl.stop().animate({left: -154}, 300, 'easeOutBounce');
    checkGameInfo('plinko');
}
function btnPlinkoLeave(e) {
    if ($btnPlinko.hasClass('disabled')) {return;} // do nothing if disabled
    $chipSmall.stop().css({
        top: '-26px',
        left: '135px'
    });
    $pointerPl.stop().animate({left: -174}, 300, 'easeOutBounce');
}



// Punch a Perq game select button behaviors
function btnPunchEnter(e) {
    if ($btnPunch.hasClass('disabled')) {return;} // do nothing if disabled
    showPrizes('PP');

    $punchBubble.animate({
        left: '181px',
        top: '22px'},
        500, 'linear', function() {
            $punchBubble.animate({
                left: '136px',
                top: '-7px'},
                500, 'linear', function() {
                    $punchBubble.animate({
                        left: '54px',
                        top: '70px'},
                        700, 'linear', function() {
                            $punchBubble.animate({
                                left: '-6px',
                                top: '25px'},
                                700, 'linear', function() {
                                    $punchBubble.stop().animate({
                                    left: '82px',
                                    top: '-6px'},
                                    800, 'linear', function() {
                                        $punchBubble.stop().animate({
                                        left: '166px',
                                        top: '56px'}, 600, 'linear');
                                    });
                            });
                    });
            });
    });

    $pointerPP.stop().animate({left: -154}, 300, 'easeOutBounce');
    checkGameInfo('punch');
}
function btnPunchLeave(e) {
    if ($btnPunch.hasClass('disabled')) {return;} // do nothing if disabled
    $pointerPP.stop().animate({left: -174}, 300, 'easeOutBounce');
    $punchBubble.stop().animate({
        left: '166px',
        top: '56px'}, 200, 'easeOutBounce');
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
    $pointerBPW.stop().animate({left: -154}, 300, 'easeOutBounce');
    checkGameInfo('prize-wheel');
}
function btnPrizeWheelLeave(e) {
    if ($btnPrizeWheel.hasClass('disabled')) {return;} // do nothing if disabled
    $btnWheelTitle.css('top', '-1350px');
    $pointerBPW.stop().animate({left: -174}, 300, 'easeOutBounce');
}



// Handle the hiding and showing of game info
// @param game can be 'mountain-climber', 'plinko', or 'prize-wheel"
function checkGameInfo(game) {
    if (game !== gameInfo) {
        $('#' + gameInfo + '-info').hide();
        $('#' + game + '-info').fadeIn(300);
        gameInfo = game;
    }
}


// No longer using images in this version - just styled text
// Replace Prize Plays amount with number images
// function replacePPNums() {
//     var ppNumsWidth = 0;

//     $('#prize-plays-amount').each(function(){
//         var $this = $(this);
//         $this.html($this.html().replace(/1/g, '<div class="prize-play-nums pp-1"></div>'));
//         $this.html($this.html().replace(/2/g, '<div class="prize-play-nums pp-2"></div>'));
//         $this.html($this.html().replace(/3/g, '<div class="prize-play-nums pp-3"></div>'));
//         $this.html($this.html().replace(/4/g, '<div class="prize-play-nums pp-4"></div>'));
//         $this.html($this.html().replace(/5/g, '<div class="prize-play-nums pp-5"></div>'));
//         $this.html($this.html().replace(/6/g, '<div class="prize-play-nums pp-6"></div>'));
//         $this.html($this.html().replace(/7/g, '<div class="prize-play-nums pp-7"></div>'));
//         $this.html($this.html().replace(/8/g, '<div class="prize-play-nums pp-8"></div>'));
//         $this.html($this.html().replace(/9/g, '<div class="prize-play-nums pp-9"></div>'));
//         $this.html($this.html().replace(/0/g, '<div class="prize-play-nums pp-0"></div>'));
//     });

//     // Need to set the width of #prize-plays-amount so it centers properly
//     $('.prize-play-nums').each(function(){
//         ppNumsWidth += $(this).width();
//     });
//     $('#prize-plays-amount').width(ppNumsWidth);
// }
// replacePPNums();


function showPrizes(g) {
    $imgContentClimber.each(function() {$(this).hide();}); // hide all of the images
    $imgContentPlinko.each(function() {$(this).hide();}); // hide all of the images
    $imgContentPunch.each(function() {$(this).hide();}); // hide all of the images
    $imgContentWheel.each(function() {$(this).hide();}); // hide all of the images
    clearInterval(timerClimber);
    clearInterval(timerPlinko);
    clearInterval(timerPunch);
    clearInterval(timerWheel);

    if (g == 'B') {
        rotateBalloon = 'Y';
        rotatePlinko = 'N';
        rotateWheel = 'N';
        rotatePunch = 'N';
        imgIndexClimber = 0;
        $imgContentClimber.eq(imgLengthClimber-1).show();
        timerClimber = setInterval(imgRotaterClimber,imgRotaterDelay);
    }
    if (g == 'P') {
        rotateBalloon = 'N';
        rotatePlinko = 'Y';
        rotateWheel = 'N';
        rotatePunch = 'N';
        imgIndexPlinko = 0;
        $imgContentPlinko.eq(imgLengthPlinko-1).show();
        timerPlinko = setInterval(imgRotaterPlinko,imgRotaterDelay);
    }
    if (g == 'W') {
        rotateBalloon = 'N';
        rotatePlinko = 'N';
        rotateWheel = 'Y';
        rotatePunch = 'N';
        imgIndexWheel = 0;
        $imgContentWheel.eq(imgLengthWheel-1).show();
        timerWheel = setInterval(imgRotaterWheel,imgRotaterDelay);
    }
    if (g == 'PP') {
        rotateBalloon = 'N';
        rotatePlinko = 'N';
        rotateWheel = 'N';
        rotatePunch = 'Y';
        imgIndexPunch = 0;
        $imgContentPunch.eq(imgLengthPunch-1).show();
        timerPunch = setInterval(imgRotaterPunch,imgRotaterDelay);
    }
}

// Set up and start the fading image rotation
$imgContentClimber.each(function() {$(this).hide();}); // hide all of the images
$imgContentPlinko.each(function() {$(this).hide();}); // hide all of the images
$imgContentWheel.each(function() {$(this).hide();}); // hide all of the images

//$imgContentClimber.eq(imgLengthClimber-1).show(); // show last image in the sequence
//$imgContentPlinko.eq(imgLengthPlinko-1).show(); // show last image in the sequence
//$imgContentWheel.eq(imgLengthWheel-1).show(); // show last image in the sequence

function imgRotaterClimber() { // after initial delay, last image will fade out, and first image will fade in
    if (imgLengthClimber == 1) {
        return; // do not rotate if only 1 image
    }
    var prev = imgIndexClimber - 1;
    if (prev < 0) {
        prev = imgLengthClimber-1;
    }
    window.status = 'balloon=' + prev;
    $imgContentClimber.eq(prev).fadeOut(300, function() {
        $imgContentClimber.eq(imgIndexClimber).fadeIn(300);    
    });
    
    imgIndexClimber += 1;
    if (imgIndexClimber >= imgLengthClimber) {
        imgIndexClimber = 0; // reset index
    }
}

function imgRotaterPlinko() { // after initial delay, last image will fade out, and first image will fade in
    if (imgLengthPlinko == 1) {
        return; // do not rotate if only 1 image
    }
    var prev = imgIndexPlinko - 1;
    if (prev < 0) {
        prev = imgLengthPlinko-1;
    }
    window.status = 'plinko=' + prev;
    $imgContentPlinko.eq(prev).fadeOut(300, function() {
        $imgContentPlinko.eq(imgIndexPlinko).fadeIn(300);    
    });
    
    imgIndexPlinko += 1;
    if (imgIndexPlinko >= imgLengthPlinko) {
        imgIndexPlinko = 0; // reset index
    }
}

function imgRotaterPunch() { // after initial delay, last image will fade out, and first image will fade in
    if (imgLengthPunch == 1) {
        return; // do not rotate if only 1 image
    }
    var prev = imgIndexPunch - 1;
    if (prev < 0) {
        prev = imgLengthPunch-1;
    }
    window.status = 'punch=' + prev;
    $imgContentPunch.eq(prev).fadeOut(300, function() {
        $imgContentPunch.eq(imgIndexPunch).fadeIn(300);    
    });
    
    imgIndexPunch += 1;
    if (imgIndexPunch >= imgLengthPunch) {
        imgIndexPunch = 0; // reset index
    }
}

function imgRotaterWheel() { // after initial delay, last image will fade out, and first image will fade in
    if (imgLengthWheel == 1) {
        return; // do not rotate if only 1 image
    }
    var prev = imgIndexWheel - 1;
    if (prev < 0) {
        prev = imgLengthWheel-1;
    }
    window.status = 'wheel=' + prev;
    $imgContentWheel.eq(prev).fadeOut(300, function() {
        $imgContentWheel.eq(imgIndexWheel).fadeIn(300);
    });
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
            var climberValue = parseInt($('#prizePlayGameValueClimberId').html());
            var plinkoValue = parseInt($('#prizePlayGameValuePlinkoId').html());
            var punchValue = parseInt($('#prizePlayGameValuePunchId').html());
            var wheelValue = parseInt($('#prizePlayGameValueWheelId').html());

            $btnMC.on('mouseenter', btnMCEnter);
            $pointerBP.on('mouseenter', btnMCEnter);
            $btnMC.on('mouseleave', btnMCLeave);
            $pointerBP.on('mouseleave', btnMCLeave);

            $btnPlinko.on('mouseenter', btnPlinkoEnter);
            $pointerPl.on('mouseenter', btnPlinkoEnter);
            $btnPlinko.on('mouseleave', btnPlinkoLeave);
            $pointerPl.on('mouseleave', btnPlinkoLeave);

            $btnPunch.on('mouseenter', btnPlinkoEnter);
            $pointerPP.on('mouseenter', btnPlinkoEnter);
            $btnPunch.on('mouseleave', btnPlinkoLeave);
            $pointerPP.on('mouseleave', btnPlinkoLeave);

            $btnPrizeWheel.on('mouseenter', btnPrizeWheelEnter);
            $pointerBPW.on('mouseenter', btnPrizeWheelEnter);
            $btnPrizeWheel.on('mouseleave', btnPrizeWheelLeave);
            $pointerBPW.on('mouseleave', btnPrizeWheelLeave);
            
            
            if (parseInt(data) >= climberValue) {
                self.setTimeout(function(){
                    $btnMC.on('click', slideInBalloon);
                    $pointerBP.on('click', slideInBalloon);
                    },2500);
            }
            else {
                $('#pointer-balloon-pop').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;padding-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
            }
    
            if (parseInt(data) >= plinkoValue) {
                self.setTimeout(function(){
                    $btnPlinko.on('click', slideInPlinko);
                    $pointerPl.on('click', slideInPlinko);
                    },2500);
            }
            else {
                $('#pointer-plinko').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;padding-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
            }

            if (parseInt(data) >= punchValue) {
                self.setTimeout(function(){
                    $btnPunch.on('click', slideInPunch);
                    $pointerPP.on('click', slideInPunch);
                    },2500);
            }
            else {
                $('#pointer-punch-perq').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;padding-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
            }
    
            if (parseInt(data) >= wheelValue) {
                self.setTimeout(function(){
                    $btnPrizeWheel.on('click', slideInBPW);
                    $pointerBPW.on('click', slideInBPW);
                    },2500);
            }
            else {
                $('#pointer-prize-wheel').html('<p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;padding-top:20px;">Not enough</p><p style="color:black;font-size:16px;font-family: Arial;font-weight:bold;width:200px;">Prize Plays available</p>');
            }
        }
    });
}