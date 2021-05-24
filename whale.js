
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
    EXALTED:0,
    MASTER:1,
    ELITE:2,
    BASIC:3
}
const AbyssTierType = {
    NIRVANA:0,
    RED_LOTUS:1,
    AGONY_3:2,
    AGONY_2:3,
    AGONY_1:4,
    SINFUL_3:5,
    SINFUL_2:6,
    SINFUL_1:7,
    FORBIDDEN:8
}
const ABYSS_REWARD_MULT = [
    // Exalted
    // Nirv, RL, A3, A2, A1, S3, S2, S1, F
    [520,500,420,340,280,220,200,190,180],
    // Master
    [0,420,0,0,260,0,0,180,80],
    // Elite
    [0,350,0,0,220,0,0,140,70],
    // Basic
    [0,300,0,0,180,0,0,100,60]
]
const MA_REWARD_MULT = {
    EXALTED:100,
    MASTER:90,
    ELITE:90,
    BASIC:90
}

// Package variables
var DaysLeft = 0;
var MAWeeksLeft = 2;
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
    //determineMAWeeksLeft(DaysLeft);
}

function determineMAWeeksLeft(d) {
    
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

    let Crystal_Multiplier = 0;

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

    Crystal_Multiplier = ABYSS_REWARD_MULT[LevelBracket][AbyssTier];
    // Output
    document.getElementById('abyss-crystals').innerText = Crystal_Multiplier;
}

function determineMemorialArenaRewards(bracket) {

    let MA_Multiplier = 0;

    switch(bracket) {
        case levelBracketType.EXALTED:
            MA_Multiplier = MA_REWARD_MULT.EXALTED;
            break;
        case levelBracketType.MASTER:
            MA_Multiplier = MA_REWARD_MULT.MASTER;
            break;
        case levelBracketType.ELITE:
            MA_Multiplier = MA_REWARD_MULT.ELITE;
            break;
        case levelBracketType.BASIC:
            MA_Multiplier = MA_REWARD_MULT.BASIC;
            break;
        default:
            MemorialArenaRewards = 0;
    }

    // Output
    document.getElementById('ma-mult').innerText = MA_Multiplier + " per cycle";
    document.getElementById('ma-rewards').innerText = MA_Multiplier * MAWeeksLeft;
}