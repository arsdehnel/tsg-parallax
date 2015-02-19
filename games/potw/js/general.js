function increaseCount (selfInstallPercent) {
	var i = 0,
		$selfInstall = $('p.self-install-percent'),
		delay = 2500/selfInstallPercent,
		intervalID = setInterval(function() {
		if (i <= selfInstallPercent) {
			$selfInstall.html(i + '%');
			i++;
		} else {
			clearInterval(intervalID);
		}
	}, delay);
}

function ajax(currentActivePower) {
	$.ajax({
		dataType: "json",
		url: 'test.json',
		cache: false,
		success: function (json) {
			$('h1.user-name').html(json.userName);
			$('span.sales-location').html(json.salesLocation);
			$('span.close-rate-target-number').html(json.closeRateTarget);
			$('span.close-rate-number').html(json.closeRateNumber);
			$('span.sales-amount').html(json.salesAmount);
			$('span.elite-leader-number').html(json.eliteLeaderNumber);
			$('span.elite-you-number').html(json.eliteCurrentNumber);
			$('span.elite-rank-number').html(json.eliteRankNumber);
			$('span.leader-sales-number').html(json.leaderSalesLowerLeft);
			$('span.leader-sales-location').html(json.leaderSalesLowerLeftLocation);
			$('span.current-sales-number').html(json.currentSalesLowerLeft);
			$('span.current-sales-location').html(json.currentSalesLowerLeftLocation);
			increaseCount(json.selfInstallPercent);
			animateLowerLeftBars(json.leaderSalesLowerLeft, json.currentSalesLowerLeft);
			underlayBarSetup(json.mainBarsValues.length, currentActivePower);
			animateMainBars(json.mainBarsValues, currentActivePower, json.mainBarsTexts, json.popupSales);
			if (json.selfInstallPercent && json.GRAPercent) { // if both dials
				GRANUMBER = json.GRAPercent;
				SELFINSTALLNUMBER = json.selfInstallPercent;
				gaugeSetup(currentActivePower);
			}
			if (json.selfInstallPercent) {
				animateGauge(json.selfInstallPercent, json.GRAPercent, "GRA", currentActivePower);
			}
			backgroundFade(currentActivePower);
			pulsePower();
		}
	});
}

function animateLowerLeftBars (leaderSales, currentSales) {
	var currentBarEndLocation = -(32 - ((currentSales / leaderSales) * 32));
	$('img.leader-bar').animate({left: "-4.4em"}, 2000);
	$('img.current-bar').animate({left: currentBarEndLocation + 'em'}, 2000);
}

function switchPowers (whichPowerClicked, currentActivePower, $whichPowerClicked) {
	$('div.background').fadeOut(800, function() {
		fadePowersIn($(this), whichPowerClicked, currentActivePower, $whichPowerClicked);
	});
}

function fadePowersIn (background, whichPowerClicked, currentActivePower, $whichPowerClicked) {
	var newBackground = 'images/' + whichPowerClicked + '-background.jpg';
	$.cookie('activePower', whichPowerClicked);
	$('img.lower-left-underlay-bars').attr('src', 'images/' + whichPowerClicked + '-lower-left-underlay-bar.png');
	$('header, section.elite').hide().fadeIn(3000);
	background.css('backgroundImage', 'url("' + newBackground + '")');
	$whichPowerClicked.attr({
		src: 'images/icons-' + currentActivePower + '-inactive.png',
		alt: currentActivePower
	});
	$('aside img:first-child').attr({
		src: 'images/icons-' + whichPowerClicked+ '-active.png',
		alt: whichPowerClicked
	});
	$('p.self-install-percent').removeClass(currentActivePower + '-self-install-percent').addClass(whichPowerClicked + '-self-install-percent');
	$('p.small-gauge-text').removeClass(currentActivePower + '-small-gauge-text').addClass(whichPowerClicked + '-small-gauge-text');
	$('p.self-install-text').removeClass(currentActivePower + '-self-install-text').addClass(whichPowerClicked + '-self-install-text');
	$('div.bonus-texts').removeClass(currentActivePower + '-bonus-texts').addClass(whichPowerClicked + '-bonus-texts');
	$('header').removeClass(currentActivePower + '-header').addClass(whichPowerClicked + '-header');
	$('span.power-display').html(whichPowerClicked);
	$('section.' + currentActivePower + '-elite').removeClass(currentActivePower + '-elite').addClass(whichPowerClicked + '-elite');
	$('div.bar-container').detach();
	$('img.lower-left-bars').attr('src', 'images/' + whichPowerClicked + '-lower-left-bar.png').css('left', '-32em');
	$('section.leader-bars').removeClass(currentActivePower + '-leader-bars').addClass(whichPowerClicked + '-leader-bars');
	background.next().css('backgroundImage', 'url("images/' + whichPowerClicked + '-background2.jpg")');
	background.fadeIn(800, function() {
		ajax(whichPowerClicked);
	});
}

