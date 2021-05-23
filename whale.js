const selectEndDate = document.getElementById('banner-end-date');
const inputCurrentCrystals = document.getElementById('in-current-crystals');

selectEndDate.addEventListener('change', determineDaysUntilEnd);
inputCurrentCrystals.addEventListener('change', setCurrentCrystals);


// Package variables
var DaysLeft = 0;
var CurrentCrystals = 0;
var DailyDutyRewards = 0;

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

    // Output
    document.getElementById('days-until-end').innerText = Days_Until_End + " days left";
    DaysLeft = Days_Until_End;

}

function setCurrentCrystals(e){
    
    // Output
    document.getElementById('current-crystals').innerText = e.target.value;
    CurrentCrystals = e.target.value;
}

function determineDailyDuty(e){
    // Output
    
}