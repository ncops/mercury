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
let secondCount = 5000; // 5 seconds

moment.locale('da');

setInterval(function(){
    if(prevJobCount === undefined){
        prevJobCount = window.jobCount;
    }

    if(prevJobCount != window.jobCount){
       difference = prevJobCount - window.jobCount;
    }

    $('#jobsPerSecond').text(difference);
    $('#jobsPerHour').text(difference/(secondCount/1000) * 60 * 60);

    let timeLeft = window.jobCount/(difference/(secondCount/1000));
    let k = moment().add(timeLeft, 's');

    $('#jobsExpectedTime').text(moment(k.format('HH:mm')).calendar());

    prevJobCount = window.jobCount;
}, secondCount);
