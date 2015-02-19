// Rocket Launcher

rocketLaunch = function() {
	var launchBtn = $("#launcherConrol a");
	var launcherPos = $('#launcher').offset();
	var launcherXPos = launcherPos.left;
	var launcherInialPos = $('#launcher').css('right');
	var selRocket;
	var frame = 0;
	var rockets = $('.rockets').length;

	$(".rockets").on("click", function(event){
		event.preventDefault();
		$(this).find("span.choose").toggleClass("on");
		if($(this).find("span.choose").hasClass("on")) {
			selRocket = $(this).attr('id');
			pickupRocket(selRocket);
		}
		else {
			clearRocket(selRocket);
		}
	});
	$("body").on("click","#launcherConrol .on",function(event) {
		event.preventDefault();
		$('#'+selRocket+' '+'.selectedImg').removeAttr('style');
		$(cloneObj).clone().appendTo( ".rocketReady" );
		$('.rocketReady .selectedImg').empty().attr('id',selRocket).addClass('position_1');
        $('.rocketReady img').hide();
		launchRocket(selRocket);
	});
	pickupRocket = function(selRocket) {
		$('.rocketReady').empty();
        $('#'+selRocket).addClass('selected').children('.choose, h1').hide();     //this is the little switch icon below the rocket

		cloneObj = $('#'+selRocket+' '+'.selectedImg');
   		cloneImg = $('#'+selRocket+' '+'.selectedImg img');
		var pos = $('#'+selRocket).offset();
		var xPos = pos.left - 45;
		var launchNewPos = launcherXPos - xPos;

			$(".launcherContainer").fadeIn(1000,function(){                                                                              //1000

                //move the tower to the proper rocket
                $(this).animate({
					right: launchNewPos + 'px'
				  }, 4000,function() {                                                                                                  //4000

				$(".rocket_holder").animate({top:'329px'},1500,slideRocket);                                                            //1500
				setTimeout(launcherBack,4000);                                                                                        //4000

			});
		});
		hideRockets(selRocket);
	}
	launcherBack = function() {
		$(".launcherContainer").animate({
			right: launcherInialPos
		},4000,function() {                                                                                                           //4000
			$(".rocketReady").animate({top: '-77px'}, { duration: 1000, queue: false });
			$(".rocket_holder").animate({top: '179px'}, 1000, function(){
                $("#launcherConrol a").animate({
                    opacity : '1'
                },1000).addClass('on');
            });
		});
	}
	slideRocket = function() {

        var selRocketObj = $('#'+selRocket);

		selRocketObj.children('.selectedImg')         //this is the rocket itself
            .css('position','absolute')             //allow it to be moved
            .animate(
                {'top':'-60px'},
                2000,
                function(){
                    $(cloneImg).clone().appendTo( ".rocketReady" );
                    $('#'+selRocket).hide();
                });

        //and also do the holder while we're doing that
        $('.rocket_holder').animate({
            top: '269px'
        },2000);

        //and then hide the shadow while the above animation is happening
		$('#'+selRocket+' '+'.shadow img').animate({
			'height':'0px',
			'left':'50px',
			'top':'20px'
		},2000);
	}
	clearRocket = function(selRocket) {
		launchBtn.css('opacity','0.6').removeClass('on');
		$('.rocketReady').empty();
		$("#launcher").fadeIn(5000,function(){
		  $(this).animate({'left': launcherXPos + 'px'},1500);
		});
		showRockets();
	}
	launchRocket = function(selRocket) {

        var rocket = $('.rocketReady .selectedImg');

        var step = 0;

        var launchTimer = setInterval(function(){

            //fire the rockets
            if( step == 0 ){
                rocket.addClass('position_2').removeClass('position_1');

            //alternate the rockets
            }else if(step > 0 && step < 20){
                if( step % 2 == 0 ){
                    rocket.addClass('position_2').removeClass('position_3');
                }else{
                    rocket.addClass('position_3').removeClass('position_2');
                }

            //begin liftoff
            }else if( step == 20 ){
                rocket
                    .addClass('position_4')
                    .removeClass('position_2 position_3')
                    .animate(
                        {top:-300},
                        {
                            duration: 2500,
                            easing: 'linear'
                        });
            //initial movement in liftoff
            }else if(step > 20 && step < 30){
                if( step % 6 == 0 ){
                    rocket.addClass('position_4').removeClass('position_5');
                }else if( step % 6 == 3 ){
                    rocket.addClass('position_5').removeClass('position_4');
                }

            //drop dust from the rocket blast
            }else if( step == 30 ){
                rocket.addClass('position_6').removeClass('position_4 position_5')

            //animate off the page with a slower alternation of rocket images
            }else if( step > 30 && step < 50 ){
                if( step % 6 == 0 ){
                    rocket.addClass('position_7').removeClass('position_6');
                }else if( step % 6 == 3 ){
                    rocket.addClass('position_6').removeClass('position_7');
                }

            //prep for the decent
            }else if( step == 50 ){
                rocket.parent().children('img').addClass('rocket-fade').show();
                rocket.remove();

            //begin the decent
            }else if( step == 55 ){
                $('.rocket-fade').rotate(-114);
                $('.rocket-fade').animate({'right' : "624px", "top" : "289px", 'width' : '0'},6000);

            //show the splash
            }else if( step == 140 ){
                $('.splash').rotate({
                    angle: 0,
                    animateTo: 600,
                    duration: 2400,
                    easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
                      return c*(t/d)+b;
                    }
                })
                $('.splash').show().animate({
                    width: 50,
                    height: 50,
                    top: 195,
                    left: 140
                }, 1200, function(){
                        $(this).animate({
                            width: 0,
                            height: 0,
                            top: 210,
                            left: 165
                        }, 1200 )}
                );

            }

            step++;

        }, 70);

        setTimeout(function(){
            clearInterval( launchTimer );
            gameOver();
        }, 12500);

	}
    gameOver = function(){
        $('.gameOver').show();
    }
	function resumeGame() {
			$(".gameOver").css("display","none");
			$(".gameOver").fadeOut("slow");
			location.reload();
	}
	$("#btnContinue").on("click", window.parent.modalClose);

	$("#btnClose").on("click", function(event){
		parent.$.fancybox.close();
	});
	hideRockets = function(selRocket) {
		 $('#rocketSection section').not("#"+selRocket).css('visibility','hidden');
		 $('#message').hide();
	}
	showRockets = function() {
		 $('#rocketSection section.rockets').css('visibility','visible');
 		 $('#message').show();
	}

}