function backgroundFade (currentActivePower) {
	$('div.alt-background').show().animate({opacity: 1}, 8000, function() {
		$(this).animate({opacity: 0}, 8000, ( function() {
			backgroundFade(currentActivePower);
		}));
	});
}

function pulsePower () {

}

function underlayBarSetup (mainBarsNumber) {
	if (mainBarsNumber > 3 ) {
		for (i = 1; i <= mainBarsNumber; i++) {
			$('section.main').append('<div class="bar-container"><img src="images/underlay-bar.png" class="underlay-bar underlay-bar-small" /></div>');
		}
	} else {
		for (i = 1; i <= mainBarsNumber; i++) {
			$('section.main').append('<div class="bar-container"><img src="images/underlay-bar.png" class="underlay-bar underlay-bar-large" /></div>');
		}
	}
}

function animateMainBars (mainBarsValues, currentActivePower, mainBarsTexts, popupSales) {
	var largest = Math.max.apply(Math, mainBarsValues),
		animateTo = [];
	switch (mainBarsValues.length) {
		case 1:
			$('section.main h2').css("marginBottom", "2.4em");
			break;
		case 2:
			$('section.main h2').css("marginBottom", "1.4em");
			break;
		case 3:
			$('section.main h2').css("marginBottom", ".5em");
			break;
		case 4:
			$('section.main h2').css("marginBottom", "1.5em");
			break;
		case 5:
			$('section.main h2').css("marginBottom", ".8em");
			break;
		case 6:
			$('section.main h2').css("marginBottom", "0");
			break;
	}

	if (mainBarsValues.length < 4) {
		$('div.bar-container').append('<img src="images/' + currentActivePower + '-overlay-bar.png" class="overlay-bar-large overlay-bar" />');
	} else {
		$('div.bar-container').append('<img src="images/' + currentActivePower + '-overlay-bar.png" class="overlay-bar-small overlay-bar" />');
	}

	for (var i = 0; i < mainBarsValues.length; i++) {
		var $currentBar = $('img.overlay-bar:eq(' + i + ')');
		animateTo[i] = 57 - ((mainBarsValues[i]/largest)*36);
		$currentBar.animate({right: animateTo[i] + 'em'}, 3000).after('<p class="main-bar-texts ' + currentActivePower + '-main-bar-texts">' + mainBarsTexts[i] + ' <span class="popup-indicator">+</span></p>').after('<p class="main-bar-sales-text ' + currentActivePower + '-main-bar-sales-text"><span class="main-bar-sales-numbers">' + mainBarsValues[i] + ' Sales</span></p>');
		$currentBar.next().next().append('<div class="popup-contents"><span class="popup-header">Popup Header</span><p class="popup-text"> February 2013: ' + popupSales.FebSales[i] + ' Sales</p><p class="popup-text"> March 2013: ' + popupSales.MarSales[i] + ' Sales</p><p class="popup-text"> April 2013: ' + popupSales.AprSales[i] + ' Sales</p><p class="popup-text"> May 2013: ' + popupSales.MaySales[i] + ' Sales</p><img src="images/popup-arrow.png" class="popup-arrow" /><img src="images/cancel-popup-button.png" class="popup-cancel-button" /></div>');
	}

	if (mainBarsValues.length > 4) {
		$('.main-bar-texts:last-child .popup-contents').addClass('popup-contents-bottom').children('.popup-arrow').addClass('popup-arrow-bottom');
	}
}

