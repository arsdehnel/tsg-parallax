;(function($, window, document, undefined) {
function g(el) { return document.getElementById(el) }

var $dart = $('#dart'),
    dart = document.getElementById('dart');
    dartX = $dart.position().left,
    dartY = $dart.position().top,
    thrown = false,
    vx = -0.01,
    vy = 0,
    i = 0,
    balloons = [],
    animateTimeout = null,
    generateTimeout = null,
    cloud1Left = $('#cloud1').position().left,
    cloud2Left = $('#cloud2').position().left,
    cloud3Left = $('#cloud3').position().left,
    cloud4Left = $('#cloud4').position().left,
    cloud5Left = $('#cloud5').position().left,
    backLeft = $('#clouds-back').position().left,
    midLeft = $('#clouds-mid ').position().left,
    foreLeft = $('#clouds-fore').position().left,
    stop = false,
    $bpopBoard = $('#bpop-game-board'),
    bID = 0; // used to give each balloon a unique ID

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animateStuff() {
    var vx1 = 0.06,
        vx2 = -0.05,
        vx3 = 0.0125,
        vx4 = -0.0125,
        vx5 = -0.0215,
        vxBack = -0.25,
        vxMid = -0.5,
        vxFore = -1,
        vxDart = -0.1,
        vyDart = -3;

    cloud1Left += vx1;
    cloud2Left += vx2;
    cloud3Left += vx3;
    cloud4Left += vx4;
    cloud5Left += vx5;
    backLeft += vxBack;
    midLeft += vxMid;
    foreLeft += vxFore;

    g('cloud1').style.left = cloud1Left + 'px';
    g('cloud2').style.left = cloud2Left + 'px';
    g('cloud3').style.left = cloud3Left + 'px';
    g('cloud4').style.left = cloud4Left + 'px';
    g('cloud5').style.left = cloud5Left + 'px';

    g('clouds-back').style.backgroundPosition = backLeft + "px 0px";
    g('clouds-mid').style.backgroundPosition = midLeft + "px 0px";
    g('clouds-fore').style.backgroundPosition = foreLeft + "px 0px";

    if (thrown){
        
        hitTest();
    }

    animateTimeout = window.setTimeout(animateStuff, 50);
}

function whichPrize() {
    // Send off the winning prize object once the chip has landed
    $.ajax({
        type: "POST",
        url: url,
        data: prizes[winningPrize],
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            // something
        }
    });
}

// Tests for collision between two circles
function hitTest() {
    var dartPos = $dart.position();
    var tipLeft = dartPos.left + 15,
        tipRight = tipLeft + 16,
        tipTop = dartPos.top,
        dartHeight = 100,
        bWidth = 66,  // back balloon
        bHeight = 76,
        mWidth = 93,  // mid balloon
        mHeight = 109,
        fWidth = 128, // fore balloon
        fHeight = 147;

    // > dart.left + 15 && < dart.left + 31

    // console.log(dartPos.left);
    // console.log(dartPos.top);

    // if ($('.blue-balloon').length > 0) {
    //     $('.blue-balloon').each(function(){
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + bWidth
    //               && tipTop > $this.position().top + bHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('blue collision');
    //         }
    //     });
    // }
    // if ($('.red-balloon').length > 0) {
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + bWidth
    //               && tipTop > $this.position().top + bHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('red collision');
    //         }
    // }

    // if ($('.orange-balloon').length > 0) {
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + mWidth
    //               && tipTop > $this.position().top + mHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('orange collision');
    //         }
    // }
    // if ($('.purple-balloon').length > 0) {
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + mWidth
    //               && tipTop > $this.position().top + mHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('purple collision');
    //         }
    // }
    // if ($('.pink-balloon').length > 0) {
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + mWidth
    //               && tipTop > $this.position().top + mHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('pink collision');
    //         }
    // }

    // if ($('.yellow-balloon').length > 0) {
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + fWidth
    //               && tipTop > $this.position().top + fHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('yellow collision');
    //         }
    // }
    // if ($('.green-balloon').length > 0) {
    //         var $this = $(this);
    //         if (tipLeft > $this.position().left
    //               && tipLeft < $this.position().left + fWidth
    //               && tipTop > $this.position().top + fHeight
    //               && tipTop < $this.position().top) {
    //                 console.log('green collision');
    //         }
    // }

}

function throwDart() {
    thrown = true;
    $dart.animate(
        {
            left: '-=20',
            top: '-=800'
        },
        {
            queue: false,
            duration: 1500,
            step: hitTest,
            complete: function(){
                thrown = false;
                // console.log('complete');
                // $dart.css({
                //     left: '460px',
                //     bottom: '40px'
                // });
            }
        }
    );
    // send response to server to update prize play points
}

function generateBalloon() {
    var left = 0,
        right = 650,
        balloons = [
            'blue-balloon',
            'red-balloon',
            'orange-balloon',
            'purple-balloon',
            'pink-balloon',
            'yellow-balloon',
            'green-balloon'
        ],
        $balloon = '',
        bStart = randInt(0, right),
        bEnd = randInt(0, right),
        bTimer = 1000;

    // $(randInt(0, balloons.length-1))
    // console.log(balloons[randInt(0, balloons.length-1)]);

    // attach balloon
    $bpopBoard.append('<div class="'+ balloons[randInt(0, balloons.length-1)] +' poppable" id="balloon'+ bID +'"></div>');

    $balloon = $('#balloon'+ bID);
    $balloon.css({
        'left': bStart + 'px',
        'top' : '720px'
    });

    if (bTimer == 9000) {
        bTimer = 1000;
    } else {
        bTimer = 9000;
    }

    // animate balloon
    $balloon.animate({
        path : new $.path.bezier({
            start: { x: bStart, y: 720, angle: 50 },
            end: { x: bEnd, y: -400, angle: 50, length: 0.20 }
        }
    )}, bTimer, function() {
            $balloon.remove();
    });

    // increment bID
    bID += 1;
    generateTimeout = window.setTimeout(generateBalloon, 900);
}

$dart.draggable({containment: "#constraint"});
$dart.on('drag', function(){
    var position = $dart.position();
    dartX = position.left;
    dartY = position.top;
    vx = 0;
    vy = 0;
});
$dart.on('dragstop', throwDart);
$dart.on('click', throwDart);

// start the animation
animateTimeout = window.setTimeout(animateStuff, 200);
generateTimeout = window.setTimeout(generateBalloon, 50);

})(jQuery, this, this.document);
