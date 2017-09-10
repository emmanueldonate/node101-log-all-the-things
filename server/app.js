const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const csv = path.join(__dirname, 'log.csv');

app.use((req, res, next) => {
// write your logging code here
const agent = req.headers['user-agent'].replace(',', '');
const date = new Date();
const time = date.toISOString();
const method = req.method;
const resource = req.originalUrl;
const version = 'HTTP/' + req.httpVersion;
const status = res.statusCode;

//console.log(agent +','+ time +','+ method +','+ resource +','+ version +','+ status +',');


fs.appendFile(csv, '\n'  + agent +','+ time +','+ method +','+ resource +','+ version +','+ status, (err) => {
    if (err) throw err;
});
    
    next()
});


app.get('/', (req, res) => {
// write your code to respond "ok" here
res.status(200).send('ok');

});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
const arrayJson =[];

fs.readFile(csv, 'utf8', function(err, data) {
    if(err) res.status(500).send('error');

    var linesArray = data.split('\n');
    linesArray.shift();
    //console.log(linesArray)

    linesArray.forEach(function (IgLine) {
        var value = IgLine.split(',');

        var dataArray = {
            'Agent': value[0],
            'Time': value[1],
            'Method': value[2],
            'Resource': value[3],
            'Version': value[4],
            'Status': value[5]
        };
        arrayJson.push(dataArray);
});
res.json(arrayJson);
});
});


module.exports = app;
