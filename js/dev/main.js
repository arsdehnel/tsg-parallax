var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
    html = $('html'),
    $bgScrollSlow = $('.scroll-background-image'),
    $parallaxWrapper = $('.parallax'),
    $parallaxContent = $parallaxWrapper.find('.parallax-layer-content'),
    viewportHeight = $parallaxWrapper.outerHeight(),
    viewportWidth = $parallaxWrapper.outerWidth(),
    scrollPos = ( $parallaxContent.offset().top * -1 ),
    badgeAnimDelay = 500,
    bgPosY;

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

$(function(){

    $('.jq-spinup').each(function(){
        var nbr = $(this);
        nbr.attr('data-init-text',nbr.text()).attr('data-spinup-end-value',nbr.text()).text('0');
    })

    $('.scroll-watch').each(function(){
        var element = $(this);
        var top = element.offset().top;
        var bottom = top + element.outerHeight();
        element.data('element-top',top).data('element-bottom',bottom);
    })

    $('body')
        .on('click','.flexslider-next', function(e){
            e.preventDefault();
            $(this).closest('.flexslider').flexslider("next");
        })
        .on('click','.badge-action', badgeDetailOpen )
        .on('click','.badges-home', badgeDetailClose )
        .on('click','.nav-we-help a:not(.badges-home)', badgeNavClick )
        .on('click','.modal-trigger',modalOpen )
        .on('click','.modal-close',modalClose );


    window.requestAnimationFrame(function(time){
        inViewItemsCheck();
    });

    $('.flexslider').flexslider({
        animation: "slide",
        animationSpeed: 600,
        animationLoop: false,
        slideshow: false,
        start: function(slider){

            // putting this here so we hide them after the flexslider JS renders the sliders properly
            // they're offscreen when the page loads anyway so we render them and then hide them completely
            // but then when they're shown they are already rendered instead of FOUCing
            $(slider).closest('.badge-detail').addClass('hide');
        }
    });

    $parallaxWrapper.on("scroll", handleScroll);

    $('body').on('click','.click-scroll',function(e){

        e.preventDefault();
        var $target = $($(this).attr('href'));
        scrollToElement( $target );

    })

})

function modalClose(e){

    e.preventDefault();
    var linkObj = $(e.target);

    linkObj.blur();

    $('.modal-body').empty();
    $('.modal-close').addClass('hide');
    $('.modal-overlay').removeClass('active');

    $('.modal-window').css({
        marginTop: '',
        marginLeft: '',
        height: '',
        width: ''
    });

    setTimeout(function(){
        $('.modal-overlay, .modal-window').addClass('hide');
        $('.modal-window .loading-indicator').removeClass('hide');
    },500);

}

function modalOpen(e){

    if( viewportWidth > 800 ){

        e.preventDefault();
        $('.modal-overlay, .modal-window').removeClass('hide');
        $('.modal-body').empty();
        $('.modal-overlay').addClass('active');

        setTimeout(function(){

            var linkObj = $(e.target).closest('a');
            var img = new Image();


            switch( linkObj.attr('data-content-type') ){

                case "image":
                    img.onload = function() {
                        // alert('x' + this.height);
                        $('.modal-window').css({
                            marginTop: ( this.height * -.5 ),
                            marginLeft:( this.width * -.5 ),
                            height: this.height,
                            width: this.width
                        });
                        setTimeout(function(){
                            $('.modal-window .loading-indicator').addClass('hide');
                            $('.modal-body').empty().append('<img src="'+linkObj.attr('href')+'">');
                            $('.modal-close').removeClass('hide');
                        },500);
                    };
                    img.src = linkObj.attr('href');
                    break;

                case "iframe":
                    resizeModalWindow( linkObj.attr('data-iframe-height'), linkObj.attr('data-iframe-width') );
                    $('.modal-window .loading-indicator').addClass('hide');
                    $('.modal-close').removeClass('hide');
                    $('<iframe class="" frameborder="0" id="game-iframe" src="'+linkObj.attr('href')+'" style="height: '+linkObj.attr('data-iframe-height')+'px; width: '+linkObj.attr('data-iframe-width')+'px;">').appendTo('.modal-body');
                    break;

                default:
                    alert('unexpected content type: '+linkObj.attr('data-content-type'));
                    break;

            }

        },500);

    }

}

function resizeModalWindow( newHeight, newWidth ){
    $('.modal-window').css({
        marginTop: ( newHeight * -.5 ),
        marginLeft:( newWidth * -.5 ),
        height: newHeight,
        width: newWidth
    });
}

function handleScroll(){

    scrollPos = ( $parallaxContent.offset().top * -1 );

    inViewItemsCheck();

}

function inView( $el, viewType, gutter ) {

    // TODO: handle gutter parameter

    var docViewTop = scrollPos;
    var docViewBottom = docViewTop + viewportHeight;

    var elTop = $el.data('element-top');
    var elBottom = $el.data('element-bottom');

    if( $el.hasClass('debug-scroll') ){
        console.log('docViewTop: '+docViewTop,'docViewBottom: '+docViewBottom,'elTop: '+elTop,'elBottom: '+elBottom);
    }

    // do we need the "complete" thing to be visible
    if( viewType === 'complete' ){
        return ((elBottom >= docViewTop) && (elTop <= docViewBottom) && (elBottom <= docViewBottom) && (elTop >= docViewTop) );

    // or are we just concerned about seeing ANY of the item
    }else if( viewType === 'visible' ){
        return ( ( elTop <= docViewBottom ) && ( elBottom >= docViewTop ) )

    }

}

