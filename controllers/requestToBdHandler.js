var db = require('../db');

exports.getSiteByName = function(hostName, req, res) {
    
    let host = {}
    console.log(hostName);
    console.log(typeof hostName);
    db.get().collection('logs').find({ URL: hostName }).toArray(function(err, logs) {
		if (err) {
			console.log(err);
		}
        console.log(logs);
        res.json(logs);
	});
}