var express = require('express');
var session = require('express-session');
var router = express.Router();

var sess;

router.use(session({secret: 'shhhhh'}));

router.get(['/addEmployee', '/deleteEmployee'], function(req, res, next){
	sess = req.session;
	if(sess.rights == 'admin'){
		next();
	}
	else{
		res.redirect('/');
	}
});

router.get('/*', function(req, res, next){
	sess = req.session;
	if(['/login', '/adminLogin'].indexOf(req.url) !== -1
		|| sess.username)
		next();
	else{
		res.redirect('/login');
	}
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/payslip', function(req, res, next){
	var db = req.db;
	var Employees = db.get("Employees");

	Employees.find({}, function(err, doc){
		res.render('payslip', {
			"employees": doc
		});
	});
});

router.post('/payslip', function(req, res){
	var db = req.db;
	var paySlip = db.get("paySlip");
	var PhilHealth = db.get("PhilHealth");
	var Employees = db.get("Employees");
	var SSS = db.get("SSS");
	var adviceNumbers = db.get("adviceNumbers");
	var eID = parseInt(req.body.employeeDropdown);
	var company = req.body.companyDropdown;
	var deductibles = parseFloat(req.body.deductibles);
	var allowance = parseFloat(req.body.allowance);
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	var currentAdviceNumber;

	adviceNumbers.findOne({"name": "paySlip"}, function (err, doc) {
		currentAdviceNumber = doc.number;
		adviceNumbers.update({"name": "paySlip"}, {$inc:{"number": 1}});
	});

	function getHDMF(salary){
		if(salary <= 1500) return salary*0.01;
		else return salary*0.02;
	}

	console.log("eID: ");
	console.log(eID);

	Employees.findOne({"eID": eID}, function(err, employee){
		console.log("employee");
		console.log(employee.name);
		PhilHealth.findOne({"range.to": {$gte: employee.salary}, "range.from": {$lte: employee.salary}}, function(err, PHdoc){
			SSS.findOne({"range.to": {$gte: employee.salary}, "range.from": {$lte: employee.salary}}, function(err, SSSdoc){
				var EE = parseFloat(SSSdoc.totalEE);
				var ER = parseFloat(SSSdoc.totalER);
				var HDMF = getHDMF(employee.salary);

				paySlip.insert({
					"eID": eID,
					"adviceNumber": currentAdviceNumber,
					"company": company,
					"deductibles": deductibles,
					"allowance": allowance,
					"startDate": startDate,
					"endDate": endDate,
					"PHreduc": PHdoc.share,
					"SSSreduc": EE,
					"HDMFreduc": HDMF,
					"EmployerPH": PHdoc.share,
					"EmployerSSS": ER,
					"EmployerHDMF": employee.salary*0.02,
					"total": employee.salary - deductibles + allowance - PHdoc.share - EE - HDMF
				});
				// console.log(PHdoc);
				// console.log(SSSdoc);
			});
		});
	});

	res.redirect('/');
});


router.get('/checkvoucher', function(req, res, next){
	var db = req.db;
	var metadata = db.get("metadata");

	metadata.findOne({"name": "Particulars"}, function(err, doc){
		res.render('checkvoucher', {
			"metadata": doc
		});
	});
});

router.post('/checkvoucher', function(req, res){
	var db = req.db;
	var checkVoucher = db.get('checkVoucher');
	var adviceNumbers = db.get('adviceNumbers');
	var name = req.body.name;
	var date = req.body.date;
	var amount = req.body.amount;
	var particulars = req.body.particulars;

	var currentAdviceNumber;

	adviceNumbers.findOne({"name": "checkVoucher"}, function (err, doc) {
		currentAdviceNumber = doc.number;
		adviceNumbers.update({"name": "checkVoucher"}, {$inc:{"number": 1}});
		checkVoucher.insert({
			"adviceNumber": currentAdviceNumber,
			"name": name,
			"date": date,
			"amount": amount,
			"particulars": particulars
		});
	});

	res.redirect('/');
});

router.get('/pettycash', function(req, res, next){
	var db = req.db;
	var metadata = db.get("metadata");

	res.render('pettycash');
});

router.post('/pettycash', function(req, res){
	var db = req.db;
	var checkVoucher = db.get('pettyCash');
	var adviceNumbers = db.get('adviceNumbers');
	var name = req.body.name;
	var date = req.body.date;
	var amount = parseFloat(req.body.amount);
	var particulars = req.body.particulars;
	var data = req.body;

	var currentAdviceNumber;

	var items = [];

	//remodel data
	for(i=0; i < data.name.length; i++){
		items.push([data.name[i], parseFloat(data.amount[i])]);
	}

	adviceNumbers.findOne({"name": "pettyCash"}, function (err, doc) {
		currentAdviceNumber = doc.number;
		adviceNumbers.update({"name": "pettyCash"}, {$inc:{"number": 1}});
		checkVoucher.insert({
			"adviceNumber": currentAdviceNumber,
			"name": name,
			"date": date,
			"items": items
		});
	});

	res.redirect('/pettycash');
});

