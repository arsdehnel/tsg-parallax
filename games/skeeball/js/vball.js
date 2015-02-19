
// Remove click/tap delay in iOS/Android
// It causes a 300ms delay between the user tapping the roll button and the
// power meter being stopped which would cause the power to be 40% off from
// what the user actually selected.
// Uses FastClick from FT Labs: https://github.com/ftlabs/fastclick
if (window.addEventListener){
    window.addEventListener('load', function() {
        FastClick.attach(document.body);
    }, false);
}

/**
 *  Begin game setup and ajax requests
 */
VBALL = {
    options: {
        awards: [],
        awardTotal: 0, // always starts at 0
        totalBalls: 0,
        ballsRemaining: 0,
        playsPerDeposit: 0,
        callback: null,
        // ### callback == function to run when the game is complete
        // these could be set outside the script, but it is recommended not to
        returnCode: 99,
        addedAmount: 0,
        cardDepositAmount: 0,
        perqDisplayAmount: 0
    },
    $instructions: $('#instructions'),
    $ballCount: $('#balls-remaining'),
    $score: $('#score')
}

function setGameTableValues(){
    var $cups = $('.cup-value');

    $.ajax({
        url: 'js/skeeball.json',
        // url: '/portal/myrewards/getVballJsonData.action',
        type: 'GET',
        dataType: 'json',
        success: function( data ){
            console.log(data);
            if ( data.cupValues ) { VBALL.options.awards = data.cupValues; }
            if ( data.totalPlays ) { VBALL.options.ballsRemaining = VBALL.options.totalBalls = data.totalPlays; }
            if ( data.playsPerDeposit ) { VBALL.options.playsPerDeposit = data.playsPerDeposit; }
            if ( data.totalPlays ) { VBALL.$ballCount.text( data.totalPlays ); }
            if( data.perqDisplayAmount ) { VBALL.$score.text(data.perqDisplayAmount); }
            VBALL.$score.text(0);
            $cups.each( function( index ){
                $( this ).text( data.cupValues[ index ] );
            });
        }
    });
}

function sendAwardValue( award ){
    var l_data = 'awardAmt=' + award;
    $.ajax({
        url: 'js/response-test.json',
        // url: '/portal/myrewards/processVBallPlayDummy.action',
        type: 'GET',
        data: l_data,
        async: false,
        cache: false,
        dataType: 'json',
        success: function( data ) {
            // console.log(data);
            if( data.returnCode ) { VBALL.options.returnCode = data.returnCode; }
            if( data.addedAmount ){ VBALL.options.addedAmount = data.addedAmount; }
            if( data.cardDepositAmount ) { VBALL.options.cardDepositAmount = data.cardDepositAmount; }
            if( data.perqDisplayAmount ) { VBALL.options.perqDisplayAmount = data.perqDisplayAmount; }

            VBALL.$score.text( VBALL.options.perqDisplayAmount ); // update the scoreboard with the response value
            nextRound();
        }
    });
}

function startGame() {
    setTimeout( function() {
        VBALL.$instructions.find( ' .status1, .status2, .status99' ).hide().end().find( '.start-text' ).show();
        VBALL.$instructions.fadeIn(250).find( '.new, .continue, .exit' ).hide();
    }, 250 );
}

function newGame() {
    setGameTableValues();
    VBALL.$instructions.fadeOut( 400, powerUp);
}

function exitGame() {
    // console.log( 'closing window...' );
    // top.tb_remove();
    window.parent.modalClose();
}

function continueGame() {
    $power.css('width', '4%'); // reset power meter
    VBALL.$instructions.fadeOut( 250, powerUp);
}

