let fs = require('fs');
//SET THESE PARAMETERS
let NUMBER_OF_TAGS = 1;
let TAG_NAME_TEMP = 'Tag_';
let START_TIME = '30-Jan-18 08:00:00';
let END_TIME = '30-Jan-19 08:00:00';
let SCAN_FREQ = 1; //number of seconds
let MAX_SECTION_SIZE = 5000; //max number of elements in memory before writing to file - 5000 was fasted


//calculate how many times to make fs.appendFileSync call per tag
const numSections = (startTime, endTime, scanFreqSecs, maxSectionSize) => {
    let UTCStartTime = Date.parse(startTime);
    let UTCEndTime = Date.parse(endTime);

    //only considering scanFreqsecs of 1... other values require addressing corner cases
    let timeStep = 1000 * scanFreqSecs;
    let numTimeStamps = (UTCEndTime - UTCStartTime) / timeStep;

    let sections = Math.floor(numTimeStamps / maxSectionSize);
    let remains = numTimeStamps % maxSectionSize;

    chunkInfo = {
        remains: remains,
        sections: sections
    }

    console.log(chunkInfo.sections);

    return chunkInfo;
}

const UTCToPITime = (UTCTime) => {
    let PITimeStamp = '';
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

 
    let date = new Date(UTCTime);
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear().toString().substring(2);
    let hour = date.getHours().toString().length > 1 ? date.getHours().toString() : '0' + date.getHours().toString();
    let min = date.getMinutes().toString().length > 1 ? date.getMinutes().toString() : '0' + date.getMinutes().toString();
    let sec = date.getSeconds().toString().length > 1 ? date.getSeconds().toString() : '0' + date.getSeconds().toString();
    PITimeStamp = day + "-" + month + "-" + year + " " + hour + ":" + min + ":" + sec;

    return PITimeStamp;
}

const generateValue = () => {
    let data = Math.floor(Math.random()*1000);
    return data;
}

const createChunk = (startTime, endTime, tagName) => {
    let chunck = '';

    let line = '';
    let value = '';
    let pitime = '';

    let utcTime = startTime;
    let timeIncr = SCAN_FREQ * 1000;
    let numTags = 1 + (endTime - startTime) / 1000;

    for (let i = 0; i < numTags; i++) {
        pitime = UTCToPITime(utcTime);
        value = generateValue();
        line = tagName + ',' + pitime + ',' + value + '\n';
        chunck += line;
        utcTime += timeIncr;
    }

    return chunck;

}

const getTagName = (tagNumber) => {
    return TAG_NAME_TEMP + tagNumber;
}

const generateFile = (startTime, endTime, scanFreqSecs, numTags, maxSectionSize) => {

    const block = numSections(startTime, endTime, scanFreqSecs, maxSectionSize);
    let tagName = '';
    let dataChunck = '';
    let UTCStartTime;
    let UTCEndTime;

    //outer loop run for each tag
    for (let i = 0; i < numTags; i++) {
        UTCStartTime = Date.parse(startTime);
        tagName = getTagName(i+1);
        //console.log("tag", tagName);

        //console.log("block.sections", block.sections);

        //handle sections
        for (let j = 0; j < block.sections; j++) {

            //generate chunks of MAX_SECTION_SIZE
            UTCEndTime = UTCStartTime + maxSectionSize*1000 - 1000; //sections are 1 sec based...need milisec
            //console.log(`Section: ${j} - start: ${UTCStartTime}  end: ${UTCEndTime}`);
            dataChunck = createChunk(UTCStartTime, UTCEndTime, tagName);
            UTCStartTime = UTCEndTime + 1000;

            if(j === block.sections - 2) {
                UTCStartTime += 1000; //hacky way to include endTime... ugh not beautiful at all
            }
            //write To File
            fs.appendFileSync('message.txt', dataChunck);
        }

        //handle remains
        UTCStartTime = Date.parse(startTime) + maxSectionSize * block.sections * 1000 + 1000;
        UTCEndTime = UTCStartTime + block.remains * 1000 - 1000;
        //console.log(`Sta Time For Remains: ${UTCStartTime}`);
        //console.log(`End Time for Remains: ${UTCEndTime}`);

        dataChunck = createChunk(UTCStartTime, UTCEndTime, tagName);
        fs.appendFileSync('message.txt', dataChunck);

    }
}

let executeCodeStartTime = Date.now(); 
generateFile(START_TIME, END_TIME, SCAN_FREQ, NUMBER_OF_TAGS, MAX_SECTION_SIZE);
let executeCodeEndTime = Date.now(); 
let totalTime = (executeCodeEndTime - executeCodeStartTime) / 1000;
console.log(`Code completed execution in ${totalTime} seconds`);


