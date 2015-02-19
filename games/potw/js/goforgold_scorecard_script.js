// JS

var $leaderUnits = $('#leader-units').text().replace('$', '');
$leaderUnits = parseInt($leaderUnits.replace(/\,/g, ''));

var $userUnits = $('#user-units').text().replace('$', '');
$userUnits = parseInt($userUnits.replace(/\,/g, ''));

var $wdd = $('#weekly-dropdown'),
	$arrow = $('#dropdown-arrow'),
	$weeks = $('#weeks'),
	$wlinks = $('#weeks li a'),
	wLinkHeight = 25, // each list item is 25px tall
	$userBar = $('#user-bar'),
	$leaderBar = $('#leader-bar'),
//	$leaderUnits = parseInt($('#leader-units').text().replace(/\,/g, '')),
//	$userUnits = parseInt($('#user-units').text().replace(/\,/g, '')),
	userBarWidth = (Math.round(288 * ($userUnits / $leaderUnits))) + 'px';

$arrow.click(function(){
	if ($wdd.css('overflow') === 'hidden') {
		$wdd.css('overflow', 'visible');
		$wdd.find('li a').addClass('dd-open');
	} else {
		$wdd.css('overflow', 'hidden');
		$wdd.find('li a').removeClass('dd-open');
	}
});

$wlinks.click(function(e){
	e.preventDefault();
	if ($wdd.css('overflow') === 'visible') {
		var id = $(this).attr('id');
		var num = id.substr(4, id.length) - 1;
		$weeks.css('top', -(num * wLinkHeight)-1);
		$wdd.find('li a').removeClass('dd-open');
		$wdd.css('overflow', 'hidden');
		getWeekData(num);
		
	} else {
		return;
	}
});

function getWeekData(weekNum) {
	/* This will pass the week number to a URL in order to update the stats with new info */
	location.href="/portal/importantprograms/selfServiceGoForGoldJune2012Scorecard.action?week=" + weekNum;
	if (true) return true;
	$.ajax({
	        type: "POST",
	        url: "/portal/importantprograms/selfServiceGoForGoldJune2012Scorecard.action",
	        data: {"week" : weekNum},
	        success: function(data) {
			//	$('#weekly-results-table table').remove();
				$('body').html(data);
	        }
	});
}

function padScore($el, maxLength) {
	var length = $el.text().length;
	var diff = maxLength - length;
	var i;
	if (length < maxLength) {
		for (i = 0; i < diff; i++) {
			$el.text('0' + $el.text());
		}
	}
}
padScore($('#sb-fp-score'), 6);
padScore($('#sb-hmc-score'), 2);
padScore($('#sb-ranking-score'), 3);
padScore($('#wu-score'), 5);
padScore($('#et-score'), 2);


// replace text with images
// grab each image and step up from 0 until number is reached

$('.score').each(function(){
	$(this).html($(this).html().replace(/1/g, '<div class="sb-num sb-1">1</div>'));
	$(this).html($(this).html().replace(/2/g, '<div class="sb-num sb-2">2</div>'));
	$(this).html($(this).html().replace(/3/g, '<div class="sb-num sb-3">3</div>'));
	$(this).html($(this).html().replace(/4/g, '<div class="sb-num sb-4">4</div>'));
	$(this).html($(this).html().replace(/5/g, '<div class="sb-num sb-5">5</div>'));
	$(this).html($(this).html().replace(/6/g, '<div class="sb-num sb-6">6</div>'));
	$(this).html($(this).html().replace(/7/g, '<div class="sb-num sb-7">7</div>'));
	$(this).html($(this).html().replace(/8/g, '<div class="sb-num sb-8">8</div>'));
	$(this).html($(this).html().replace(/9/g, '<div class="sb-num sb-9">9</div>'));
	$(this).html($(this).html().replace(/0/g, '<div class="sb-num sb-0">0</div>'));
});

$('.sb-num').each(function() {
	var $this = $(this),
		num = $this.html(),
		offset = -261,
		delay = 250,
		height = 29;

	function animateScore() {
		offset = offset + height;
		$this.css('background-position', '0 ' + offset + 'px');
		num--;
		if (num > 0) {
			setTimeout(animateScore, delay);
		}
	}

	if (num > 0) {
		$this.css('background-position', '0 '+ offset +'px');
		setTimeout(animateScore, delay);
	}
});


$leaderBar.css('width', '0px');
$userBar.css('width', '0px');
$leaderBar.animate({width: '288px'}, 1000);
$userBar.animate({width: userBarWidth}, 1000);

$('#weekly-results-popup').hide();

$('#wu-score').click(function(e){
	e.stopPropagation();
	$('#weekly-results-popup').toggle();
	$('#disclaimerId').toggle();
	$('#rssFeedId').toggle();
	$('#account-prospect').toggle();
});
$('#weeklyUnitsLabel').click(function(e){
	e.stopPropagation();
	$('#weekly-results-popup').toggle();
	$('#disclaimerId').toggle();
	$('#rssFeedId').toggle();
	$('#account-prospect').toggle();
});

$(document).bind('click', function (e) {
	if ($('#weekly-results-popup').css('display') === 'block') {
		$('#weekly-results-popup').toggle();
		$('#disclaimerId').toggle();
		$('#rssFeedId').toggle();
		$('#account-prospect').toggle();
	}
});

$('#weekly-results-popup').bind('click', function(e) {
    e.stopPropagation();
});

