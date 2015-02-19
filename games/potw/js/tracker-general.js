$(document).ready( function () {
	$.ajax({
		dataType: "json",
		url: 'tracker-test.json',
		cache: false,
		success: function (json) {
			$('div.background').addClass(json.currentPower + '-background');
			$('p.view-scorecard').addClass(json.currentPower + '-view-scorecard');
			$('div.leader-container img').attr('src', 'images/' + json.currentPower + '-leader-bar.png')
			$('p.tier').addClass(json.currentPower + '-tier').children('span').html(json.currentTier);
			
			$('div.container > img').delay(2000).animate({
				top: "128px",
				marginLeft: "-163px",
				width: "96px"
			}, 2000);
			$('div.curtain').delay(2000).animate({
				left: "306px"
			}, 2000, function () {
				$('p.tier').fadeIn(500);
				$('div.leader-container img').delay(500).animate({left: '0px'}, 1000);
				$('p.view-scorecard').delay(1750).fadeIn(1000);
			});
		}
	});
});