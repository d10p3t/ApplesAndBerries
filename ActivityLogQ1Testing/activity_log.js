var fs = require('fs');


fs.writeFileSync('result.txt', 'READFILE:\nIs String: ');
console.log('READ FILE:\nIs String: ');

var log_raw = fs.readFileSync('../log.log', 'utf8');

if (typeof(log_raw) == "string"){
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	fs.appendFileSync('result.txt', 'FAIL\nENDING TEST');
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Contains JSON: ');
console.log('Contains JSON: ');
if (log_raw.charAt(0) == '{' && log_raw.charAt(log_raw.length-2) == '}'){
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	fs.appendFileSync('result.txt', 'FAIL\nENDING TEST');
	console.log('FAIL');
	console.log('log_raw.charAt(0) =', log_raw.charAt(0), 'log_raw.charAt(log_raw.length-1) =', log_raw.charAt(log_raw.length-1));
	console.log('ENDING TEST');
	return;
}

fs.appendFileSync('result.txt', '\n--------------------------------------------\nTURN DATA TO JSON ARRAY:\nIsValid: ');
console.log('\n-----------------------------------\nTURN DATA TO ARRAY:\nIsValid:');

log_raw = log_raw.replace(/{/g, '\t{');
log_raw = log_raw.replace(/}/g, '},');
log_raw = '[\n' + log_raw + ']';
log_raw = log_raw.replace('},\n]', '}\n]');

try {
	JSON.parse(log_raw);
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');

}
catch(err) {
	console.log('FAIL\nENDING TEST');
	return;
}

log_raw = JSON.parse(log_raw);

fs.appendFileSync('result.txt', '\n--------------------------------------------\nCHECK DATE PRE-FORMAT:\nFirst Entry Length Is 10: ');
console.log('\n-----------------------------------\nCHECK DATE PRE-FORMAT:\nFirst Entry Length Is 10: ');

for (var i = 0; i < log_raw.length; i++) {
	log_raw[i].timestamp = log_raw[i].timestamp.substring(0, 10);
}

if (log_raw[0].timestamp.length == 10) {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'First Entry Has Valid Year: ');
console.log('First Entry Has Valid Year:');

var year = log_raw[0].timestamp.substring(0,4);

if (!isNaN(year)) {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'First Entry Has Valid Month: ');
console.log('First Entry Has Valid Month:');

var month = log_raw[0].timestamp.substring(5, 7);

if (!isNaN(month)) {
	month = Number(month);
	if (month > 0 && month < 13){
		fs.appendFileSync('result.txt', 'SUCCESS\n');
		console.log('SUCCESS');
	}
	else {
		console.log('FAIL\nENDING TEST');
		console.log('month =', month);
		return;
	}
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'First Entry Has Valid Day: ');
console.log('First Entry Has Valid Day:');

var day = log_raw[0].timestamp.substring(8, 10);

if (!isNaN(day)) {
	day = Number(day);
	if (day > 0 && day < 32){
		fs.appendFileSync('result.txt', 'SUCCESS\n');
		console.log('SUCCESS');
	}
	else {
		console.log('FAIL\nENDING TEST');
		console.log('day =', day);
		return;
	}
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', '\nLast Entry Length Is 10: ');
console.log('\nLast Entry Length Is 10:');

if (log_raw[log_raw.length-1].timestamp.length == 10) {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Last Entry Has Valid Year: ');
console.log('Last Entry Has Valid Year:');

year = log_raw[log_raw.length-1].timestamp.substring(0,4);

if (!isNaN(year)) {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Last Entry Has Valid Month: ');
console.log('Last Entry Has Valid Month:');

month = log_raw[log_raw.length-1].timestamp.substring(5, 7);

if (!isNaN(month)) {
	month = Number(month);
	if (month > 0 && month < 13){
		fs.appendFileSync('result.txt', 'SUCCESS\n');
		console.log('SUCCESS');
	}
	else {
		console.log('FAIL\nENDING TEST');
		console.log('month =', month);
		return;
	}
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Last Entry Has Valid Day: ');
console.log('Last Entry Has Valid Day:');

day = log_raw[log_raw.length-1].timestamp.substring(8, 10);

if (!isNaN(day)) {
	day = Number(day);
	if (day > 0 && day < 32){
		fs.appendFileSync('result.txt', 'SUCCESS\n');
		console.log('SUCCESS');
	}
	else {
		console.log('FAIL\nENDING TEST');
		console.log('day =', day);
		return;
	}
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', '\nSecond Entry Length Is 10: ');
console.log('\nSecond Entry Length Is 10:');

if (log_raw[1].timestamp.length == 10) {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Second Entry Has Valid Year: ');
console.log('Second Entry Has Valid Year:');

year = log_raw[1].timestamp.substring(0,4);

if (!isNaN(year)) {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Second Entry Has Valid Month: ');
console.log('Second Entry Has Valid Month:');

month = log_raw[1].timestamp.substring(5, 7);

if (!isNaN(month)) {
	month = Number(month);
	if (month > 0 && month < 13){
		fs.appendFileSync('result.txt', 'SUCCESS\n');
		console.log('SUCCESS');
	}
	else {
		console.log('FAIL\nENDING TEST');
		console.log('month =', month);
		return;
	}
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

fs.appendFileSync('result.txt', 'Second Entry Has Valid Day: ');
console.log('Second Entry Has Valid Day:');

day = log_raw[1].timestamp.substring(8, 10);

if (!isNaN(day)) {
	day = Number(day);
	if (day > 0 && day < 32){
		fs.appendFileSync('result.txt', 'SUCCESS\n');
		console.log('SUCCESS');
	}
	else {
		console.log('FAIL\nENDING TEST');
		console.log('day =', day);
		return;
	}
}
else {
	console.log('FAIL\nENDING TEST');
	return;
}

var months = ['January', 'February', 'March', 'April',
			'May', 'June', 'July', 'August', 'September',
			'October', 'November', 'December']

var year;
var month;
var day;

for (var i = 0; i < log_raw.length; i++) {
	year = log_raw[i].timestamp.substring(0, 4);
	month = months[Number(log_raw[i].timestamp.substring(5, 7))-1]
	day = Number(log_raw[i].timestamp.substring(8, 10));
	log_raw[i].timestamp = month + ' ' + day + ', ' + year;
}

fs.appendFileSync('result.txt', '\n--------------------------------------------\nCHECK DATE FORMAT:\nFirst Entry Date Is June 6, 2017: ');
console.log('\n-----------------------------------\nCHECK DATE FORMAT:\nFirst Entry Date Is June 6, 2017: ');

if (log_raw[0].timestamp === 'June 6, 2017') {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	console.log('Date =', log_raw[0].timestamp);
	return;
}

fs.appendFileSync('result.txt', 'Second Entry Date Is June 6, 2017: ');
console.log('Second Entry Date Is June 6, 2017:');

if (log_raw[1].timestamp === 'June 6, 2017') {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	console.log('Date =', log_raw[0].timestamp);
	return;
}

fs.appendFileSync('result.txt', '18th Entry Date Is June 7, 2017: ');
console.log('18th Entry Date Is June 7, 2017:');

if (log_raw[17].timestamp === 'June 7, 2017') {
	fs.appendFileSync('result.txt', 'SUCCESS\n');
	console.log('SUCCESS');
}
else {
	console.log('FAIL\nENDING TEST');
	console.log('Date =', log_raw[0].timestamp);
	return;
}
