/**
 *
 * Slot Machine
 * Author: Stefan Petre www.eyecon.ro
 * 
 */
 (function($){  	
	var slotMachine = function() {
		var credits = 0,
			gameType = 0,
			winLoose = 0,			 			
			spinning = 3,
			spin = [0,0,0],
			soundEffect = 1,
			slotsTypes = {
				'obj1': [2,5,10],
				'obj2': [0,15,30],
				'obj3': [0,40,50],
				'obj4': [0,50,80],
				'obj5': [0,0,100]
			},
			slots = [
				['obj1','obj2','obj3','obj4','obj5'],
				['obj1','obj2','obj3','obj4','obj5'],
				['obj1','obj2','obj3','obj4','obj5']
			],
			
			soundOnOff = function() {
				var onoff = $(this).html();
				if(onoff == 'ON') { 
					soundEffect = 1;
					$(this).css("color","#090");
				}
				else { 
					soundEffect = 0;
					$(this).css("color","#f00");
				}						
				
			},
			startSlot = function() {
				credits = 3;
				gameType = $("#gameType").val();
				winLoose = $("#winLoose").val();
				spinning = false;
				if(soundEffect !=0) {
					playSound('openclose');
				}
				$('#slotSplash').animate({top: -440}, 500, 'easeOut');
				$('#stickHolder').animate({left: 830}, 100, 'easeOut');
				$('#triggerContainer').animate({left: 837}, 100, 'easeOut');				
				$('#slotTrigger').removeClass('slotTriggerDisabled');
				this.blur();
				return false;
			},
			endSlot = function() {
				if(soundEffect !=0) {
					playSound('openclose');
				}
				$('#slotSplash').animate({top: 0}, 500, 'easeOut');
				$('#stickHolder').animate({left: 830}, 500, 'easeOut');
				$('#triggerContainer').animate({left: 837}, 500, 'easeOut');
			},			
			addCredit = function(incrementCredits) {
				var currentCredits = credits;
				credits += incrementCredits;
				$('#slotCredits')
					.css('credit', 0)
					.animate({
						credit: incrementCredits
					},{
						duration: 400 + incrementCredits,
						easing: 'easeOut',
						step: function (now) {
							$(this).html(parseInt(currentCredits + now, 10));
						},
						complete: function() {
							$(this).html(credits);
						}
					});
			},
			spin = function() {	 	
				this.blur();			
				
					if((gameType == 0) && (winLoose == 0)) { 
						spin[0] = spin[1] = spin[2] = parseInt(Math.random() * 5);
					}					
					else if((gameType == 0) && (winLoose == 1))  {
						spin[0] = parseInt(Math.random() * 1);					
						spin[1] = parseInt(Math.random() * 4)+ 1;					
						spin[2] = parseInt(Math.random() * 3)+ 1;																							
					}
					else {
						spin[0] = parseInt(Math.random() * 5);					
						spin[1] = parseInt(Math.random() * 5);					
						spin[2] = parseInt(Math.random() * 5);																	
					}					
					$('#slotTrigger').animate({
                        top: 100,
						left:8,
                        height: 67,
						width:67
                    }, 100, 'easeOut').animate({
                        top: 221,
                        left: 8,
                        height: 70,
						width:70						
                    }, 100, 'easeOut');
                    $('#leverStick').animate({
                        top: 156,
                        height: 190,
                        width: 32
                    }, 100, 'easeOut').animate({
                        top: 278,
                        height: 70,
                        width: 32,
                        left: 27
                    }, 100, 'easeOut');                  		
				
					//$('#slotTrigger').addClass('slotTriggerDisabled');
					//$('img.slotSpinAnimation').show();
					if(soundEffect !=0) {
						playSound('running');
					}
					$('#wheel1 div.rotate').css('top', -(spin[0] * 100 + 10000) + 'px');
                    $('#wheel2 div.rotate').css('top', -(spin[1] * 100 + 10000) + 'px');
                    $('#wheel3 div.rotate').css('top', -(spin[2] * 100 + 10000) + 'px');										
					$('#wheel1 div.rotate').animate({
                        top: -(spin[0] * 171 - 45)
                    }, 5000 + parseInt(1500 * Math.random()));
                    $('#wheel2 div.rotate').animate({
                        top: -(spin[1] * 171 - 45)
                    }, 5000 + parseInt(1500 * Math.random()));
                    $('#wheel3 div.rotate').animate({
                        top: -(spin[2] * 171 - 45)
                    }, 5000 + parseInt(1500 * Math.random()));
					$('#slotTrigger').animate({
                        top: 9,
                        left: 13,
						width:63,
                        height: 63
                    }, 500, 'bounceOut');
                    $('#leverStick').animate({
                        top: 67,
                        height: 268,
                        width: 40,
                        left: 23
                    }, 500, 'bounceOut');                    										
					setTimeout(function(){
						stopSpin(1);
					}, 5000 + parseInt(1500 * Math.random()));
					setTimeout(function(){
						stopSpin(2);
					}, 5000 + parseInt(1500 * Math.random()));
					setTimeout(function(){
						stopSpin(3);
					}, 5000 + parseInt(1500 * Math.random()));				
				
				return false;
			},
			stopSpin = function(slot) {		
				$('#wheel' + slot)
					.find('img:last')
						//.hide()
						.end()
					.find('img:first')
						.animate({
							top: - spin[slot - 1] * 342 - 171
						},{
							duration: 3000,
							easing: 'elasticOut',
							complete: function() {
								spinning --;
								if (spinning == 0 ) { 
									endSpin();
								}
							}
						});
			},
			endSpin = function() {
				var slotType = slots[0][spin[0]],
					matches = 1,
					barMatch = /bar/.test(slotType) ? 1 : 0,
					winnedCredits = 0,
					waitToSpin = 10;
										
				if ( slotType == slots[1][spin[1]]) {
					matches ++;
					if ( slotType == slots[2][spin[2]]) {
						matches ++;
					} else if (barMatch !=0 && /bar/.test(slots[2][spin[2]])) {
						barMatch ++;
					}
				} else if (barMatch != 0 && /bar/.test(slots[1][spin[1]])) {
					barMatch ++;
					if (/bar/.test(slots[2][spin[2]])) {
						barMatch ++;
					}
				}
				if (matches != 3 && barMatch == 3) {
					slotType = 'anybar';
					matches = 3;
				}
				var winnedCredits = slotsTypes[slotType][matches-1];
				
				if (winnedCredits > 0) {
					addCredit(winnedCredits);
					waitToSpin = 410 + winnedCredits;
				}
				if((winLoose == 1 && gameType == 0) || (winLoose == 0 && gameType == 0)) {
					credits = 0;					 
				}
				setTimeout(function() {
					if (credits == 0) {
						setTimeout(function() { 
							//endSlot();
						}, 1000);
					} else {
						$('#slotTrigger').removeClass('slotTriggerDisabled');
						spinning = false;
					}
				}, waitToSpin);
				
				if((spin[0] == spin[1]) && (spin[1]) == (spin[2])) {
				if(soundEffect !=0) {
						playSound('winner');
					}
					$('#statusMsg').html('<img src="images/winner.gif"></img>');					
					showstatus();					
				}
				else {
			if(soundEffect !=0) {
						playSound('loser');	
					}
					$('#statusMsg').html('<h3>!!U R The Loser.!!</h3>');
					showstatus();	  				    
				}  
			};
			function playSound(soundType) {
				var audioPlayer = document.getElementById("audio");				
				if($.browser.mozilla) {
						audioPlayer.src = 'audio/' +soundType+'.wav';
						audioPlayer.play();					
					}					
					else if(($.browser.msie) && ($.browser.version < 9)) { 
						 if (document.all) document.all['runningsound'].src='audio/'+soundType+'.wav';	
					}
					else { 
						audioPlayer.src = 'audio/' +soundType+'.mp3';
						audioPlayer.play();	
					}					
			}			
			function showstatus() {			 	
				$(".lights img").css('display','block').delay(6000).fadeOut('slow');				
			 	$('#statusMsg').fadeIn('slow');
			 	$('#statusMsg').delay(6000).fadeOut('slow');				
				
			}
							
		return {
			init: function() {			
				//$('#slotSplash a.play').bind('click', startSlot);
				$('#slotMachine a.soundon').bind('click', soundOnOff);
				$('#slotMachine a.soundoff').bind('click', soundOnOff);
				$('#slotTrigger').bind('drag', spin);
				$('#slotTrigger').bind('click', spin);				
				$('#wheel1 div.rotate').css('top', - (parseInt(Math.random() * 5) * 171 - 40)  + 'px');
				$('#wheel2 div.rotate').css('top', - (parseInt(Math.random() * 5) * 171 - 40)  + 'px');
				$('#wheel3 div.rotate').css('top', - (parseInt(Math.random() * 5) * 171 - 40)  + 'px');								
			}
		};
	}();
	$.extend($.easing,{
		bounceOut: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeOut:function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		elasticOut: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		}
	});	
	$(document).ready(slotMachine.init);
})(jQuery);