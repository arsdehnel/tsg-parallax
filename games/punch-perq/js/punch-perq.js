;(function($, window, document, undefined) {
function g(el) { return document.getElementById(el) };

var $glove = $('#glove'),
    glove = document.getElementById('glove'),
    gloveX = $glove.position().left,
    gloveY = $glove.position().top,
    thrown = false,
    vx = -0.01,
    vy = 0,
    i = 0,
    bubbles = $('.poppable'),
    animateTimeout = null,
    stop = false,
    $papBoard = $('#pap-game-board'),
    $papBoardArea = $('#pap-game-inner'),
    bubblePositions = [
        {"top":"60px",  "left":"210px"},
        {"top":"128px",  "left":"546px"},
        {"top":"180px", "left":"390px"},
        {"top":"209px", "left":"5px"},
        {"top":"218px", "left":"182px"},
        {"top":"343px", "left":"555px"},
        {"top":"343px", "left":"72px"},
        {"top":"440px", "left":"270px"},
        {"top":"440px", "left":"90px"},
        {"top":"508px", "left":"390px"},
        {"top":"535px", "left":"586px"},
        {"top":"543px", "left":"0px"}
    ],
    popped = false,
    pointArray = [{
        id: "32",
        name: "AwardperQs",
        value: 150,
        points: [25,25,50,20,30]
     }],
    countClick = 0;

function randInt (from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
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

// Tests for collision between two circles
function hitTest() {

    var tipLeft = gloveX,
        tipRight = tipLeft + 124,
        tipTop = gloveY,
        bLeft = bubbles.offset().left,
        bRight = bubbles.offset().left + bubbles,// bubble
        bTop = bubbles.offset().top;

    bubbles.each(function() {
            if (bLeft === $papBoardArea || bTop === $papBoardArea) {
                   console.log('hit');

            }
    });

}

function popBubble(e) {

    var bubbleCount = $('.poppable.popped').length;

    if(bubbleCount < 5){
        $(this).stop();

        $(this).addClass('popped').append("<span>" + pointArray.points[countClick++] +"</span>");

        $('.popped').fadeOut(800,function(){
            $(this).css('background-image');
        });

        $('.popped').unbind('click');
        updateScore();

        if(countClick >= 5){
           $('#constraint').css('z-index', '11');
           EndGame();
        }

    }
}

function updateScore(){
    var points = 0;
            $('.poppable span').each(function(){
                points += Number($(this).text());
            });

    $('#pap-point-total span').text(points);
}

function EndGame($el) {
    popped = true;
    $('#prize-layer').fadeIn(1000);
    $('#pap-game-board').css('cursor', 'default');
    $('#glove').hide();
    bubbles.stop();
    $('.bokeh1').stop();


    // make calls to the interface script in the parent window (outside of the iframe)
    // window.parent.$bPopBack.fadeIn(500); // show the back to game select text
    // window.parent.$bPopBack.on('click', window.parent.slideOutBalloon); // add event listener
}

function animateBubbles(obj) {

    var $this = $(this),
        //board area
        pPos = $papBoardArea.offset(),
        pHeight = $papBoardArea.height(),
        pWidth = $papBoardArea.width() + 45,

        bHeight = bubbles.height(),
        bWidth = bubbles.width(),

        maxY = pPos.top + pHeight - bHeight,
        maxX = pPos.left + pWidth - bWidth,

        minY = pPos.top - 20,
        minX = pPos.left - 45,

        newY = randInt(minY, maxY),
        newX = randInt(minX, maxX);

                obj.animate({
                        "left" : newX,
                        "top" : newY
                }, randInt(1000,5000), function(){
                    animateBubbles(obj);
                });

};

function moveBokehRight(){
    $('.bokeh1').animate({
        "background-position-x": "0",
        "background-position-y": "-70"
    }, 12000, function(){
        moveBokehLeft();
    });
}
function moveBokehLeft(){
    $('.bokeh1').animate({
        "background-position-x": "-380",
        "background-position-y": "10"
    }, 12000, function(){
        moveBokehRight();
    });
}
function setcoords(e){
    var x=event.clientX;
    var y=event.clientY;
}

$('#pap-game-board').mousemove(function(e){

    $('#glove').css({
        "top":e.pageY ,
        "left":e.pageX
    });

});

$('#glove').click(function(e){
        $(this).hide();
        setcoords().click();
        $(this).show();
    });

 //start the animation
bubbles.each(function(){
        animateBubbles($(this));
});

$('.poppable').click(function(e){
        e.stopPropagation();
        popBubble.apply(this);
});


 moveBokehLeft();

 $.ajax({
    type: "GET",
    cache: false,
    url: 'punch-prizes.json',
    beforeSend: function(x) {
        if(x && x.overrideMimeType) {
            x.overrideMimeType("application/j-son;charset=UTF-8");
        }
    },
    dataType: "json",
    success: function(data){
        pointArray = data[0];

        // should only be one prize in the JSON data object
        $('#prize-description').text(data.value);


    }
});

})(jQuery, this, this.document);
