$('#setJob').on('click', () => {
    $('#amountJobs').val(window.jobCount);
});

$('#setJob').on('click', () => {
    $('#amountJobs').val(window.jobCount);
});

$('#jobCountDecr').on('click', () => {
    $('#amountJobs').val(parseInt($('#amountJobs').val()) - 1);
});

$('#jobCountIncr').on('click', () => {
    $('#amountJobs').val(parseInt($('#amountJobs').val()) + 1);
});

$('#jobsCountSave').on('click', () => {
    $.get( "/setJobs/" + parseInt($('#amountJobs').val()), function(  ) {
        console.log("Added jobs")
    });
});

let prevJobCount;
let difference = 0;
let secondCount = 2500; // 5 seconds
let avgsJobsPerSecond = [];

moment.locale('da');

setInterval(function(){
    if(prevJobCount === undefined){
        prevJobCount = window.jobCount;
    }

    if(prevJobCount != 0){
       difference = prevJobCount - window.jobCount;
    } else {
        difference = 0;
        prevJobCount = window.jobCount;
    }

    let average = getAverage(avgsJobsPerSecond, (difference/(secondCount/1000)));

    $('#jobsPerSecond').text(average);
    $('#jobsPerHour').text((average * 60 * 60).toFixed(2));

    let timeLeft = window.jobCount/average;
    let k = moment().add(timeLeft, 's');

    if(window.jobCount !== 0){
        $('#jobsExpectedTime').text(moment(k).calendar());
    } 

    prevJobCount = window.jobCount;
}, secondCount);


const getAverage = (theArray, value) => {
    if(theArray.length === 25){
        theArray.shift();
    }

    theArray.push(value);
    console.log(theArray);
    return (theArray.reduce((a,b) => a + b, 0) / theArray.length).toFixed(2);
};