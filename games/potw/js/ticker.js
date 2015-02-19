/* ticker tape js */

$( window).ready( function(){


    var $tickerContainer = $( '.ticker' ),
        $tickerItems = $tickerContainer.find( 'li' ),
        tickerContainerWidth = 1,
        defTiming,
        speed =  0.07;

    $tickerItems.each( function( i ){
        $( this, i ).append( $( '<small class="after">-</small>' ) );
        tickerContainerWidth +=  $( this, i  ).outerWidth( true );
    });

    $tickerContainer.width( tickerContainerWidth );
    defTiming = tickerContainerWidth / speed;

    function scrollWinners( distance, rate ){
        $tickerContainer.animate({ left: '-='+ distance }, rate, "linear", function(){
            $tickerContainer.css("left", 0 );
            scrollWinners( tickerContainerWidth, defTiming );
        });
    }
    scrollWinners( tickerContainerWidth, defTiming );

});