function nextRound() {
    if( VBALL.options.returnCode ===  '0' ) {
        continueGame();
    }
    if( VBALL.options.returnCode ===  '1' ) {
        VBALL.$instructions.find( '.start-text, .status2, .status99' ).hide().end().find( '.status1' ).show();
        VBALL.$instructions.find( '.pointDeposit' ).text( VBALL.options.perqDisplayAmount ).end().find( '.gameAddition').text( VBALL.options.addedAmount );
        VBALL.$instructions.fadeIn( 250 ).show().find( '.continue, .exit' ).show().end().find( '.play, .new' ).hide();
    } else if(  VBALL.options.returnCode ===  '2'  ) {
        VBALL.$instructions.find( '.start-text, .status1, .status99' ).hide().end().find( '.status2' ).show();
        VBALL.$instructions.fadeIn( 250 ).show().find( '.exit' ).show().end().find( '.play, .continue, .new' ).hide();
        VBALL.$instructions.fadeIn( 250 ).find( '.exit, .new' ).show().end().find( '.play, .continue' ).hide();
        VBALL.$instructions.find( '.pointDeposit' ).text( VBALL.options.perqDisplayAmount );
    } else if(  VBALL.options.returnCode ===  '99'  ) {
        VBALL.$instructions.find( '.start-text,  .status1, .status2' ).hide().end().find( '.status99' ).show();
        VBALL.$instructions.fadeIn( 250 ).show().find( '.exit' ).show().end().find( '.play, .continue, .new' ).hide();
    }
}

function gameOver() {
    VBALL.$instructions.find( '.start-text, .status0, .status1, .status2, .status99' ).hide().end().find( '.game-over' ).show();
    VBALL.$instructions.fadeIn( 250 ).show().find( '.exit' ).show().end().find( '.play, .continue, .new' ).hide();
}


VBALL.$instructions.find( '.play' ).on('click', newGame);
VBALL.$instructions.find( '.new' ).on('click', newGame );
VBALL.$instructions.find( '.continue' ).on('click', continueGame );
VBALL.$instructions.find( '.exit' ).on('click', window.parent.modalClose );

startGame();

/**
 *  End game setup and ajax requests
 */



















/**
 *  Begin main game code
 */
