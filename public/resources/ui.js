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

    });
});
