var questions2videosMap = {
    q1: {
        file: 'Acct_Rev_Game_Q1',
        duration: 28,
        pauseatend: false
    },
    q2: {
        file: 'Acct_Rev_Game_Q1',
        duration: 28,
        pauseatend: false
    },
    q3: {
        file: 'Acct_Rev_Game_Q3',
        duration: 15,
        pauseatend: false
    },
    q4: {
        file: 'Acct_Rev_Game_Q4_5',
        duration: 24,
        pauseatend: false
    },
    q5: {
        file: 'Acct_Rev_Game_Q4_5',
        duration: 24,
        pauseatend: false
    },
    q6: {
        file: 'Acct_Rev_GameQ6v2',
        duration: 31,
        pauseatend: false
    },
    q7: {
        file: 'Acct_Rev_Game_Q_7_10',
        duration: 10,
        pauseatend: true
    },
    q8: {
        file: 'Acct_Rev_Game_Q_7_10',
        duration: 10,
        pauseatend: true
    },
    q9: {
        file: 'Acct_Rev_Game_Q_7_10',
        duration: 10,
        pauseatend: true
    },
    q10: {
        file: 'Acct_Rev_Game_Q_7_10',
        duration: 10,
        pauseatend: true
    },
    q11: {
        file: 'Acct_Rev_GameQ11',
        duration: 21,
        pauseatend: false
    },
    q12: {
        file: 'Acct_Rev_GameQ12_13',
        duration: 44,
        pauseatend: false
    },
    q13: {
        file: 'Acct_Rev_GameQ12_13',
        duration: 44,
        pauseatend: false
    }
};


function loadVideoSWF(qID) {
    // qID is the ID of the target container (string)
    // vID is the video to retrieve (string)

    var visualaid = $('#'+qID+' .visualaid');
    var container = $('#'+qID);
    visualaid.data('PL', parseInt(visualaid.css('paddingLeft'),10) );
    visualaid.css({
        paddingLeft: 0,
        zIndex: 100
    });
    
    visualaid.append('<div class="video" id="video'+qID+'" /><div class="videocoverup" />');
    
    // override the video duration for videos that need to pause
    // note: duration is in seconds, so when the video needs to pause at the end, we set the duration to a really high number (1000 seconds)
    var duration = (questions2videosMap[qID].pauseatend) ? 1000 : questions2videosMap[qID].duration;
    
    var vzvid = $('#video'+qID).flowplayer(
        // flash config
        {
            src: "/portal/js/flowplayer/flowplayer-3.2.7.swf",
            allowfullscreen : false
        },
        // flowplayer config
        {
            clip: {
                url: '/portal/img/insightg/'+questions2videosMap[qID].file+'.swf',
                scaling: 'fit',
                duration: duration/*,
                onCuepoint: (questions2videosMap[qID].pauseatend) ? [ questions2videosMap[qID].duration*1000, function() { closeVideo(true); } ] : null*/
                // note: cuepoint time pointer is in milliseconds -----^
            },
            play: null,
            plugins: {
                controls: null
            },
            onBeforeLoad: function() {
                // alert('not yet playing');
            },
            onLoad: function(clip) {
                setTimeout(function() {
                    closeVideo(questions2videosMap[qID].pauseatend);
                    // webTrack(52536);
                }, questions2videosMap[qID].duration*1000);
            },
            onBeforePause: function() {
                return false;
            },
            onPause: function() {
                return false;
            },
            onFinish: function() {
                // alert('done playing');
                // closeVideo();
                // webTrack(52536);
            }
        }
    );

    function closeVideo(pausefirst) {
        visualaid.append('<p class="closevideo">Done with the video? <a href="#" class="button cancel close"><span class="s1">Close</span></a></p>');
        if(pausefirst === true) {
            visualaid.find('.closevideo .button').click(function(e) {
                e.preventDefault();
                closeIt();
            });
        }
        else {
            closeIt();
        }
        
        function closeIt() {
            var aniDur = 250;
            var availW = container.innerWidth() - visualaid.data('PL');
            var video = visualaid.find('.video');
        
            var aniVidAttr = {
                top: '0%',
                // if the width of a question sidebar needs to be adjusted and the videos end up getting sqished to the right, uncomment the next two lines to allow for dynamic sizing upon collapse
                // width: (video.width()+60 > availW) ? availW-60 : video.width(),
                // height: (video.width()+60 > availW) ? video.height()*(availW-60)/video.width() : video.height(),
                marginTop: (video.width()+60 > availW) ? 21 : (availW - video.outerWidth()) / 2
            };
            
            visualaid.find('.closevideo').hide();
        
            visualaid.animate({
                marginLeft: visualaid.data('PL')
            }, aniDur, 'linear');

            video.animate(aniVidAttr, aniDur, 'linear');
            visualaid.find('.videocoverup').fadeOut(aniDur);
            webTrack(52537);
        }
    }
}
