;(function($, window, document, undefined) {

var $chip = $('#chip'),
    chip = document.getElementById('chip');
    chipR = 33,
    chipX = $chip.position().left + chipR,
    chipY = $chip.position().top + chipR,
    chipRotate = 0,
    dropped = false,
    vx = 0,
    vy = 0,
    vyPrev = vy, // to slow the chip to a stop if it is rolling across the bottom.
    bounce = -0.65,
    gravity = 0.25,
    stop = false,
    pegs = [
        { 'x': 70,  'y': 120, 'radius': 11, 'touching': false },
        { 'x': 210, 'y': 120, 'radius': 11, 'touching': false },
        { 'x': 350, 'y': 120, 'radius': 11, 'touching': false },
        { 'x': 490, 'y': 120, 'radius': 11, 'touching': false },
        { 'x': 630, 'y': 120, 'radius': 11, 'touching': false },
        { 'x': 0,   'y': 220, 'radius': 11, 'touching': false },
        { 'x': 140, 'y': 220, 'radius': 11, 'touching': false },
        { 'x': 280, 'y': 220, 'radius': 11, 'touching': false },
        { 'x': 420, 'y': 220, 'radius': 11, 'touching': false },
        { 'x': 560, 'y': 220, 'radius': 11, 'touching': false },
        { 'x': 700, 'y': 220, 'radius': 11, 'touching': false },
        { 'x': 70,  'y': 315, 'radius': 11, 'touching': false },
        { 'x': 210, 'y': 315, 'radius': 11, 'touching': false },
        { 'x': 350, 'y': 315, 'radius': 11, 'touching': false },
        { 'x': 490, 'y': 315, 'radius': 11, 'touching': false },
        { 'x': 630, 'y': 315, 'radius': 11, 'touching': false },
        { 'x': 0,   'y': 405, 'radius': 11, 'touching': false },
        { 'x': 140, 'y': 405, 'radius': 11, 'touching': false },
        { 'x': 280, 'y': 405, 'radius': 11, 'touching': false },
        { 'x': 420, 'y': 405, 'radius': 11, 'touching': false },
        { 'x': 560, 'y': 405, 'radius': 11, 'touching': false },
        { 'x': 700, 'y': 405, 'radius': 11, 'touching': false },
        { 'x': 70,  'y': 500, 'radius': 11, 'touching': false },
        { 'x': 210, 'y': 500, 'radius': 11, 'touching': false },
        { 'x': 350, 'y': 500, 'radius': 11, 'touching': false },
        { 'x': 490, 'y': 500, 'radius': 11, 'touching': false },
        { 'x': 630, 'y': 500, 'radius': 11, 'touching': false },
        { 'x': 0,   'y': 590, 'radius': 11, 'touching': false },
        { 'x': 140, 'y': 590, 'radius': 11, 'touching': false },
        { 'x': 280, 'y': 590, 'radius': 11, 'touching': false },
        { 'x': 420, 'y': 590, 'radius': 11, 'touching': false },
        { 'x': 560, 'y': 590, 'radius': 11, 'touching': false },
        { 'x': 700, 'y': 590, 'radius': 11, 'touching': false }
    ],
    pegCount = pegs.length,
    i = 0, // for iterating through the pegs array
    iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false ),
    even = true;

function release() {
    if (dropped) return; // do nothing if chip has already been released

    // send off current winning prize
    $.ajax({
        type: "POST",
        url: url,
        data: prizes[winningPrize],
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            alert('yay');
            // update the prize plays amount in the interface
            // window.parent.points('10');     // replaces the points value with whatever is provided
            // window.parent.replacePPNums();  // replaces the text with the digit images
            // window.parent.disableGames();   // makes games unselectable if there aren't enough points to play them
        }
    });

    var position = $chip.position();
    chipX = position.left + chipR;
    chipY = position.top + chipR;
    dropped = true;
    $chip.draggable('destroy');
}