var
$ball = $('#ball'),
$power = $('#power'),
$roll = $('#lets-roll'),
$left = $('#move-left'),
$right = $('#move-right'),
$ballCount = $('#balls-remaining'),
// $score = $('#score'),
rolling = false,
shifting = false,
shiftSpeed = 100,
shouldSink = false,
laneOffset = 129, // distance between starting positions
currentLane = 3,  // starting lane out of 5 - 3 is the middle lane
power = 0.50,
powerSpeed = 500,
pmWidth = 365, // 100% width of power meter
landingRow,
laneAniSpeed,
jumpAniSpeed,
jumpYpos,
jumpXpos,
dropYpos,
dropXpos,
award,
coords = [ // coords[lane][row]
    [   // 11 and 12 land in same spot
        {jumpXpos:'206px', dropYpos:'266px', dropXpos:'212px', landingBox:11}, // lane 1, row 1
        {jumpXpos:'206px', dropYpos:'266px', dropXpos:'212px', landingBox:12}, // lane 1, row 2
        {jumpXpos:'206px', dropYpos:'210px', dropXpos:'210px', landingBox:13}, // lane 1, row 3
        {jumpXpos:'206px', dropYpos:'172px', dropXpos:'214px', landingBox:14}, // lane 1, row 4
        {jumpXpos:'214px', dropYpos:'132px', dropXpos:'222px', landingBox:15}  // lane 1, row 5
    ],
    [   // 21 and 22 land in same spot
        // 24 and 25 land in same spot
        {jumpXpos:'271px', dropYpos:'312px', dropXpos:'275px', landingBox:21}, // lane 2, row 1
        {jumpXpos:'271px', dropYpos:'312px', dropXpos:'275px', landingBox:22}, // lane 2, row 2
        {jumpXpos:'266px', dropYpos:'218px', dropXpos:'270px', landingBox:23}, // lane 2, row 3
        {jumpXpos:'271px', dropYpos:'158px', dropXpos:'275px', landingBox:24}, // lane 2, row 4
        {jumpXpos:'271px', dropYpos:'158px', dropXpos:'275px', landingBox:25}  // lane 2, row 5
    ],
    [
        {jumpXpos:'324px', dropYpos:'320px', dropXpos:'328px', landingBox:31}, // lane 3, row 1
        {jumpXpos:'324px', dropYpos:'266px', dropXpos:'328px', landingBox:32}, // lane 3, row 2
        {jumpXpos:'324px', dropYpos:'210px', dropXpos:'328px', landingBox:33}, // lane 3, row 3
        {jumpXpos:'324px', dropYpos:'172px', dropXpos:'328px', landingBox:34}, // lane 3, row 4
        {jumpXpos:'324px', dropYpos:'132px', dropXpos:'328px', landingBox:35}  // lane 3, row 5
    ],
    [   // 41 and 42 land in same spot
        // 44 and 45 land in same spot
        {jumpXpos:'376px', dropYpos:'312px', dropXpos:'380px', landingBox:41}, // lane 4, row 1
        {jumpXpos:'376px', dropYpos:'312px', dropXpos:'380px', landingBox:42}, // lane 4, row 2
        {jumpXpos:'381px', dropYpos:'218px', dropXpos:'385px', landingBox:43}, // lane 4, row 3
        {jumpXpos:'376px', dropYpos:'158px', dropXpos:'380px', landingBox:44}, // lane 4, row 4
        {jumpXpos:'376px', dropYpos:'158px', dropXpos:'380px', landingBox:45}  // lane 4, row 5
    ],
    [
        // 51 and 52 land in same spot
        {jumpXpos:'440px', dropYpos:'266px', dropXpos:'444px', landingBox:51}, // lane 5, row 1
        {jumpXpos:'440px', dropYpos:'266px', dropXpos:'444px', landingBox:52}, // lane 5, row 2
        {jumpXpos:'440px', dropYpos:'210px', dropXpos:'444px', landingBox:53}, // lane 5, row 3
        {jumpXpos:'440px', dropYpos:'172px', dropXpos:'440px', landingBox:54}, // lane 5, row 4
        {jumpXpos:'430px', dropYpos:'132px', dropXpos:'434px', landingBox:55}  // lane 5, row 5
    ],
];

$roll.on('click tap', startRoll);

// Handle the move left and right buttons to place the ball
$left.on('click tap', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (currentLane === 1 || shifting || rolling) { return; }
    else {
        currentLane -= 1;
        shifting = true;
        $ball.animate({left: '-=129'}, shiftSpeed, function() {
            shifting = false;
        });
    }
});
$right.on('click tap', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (currentLane === 5 || shifting || rolling) { return; }
    else {
        currentLane += 1;
        shifting = true;
        $ball.animate({left: '+=129'}, shiftSpeed, function() {
            shifting = false;
        });
    }
});

// animation functions for the power meter
function powerUp()   { $power.animate({ width: '100%' }, powerSpeed, 'linear', powerDown); }
function powerDown() { $power.animate({ width:   '4%' }, powerSpeed, 'linear', powerUp); }

// $power.css('width', '95%');

function startRoll(e) {
    e.stopPropagation();
    e.preventDefault();
    // do nothing if ball is being moved or if it has been thrown
    if (shifting || rolling) { return; }

    $power.stop();                    // stop the power meter
    power = $power.width() / pmWidth; // get the power value
    rolling = true;                   // now ball is rolling down the lane
    findLanding();
    switch (currentLane) {
        case 1:
            laneAnimation('196px');
            break;
        case 2:
            laneAnimation('263px');
            break;
        case 3:
            laneAnimation('322px');
            break;
        case 4:
            laneAnimation('380px');
            break;
        case 5:
            laneAnimation('438px');
            break;
    }
}

