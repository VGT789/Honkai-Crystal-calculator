
// Field bindings
const selectEndDate = document.getElementById('banner-end-date');
const inputCurrentCrystals = document.getElementById('in-current-crystals');
const checkboxShareActive = document.getElementById('share');
const checkboxHoyoverseActive = document.getElementById('hoyoverse');
const selectBracket = document.getElementById('level-bracket');
const selectExaltedAbyssTier = document.getElementById('select-exalted-abyss-tier');
const selectAbyssTier = document.getElementById('select-abyss-tier');
const checkboxMonthlyCard = document.getElementById('monthly-card');
const checkboxArmadaActive = document.getElementById('armada');
const inputCardProgress = document.getElementById('card-progress');
const selectErTier= document.getElementById('ER-difficulty-level');
const SSSbosscountlist= document.getElementById('SSS-ma-boss-count');

selectEndDate.addEventListener('change', determineDaysUntilEnd);
inputCurrentCrystals.addEventListener('change', setCurrentCrystals);
checkboxShareActive.addEventListener('change',setShareActive);
checkboxHoyoverseActive.addEventListener('change',setHoyoverseActive);
selectBracket.addEventListener('change', setLevelBracket);
selectExaltedAbyssTier.addEventListener('change', determineAbyssTier);
selectAbyssTier.addEventListener('change', determineAbyssTier);
checkboxArmadaActive.addEventListener('change',setArmadaActive);
inputCardProgress.addEventListener('change', setMonthlyCardProgress);
selectErTier.addEventListener('change', setERdifficulty);
checkboxMonthlyCard.addEventListener('change',setMonthlyCard);
SSSbosscountlist.addEventListener('change',setSSSbosscount);

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
    FORBIDDEN:8,
    MyriadT100:9,
    MyriadT50:10
}

const ERdifficultyType = {
    Abstinence:0,
    Submergence:1,
    Inferno:2,
    Shroud:3,
    Void:4,
    No:5
}
const ABYSS_REWARD_MULT = [
    // Exalted=0
    // Nirv=0, RL=1, A3=2, A2=3, A1=4, S3=5, S2=6, S1=7, F=8, Myr100=9, Myr50=10
    [520,500,420,340,280,220,200,190,180,570,640],
    // Master=1
    [0,420,0,0,260,0,0,180,80],
    // Elite=2
    [0,350,0,0,220,0,0,140,70],
    // Basic=3
    [0,300,0,0,180,0,0,100,60]
]
const MA_REWARD_MULT = {
    EXALTED:100,
    MASTER:90,
    ELITE:90,
    BASIC:90
}
const ER_REWARD_MULT = {
    Abstinence:500,
    Submergence:450,
    Inferno:360,
    Shroud:280,
    Void:120,
    No:0
}
// Package variables
var DaysLeft = 0;
var ShareWeeksLeft = 0;
var MAWeeksLeft = 0;
var AbyssWeeksLeft = 0;
var ArmadaWeeksLeft = 0;

var CurrentCrystals = 0;
var DailyDutyRewards = 0;
var DailyIGloginRewards = 0;
var DailyHYVloginRewards = 0;
var ShareRewards = 0;
var AbyssRewards = 0;
var MemorialArenaRewards = 0;
var MAbossRewards = 0;
var ERRewards = 0;
var ArmadaRewards = 0;
var MonthlyCardRewards = 0;
var MonthlyCardProgress = 1;
var TotalCrystalRewards = 0;
var TotalCard = 0;

var difficulty = ERdifficultyType.Abstinence;
var LevelBracket = levelBracketType.EXALTED;
var AbyssTier = AbyssTierType.RED_LOTUS;
var AbyssTierMultiplier = ABYSS_REWARD_MULT[0][1];
var bosscount = 2;

var ActiveHoyoverse = false;
var ActiveArmada = true;
var ActiveShare = true;
var MonthlyCard = true;

function updateCalculations(){
    determineDailyDuty(DaysLeft);
    determineDailyIGLoginRewards(DaysLeft);
    determineDailyHYVLoginRewards(DaysLeft);
    determineShareRewards(DaysLeft);
    determineMAWeeksLeft(DaysLeft);
    determineAbyssWeeksLeft(DaysLeft);
    determineMemorialArenaRewards(LevelBracket);
    determineAbyssRewards(AbyssTierMultiplier);
    determineArmadaRewards(DaysLeft);
    determineMonthlyCardRewards(DaysLeft);
    determineERrewards(difficulty);
    determineTotalCrystalRewards();
    determineMAbossRewards(bosscount);
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

    // Output
    document.getElementById('days-until-end').innerText = Days_Until_End + " days left";
    DaysLeft = Days_Until_End;
    updateCalculations();
}

