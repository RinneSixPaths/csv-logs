var db = require('../db');
var logsArr = [];
var mapreduce = require('mapred')();

exports.initialWrite = function (logs) {
    logs.forEach((key) => {
        let buffArr = key.split(','),
            objToWrite = {URL: buffArr[0],
                         IP: buffArr[1],
                         timeStamp: Number(buffArr[2]),
                         timeSpent: Number(buffArr[3])};
        logsArr.push(objToWrite);
        if (logsArr.length == logs.length) checkAndWrite();
    });
    
}

function checkAndWrite() {
    db.get().collection('logs').find().toArray(function(err, logs) {
        if (logs && logs.length) {
            console.log('logs already exists');
            return true;
        } else {
            console.log('prepare to write logs');
            logsArr.forEach((key) => {
                db.get().collection('logs').insert(key, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
		          console.log('inserted');
	            });
            });
        }
	});
}

exports.all = function(req, res) {
    db.get().collection('logs').find().sort({URL:1}).toArray(function(err, logs) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(logs);
	});
};

exports.clear = function(req, res) {
    db.get().collection('logs').find().toArray(function(err, logs) {
        if (logs && logs.length) {
            logs.forEach((key) => {
                db.get().collection('logs').remove(key, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
		          console.log('deleted');
	            });
            });
        } else {
            console.log('collection is clear');
        }
	});
};

exports.getByURL = function(req, res) {
     db.get().collection('logs').find({ URL: req.params.url }).sort({IP:1}).toArray(function(err, logs) {
        if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(logs);
	});
}

exports.getByTime = function(req, res) {
     db.get().collection('logs').find({ timeSpent: { $gte: 0, $lte: Number(req.params.time) } }).sort({URL:1}).toArray(function(err, logs) {
        if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(logs);
	});
}

exports.getByIp = function(req, res) {
     db.get().collection('logs').find({ IP: req.params.ip }).sort({URL:1}).toArray(function(err, logs) {
        if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(logs);
	});
}

var map = function (key, value) {
    emit(this.URL, 1);
}
var reduce = function (key, values) {
	var sum = 0;
	for(var i in values) {
		sum += values[i];
	}
	return sum;
}

var options = {
        out: {
            inline:1
        },
        include_statistics: true,
        verbose: true
    };

exports.getAmount = function(req, res) {
     db.get().collection('logs').mapReduce(map, reduce, options, function(err, collection, stats) {
         collection.sort((a, b) => {if (a.value < b.value) return 1;});
         res.send(collection);
    });
}

var map2 = function (key, value) {
    emit(this.URL, this.timeSpent);
}


exports.getTimeSpent = function(req, res) {
     db.get().collection('logs').mapReduce(map2, reduce, options, function(err, collection, stats) {
         collection.sort((a, b) => {if (a.value < b.value) return 1;});
         res.send(collection);
    });
}

var map3 = function (key, value) {
    emit(this.IP, {recourse_count: 1, sum_count: this.timeSpent});
}
var reduce3 = function (key, values) {
	var sum = 0;
	var count = 0;
	for(var i in values){
		count += values[i].sum_count;
		sum += values[i].recourse_count;
	}
	return {recourse_count: sum, sum_count: count};
}

exports.getSpentIp = function(req, res) {
     db.get().collection('logs').mapReduce(map3, reduce3, options, function(err, collection, stats) {
         collection.sort((a, b) => {if (a.value.recourse_count < b.value.recourse_count) return 1;});
         collection.sort((a, b) => {if (a.value.sum_count < b.value.sum_count) return 1;});
         res.send(collection);
    });
}