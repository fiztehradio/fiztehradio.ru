var chart;

$(document).ready(function () {

	changelistenersNumber();
	// setInterval(function () {
		// changelistenersNumber()
	// }, 2 * 1000);

	chart = AmCharts.makeChart("stats-chart", {
		"type": "serial",
		"theme": "light",

		// "glueToTheEnd": true,
		// "syncDataTimestamps": true,

		"gridAboveGraphs": true,
		"fontSize": 12,

		// "dataDateFormat": "hh:mm:ss DD.MM.YYYY",

		"chartScrollbar": {
			"autoGridCount": true,
			"graph": "totalListeners",
			"scrollbarHeight": 80,
			"position": "bottom"
		},

		"dataLoader": {
			"url": "php/get_stats.php",
			"format": "json",
			"showCurtain": true,
			"showErrors": true,
			"numberFields": [ "timestamp", "websiteListenersNumber", "youtubeListenersNumber", "vkListenersNumber" ],
			"postProcess": function(data, config, chart) {
				$.each(data, function() {
					this.timestamp *= 1000;
					this.totalListeners = parseInt(this.websiteListenersNumber) +
								parseInt(this.youtubeListenersNumber) +
								parseInt(this.vkListenersNumber);
				});

				var lastPoint = data[data.length - 1];

				var oneMorePoint = {
					"timestamp": new Date().getTime(),
					"websiteListenersNumber": lastPoint.websiteListenersNumber,
					"youtubeListenersNumber": lastPoint.youtubeListenersNumber,
					"vkListenersNumber": lastPoint.vkListenersNumber,
					"totalListeners": lastPoint.totalListeners
				};
				data.push(oneMorePoint);

				// console.log(JSON.stringify(data));
				return data;
			}
		},

		"categoryField": "timestamp",

		"graphs": [{
			"id": "websiteListeners",
			"title": "Website",
			"valueField": "websiteListenersNumber",
			"lineAlpha": 1,
			"lineThickness": 4,
			"lineColor": "#00a1f1",
			"balloonText": "[[value]]",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"useLineColorForBulletBorder": true,
			"hideBulletsCount": 50
		}, {
			"title": "YouTube",
			"valueField": "youtubeListenersNumber",
			"lineAlpha": 1,
			"lineThickness": 4,
			"lineColor": "#FF6D00",
			"balloonText": "[[value]]",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"useLineColorForBulletBorder": true,
			"hideBulletsCount": 50
		}, {
			"title": "vk",
			"valueField": "vkListenersNumber",
			"lineAlpha": 1,
			"lineThickness": 4,
			"lineColor": "#00E676",
			"balloonText": "[[value]]",
			"bullet": "round",
			"bulletBorderAlpha": 1,
			"bulletColor": "#FFFFFF",
			"useLineColorForBulletBorder": true,
			"hideBulletsCount": 50
		}, {
			"id": "totalListeners",
			"valueField": "totalListeners",
			"lineAlpha": 0
		}],

		"legend": {
			"enabled": true,
			"useGraphSettings": true
		},

		"categoryAxis": {
			"parseDates": true,
			"minPeriod": "ss"
		}
	});

	$("#zoom-out-button").click(function() {
		chart.zoomOut();
	});

	$("#zoom-1-hour-button").click(function() {
		zoomChartTo(1);
	});

	$("#zoom-2-hour-button").click(function() {
		zoomChartTo(2);
	});

	$("#zoom-6-hour-button").click(function() {
		zoomChartTo(6);
	});

	$("#zoom-12-hour-button").click(function() {
		zoomChartTo(12);
	});

	$("#update-chart").click(function() {
		console.log("update");
		chart.validateData();
		// chart.update()
	});

	// setTimeout()
});

function zoomChartTo(hours)
{
	var currentTimeStamp = new Date();
	var previousTimeStamp = new Date();
	previousTimeStamp.setHours(currentTimeStamp.getHours() - hours);
	chart.zoomToDates(previousTimeStamp, currentTimeStamp);
}

function getNearestChartDataElement(goal) {
	var closest = null;
	$.each(chart.chartData, function(){
		if (closest === null || Math.abs(this.category - goal) < Math.abs(closest - goal)) {
			closest = this.category;
		}
	});
	return closest;
}

function setNumberColor(color) {
	$("#listeners-number").css("color", color);
}

function changelistenersNumber() {
	var numberDiv = $("#listeners-number");
	$.ajax({
		url: "php/icecast-listeners-number.php"
	}).done(function(resp) {
		numberDiv.text(resp);

		if (numberDiv.text() > 99)
			setNumberColor("#FF0000");
		else if (numberDiv.text() > 49)
			setNumberColor("#F45743");
		else if (numberDiv.text() > 24)
			setNumberColor("#F2A232");
		else if (numberDiv.text() > 14)
			setNumberColor("#EDE63C");
		else if (numberDiv.text() > 4)
			setNumberColor("#5CAA4F");
		else if (numberDiv.text() > 1)
			setNumberColor("#638094");
		else
			setNumberColor("#616161");
	});
}