// find where the ball will land based on lane and power
function findLanding() {
    if (power <= 0.2) {
        laneAniSpeed = 1500;
        jumpAniSpeed = 550;
        landingRow = 1;
        jumpYpos = '250px';
    }
    else if (power > 0.2 && power <= 0.4) {
        laneAniSpeed = 1250;
        jumpAniSpeed = 550;
        landingRow = 2;
        jumpYpos = '222px';
    }
    else if (power > 0.4 && power <= 0.6) {
        laneAniSpeed = 1000;
        jumpAniSpeed = 550;
        landingRow = 3;
        jumpYpos = '116px';
    }
    else if ((power > 0.6 && power <= 0.8) || (power > 0.8 && power <= 0.95 && (currentLane == 1 || currentLane == 5))) {
        laneAniSpeed = 750;
        jumpAniSpeed = 550;
        landingRow = 4;
        jumpYpos = '78px';
    }
    else if ((power > 0.8 && currentLane != 1 && currentLane != 5) || (power > 0.95 && (currentLane == 1 || currentLane == 5))) {
        laneAniSpeed = 500;
        jumpAniSpeed = 500;
        landingRow = 5;
        jumpYpos = '38px';
    }
}

// animate up the lane
function laneAnimation(xPos) {
    $ball.animate({
        left: xPos,
        top: '356px',
        width: '60px'},
        laneAniSpeed,
        'linear',
        jumpAnimation);
}

// animate the jump
function jumpAnimation() {
    $ball.animate({
        left: coords[currentLane-1][landingRow-1].jumpXpos,
        top: jumpYpos,
        width: '52px'},
        jumpAniSpeed,
        'easeOutQuad',
        dropAnimation);
}

// animate the drop from the top of the jump
function dropAnimation() {
    $ball.css('z-index', '4');
    toggleMasks();
    $ball.animate({
        left: coords[currentLane-1][landingRow-1].dropXpos,
        top: coords[currentLane-1][landingRow-1].dropYpos,
        width: '44px'},
        250,
        'easeInQuad',
        rollToHoleAnimation);
}

// Decides what to do based on if ball landed in hole or not.
// Should it sink, or should it roll?
function rollToHoleAnimation() {
    if (shouldSink) {
        switch(coords[currentLane-1][landingRow-1].landingBox) {
            case 15:
                award = VBALL.options.awards[0];
                break;
            case 31:
                award = VBALL.options.awards[6];
                break;
            case 32:
                award = VBALL.options.awards[5];
                break;
            case 33:
                award = VBALL.options.awards[4];
                break;
            case 34:
                award = VBALL.options.awards[3];
                break;
            case 35:
                award = VBALL.options.awards[2];
                break;
            case 55:
                award = VBALL.options.awards[1];
                break;
        }
        sinkAnimation();
    } else {
        // handle roll to hole animations
        findAnimation();
    }
}

// Make the ball appear to sink into a hole
function sinkAnimation() {
    $ball.animate({top: '+=10'}, 200, 'linear', function() {
        $ball.animate({top: '+=25', height: '-=30'}, 200, 'linear', reset);
    });
}