function gaugeSetup (currentActivePower) {
	$('div.gauge-container').append('<img src="images/' + currentActivePower + '-small-gauge.png" class="switch-gauges small-gauge" alt="GRA" />', '<img src="images/switch-arrow-down.png" class="switch-gauges gauge-switch-arrow-down" />', '<img src="images/switch-arrow-up.png" class="switch-gauges gauge-switch-arrow-up" />');	
}

function animateGauge (selfInstallPercent, GRAPercent, whichGauge, currentActivePower) {
	switch (currentActivePower) {
		case "Quantum":
			my_arc.attr({"stroke": "#b3b3b3"});
			break;
		case "Fire":
			my_arc.attr({"stroke": "#3fcdcf"});
			break;
		case "Invisible":
			my_arc.attr({"stroke": "#60c9ae"});
			break;
		case "Ice":
			my_arc.attr({"stroke": "#48c4d3"});
			break;
	}
	
	my_arc.animate({
		arc: [75, 75, 1, 100, 65]
		}, 5, "linear", function() {
			if (selfInstallPercent)	{
				if (whichGauge === "SELF-INSTALL") {
					$('p.self-install-text').html('GRA').addClass('gra-text');
					$('p.small-gauge-text').html('SELF INSTALL').removeClass('small-gauge-text-gra');
					my_arc.animate({
    	          		arc: [75, 75, GRAPercent, 100, 65]
    	    		}, 2500, "ease-in-out");	
				} else {
				$('p.self-install-text').html('SELF INSTALL').removeClass('gra-text');
				$('p.small-gauge-text').html('GRA').addClass('small-gauge-text-gra');
					my_arc.animate({
    	          		arc: [75, 75, selfInstallPercent, 100, 65]
    	    		}, 2500, "ease-in-out");	
				}
			}
	});
}

var canvas = Raphael("gauge", 150, 150);

canvas.customAttributes.arc = function (xloc, yloc, value, total, R) {
    var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = xloc + R * Math.cos(a),
        y = yloc - R * Math.sin(a),
        path;
    if (total === value) {
        path = [
            ["M", xloc, yloc - R],
            ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
        ];
    } else {
        path = [
            ["M", xloc, yloc - R],
            ["A", R, R, 0, +(alpha > 180), 1, x, y]
        ];
    }
    return {
        path: path
    };
};

var my_arc = canvas.path().attr({
    "stroke": "#B3B3B3",
    "stroke-width": 20,
    arc: [75, 75, 0.1, 100, 65]
});

$(document).ready( function () {
	$('aside').on('click', 'img:nth-child(n+2)', function() {
		switchPowers($(this).attr('alt'), $('aside img:first-child').attr('alt'), $(this));
	});
	
	$('section.main').on('click', 'p.main-bar-texts > span', function() {
		$(this).next().show().animate({opacity: 1, left: "110%"}, 300);
	});
	
	$('section.main').on('click', 'p.main-bar-texts > div.popup-contents > img.popup-cancel-button', function() {
		$(this).parent().hide().css({
			opacity: '0',
			left: '140%'
		});
	});

	$('div.gauge-container').on('click', 'img.switch-gauges', function() {
		if ($('img.small-gauge').attr('alt') === "GRA") {
			$('img.small-gauge').attr('alt', 'SELF-INSTALL');
			$('p.small-gauge-text').html('SELF INSTALL');
			animateGauge(SELFINSTALLNUMBER, GRANUMBER, "SELF-INSTALL");
			increaseCount(GRANUMBER);
		} else {
			$('img.small-gauge').attr('alt', 'GRA');
			$('p.small-gauge-text').html('GRA');
			animateGauge(SELFINSTALLNUMBER, GRANUMBER, "GRA");
			increaseCount(SELFINSTALLNUMBER);
		}
	});

	if ($.cookie('activePower') && $.cookie('activePower') !== 'Quantum') {
		switch ($.cookie('activePower')) {
			case 'Ice':
				fadePowersIn($('div.background'), "Ice", "Quantum", $('aside img:nth-child(4)'));
				break;
			case 'Invisible':
				fadePowersIn($('div.background'), "Invisible", "Quantum", $('aside img:nth-child(3)'));
				break;
			case 'Fire':
				fadePowersIn($('div.background'), "Fire", "Quantum", $('aside img:nth-child(2)'));
				break;
		}
	} else {
		fadePowersIn($('div.background'), "Quantum", "Quantum", $('aside img:first-child'));
	}
});