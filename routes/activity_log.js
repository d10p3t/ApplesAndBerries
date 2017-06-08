var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next){
	var log_raw = fs.readFileSync('log.log', 'utf8');
	log_raw = log_raw.replace(/{/g, '\t{');
	log_raw = log_raw.replace(/}/g, '},');
	log_raw = '[\n' + log_raw + ']';
	log_raw = log_raw.replace('},\n]', '}\n]');

	log_raw = JSON.parse(log_raw);

	for (var i = 0; i < log_raw.length; i++) {
		log_raw[i].timestamp = log_raw[i].timestamp.substring(0, 10);
	}

	res.render('activity_log', {title: 'Activity Log', act_log: log_raw });
});

module.exports = router;
