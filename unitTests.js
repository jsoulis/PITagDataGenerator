let test1 = generateTags(50, "fakeTag");
console.log(test1);

let test2 = generateUTCTimeStamps("29-Jul-04 15:27:23.000", "29-Jul-04 15:28:23.000", 1);
console.log(test2);

let test3 = UTCToPITimestamps(test2);
console.log(test3);

let test4 = generateData(test3.length);
console.log(test4);

let test5 = generateTimeStamps("29-Jul-04 15:27:23.000", "29-Jul-04 15:28:23.000", 1);
console.log(test5);

let test6 = generatePITagData("29-Jul-04 15:27:23.000", "29-Jul-04 15:28:23.000", 1);
console.log(test6);

let test7 = generateCSVData("29-Jul-04 15:27:23.000", "29-Jul-04 15:27:28.000", 1, 2, "Tag");
console.log(test7);