;(function($, window, document, undefined) {

function updatePrizePlay() {
    var url = 'prize-wheel-prize.json',
        data = {"prizePlays":"1"}; // whatever data needs to be sent to the server after dart is thrown

    // This is called after wheel is spun so Prize Play points can be updated
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

function spinClicked() {
    var $self = $( this );
    updatePrizePlay(); // call to update the prize play points available
    $self.addClass( 'active' ); // add active class when button is clicked to maintain click state
    $('#wheel').animate({
            top: -80
        }, {
            duration: 5000,
            easing: 'easeOutCirc',
            complete: function(){
                $self.removeClass( 'active' );
            }
        }
    );


    // Send any info to the server if needed.
    // $.ajax({
    //     type: "POST",
    //     url: url,
    //     data: data,
    //     dataType: "json",
    //     contentType: "application/json; charset=utf-8",
    //     success: function(msg) {
    //         // success
    //     }
    // });
}

    function oscillate( obj ){
        var currPos = $( obj ).offset(),
            currPosY = currPos.top,
            dy = 3;

        $( obj ).animate({
                top: currPosY - dy
            },{
                duration: 1000,
                easing: 'easeInOutSine',
                complete: function(){
                    $( obj ).animate({ top: currPosY + dy }, 1000);
                }
            }
        );
    }

    function cycleLights(){
        $( ".lights span.lit" ).removeClass()
            .next().add( ".lights span:first" ).last().addClass( "lit" );
    }
    setInterval( cycleLights, 100 );

    $( window ).load( function(){
        setInterval( function(){
            oscillate( '#spinBtn' );
        }, 500 );
    });

    $( '#spinBtn' ).on( 'click', spinClicked);

})(jQuery, this, this.document);