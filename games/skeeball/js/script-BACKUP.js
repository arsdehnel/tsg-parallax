;(function($, window, document, undefined) {

var
$ball = $('#ball'),
$power = $('#power'),
$roll = $('#lets-roll'),
$left = $('#move-left'),
$right = $('#move-right'),
rolling = false,
shifting = false,
shiftSpeed = 100,
shouldSink = false,
laneOffset = 129, // distance between starting positions
currentLane = 3,  // starting lane out of 5 - 3 is the middle lane
power = 0.50,
powerSpeed = 1500,
pmWidth = 365, // 100% width of power meter
landingRow,
laneAniSpeed,
jumpAniSpeed,
jumpYpos,
jumpXpos,
dropYpos,
dropXpos,
coords = [ // coords[lane][row]
    [   // 11 and 12 land in same spot
        {jumpXpos:'206px', dropYpos:'266px', dropXpos:'212px', landingBox:11}, // lane 1, row 1
        {jumpXpos:'206px', dropYpos:'266px', dropXpos:'212px', landingBox:12}, // lane 1, row 2
        {jumpXpos:'206px', dropYpos:'210px', dropXpos:'210px', landingBox:13}, // lane 1, row 3
        {jumpXpos:'206px', dropYpos:'172px', dropXpos:'214px', landingBox:14}, // lane 1, row 4
        {jumpXpos:'218px', dropYpos:'132px', dropXpos:'222px', landingBox:15}  // lane 1, row 5
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

$roll.on('click', startRoll);

// Handle the move left and right buttons to place the ball
$left.on('click', function() {
    if (currentLane === 1 || shifting || rolling) { return; }
    else {
        currentLane -= 1;
        shifting = true;
        $ball.animate({left: '-=129'}, shiftSpeed, function() {
            shifting = false;
        });
    }
});
$right.on('click', function() {
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
// $power.css('width', '55%'); //set power here for testing

function startRoll() {
    if (shifting) { return; } // do nothing if ball isn't placed yet.
    $power.stop(); // stop the power meter
    power = $power.width() / pmWidth; // get the power value
    rolling = true;
    findLanding();
    switch (currentLane) {
        case 1:
            console.log("Lane 1");
            laneAnimation('200px');
            break;
        case 2:
            console.log("Lane 2");
            laneAnimation('263px');
            break;
        case 3:
            console.log("Lane 3");
            laneAnimation('322px');
            break;
        case 4:
            console.log("Lane 4");
            laneAnimation('380px');
            break;
        case 5:
            console.log("Lane 5");
            laneAnimation('438px');
            break;
    }
}

function findLanding() {
    if (power <= 0.2) {
        laneAniSpeed = 1500;
        jumpAniSpeed = 550;
        landingRow = 1;
        jumpYpos = '250px';
    }
    else if (power > 0.2 && power <= 0.4){
        laneAniSpeed = 1250;
        jumpAniSpeed = 550;
        landingRow = 2;
        jumpYpos = '222px';
    }
    else if (power > 0.4 && power <= 0.6){
        laneAniSpeed = 1000;
        jumpAniSpeed = 550;
        landingRow = 3;
        jumpYpos = '116px';
    }
    else if (power > 0.6 && power <= 0.8){
        laneAniSpeed = 750;
        jumpAniSpeed = 550;
        landingRow = 4;
        jumpYpos = '78px';
    }
    else if (power > 0.8){
        laneAniSpeed = 500;
        jumpAniSpeed = 500;
        landingRow = 5;
        jumpYpos = '38px';
    }
}

function laneAnimation(xPos) {
    $ball.animate({
        left: xPos,
        top: '356px',
        width: '60px'},
        laneAniSpeed,
        'linear',
        jumpAnimation);
}

function jumpAnimation() {
    $ball.animate({
        left: coords[currentLane-1][landingRow-1].jumpXpos,
        top: jumpYpos,
        width: '52px'},
        jumpAniSpeed,
        'easeOutQuad',
        dropAnimation);
}

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

function rollToHoleAnimation() {
    if (shouldSink) {
        sinkAnimation();
    } else {
        // handle roll to hole animations
        findAnimation();
    }
}

function sinkAnimation() {
    console.log('sink!');
    $ball.animate({top: '+=10'}, 200, 'linear', function() {
        $ball.animate({top: '+=25', height: '-=30'}, 200, 'linear');
    });
}

function findAnimation() {
    switch (coords[currentLane-1][landingRow-1].landingBox) {
        case 11:
        case 12:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 212, y: 266, angle: 75, length: 0.35 },
                    end:   { x: 328, y: 320, angle: 160, length: 0.1 }
                }
            )}, 750, 'easeInQuad', sinkAnimation);
            break;
        case 13:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 210, y: 210, angle: 70, length: 0.6 },
                    end:   { x: 328, y: 320, angle: 150, length: 0.3 }
                }
            )}, 1000, 'easeInQuad', sinkAnimation);
            break;
        case 14:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 214, y: 172, angle: 50, length: 1.15 },
                    end:   { x: 328, y: 320, angle: 120, length: 0.3 }
                }
            )}, 1250, 'easeInQuad', sinkAnimation);
            break;
        case 21:
        case 22:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 275, y: 312, angle: 75, length: 0.25 },
                    end:   { x: 328, y: 320, angle: 160, length: 0.1 }
                }
            )}, 500, 'linear', sinkAnimation);
            break;        
        case 23:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 270, y: 218, angle: 75, length: 0.25 },
                    end:   { x: 328, y: 266, angle: 160, length: 0.1 }
                }
            )}, 500, 'linear', sinkAnimation);
            break;
        case 24:
        case 25:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 275, y: 158, angle: 85, length: 1.2 },
                    end:   { x: 328, y: 320, angle: 160, length: 0.2 }
                }
            )}, 1500, 'easeInQuad', sinkAnimation);
            break;
        case 41:
        case 42:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 380, y: 312, angle: -75, length: 0.25 },
                    end:   { x: 328, y: 320, angle: -160, length: 0.1 }
                }
            )}, 500, 'linear', sinkAnimation);
            break;        
        case 43:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 385, y: 218, angle: -75, length: 0.25 },
                    end:   { x: 328, y: 266, angle: -160, length: 0.1 }
                }
            )}, 500, 'linear', sinkAnimation);
            break;
        case 44:
        case 45:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 380, y: 158, angle: -85, length: 1.2 },
                    end:   { x: 328, y: 320, angle: -160, length: 0.2 }
                }
            )}, 1500, 'easeInQuad', sinkAnimation);
            break;
        case 51:
        case 52:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 444, y: 266, angle: -75, length: 0.35 },
                    end:   { x: 328, y: 320, angle: -160, length: 0.1 }
                }
            )}, 750, 'easeInQuad', sinkAnimation);
            break;
        case 53:
            $ball.animate({
                path : new $.path.bezier({
                    start: { x: 444, y: 210, angle: -70, length: 0.6 },
                    end:   { x: 328, y: 320, angle: -150, length: 0.3 }
                }
            )}, 1000, 'easeInQuad', sinkAnimation);
            break;
        case 54:
            // $ball.animate({
            //     path : new $.path.bezier({
            //         start: { x: 440, y: 172, angle: -50, length: 1.15 },
            //         end:   { x: 328, y: 320, angle: -120, length: 0.3 }
            //     }
            // )}, 1250, 'easeInQuad', sinkAnimation);
            aniPath(440, 172, -50, 1.15, 328, 320, -120, 0.3, 1250, 'easeInQuad');
            break;
    }
}

function aniPath(sx, sy, sa, sl, ex, ey, ea, el, time, ease) {
    $ball.animate({
        path : new $.path.bezier({
            start: { x: sx, y: sy, angle: sa, length: sl },
            end:   { x: ex, y: ey, angle: ea, length: el }
        }
    )}, time, ease, sinkAnimation);
}

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
        case 34: ///////////////
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





powerUp(); // start the power meter








})(jQuery, this, this.document);