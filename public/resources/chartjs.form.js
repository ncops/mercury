const socket = io('http://erst-demo-ui-socket-mercury.cluster.nonp.dp.dig.nchosting.dk');

let workers = [];
let jobs = [];

socket.on('connect', () => {
  console.log(socket.id);
});

socket.on('queueCheck', (data) => {
	workers.push(parseInt(data.workers));
	jobs.push(parseInt(data.jobs));
});

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};


function onRefresh(chart) {


	let worker = workers.pop();
	let job = jobs.pop();
    window.jobCount = job;
    window.workerCount = worker;

	chart.config.data.datasets[0].data.push({
		x: Date.now(),
		y: worker
	});

	// chart.config.data.datasets[0].label -- the label)
	$('#workersInTotal').text(worker);

	chart.config.data.datasets[1].data.push({
		x: Date.now(),
		y: job
	});

	//chart.config.data.datasets[1].label = 'Jobs = ' + job
    $('#jobsInTotal').text(job);


}

var color = Chart.helpers.color;
var config = {
	type: 'line',
	data: {
		datasets: [{
			label: 'Workers',
			backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
			borderColor: chartColors.red,
			fill: false,
			lineTension: 0,
			borderDash: [8, 4],
			data: []
		}, {
			label: 'Jobs',
			backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
			borderColor: chartColors.blue,
			fill: false,
			cubicInterpolationMode: 'monotone',
			data: []
		}]
	},
	options: {
		title: {
			display: false,
			text: 'Scaleability example for ERST'
		},
		scales: {
			xAxes: [{
				type: 'realtime',
				realtime: {
					duration: 60000,
					refresh: 2000,
					delay: 2000,
					onRefresh: onRefresh
				},
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Count'
				}
			}]
		},
		tooltips: {
			mode: 'nearest',
			intersect: false
		},
		hover: {
			mode: 'nearest',
			intersect: false
		}
	}
};

window.onload = function() {
	var ctx = document.getElementById('myChart').getContext('2d');
	window.myChart = new Chart(ctx, config);
};

document.getElementById('randomizeData').addEventListener('click', function() {
	config.data.datasets.forEach(function(dataset) {
		dataset.data.forEach(function(dataObj) {
			dataObj.y = randomScalingFactor();
		});
	});
	window.myChart.update();
});

var colorNames = Object.keys(chartColors);
document.getElementById('addDataset').addEventListener('click', function() {
	var colorName = colorNames[config.data.datasets.length % colorNames.length];
	var newColor = chartColors[colorName];
	var newDataset = {
		label: 'Dataset ' + (config.data.datasets.length + 1),
		backgroundColor: color(newColor).alpha(0.5).rgbString(),
		borderColor: newColor,
		fill: false,
		lineTension: 0,
		data: []
	};

	config.data.datasets.push(newDataset);
	window.myChart.update();
});

document.getElementById('removeDataset').addEventListener('click', function() {
	config.data.datasets.pop();
	window.myChart.update();
});

document.getElementById('addData').addEventListener('click', function() {
	onRefresh(window.myChart);
	window.myChart.update();
});