function determineAbyssWeeksLeft(d){

    let today = new Date();

    // Weeks = floor(days/7)
    let weeks = Math.floor(d/7);
    // Days left mod 7 = end day offset
    let end_day_offset = d % 7;
    // (end day offset + today) mod 7 = end day
    let end_day = (end_day_offset + today.getDay()) % 7;
    
    // Abyss weeks = weeks + 1 if end_day > wednesday or sunday and today is between abyss cycles
    AbyssWeeksLeft = 2 * weeks + ((((end_day > 3) && (today.getDay() <= 3)) || ((end_day > 0)&&(today.getDay() >= 3))) ? 1 : 0);
}

function determineMAWeeksLeft(d){
    
    let today = new Date();

    // Weeks = floor(days/7)
    let weeks = Math.floor(d/7);
    // Days left mod 7 = end day offset
    let end_day_offset = d % 7;
    // (end day offset + today) mod 7 = end day
    let end_day = (end_day_offset + today.getDay()) % 7;
    
    // MA weeks = weeks + 1 if end_day >= wednesday
    MAWeeksLeft = weeks + ((end_day >= 3) ? 1 : 0);
}

function setCurrentCrystals(e){
    
    // Output
    document.getElementById('current-crystals').innerText = parseInt(e.target.value,10);
    CurrentCrystals = parseInt(e.target.value,10);

    determineTotalCrystalRewards()
}

function determineDailyDuty(days){

    DailyDutyRewards = days * 40;
    // Output
    document.getElementById('duty-rewards').innerText = DailyDutyRewards;

    determineTotalCrystalRewards()
}

function determineDailyIGLoginRewards(days){

    DailyIGloginRewards = (days * 13.1777625)-((days * 13.1777625)%50);
    // Output
    document.getElementById('ig-login-rewards').innerText = DailyIGloginRewards;

    determineTotalCrystalRewards()
}

function determineDailyHYVLoginRewards(days){
    DailyHYVloginRewards = ActiveHoyoverse ? (days * 1.64722032)-((days * 1.64722032)%10) : 0;
    document.getElementById('hyv-login-rewards').innerText = DailyHYVloginRewards;

    determineTotalCrystalRewards()
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

function setERdifficulty(e){

    // Set difficulty
    switch(e.target.value){
        case '2.25':
            difficulty = ERdifficultyType.Abstinence;
            break;
        case '2.0':
            difficulty = ERdifficultyType.Submergence;
            break;
        case '1.75':
            difficulty = ERdifficultyType.Inferno;
            break;
        case '1.5':
            difficulty = ERdifficultyType.Shroud;
            break;
        case '1.0':
            difficulty = ERdifficultyType.Void;
            break;
        case '1.0':
            difficulty = ERdifficultyType.No;
            break;
    }

    // Calculate ER rewards
    determineERrewards(difficulty);

}

function setSSSbosscount(e){

    // Set number
    switch(e.target.value){
        case '2':
            bosscount = 2
            break;
        case '1':
            bosscount = 1;
            break;
        case '0':
            bosscount = 0;
            break;
    }

    // Calculate boss rewards
    determineMAbossRewards(bosscount);
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
        case 'myrT100':
            AbyssTier = AbyssTierType.MyriadT100;
            break;
        case 'myrT50':
            AbyssTier = AbyssTierType.MyriadT50;
            break;
        default:
            AbyssTier = AbyssTierType.RED_LOTUS;
    }

    Crystal_Multiplier = ABYSS_REWARD_MULT[LevelBracket][AbyssTier];

    // Output
    AbyssTierMultiplier = Crystal_Multiplier;
    determineAbyssRewards(AbyssTierMultiplier);
    
}

function determineAbyssRewards(mult){
    AbyssRewards = mult * AbyssWeeksLeft;
    document.getElementById('abyss-crystals').innerText = AbyssRewards;
    determineTotalCrystalRewards()
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
MemorialArenaRewards = MA_Multiplier * MAWeeksLeft;
document.getElementById('ma-mult').innerText = MA_Multiplier + " per cycle";
document.getElementById('ma-rewards').innerText = MemorialArenaRewards;
determineTotalCrystalRewards()
}

function determineMAbossRewards(bosscount) {
    MAbossRewards = bosscount * 20 * MAWeeksLeft
    document.getElementById('Ma-SSS-rewards').innerText = MAbossRewards;
    determineTotalCrystalRewards()
}

