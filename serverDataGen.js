let fs = require('fs');

try {
    let input = "15-Jul-18 09:36:28.000"
    let limit = 31000000; //about the num of seconds in a year

    //this took forever and the file grew at a very slow pace while CPU usage exploded.
    //I think I should write to a buffer first and then periodically append
    //what is written to the buffer, to the file.
  /*   for (let i = 0; i < limit; i++) {
        fs.appendFile('message.txt', input);
    } */
    let segment = limit / 10000;
    let buffer = '';
    for (let i = 0; i < segment; i++) {
        for (let j = 0; j < 10000; j++) {
            buffer += input;
        }
        fs.appendFileSync('message.txt', buffer);
        buffer = '';
    }
    console.log('The "data to append" was appended to file!');
} catch (err) {
    /* Handle the error */
}


const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});