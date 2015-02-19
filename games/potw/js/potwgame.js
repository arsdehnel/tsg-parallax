function initPOTWgame(obj) {

    setTimeout( function() {
        obj.find('#instructions').fadeIn();
    }, 500);

    var pirate = obj.find('#header h1');
    var logo = obj.find('#header h2');
    var chests = obj.find('#chests li');

    chests.find('.special').css({
        opacity: 0
    });

    obj.find('#instructions .button').click(function(e) {
        e.preventDefault();

        obj.find('#instructions').fadeOut(function() {
            setTimeout( showPirate, 250);
            setTimeout( showChests, 250);
        });
    });

    function showPirate() {
        var logoMR = parseInt( logo.css('margin-right') );
        pirate.animate({
            marginLeft: 0
        },
        {
            duration: 125,
            step: function(now, fx) {
                if( Math.abs(now) <= logoMR ) {
                    logo.css({
                        marginRight: -now
                    });
                }
            }
        });
    }

    function showLogo() {
        logo.animate({
            marginBottom: 0
        },
        {
            duration: 125
        });
    }

    function showChests() {
        var i = 0;
        var max = chests.length;

        var showem = setInterval( function() {
            chests.eq(i).find('.special').animate({
                opacity: 1
            },
            {
                duration: 1000
            })

            if( i < max-1 ) {
                i++;
            }
            else {
                clearInterval(showem);
                initChests();
            }
        }, 500);
    }

    function initChests() {
        chests.find('label')
            .addClass('ready')
            .mouseup(function() {
                var open = $(this).parents('.chest').hasClass('open');

                $('.chest').removeClass('open');

                if( !open ) {
                    $(this).parents('.chest').addClass('open');
                }

                $(this).find('input').focus();
            });
    }

}