function inViewItemsCheck() {

    //checkBgParallax();
    checkBadges();
    checkSpinUp();
    checkFooter();

}

function scrollToElement( $el ) {

    var elTop = $el.data('element-top');

    $parallaxWrapper.animate({
        scrollTop: elTop
    },800, 'swing');

}

function badgeNavClick(e) {

    // close things up from whatever was selected before
    badgeDetailClose(e);

    // wait the delay amount and then start up the opening process
    setTimeout(badgeDetailOpen(e),badgeAnimDelay);

}

function badgeDetailOpen(e) {

    e.preventDefault();
    var selectedBadgeAction = $(e.target);

    // have this wait until the badges roll off the page otherwise the scroll events conflict with the animations and we get a free trip to janktown
    setTimeout(function(){
        scrollToElement( $('#we-help') );
    },badgeAnimDelay);


    // send the badges and intial header off the page
    $('#we-help').find('.badge-wrapper.visible, .content h2.visible').addClass('invisible').removeClass('visible');

    // wait for that animation to be done
    setTimeout(function(){
        $('.badges-grid').addClass('hide');
        $(selectedBadgeAction.attr('href')).removeClass('hide').addClass('visible');
        $('#we-help .subpage-header').addClass('visible').find('.badge-'+selectedBadgeAction.attr('data-badge')).addClass('active');
    },badgeAnimDelay);

}

function badgeDetailClose(e) {

    e.preventDefault();

    // try to get the current badge from the event
    var crntBadgeDtl = $(e.target).closest('.badge-detail');

    // console.log(crntBadgeDtl.attr('id'));

    // if it's form the nav bar then we won't get the above so we'll do it here
    if( !crntBadgeDtl.size() ){
        crntBadgeDtl = $('.badge-detail.visible');
    }

    // console.log(crntBadgeDtl.attr('id'));

    // fade the current badge slider out
    crntBadgeDtl.removeClass('visible');

    // and hide the nav bar if we're going back home
    if( $(e.target).hasClass('badges-home') ){
        // console.log('going home');
        $('#we-help .subpage-header').removeClass('visible');
    }

    setTimeout(function(){

        // reset this so it takes up the right space in the layout again
        $('.badges-grid').removeClass('hide');//css({'display':'block'})
        $('#we-help .subpage-header .active').removeClass('active');

        // reset this so that if the user comes back to this same one it's on the first slide
        if( crntBadgeDtl.find('.flexslider').size() ){
            crntBadgeDtl.find('.flexslider').flexslider(0);
        }

        // and then hide it so other badge details are positioned properly
        crntBadgeDtl.addClass('hide');

        // set this so that we sequence the animations
        setTimeout(function(){

            // make things slide back in
            $('.badges-grid').find('.invisible').removeClass('invisible').addClass('visible');

        },badgeAnimDelay);

    },badgeAnimDelay);

}

function checkBgParallax() {

    $bgScrollSlow.each(function(){

        if( inView( $(this), 'visible' ) ) {

            console.log($(this).position().top)

            // Manipulate elements that are going to move/fade/whatever on scroll
            if( (Math.round(scrollPos / 2)) >= 0 ){
                bgPosY = (Math.round(scrollPos / 2))
            }else{
                bgPosY = 0;
            }
            $(this).css( 'background-position', '50% ' + bgPosY + 'px' );

        }

    })


}

function checkBadges() {

    // TODO: this is wonky on phone sized screen for some reason
    $('.badge-wrapper').each(function(){

        // console.log(this);

        var badge = $(this);

        if( !badge.hasClass('visible') && inView( badge, 'complete', 0 ) ){
            badge.addClass('visible')
            if( html.hasClass('no-csstransitions') ){
                alert('must be ie9 or lower');
            }
        }else if( badge.hasClass('visible') && !inView( badge, 'complete', 0 ) ){
            badge.removeClass('visible')
            if( html.hasClass('no-csstransitions') ){
                alert('must be ie9 or lower');
            }
        }

    })

}

function checkSpinUp() {

    $('.jq-spinup').each(function(){

        var nbr = $(this);

        if( !nbr.hasClass('visible') && inView( nbr, 'complete', 0 ) ){
            nbr.addClass('visible').numberSpinUp();
        }else if( nbr.hasClass('visible') && !inView( nbr, 'complete', 0 ) ){
            nbr.removeClass('visible').text('0');
        }

    })

}

function checkFooter() {

    $('.footer-item, .section-footer h2').each(function(){

        // console.log(this);

        var item = $(this);

        if( !item.hasClass('visible') && inView( item, 'complete', 0 ) ){
            item.addClass('visible')
            if( html.hasClass('no-csstransitions') ){
                alert('must be ie9 or lower');
            }
        }else if( item.hasClass('visible') && !inView( item, 'complete', 0 ) ){
            item.removeClass('visible')
            if( html.hasClass('no-csstransitions') ){
                alert('must be ie9 or lower');
            }
        }

    })

}