function determineERrewards(difficultylvl) {

    let ER_Multiplier = 0;

    switch(difficultylvl) {
        case ERdifficultyType.Abstinence:
            ER_Multiplier = ER_REWARD_MULT.Abstinence;
            break;
        case ERdifficultyType.Submergence:
            ER_Multiplier = ER_REWARD_MULT.Submergence;
            break;
        case ERdifficultyType.Inferno:
            ER_Multiplier = ER_REWARD_MULT.Inferno;
            break;
        case ERdifficultyType.Shroud:
            ER_Multiplier = ER_REWARD_MULT.Shroud;
            break;
        case ERdifficultyType.Void:
            ER_Multiplier = ER_REWARD_MULT.Void;
            break;
        case ERdifficultyType.No:
            ER_Multiplier = ER_REWARD_MULT.No;
            break
        default:
            ER_Multiplier = ER_REWARD_MULT.No;
    }
// Output
ERRewards = ER_Multiplier * ArmadaWeeksLeft;
document.getElementById('ER-rewards').innerText = ERRewards;
determineTotalCrystalRewards()
}
function setMonthlyCard(e){
    
    if(checkboxMonthlyCard.checked){
        MonthlyCard = true;
        document.getElementById("card-progress-row").removeAttribute(hidden);
    }
    else {
        MonthlyCard = false;
        document.getElementById("card-progress-row").hidden = 'true';
    }

    determineMonthlyCardRewards(DaysLeft);
}

function determineMonthlyCardRewards(d){

    // Calculate number of 15 day rewards to collect
    let CardEpochs = Math.floor((d + MonthlyCardProgress) / 15);

    MonthlyCardRewards = MonthlyCard ? (d * 60 + CardEpochs * 500) : 0;
    document.getElementById('card-rewards').innerText = MonthlyCardRewards;

    determineTotalCrystalRewards()
}

function setMonthlyCardProgress(e){
    MonthlyCardProgress = parseInt(e.target.value,10);
    determineMonthlyCardRewards(DaysLeft);
}

function setArmadaActive(e){

    ActiveArmada = checkboxArmadaActive.checked;
    determineArmadaRewards(DaysLeft);
}

function setShareActive(e){

    ActiveShare = checkboxShareActive.checked;
    determineShareRewards(DaysLeft);
}

function setHoyoverseActive(e){

    ActiveHoyoverse = checkboxHoyoverseActive.checked;
    determineDailyHYVLoginRewards(DaysLeft);
}

function determineArmadaWeeksLeft(d){
    let today = new Date();

    // Weeks = floor(days/7)
    let weeks = Math.floor(d/7);
    // Days left mod 7 = end day offset
    let end_day_offset = d % 7;
    // (end day offset + today) mod 7 = end day
    let end_day = (end_day_offset + today.getDay()) % 7;
    
    // MA weeks = weeks + 1 if end_day >= monday
    ArmadaWeeksLeft = weeks + ((end_day >= 1) ? 1 : 0);
}

function determineShareWeeksLeft(d){
    let today = new Date();

    // Weeks = floor(days/7)
    let weeks = Math.floor(d/7);
    // Days left mod 7 = end day offset
    let end_day_offset = d % 7;
    // (end day offset + today) mod 7 = end day
    let end_day = (end_day_offset + today.getDay()) % 7;
    
    // MA weeks = weeks + 1 if end_day >= monday
    ShareWeeksLeft = weeks + ((end_day >= 1) ? 1 : 0);
}

function determineArmadaRewards(d){
    determineArmadaWeeksLeft(d);
    ArmadaRewards = ActiveArmada ? ArmadaWeeksLeft * 25 : 0;
    document.getElementById('armada-rewards').innerText = ArmadaRewards;

    determineTotalCrystalRewards()
}

function determineShareRewards(d){
    determineShareWeeksLeft(d);
    ShareRewards = ActiveShare ? ShareWeeksLeft * 30 : 0;
    document.getElementById('share-rewards').innerText = ShareRewards;

    determineTotalCrystalRewards()
}

function determineTotalCrystalRewards(){
    
    TotalCrystalRewards = CurrentCrystals +
        DailyDutyRewards +
        DailyIGloginRewards +
        DailyHYVloginRewards +
        ShareRewards +
        AbyssRewards +
        MemorialArenaRewards + 
        ArmadaRewards + 
        ERRewards +
        MonthlyCardRewards +
        MAbossRewards;

    document.getElementById('total-rewards').innerText = TotalCrystalRewards + " crystals";
    determineTotalCardRewards(TotalCrystalRewards);
}
function determineTotalCardRewards(crystals){
    TotalCard = (crystals - crystals % 280)/280;
    document.getElementById('total-card').innerText = TotalCard + " expansion/focused card";
}
