var db = require('../db');

exports.getSiteByName = function(hostName) {
    /*db.get().collection('logs').find({ URL: hostName }).toArray(function(err, logs) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		res.send(logs);
	});*/
    
    console.log(hostName);
    
    return { name: 'Anton' };
}

/*var data = {
    
    hostName: 'instagram.com'
    
}

fetch('/teest', {
    
        method: "POST",
        mode: 'cors',
        body: data
    
    })
    .then(function(response) {
            return response.json();
    })
    .then(data => {
        console.log(data)
    });*/