// Pass along path animation values based on where the ball lands
// this also finds the score of the shot
function findAnimation() {
    switch (coords[currentLane-1][landingRow-1].landingBox) {
        case 11:
        case 12:
            aniPath(212, 266, 75, 0.35, 328, 320, 160, 0.1, 750, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 13:
            aniPath(210, 210, 70, 0.6, 328, 320, 150, 0.3, 1000, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 14:
            aniPath(214, 172, 50, 1.15, 328, 320, 120, 0.3, 1250, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 21:
        case 22:
            aniPath(275, 312, 75, 0.25, 328, 320, 160, 0.1, 500, 'linear');
            award = VBALL.options.awards[6];
            break;
        case 23:
            aniPath(270, 218, 75, 0.25, 328, 266, 160, 0.1, 500, 'linear');
            award = VBALL.options.awards[5];
            break;
        case 24:
        case 25:
            aniPath(275, 158, 85, 1.22, 328, 320, 180, 0.2, 1500, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 41:
        case 42:
            aniPath(380, 312, -75, 0.25, 328, 320, -160, 0.1, 500, 'linear');
            award = VBALL.options.awards[6];
            break;
        case 43:
            aniPath(385, 218, -75, 0.25, 328, 266, -160, 0.1, 500, 'linear');
            award = VBALL.options.awards[5];
            break;
        case 44:
        case 45:
            aniPath(380, 158, -85, 1.22, 328, 320, -180, 0.2, 1500, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 51:
        case 52:
            aniPath(444, 266, -75, 0.35, 328, 320, -160, 0.1, 750, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 53:
            aniPath(444, 210, -70, 0.6, 328, 320, -150, 0.3, 1000, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
        case 54:
            aniPath(440, 172, -50, 1.15, 328, 320, -120, 0.3, 1250, 'easeInQuad');
            award = VBALL.options.awards[6];
            break;
    }
}

// Uses the jQuery Path plugin to animate along a curve
// https://github.com/weepy/jquery.path
function aniPath(sx, sy, sa, sl, ex, ey, ea, el, time, ease) {
    $ball.animate({
        path : new $.path.bezier({
            start: { x: sx, y: sy, angle: sa, length: sl },
            end:   { x: ex, y: ey, angle: ea, length: el }
        }
    )}, time, ease, sinkAnimation);
}

// toggle any masking images and update z-indexes if needed
function toggleMasks() {
    switch (coords[currentLane-1][landingRow-1].landingBox) {
        case 15:
            $('#mask_1-1').css('display', 'block');
            shouldSink = true;
            break;
        case 23:
        case 43:
            $('#pv_5-3').css('z-index', '7');
            $('#mask_middle').css('display', 'block');
            break;
        case 24:
        case 25:
        case 44:
        case 45:
            $('#pv_1-3').css('z-index', '7');
            $('#pv_2-3').css('z-index', '7');
            $('#pv_3-3').css('z-index', '7');
            $('#pv_4-3').css('z-index', '7');
            $('#mask_upper').css('display', 'block');
            break;
        case 31:
            shouldSink = true;
            break;
        case 32:
            $('#pv_5-3').css('z-index', '7');
            $('#mask_middle').css('display', 'block');
            shouldSink = true;
            break;
        case 33:
            $('#pv_4-3').css('z-index', '7');
            $('#mask_3-3').css('display', 'block');
            shouldSink = true;
            break;
        case 34:
            $('#pv_3-3').css('z-index', '7');
            $('#pv_4-3').css('z-index', '7');
            $('#mask_2-3').css('display', 'block');
            shouldSink = true;
            break;
        case 35:
            $('#pv_2-3').css('z-index', '7');
            $('#mask_1-3').css('display', 'block');
            shouldSink = true;
            break;
        case 55:
            $('#mask_1-5').css('display', 'block');
            shouldSink = true;
            break;
    }
}

// reset everything for the next round
function reset() { //newBall

    VBALL.options.awardTotal += award;
    // sendAwardValue(award);
    VBALL.$score.text(VBALL.options.awardTotal);


    // deduct 1 from ballsRemaining and update the scoreboard
    $ballCount.text(--VBALL.options.ballsRemaining);

    // $score.text(VBALL.options.awardTotal);
    if (VBALL.options.ballsRemaining > 0) {
        $ball.css({
            left: '301px',
            top: '610px',
            width: '98px',
            height: 'auto',
            zIndex: '11'
        });
        rolling = false;
        shifting = false;
        shouldSink = false;
        currentLane = 3;
        $('.mask').css('display', 'none');
        $('#mask_lower').css('display', 'block');
        $('.cup-value').css('z-index', '3');
        $power.css('width', '4%');
        continueGame();
    } else {
        // if (VBALL.options.returnCode == '0') {
            gameOver();
            $power.stop();
            $power.css('width', '4%');
        // }
    }
}