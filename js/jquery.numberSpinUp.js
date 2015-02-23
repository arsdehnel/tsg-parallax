$.fn.numberSpinUp = function( options ){

    settings = $.extend({
        'startValue': 0,
        'precision': 0,
        'suffix': ''
    }, options)

    return this.each(function(){

        var elem      = $(this),
            startVal  = elem.attr('data-spinup-start-value') ? parseFloat( elem.attr('data-spinup-start-value') ) : settings.startValue,
            endVal    = elem.attr('data-spinup-end-value') ? parseFloat( elem.attr('data-spinup-end-value') ) : settings.endValue,
            easing    = elem.attr('data-spinup-easing') ? elem.attr('data-spinup-easing') : settings.easing,
            duration  = elem.attr('data-spinup-duration') ? parseInt( elem.attr('data-spinup-duration'), 10 ) : settings.duration,
            precision = elem.attr('data-spinup-precision')  ? parseInt( elem.attr('data-spinup-precision'), 10 ) : settings.precision,
            prefix    = elem.attr('data-spinup-prefix') ? elem.attr('data-spinup-prefix') : '',
            suffix    = elem.attr('data-spinup-suffix') ? elem.attr('data-spinup-suffix') : '',
            separator = elem.attr('data-spinup-separator') ? elem.attr('data-spinup-separator') : '';

        $({someValue: Math.round(startVal,precision)}).animate({someValue: Math.round(endVal,precision)}, {
            duration: duration,
            easing: easing,
            step: function() {
                elem.html( prefix + ( (this.someValue).toFixed(precision) ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator) + suffix );
            },
            complete: function() {
                elem.html( prefix + endVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator) + suffix );
            }
        });

    });

}