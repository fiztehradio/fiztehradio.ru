var chart;

$(document).ready(function () {

	changelistenersNumber();
	setInterval(function () {
	changelistenersNumber()
	}, 2 * 1000);

	chart = AmCharts.makeChart("stats-chart", {
		type: "stock",
		theme: "light",

		glueToTheEnd: true,
		syncDataTimestamps: true,

		gridAboveGraphs: true,
		fontSize: 12,

		dataDateFormat: "hh:mm:ss DD.MM.YYYY",

		// precision: -1,
		// percentPrecision: -2,


		dataSets: [{
			// "title": "Listeners",
			fieldMappings: [{
				fromField: "websiteListenersNumber",
				toField: "website"
			}, {
				fromField: "youtubeListenersNumber",
				toField: "youtube"
			}, {
				fromField: "vkListenersNumber",
				toField: "vk"
			}, {
				fromField: "totalListeners",
				toField: "totalListeners"
			}],

			categoryField: "timestamp",

			dataLoader: {
				url: "php/get_stats.php",
				format: "json",
				showCurtain: false,
				showErrors: true,
				numberFields: ["timestamp", "websiteListenersNumber", "youtubeListenersNumber", "vkListenersNumber"],
				postProcess: function (data, config, chart) {
					$.each(data, function () {
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
				},

				reload: 2
			}

		}],

		panels: [{

			legend: {},

			stockGraphs: [{
				id: "totalListeners",
				valueField: "totalListeners",
				title: "TOTAL",
				useDataSetColors: false,
				fillAlphas: 0,
				lineAlpha: 0.8,
				lineThickness: 3,
				lineColor: "#666666",
				bullet: "round",
				bulletBorderAlpha: 1,
				bulletColor: "#FFFFFF",
				useLineColorForBulletBorder: true,
				hideBulletsCount: 50
				// lineAlpha: 0
			}, {
				id: "graph1",
				valueField: "website",
				type: "line",
				title: "Website",
				useDataSetColors: false,
				fillColor: "#00FF00",
				fillAlphas: 0.2,
				lineAlpha: 1,
				lineThickness: 3,
				lineColor: "#00B0FF",
				bullet: "round",
				bulletBorderAlpha: 1,
				useLineColorForBulletBorder: true,
				hideBulletsCount: 50
			}, {
				id: "graph2",
				valueField: "youtube",
				type: "line",
				title: "Youtube stream",
				useDataSetColors: false,
				fillAlphas: 0.2,
				lineAlpha: 1,
				lineThickness: 3,
				lineColor: "#FF6D00",
				bullet: "round",
				bulletBorderAlpha: 1,
				bulletColor: "#FFFFFF",
				useLineColorForBulletBorder: true,
				hideBulletsCount: 50
			}, {
				id: "graph3",
				valueField: "vk",
				type: "line",
				title: "VK stream",
				useDataSetColors: false,
				fillAlphas: 0.2,
				lineAlpha: 1,
				lineThickness: 3,
				lineColor: "#00E676",
				bullet: "round",
				bulletBorderAlpha: 1,
				bulletColor: "#FFFFFF",
				useLineColorForBulletBorder: true,
				hideBulletsCount: 50
			}],

			zoomOutOnDataUpdate: false
		}],

		// "panelsSettings": {
		// 	"startDuration": 1
		// },

		categoryAxesSettings: {
			dashLength: 5,
			minPeriod: "ss",
			maxSeries: 500
		},

		valueAxesSettings: {
			dashLength: 5
		},

		chartScrollbarSettings: {
			graph: "totalListeners",
			graphType: "line",
			scrollbarHeight: 100
		},

		chartCursorSettings: {
			valueBalloonsEnabled: true
		},

		periodSelector: {
			periods: [{
				period: "mm",
				count: 10,
				label: "10 минут"
			}, {
				period: "hh",
				count: 1,
				label: "1 час",
				selected: true
			}, {
				period: "hh",
				count: 2,
				label: "2 часа"
			}, {
				period: "hh",
				count: 6,
				label: "6 часов"
			}, {
				period: "hh",
				count: 12,
				label: "12 часов"
			}, {
				period: "hh",
				count: 24,
				label: "24 часа"
			}, {
				period: "MAX",
				label: "MAX"
			}]
		}
	});

});

function setNumberDivColor(numberDiv) {
	if (numberDiv.text() > 99)
		numberDiv.css("color", "#FF0000");
	else if (numberDiv.text() > 49)
		numberDiv.css("color", "#F45743");
	else if (numberDiv.text() > 24)
		numberDiv.css("color", "#F2A232");
	else if (numberDiv.text() > 14)
		numberDiv.css("color", "#EDE63C");
	else if (numberDiv.text() > 4)
		numberDiv.css("color", "#5CAA4F");
	else if (numberDiv.text() > 1)
		numberDiv.css("color", "#638094");
	else
		numberDiv.css("color", "#616161");
}

function changelistenersNumber() {
	var websiteNumber = $("#website-listeners-number");
	var youtubeNumber = $("#youtube-listeners-number");
	var vkNumber = $("#vk-listeners-number");
	var totalNumber = $("#total-listeners-number");

	$.ajax({
		url: "php/icecast-listeners-number.php"
	}).done(function (resp) {
		// console.log(resp[0]);
		websiteNumber.text(resp[0].websiteListenersNumber);
		youtubeNumber.text(resp[0].youtubeListenersNumber);
		vkNumber.text(resp[0].vkListenersNumber);
		totalNumber.text(parseInt(resp[0].websiteListenersNumber) +
			parseInt(resp[0].youtubeListenersNumber) +
			parseInt(resp[0].vkListenersNumber));
		setNumberDivColor(websiteNumber);
		setNumberDivColor(youtubeNumber);
		setNumberDivColor(vkNumber);
		setNumberDivColor(totalNumber);
	});
}