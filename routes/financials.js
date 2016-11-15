var express = require('express');
var session = require('express-session');
var router = express.Router();
var paySlipRoute = require('../models/financials/paySlip');
var checkVoucherRoute = require('../models/financials/checkVoucher');
var pettyCashRoute = require('../models/financials/pettyCash');
var ARRoute = require('../models/financials/AR');
var viewRoute = require('../models/financials/view');
var loginRoute = require('../models/login/login');

// var auth = require('../middlewares/auth');

var sess;

router.use(session({secret: 'shhhhh'}));

router.get(['/employees/add', '/employees/delete'], function(req, res, next){
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
	if(['/login', '/logout'].indexOf(req.url) !== -1
		|| sess.username)
		next();
	else{
		res.redirect('/login');
	}
});

router.get('/login',function(req, res, next){
	res.render('login');
});

router.post('/login',function(req, res){
	loginRoute.login(req, res, function(success){
		if(success) res.redirect('/');
		if(!success) res.render('login', {error: "Invalid username or password"});
	});
});

router.get('/logout', function(req, res, next){
	loginRoute.logout(req, res, function(){
		res.redirect('/');
	})
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Apples and Berries Payroll System' });
});

router.get('/payslip', function(req, res, next){
	paySlipRoute.get(req, function(err, doc){
		res.render('payslip',{
			"employees": doc
		});
	});
});

router.post('/payslip', function(req, res){
	paySlipRoute.insert(req, res, function(){
		res.redirect('/');
	});
});


router.get('/checkvoucher', function(req, res, next){
	checkVoucherRoute.get(req, function(err, doc){
		res.render('checkvoucher', {
			"metadata": doc
		});
	});
});

router.post('/checkvoucher', function(req, res){
	checkVoucherRoute.insert(req, res, function(){
		res.redirect('/');
	});
});

router.get('/pettycash', function(req, res, next){
	res.render('pettycash');
});

router.post('/pettycash', function(req, res){
	pettyCashRoute.insert(req, res, function(){
		res.redirect('/pettycash');
	});
});

router.get('/AR', function(req, res, next){
	res.render('AR');
});

router.post('/AR', function(req, res){
	ARRoute.insert(req, res, function(){
		res.redirect('/AR');
	});
});

//=========================== login ======================================


//========================================================

router.get('/view', function(req, res, next){
	res.render('view');
});

router.post('/view', function(req, res){
	viewRoute.viewSpecific(req, res, function(err, transaction, docs, people){
		res.render('view', {
			type: transaction,
			transactions: docs,
			employees: people
		});
	})
});

module.exports = router;