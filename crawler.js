const req = require("request");
const storedData = require("./data");
const CronJob = require('cron').CronJob;

let ageData = {};
let genderData = {};
let raceData = {};


function retrieveData(limit, offset, callback) {
    const options = {
        url: "https://data.cdc.gov/resource/vbim-akqf.json?$limit=" + limit + "&$offset=" + offset,
        method: "GET"
    };

    req(options, function (err, res, result) {
        let r = [];
        try {
            r = JSON.parse(result);
        }
        catch (e) { }

        return callback(null, r);
    })
}


function processData(limit, offset, callback) {
    console.log("===== offset: " + offset);
    console.log("===== limit: " + limit);
    retrieveData(limit, offset, function (err, data) {
        if (err) {
            return callback(err);
        }

        if (data.length == 0) {
            return callback();
        }
        else {

            // PROCESS DATA
            // How many people catch COVID-19 in each age-group?
            data.forEach(function (item) {
                ageData[item.age_group] = (ageData[item.age_group] || 0) + 1;

                genderData[item.sex] = (genderData[item.sex] || 0) + 1;

                raceData["race_" + item.race_ethnicity_combined] = (raceData["race_" + item.race_ethnicity_combined] || 0) + 1;
            });


            console.log("==== ageData: " + JSON.stringify(ageData, null, 4))
            console.log("==== genderData: " + JSON.stringify(genderData, null, 4))
            console.log("==== raceData: " + JSON.stringify(raceData, null, 4))

            // Percentage of people catch COVID-19 in each race?
            // Display sex group of people catch COVID-19

            console.log("===== next batch");
            // return processData(limit, offset + limit, callback);
            return callback();
        }
    })
}

function crawlData() {
    let limit = 10000;
    let offset = 0;
    processData(limit, offset, function () {


        storedData.gender = genderData;
        storedData.age = ageData;
        storedData.race = raceData;
        console.log("Done");
    })
}


module.exports.start = function(){
    // Scheduler
    var job = new CronJob('0 0 0 1 * *', function () {
        crawlData();
    }, null, true, 'America/Los_Angeles');
    job.start();
}




// {
//     "0 - 9 Years": 90669,
//     "Female": 3487711,
//     "race_Black, Non-Hispanic": 538563,
//     "race_Hispanic/Latino": 825809,
//     "Male": 3166605,
//     "race_Missing": 325918,
//     "race_Unknown": 2583025,
//     "Unknown": 144363,
//     "race_White, Non-Hispanic": 1995968,
//     "race_Multiple/Other, Non-Hispanic": 268039,
//     "race_Asian, Non-Hispanic": 132301,
//     "race_American Indian/Alaska Native, Non-Hispanic": 58785,
//     "Missing": 20140,
//     "race_Native Hawaiian/Other Pacific Islander, Non-Hispanic": 11580,
//     "Other": 126,
//     "10 - 19 Years": 1003421,
//     "20 - 29 Years": 20962,
//     "30 - 39 Years": 1779481,
//     "50 - 59 Years": 1371910,
//     "60 - 69 Years": 1302023,
//     "40 - 49 Years": 867688,
//     "80+ Years": 123570,
//     "70 - 79 Years": 101253,
//     "NA": 78,
//     "race_NA": 12
// }