function animate() {
    if (stop) return;
    requestAnimationFrame(animate);

    var left = -10,
        right = 710,
        top = 0,
        bottom = 720,
        chipLeft,
        chipTop;

    if (dropped) {
        vy += gravity;
        chipX += vx;
        chipY += vy;

        // Check if chip has collided with any of the edges of the game board
        if (chipX + chipR > right) {
            chipX = right - chipR;
            vx *= bounce;
        } else if (chipX - chipR < left) {
            chipX = left + chipR;
            vx *= bounce;
        }
        if (chipY + chipR > bottom) {
            chipY = bottom - chipR;
            vy *= bounce;
        } else if (chipY - chipR < top) {
            chipY = top + chipR;
            vy *= bounce;
        }

        // Get the current left and top position of the chip
        chipLeft = chipX - chipR;
        chipTop = chipY - chipR;

        // Test for collision against each of the pegs
        for (i = 0; i < pegCount; i++) {
            hitTest(pegs[i]);
        }

        // Mobile Safari is tripping over itself when trying to perform a -webkit-transform:rotate();
        // call and set an element's position during the same animation frame. So if this is running
        // on an iOS device, break up the positioning and rotation so they are performed in every
        // other frame.
        if (!iOS) {
            $chip[0].style.left = chipLeft + 'px';
            $chip[0].style.top = chipTop + 'px';
            chipRotate += vx;
            $chip.rotate(chipRotate);
        } else {
            if (even) {
                $chip[0].style.left = chipLeft + 'px';
                $chip[0].style.top = chipTop + 'px';
                even = false;
            } else {
                chipRotate += vx;
                $chip.rotate(chipRotate);
                even = true;
            }
        }

        // Stop the chip if it reaches the bottom
        if (chipTop > 580 && vy > 0) {
            vy *= 0.8; // set veritcal velocity to 80% of its speed each in each frame to slow it to a stop
            vx = 0; // immediately stop horizontal velocity
            if (vy < 0.2) {
                vy = 0; // if vertical velocity is sufficiently slow, set it to 0
                stop = true;
                whichPrize(chipLeft, chipR); // chip has landed

                // make calls to the interface script in the parent window (outside of the iframe)
                // window.parent.$plinkoBack.fadeIn(500); // show the back to game select text
                // window.parent.$plinkoBack.on('click', window.parent.slideOutPlinko); // add event listener
                $plinkoBack.fadeIn(500); // show the back to game select text
                $plinkoBack.on('click', window.parent.modalClose); // add event listener
            }
        }
    }
}

function whichPrize(left, radius) {
    // dividing lines separating the prize slots
    var div1 = 140 - radius,
        div2 = 280 - radius,
        div3 = 420 - radius,
        div4 = 560 - radius,
        div5 = 700; // right edge

    // assuming 5 prizes, numbered 0 through 4
    switch(true) {
        case (left <= div1):
            winningPrize = 0;
            break;
        case (left > div1 && left <= div2):
            winningPrize = 1;
            break;
        case (left > div2 && left <= div3):
            winningPrize = 2;
            break;
        case (left > div3 && left <= div4):
            winningPrize = 3;
            break;
        case (left > div4 && left <= div5):
            winningPrize = 4;
            break;
    }

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
function hitTest(peg) {
    // Use the center points of each circle to form a right triangle
    var dx = chipX - peg.x; // length of horizontal leg of the triangle
    var dy = chipY - peg.y; // length of vertical leg of the triangle

    // Distance between center points of chip and peg
    var dist = Math.sqrt(dx * dx + dy * dy); //Pythagorean Theorem FTW

    // Add the radius of the two circles being checked together. If the distance
    // between both center points is less than this sum, the circles are touching.
    if (dist < (chipR + peg.radius) && !peg.touching) {
        // Collision has occurred
        peg.touching = true;

        // do coordinate rotation and perform bounce
        var angle = Math.atan2(dy, dx);
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);

        // nudge the chip left or right if bounce is exactly vertical so that it doesn't
        // get stuck or fall through the pegs.
        if (angle * (180 / Math.PI) == -90) {
            if (even) {
                vx += 0.025;
            } else {
                vx -= 0.025;
            }
        }
        // rotate the velocity of the chip
        var vx1 = vx * cos + vy * sin;
        var vy1 = vy * cos - vx * sin;

        vx1 *= bounce;

        // rotate velocities back to the correct directions
        vx = vx1 * cos - vy1 * sin;
        vy = vy1 * cos + vx1 * sin;


    } else if (dist > (chipR + peg.radius) && peg.touching) {
            peg.touching = false;
    }
}

$chip.draggable({containment: "#constraint"});
$chip.on('drag', function(){
    var position = $chip.position();
    chipX = position.left + chipR;
    chipY = position.top + chipR;
    vx = 0;
    vy = 0;

    if ($chip.position().top > 35) {
        $chip[0].style.top = '35px';
    }
});
$chip.on('dragstop', release);
$chip.on('click', release);

// start the animation
requestAnimationFrame(animate);

})(jQuery, this, this.document);