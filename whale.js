const selectEndDate = document.getElementById('banner-end-date');
if(selectEndDate){
    selectEndDate.addEventListener('change', determineDaysUntilEnd);
}

function determineDaysUntilEnd(e){
    
    let Days_Until_End = 0;

    // Fetch selected end date
    let EndDate = new Date(e.target.value);

    // Find the amount of days, N, between now and the end date
    let Today = new Date();
    Today.setHours(0,0,0,0);
    let Today_to_EndDate = EndDate - Today; // Time difference in msec

    // Convert to days (1000msec per second)(60 sec per min)(60 min per hour)(24 hr per day)
    if (Today_to_EndDate > 0){
        Days_Until_End = Math.ceil(Today_to_EndDate / (1000*60*60*24));
    }

    // If N is positive
    // Set the days remaining to N
    document.getElementById('days-until-end').innerText = Days_Until_End;
}