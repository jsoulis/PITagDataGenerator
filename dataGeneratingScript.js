console.log("Hello World");

//input startTime, endTime, and number of tags for fake data.
const generateTags = (numOfTags, tagTemplateName) => {
    let tagNames = new Array(numOfTags);
    for (let i = 0; i < numOfTags; i++) {
        let j = i+1;
        tagNames[i] = tagTemplateName + "_" + j;
    }
    return tagNames;
}

const generateUTCTimeStamps = (startTime, endTime, scanFreqSecs) => {
    //29-Jul-04 15:27:23.000
    let UTCStartTime = Date.parse(startTime);
    let UTCEndTime = Date.parse(endTime);

    console.log("startTime", UTCStartTime);
    console.log("endTime", UTCEndTime);

    //only considering scanFreqsecs of 1... other values require addressing corner cases
    let timeStep = 1000 * scanFreqSecs;

    let numTimeStamps = 1 + (UTCEndTime - UTCStartTime) / timeStep;
    let timeStamps = new Array(numTimeStamps);

    for(let i = 0; i < numTimeStamps; i++) {
        timeStamps[i] = UTCStartTime + timeStep*i;
    }

    return timeStamps;

    var date = new Date(time);
}

const UTCToPITimestamps = (utcTimeStamps) => {
    let PITimeStamps = new Array(utcTimeStamps.length);
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];

    for(let i = 0; i < PITimeStamps.length; i ++ ) {
        let date = new Date(utcTimeStamps[i]);
        let day = date.getDate();
        let month = months[date.getMonth()];
        let year = date.getFullYear().toString().substring(2);
        let hour = date.getHours().toString().length > 1 ? date.getHours().toString() : '0' + date.getHours().toString();
        let min = date.getMinutes().toString().length > 1 ? date.getMinutes().toString() : '0' + date.getMinutes().toString();
        let sec = date.getSeconds().toString().length > 1 ? date.getSeconds().toString() : '0' + date.getSeconds().toString();
        PITimeStamps[i] = day + "-" + month + "-" + year + " " + hour + ":" + min + ":" + sec;
    }

    return PITimeStamps;
}

const generateTimeStamps = (startTime, endTime, scanFreqSecs) => {
    let utcTimes = generateUTCTimeStamps(startTime, endTime, scanFreqSecs);
    let PITimes = UTCToPITimestamps(utcTimes);
    return PITimes;
}

const generateData = (numOfEntries) => {
    let data = new Array(numOfEntries);
    for(let i = 0; i < numOfEntries; i++) {
        data[i] = Math.floor(Math.random()*1000);
    }
    return data;
}

const generatePITagData = (startTime, endTime, scanFreqSecs) => {
    let PITagData;
    let timeStamps = generateTimeStamps(startTime, endTime, scanFreqSecs);
    let dataValues = generateData(timeStamps.length);
    PITagData = new Array(timeStamps.length);

    for(let i = 0; i < PITagData.length; i++) {
        PITagData[i] = timeStamps[i] + "," + dataValues[i];
    }

    return PITagData;

}

const generateCSVData = (startTime, endTime, scanFreqSecs, numOfTags, tagTemplateName) => {
    let tagNames = generateTags(numOfTags, tagTemplateName);
    let dataMatrix = [];
    let csvList = [];
    for(let i = 0; i < tagNames.length; i++) {
        dataMatrix.push(generatePITagData(startTime, endTime, scanFreqSecs));
    }

    for(let i = 0; i < dataMatrix.length; i++) {
        for(let j = 0; j < dataMatrix[i].length; j++) {
            let index = i*j + 1;
            csvList.push(tagNames[i] + "," + dataMatrix[i][j]);
        }
    }

    return csvList;
}



//this function will actually generate the CSV, but we need to pass it data
const downloadCSV = () => {
    let csvdata = generateCSVData("29-Jul-04 15:27:23.000", "29-Jul-04 15:27:28.000", 1, 2, "Tag");
    let mergedData ='';
    for(let i = 0; i < csvdata.length; i++) {
        //with just \n, the newline didnt appear in notepad, need \r\n for windows apparently.
        mergedData += csvdata[i] + '\r\n';
    }
    let csvContent = 'data:text/csv;charset=utf-8,' + mergedData;
    let encodedUri = encodeURI(csvContent);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = encodedUri;
    hiddenElement.target = '_blank';
    hiddenElement.download = 'backfillData.csv';
    hiddenElement.click();

    /* const rows = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
    let mergedRows = rows.map(e=>e.join(",")).join("\n");
    let csvContent = 'data:text/csv;charset=utf-8,' + mergedRows;
    var encodedUri = encodeURI(csvContent);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = encodedUri;
    hiddenElement.target = '_blank';
    hiddenElement.download = 'backfillData.csv';
    hiddenElement.click(); */
}


