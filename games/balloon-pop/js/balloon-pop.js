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
    balloonPositions = [
        {"top":"600px",  "left":"400px"},
        {"top":"520px",  "left":"600px"},
        {"top":"620px", "left":"800px"},
        {"top":"720px", "left":"400px"},
        {"top":"820px", "left":"550px"},
        {"top":"920px", "left":"300px"},
        {"top":"1020px", "left":"450px"},
        {"top":"1120px", "left":"900px"},
        {"top":"1220px", "left":"650px"},
        {"top":"1320px", "left":"400px"},
        {"top":"1420px", "left":"700px"}
    ],
    popped = false;

function randInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePrizePlay() {
    var url = '/something/to/point/to.do',
        data = {"prizePlays":"1"}; // whatever data needs to be sent to the server after dart is thrown

    // This is called after dart is thrown so Prize Play points can be updated
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            // update the prize plays amount in the interface
            // window.parent.points('10');     // replaces the points value with whatever is provided
            // window.parent.replacePPNums();  // replaces the text with the digit images
            // window.parent.disableGames();   // makes games unselectable if there aren't enough points to play them
        }
    });
}

function animateClouds() {
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

    animateTimeout = window.setTimeout(animateClouds, 50);
}

// Tests for collision between two circles
function hitTest() {
    dartX = $dart.offset().left;
    dartY = $dart.offset().top;

    var tipLeft = dartX + 15,
        tipRight = tipLeft + 16,
        tipTop = dartY,
        bWidth = 66,  // back balloon
        bHeight = 76,
        mWidth = 93,  // mid balloon
        mHeight = 109,
        fWidth = 128, // fore balloon
        fHeight = 147;

    $('.blue-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 340) { // make sure balloons are visible before detecting collisions
            if (tipLeft > offset.left && tipLeft < offset.left + bWidth
                  && tipTop > offset.top && tipTop < offset.top + bHeight) {
                    balloonHit($this);
            }
        }
    });
    $('.red-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 340) { // make sure balloons are visible before detecting collisions
            if (tipLeft > offset.left && tipLeft < offset.left + bWidth
                  && tipTop > offset.top && tipTop < offset.top + bHeight) {
                    balloonHit($this);
            }
        }
    });

    $('.orange-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 426) {
            if (tipLeft > offset.left && tipLeft < offset.left + mWidth
                  && tipTop > offset.top && tipTop < offset.top + fHeight) {
                    balloonHit($this);
            }
        }
    });
    $('.purple-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 426) {
            if (tipLeft > offset.left && tipLeft < offset.left + mWidth
                  && tipTop > offset.top && tipTop < offset.top + mHeight) {
                    balloonHit($this);
            }
        }
    });
    $('.pink-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 426) {
            if (tipLeft > offset.left && tipLeft < offset.left + mWidth
                  && tipTop > offset.top && tipTop < offset.top + mHeight) {
                    balloonHit($this);
            }
        }
    });

    $('.yellow-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 520) {
            if (tipLeft > offset.left && tipLeft < offset.left + fWidth
                  && tipTop > offset.top && tipTop < offset.top + mHeight) {
                    balloonHit($this);
            }
        }
    });

    $('.green-balloon').each(function() {
        var $this = $(this),
            offset = $this.offset();

        if (offset.top < 520) {
            if (tipLeft > offset.left && tipLeft < offset.left + fWidth
                  && tipTop > offset.top && tipTop < offset.top + fHeight) {
                    balloonHit($this);
            }
        }
    });
}

function balloonHit($el) {
    $el.attr('id', 'balloonHit');
    $el.removeClass('poppable');
    popped = true;
    $dart.stop().remove();
    $('#prize-layer').fadeIn(800);

    // make calls to the interface script in the parent window (outside of the iframe)
    // window.parent.$bPopBack.fadeIn(500); // show the back to game select text
    // window.parent.$bPopBack.on('click', window.parent.slideOutBalloon); // add event listener
}

function throwDart() {
    thrown = true;
    updatePrizePlay();
    $dart.animate(
        {
            left: '-=20',
            top: '-=800'
        },
        {
            queue: false,
            duration: 1000,
            step: hitTest,
            complete: function(){
                thrown = false;
                // dart missed, reset it
                $('#dart').css('top', '30px');
            }
        }
    );
}

function animateBalloons() {
    if (popped) {return;}

    var vxB = -1,
        vyB = -3,
        i = 0,
        bPos = null,
        $currBalloon = null;

    for (i = 0; i < $('.poppable').length; i++) {
        bPos = $('#balloon' + i).position();
        if (bPos.left < -140 || bPos.top < - 350) {
            g('balloon' + i).style.left = balloonPositions[i].left;
            g('balloon' + i).style.top = balloonPositions[i].top;
        } else {
            g('balloon' + i).style.left = (bPos.left + vxB) + "px";
            g('balloon' + i).style.top = (bPos.top + vyB) + "px";
        }
    }
    window.setTimeout(animateBalloons, 50);
}


$dart.draggable({containment: "#constraint"});
$dart.on('drag', function(){
    var offset = $dart.offset();
    dartX = offset.left;
    dartY = offset.top;
    vx = 0;
    vy = 0;
});
$dart.on('dragstop', throwDart);
$dart.on('click', throwDart);

// start the animation
animateTimeout = window.setTimeout(animateClouds, 200);
window.setTimeout(animateBalloons, 50);

})(jQuery, this, this.document);
