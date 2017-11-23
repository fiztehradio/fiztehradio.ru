var chart;

$(document).ready(function () {

	changelistenersNumber();
	setInterval(function () {
	changelistenersNumber()
	}, 2 * 1000);

	// AmCharts.makeChart( "stats-chart", {
	// 	"type": "stock",
	// 	"dataDateFormat": "YYYY-MM-DD",
	// 	"dataSets": [ {
	// 		"dataProvider": [ {
	// 			"date": "2011-06-01",
	// 			"val": 10
	// 		}, {
	// 			"date": "2011-06-02",
	// 			"val": 11
	// 		}, {
	// 			"date": "2011-06-03",
	// 			"val": 12
	// 		}, {
	// 			"date": "2011-06-04",
	// 			"val": 11
	// 		}, {
	// 			"date": "2011-06-05",
	// 			"val": 10
	// 		}, {
	// 			"date": "2011-06-06",
	// 			"val": 11
	// 		}, {
	// 			"date": "2011-06-07",
	// 			"val": 13
	// 		}, {
	// 			"date": "2011-06-08",
	// 			"val": 14
	// 		}, {
	// 			"date": "2011-06-09",
	// 			"val": 17
	// 		}, {
	// 			"date": "2011-06-10",
	// 			"val": 13
	// 		} ],
	// 		"fieldMappings": [ {
	// 			"fromField": "val",
	// 			"toField": "value"
	// 		} ],
	// 		"categoryField": "date"
	// 	} ],
	//
	// 	"panels": [ {
	//
	// 		"legend": {},
	//
	// 		"stockGraphs": [ {
	// 			"id": "graph1",
	// 			"valueField": "value",
	// 			"type": "column",
	// 			"title": "MyGraph",
	// 			"fillAlphas": 1
	// 		} ]
	// 	} ],
	//
	// 	"panelsSettings": {
	// 		"startDuration": 1
	// 	},
	//
	// 	"categoryAxesSettings": {
	// 		"dashLength": 5
	// 	},
	//
	// 	"valueAxesSettings": {
	// 		"dashLength": 5
	// 	},
	//
	// 	"chartScrollbarSettings": {
	// 		"graph": "graph1",
	// 		"graphType": "line"
	// 	},
	//
	// 	"chartCursorSettings": {
	// 		"valueBalloonsEnabled": true
	// 	},
	//
	// 	"periodSelector": {
	// 		"periods": [ {
	// 			"period": "DD",
	// 			"count": 1,
	// 			"label": "1 day"
	// 		}, {
	// 			"period": "DD",
	// 			"selected": true,
	// 			"count": 5,
	// 			"label": "5 days"
	// 		}, {
	// 			"period": "MM",
	// 			"count": 1,
	// 			"label": "1 month"
	// 		}, {
	// 			"period": "YYYY",
	// 			"count": 1,
	// 			"label": "1 year"
	// 		}, {
	// 			"period": "YTD",
	// 			"label": "YTD"
	// 		}, {
	// 			"period": "MAX",
	// 			"label": "MAX"
	// 		} ]
	// 	}
	// } );


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
			}, {
				id: "totalListeners",
				valueField: "totalListeners",
				lineAlpha: 0
			}],

			zoomOutOnDataUpdate: false
		}],

		// "panelsSettings": {
		// 	"startDuration": 1
		// },

		categoryAxesSettings: {
			dashLength: 5,
			minPeriod: "ss",
			maxSeries: -1
		},

		valueAxesSettings: {
			dashLength: 5
		},

		chartScrollbarSettings: {
			graph: "graph1",
			graphType: "line",
			scrollbarHeight: 100
		},

		chartCursorSettings: {
			valueBalloonsEnabled: true
		},

		periodSelector: {
			periods: [{
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

	$.ajax({
		url: "php/icecast-listeners-number.php"
	}).done(function (resp) {
		console.log(resp[0]);
		websiteNumber.text(resp[0].websiteListenersNumber);
		youtubeNumber.text(resp[0].youtubeListenersNumber);
		vkNumber.text(resp[0].vkListenersNumber);
		setNumberDivColor(websiteNumber);
		setNumberDivColor(youtubeNumber);
		setNumberDivColor(vkNumber);
	});
}