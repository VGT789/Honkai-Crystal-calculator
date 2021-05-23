
// Field bindings
const selectEndDate = document.getElementById('banner-end-date');
const inputCurrentCrystals = document.getElementById('in-current-crystals');
const selectBracket = document.getElementById('level-bracket');
const selectExaltedAbyssTier = document.getElementById('select-exalted-abyss-tier');
const selectAbyssTier = document.getElementById('select-abyss-tier');

selectEndDate.addEventListener('change', determineDaysUntilEnd);
inputCurrentCrystals.addEventListener('change', setCurrentCrystals);
selectBracket.addEventListener('change', setLevelBracket);
selectExaltedAbyssTier.addEventListener('change', determineAbyssTier);
selectAbyssTier.addEventListener('change', determineAbyssTier);

// Constants
const hidden = 'hidden';
const levelBracketType = {
    EXALTED:'exalted',
    MASTER:'master',
    ELITE:'elite',
    BASIC:'basic'
}
const AbyssTierType = {
    NIRVANA:'nirvana',
    RED_LOTUS:'rl',
    AGONY_3:'a3',
    AGONY_2:'a2',
    AGONY_1:'a1',
    SINFUL_3:'s3',
    SINFUL_2:'s1',
    SINFUL_1:'s1',
    FORBIDDEN:'f'
}
const MA_REWARD_MULT = {
    EXALTED:100,
    MASTER:90,
    ELITE:90,
    BASIC:90
}

// Package variables
var DaysLeft = 0;
var MAWeeksLeft = 0;
var CurrentCrystals = 0;
var DailyDutyRewards = 0;
var LevelBracket = levelBracketType.EXALTED;
var AbyssTier = AbyssTierType.RED_LOTUS;
var MemorialArenaRewards = 0;

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
    determineDailyDuty(DaysLeft);
    determineMemorialArenaRewards(LevelBracket);
    determineMAWeeksLeft(DaysLeft);
}

function setCurrentCrystals(e){
    
    // Output
    document.getElementById('current-crystals').innerText = e.target.value;
    CurrentCrystals = e.target.value;
}

function determineDailyDuty(days){

    DailyDutyRewards = days * 40;
    // Output
    document.getElementById('duty-rewards').innerText = DailyDutyRewards;

}

function setLevelBracket(e){

    // Set bracket
    switch(e.target.value){
        case 'exalted':
            LevelBracket = levelBracketType.EXALTED;
            break;
        case 'master':
            LevelBracket = levelBracketType.MASTER;
            break;
        case 'elite':
            LevelBracket = levelBracketType.ELITE;
            break;
        case 'basic':
            LevelBracket = levelBracketType.BASIC;
            break;
        default:
            LevelBracket = levelBracketType.EXALTED;
    }
    // Reveal appropriate abyss tier selection boxes
    if (LevelBracket == levelBracketType.EXALTED) {
        document.getElementById('select-exalted-abyss-tier').removeAttribute(hidden);
        document.getElementById('select-abyss-tier').hidden = 'true';
    }
    else {
        document.getElementById('select-exalted-abyss-tier').hidden = 'true';
        document.getElementById('select-abyss-tier').removeAttribute(hidden);
    }

    // Calculate MA rewards
    determineMemorialArenaRewards(LevelBracket);

}

function determineAbyssTier(e){

    // Save off abyss tier
    switch(e.target.value){
        case 'nirv':
            AbyssTier = AbyssTierType.NIRVANA;
            break;
        case 'rl':
            AbyssTier = AbyssTierType.RED_LOTUS;
            break;
        case 'a3':
            AbyssTier = AbyssTierType.AGONY_3;
            break;
        case 'a2':
            AbyssTier = AbyssTierType.AGONY_2;
            break;
        case 'a1':
            AbyssTier = AbyssTierType.AGONY_1;
            break;
        case 's3':
            AbyssTier = AbyssTierType.SINFUL_3;
            break;
        case 's2':
            AbyssTier = AbyssTierType.SINFUL_2;
            break;
        case 's1':
            AbyssTier = AbyssTierType.SINFUL_1;
            break;
        case 'f':
            AbyssTier = AbyssTierType.FORBIDDEN;
            break;
        default:
            AbyssTier = AbyssTierType.RED_LOTUS;
    }

    // Output
    document.getElementById('abyss-crystals').innerText = "0";
}

function determineMemorialArenaRewards(bracket) {

    switch(bracket) {
        case levelBracketType.EXALTED:
            MemorialArenaRewards = MA_REWARD_MULT.EXALTED * MAWeeksLeft;
            break;
        case levelBracketType.MASTER:
            MemorialArenaRewards = MA_REWARD_MULT.MASTER * MAWeeksLeft;
            break;
        case levelBracketType.ELITE:
            MemorialArenaRewards = MA_REWARD_MULT.ELITE * MAWeeksLeft;
            break;
        case levelBracketType.BASIC:
            MemorialArenaRewards = MA_REWARD_MULT.BASIC * MAWeeksLeft;
            break;
        default:
            MemorialArenaRewards = 0;
    }

    // Output
    document.getElementById('ma-rewards').innerText = MemorialArenaRewards;
}