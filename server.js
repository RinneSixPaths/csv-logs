var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db = require('./db');
var logsController = require('./controllers/commands');

const queryHandler = require('./controllers/requestToBdHandler');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/controllers'));

var CSVlogs = ['google.com,62.185.176.128,1513676560910,56000',
               'google.com,62.185.176.122,1513676560910,56000',
              'amazon.com,192.94.221.0,1513676560910,56000',
              'facebook.com,193.124.0.0,1513676560910,56000',
              'instagram.com,193.178.135.255,1513676560910,56000',
              'vk.com,193.188.134.64,1513676560910,56000',
              'github.com,192.124.174.255,1513676560910,56000',
              'youtube.com,212.108.127.255,1513676560910,56000',
              'bsuir.by,212.108.127.255,1513676560910,56000']

app.get('/', function(req, res) {
	res.send('Hello SPP');
});

app.get('/logs', logsController.all);

app.get('/clear', logsController.clear);

app.get('/logs/:url', logsController.getByURL);

app.get('/logs/time/:time', logsController.getByTime);

app.get('/logs/ip/:ip', logsController.getByIp);

app.get('/sum-timespent', logsController.getTimeSpent);

app.get('/amount', logsController.getAmount);

app.get('/getspentip', logsController.getSpentIp);

db.connect('mongodb://localhost:27017/myapi', function(err) {
	if (err) {
		return console.log(err);
	}
    logsController.initialWrite(CSVlogs);
	app.listen(3012, function() {
		console.log('SPP app started');
	});
});

app.get('/teest', function(req, res) {
    res.sendFile(path.join(__dirname+'/testPost.html'));
});

app.post("/teest", function (request, response) {
    
    console.log('got request!');
    console.log(request.method);
    
    const siteObject = queryHandler.getSiteByName(request.body.hostName, request, response);
    
});