router.get('/AR', function(req, res, next){
	res.render('AR');
});

router.post('/AR', function(req, res){
	var db = req.db;
	var AR = db.get('AR');
	var adviceNumbers = db.get('adviceNumbers');
	var name = req.body.name;
	var date = req.body.date;
	var amount = parseFloat(req.body.amount);
	var particulars = req.body.particulars;

	var currentAdviceNumber;

	adviceNumbers.findOne({"name": "AR"}, function (err, doc) {
		currentAdviceNumber = doc.number;
		adviceNumbers.update({"name": "AR"}, {$inc:{"number": 1}});
		AR.insert({
			"adviceNumber": currentAdviceNumber,
			"name": name,
			"date": date,
			"particulars": particulars,
			"amount": amount
		});
	});

	res.redirect('/AR');
});

router.get('/addemployee', function(req, res, next){
	var db = req.db;
	res.render('addEmployee');

	res.redirect('/');
});

router.post('/addemployee', function(req, res){
	var db = req.db;
	var Employees = db.get("Employees");
	var adviceNumbers = db.get("adviceNumbers");
	var name = req.body.name;
	var birthday = req.body.birthday;
	var position = parseInt(req.body.position);
	var status = parseInt(req.body.status);
	var dependents = parseInt(req.body.dependents);
	var salary = parseFloat(req.body.salary);

	adviceNumbers.findOne({"name": "eID"}, function(err, doc){
		Employees.insert({
			"eID": doc.number,
			"name": name,
			"birthday": birthday,
			"position": position,
			"status": status,
			"dependents": dependents,
			"salary": salary
		});
		adviceNumbers.update({"name": "eID"}, {$inc:{number: 1}});
	});
	res.redirect('/addemployee');
});

router.get('/deleteEmployee', function(req, res, next){
	var db = req.db;
	var Employees = db.get("Employees");

	Employees.find({}, function(err, doc){
		res.render('deleteEmployee', {
			"employees": doc
		});
	});
});

router.post('/deleteEmployee', function(req, res){
	var db = req.db;
	var eID = req.body.eID
	var Employees = db.get("Employees");

	console.log(eID);

	Employees.remove({"eID": parseInt(eID)});

	res.redirect('/deleteEmployee');
});

//=========================== login ======================================

router.get('/login',function(req, res, next){
	res.render('login');
});

router.post('/login',function(req, res){
	var db = req.db;
	var users = db.get('Users');
	var username = req.body.username;
	sess = req.session;

	users.findOne({"username": username}, function(err,	user){
		if(!user){
			res.render('login', {error: "Invalid username or password"});
		}
		else{
			if(req.body.password == user.password){
				sess.username = user.username;
				sess.rights = user.rights;
				res.redirect('/');
			}
			else{
				res.render('login', {error: "Invalid username or password"});
			}
		}
	});
});

router.get('/logout', function(req, res, next){
	sess.destroy(function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/');1
		}
	});
});

//========================================================

// router.get('/createPhilHealthTable', function(req, res, next){
// 	var db = req.db;
// 	var PHTable = db.get("PhilHealth");

// 	for(i = 1; i < 29; i++){
// 		PHTable.insert({
// 			"bracket": i,
// 			"range": {"from": 7000+1000*i, "to": 7999+1000*i},
// 			"base": 7000+1000*i,
// 			"premium": 175+25*i,
// 			"share": (175+25*i)/2
// 		});
// 	}

// 	res.redirect('/');

// });

// router.get('/createSSSTable', function(req, res, next){
// 	var db = req.db;
// 	var SSSTable = db.get("SSS");

// 	function getEC(credit){
// 		if(credit >= 15000){
// 			return 30;
// 		}
// 		else return 10;
// 	}

// 	for(i = 1; i < 31; i++){
// 		SSSTable.insert({
// 			"range": {"from": 750+500*i, "to": 1249.99+500*i},
// 			"credit": 1000+500*i,
// 			"totalER": (Math.round((1000+500*i)*0.7366666666666666666666)/10 + getEC(1000+500*i)).toFixed(2),
// 			"totalEE": (Math.round((1000+500*i)*0.3633333333333333333333)/10).toFixed(2),
// 			"EC": getEC(1000+500*i),
// 			"total": (1000+500*i)*0.11 + getEC(1000+500*i)
// 		});
// 	}

// 	res.redirect('/');

// });

module.exports = router;