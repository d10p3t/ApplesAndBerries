var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = chai.expect;
var server = require("../app");
var should = chai.should();
var local = "http://localhost:8000";
// var helper = require('./helper');
var winston = require('winston');
var monk = require("monk");
var db = monk(process.env.MONGOLAB_URI || 'localhost:27017/ApplesAndBerries');

var financialwinston = new(winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: 'financials_test.log' })
	]
});

chai.use(chaiHttp);


describe("Payslip", function(){
	var url = local;
	describe("Display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Displaying payslip page");
			chai.request(server)
				.get('/payslip')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("Page displayed successfully");
		});
	});
	
	describe("Insert", function(){
		var adviceNumbers = db.get('adviceNumbers');
		it("returns status 200", function(done){
			financialwinston.info("Inserting to payslip");
			chai.request(server)
				.post('/payslip')
				.send({
					"employeeDropdown": "1",
					"companyDropdown": "apples",
					"deductibles_name": ["deductibles_name", "a"],
					"deductibles": [500, 100],
					"allowance_name": ["allowance_name", "b"],
					"allowance": [1000, 300],
					"startDate": "March 1, 2017",
					"endDate": "March 30, 2017"
				})
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});	
			financialwinston.info("Success insert to payslip. Response 200");
		});
	});
	describe("Edit paySlip entry given an", function() {
		it("should edit entry", function(done){
			financialwinston.info("Editing payslip");
			chai.request(server)
			.post('/editPayslip')
			.send({
				"employeeDropdown": "1",
				"companyDropdown": "berries",
				"deductibles_name": ["deductibles_name"],
				"deductibles": [500],
				"allowance_name": ["allowance_name", "b"],
				"allowance": [1000, 300],
				"startDate": "October 1, 2016",
				"endDate": "October 30, 2016"
			})
			.end(function(err, res){
				res.should.have.status(200);
			})
			done();
		});
	});
	describe("Delete paySlip entry given list of advice numbers", function(){
		it('should delete a signle entry', function(done){
			financialwinston.info("Deleting payslip");
			adviceNumbers.find({name: 'paySlip'}).then((adviceNumber) => {
				console.log('DELETE', adviceNumber[0].number);
				chai.request(server)
				.post('/deletePaySlip')
				.send({'0':adviceNumber[0].number, length: 1})
				.end(function(err, res){
					res.should.have.status(200);
					// res.should.be.json;
					// res.body.should.have.property('success');
					// res.body.should.have.property('data');
					// res.body.data.should.be.a('number');
					// res.body.data.should.equal(1);
					done();
				});
			});
		});
	});
});

describe("Thirteenth", function(){
	var url = local;
	describe("Insert", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to thirteenth month pay");
			chai.request(server)
				.post('/thirteenth')
				.send({
					"employeeDropdown": 1,
					"companyDropdown": "Apples",
					"startDate": "October 1, 2016",
					"endDate": "October 30, 2016"
				})
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Success insert to thirteenth month pay. Response 200");
		});
	});
	describe("Delete thirteenth", function(){
		it('should delete a signle entry', function(done){
			adviceNumbers.find({name: 'paySlip'}).then((adviceNumber) => {
				console.log('DELETE', adviceNumber[0].number);
				chai.request(server)
				.post('/deletePaySlip')
				.send({'0':adviceNumber[0].number, length: 1})
				.end(function(err, res){
					res.should.have.status(200);
					// res.should.be.json;
					// res.body.should.have.property('success');
					// res.body.should.have.property('data');
					// res.body.data.should.be.a('number');
					// res.body.data.should.equal(1);
					done();
				});
			});
		});
	});
});

describe("AR", function(){
	var url = local;
	describe("Display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to AR table page");
			chai.request(server)
				.get('/AR_view')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("AR table page reached. Response 200");
		});
	});
	describe("Display form", function(){
		it("returns status 200", function(done){
			financialwinston.info("Go to AR form page");
			chai.request(server)
				.get('/AR')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("AR form page reached. Response 200");
		});
	});
	describe("Insert", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to AR");
			chai.request(server)
				.post('/AR')
				.send({
					"name": "Edrich Chua",
					"date": "March 1, 2017",
					"amount": 500,
					"particulars": 'food'
				})
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Success inserting to AR. Response 200");
		});
	});
	describe("Delete AR entry given list of advice numbers", function(){
		it('should delete a signle entry', function(done){
			adviceNumbers.find({name: 'AR'}).then((adviceNumber) => {
				console.log('DELETE', adviceNumber[0].number-1);
				chai.request(server)
				.post('/deleteAR')
				.send({'0':adviceNumber[0].number-1, length: 1})
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('success');
					res.body.should.have.property('data');
					res.body.data.should.be.a('number');
					res.body.data.should.equal(1);
					done();
				});
			});
		});
	});
});

describe("Petty Cash", function(){
	var url = local;
	describe("Display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to petty cash table page");
			chai.request(server)
				.get('/pettycash_view')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("Petty cash table page reached. Response 200");
		});
	});
	describe("Display form", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to petty cash form page");
			chai.request(server)
				.get('/pettycash')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("Petty cash form page reached. Response 200");
		});
	});
	describe("Insert", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to petty cash");
			chai.request(server)
				.post('/pettycash')
				.send({
					"name": "Edrich Chua",
					"date": "March 1, 2017",
					"amount": [500, 10],
					"qty": [2, 4],
					"particulars": ['food', 'loool']
				})
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Success inserting to petty cash. Response 200");
		});
	});
	describe("Delete petty cash entry given list of advice numbers", function(){
		it('should delete a signle entry', function(done){
			adviceNumbers.find({name: 'pettyCash'}).then((adviceNumber) => {
				console.log('DELETE', adviceNumber[0].number-1);
				chai.request(server)
				.post('/deletePettycash')
				.send({'0':adviceNumber[0].number-1, length: 1})
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('success');
					res.body.should.have.property('data');
					res.body.data.should.be.a('number');
					res.body.data.should.equal(1);
					done();
				});
			});
		});
	});
});

describe("Check Voucher", function(){
	var url = local;
	describe("Display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to check voucher table page");
			chai.request(server)
				.get('/checkvoucher_view')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("Check voucher table page reached. Response 200");
		});
	});
	describe("Display form", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to check voucher form page");
			chai.request(server)
				.get('/checkvoucher')
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			financialwinston.info("Check voucher form page reached. Response 200");
		});
	});
	describe("Insert", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to check voucher");
			chai.request(server)
				.post('/checkvoucher')
				.send({
					"name": "Edrich Chua",
					"date": "March 1, 2017",
					"amount": 500,
					"particulars": 'food'
				})
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Success inserting to check voucher. Response 200");
		});
	});
	describe("Delete check voucher entry given list of advice numbers", function(){
		it('should delete a signle entry', function(done){
			adviceNumbers.find({name: 'checkVoucher'}).then((adviceNumber) => {
				console.log('DELETE', adviceNumber[0].number-1);
				chai.request(server)
				.post('/deleteCheckvoucher')
				.send({'0':adviceNumber[0].number-1, length: 1})
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('success');
					res.body.should.have.property('data');
					res.body.data.should.be.a('number');
					res.body.data.should.equal(1);
					done();
				});
			});
		});
	});
});

describe("BIR", function(){
	describe("Incorrect Insert (character in hash)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to BIR table");
			chai.request(server)
			.post('/updateBIRComp')
			.send(
				[ [ { name: 'BIR', hash: [ [ 0, 0 ],
																 [ 0, 0.05 ],
																 [ 41.67, 'a' ],
																 [ 208.33, 0.15 ],
																 [ 708.33, 0.2 ],
																 [ 1875, 0.25 ],
																 [ 4166.67, 0.3 ],
																 [ 10416.67, 0.32 ]]}],
					[ { dep: 0, ranges: [ 1, 4167, 5000, 6667, 10000, 15833, 25000, 45833 ]},
						{ dep: 1, ranges: [ 1, 6250, 7083, 8750, 12083, 17917, 27083, 47917 ]},
						{ dep: 2, ranges: [ 1, 8333, 9167, 10833, 14167, 20000, 29167, 50000 ]},
						{ dep: 3, ranges: [ 1, 10417, 11250, 12917, 16250, 22083, 31250, 52083 ]},
						{ dep: 4, ranges: [ 1, 12500, 13333, 15000, 18333, 24167, 33333, 54167 ]}]]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to BIR table failed. Character in hash. Response 500");
		});
	});
	describe("Incorrect Insert (character in range)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to BIR table");
			chai.request(server)
			.post('/updateBIRComp')
			.send(
				[ [ { name: 'BIR', hash: [ [ 0, 0 ],
																 [ 0, 0.05 ],
																 [ 41.67, 0.1 ],
																 [ 208.33, 0.15 ],
																 [ 708.33, 0.2 ],
																 [ 1875, 0.25 ],
																 [ 4166.67, 0.3 ],
																 [ 10416.67, 0.32 ]]}],
					[ { dep: 0, ranges: [ 1, 'a', 5000, 6667, 10000, 15833, 25000, 45833 ]},
						{ dep: 1, ranges: [ 1, 6250, 7083, 8750, 12083, 17917, 27083, 47917 ]},
						{ dep: 2, ranges: [ 1, 8333, 9167, 10833, 14167, 20000, 29167, 50000 ]},
						{ dep: 3, ranges: [ 1, 10417, 11250, 12917, 16250, 22083, 31250, 52083 ]},
						{ dep: 4, ranges: [ 1, 12500, 13333, 15000, 18333, 24167, 33333, 54167 ]}]]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to BIR table failed. Character in range. Response 500");
		});
	});
	describe("Incorrect Insert (null in hash)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to BIR table");
			chai.request(server)
			.post('/updateBIRComp')
			.send(
				[ [ { name: 'BIR', hash: [ [ 0, 0 ],
																 [ 0, 0.05 ],
																 [ 41.67, 0.1 ],
																 [ 208.33, 0.15 ],
																 [ 708.33, 0.2 ],
																 [ 1875, null ],
																 [ 4166.67, 0.3 ],
																 [ 10416.67, 0.32 ]]}],
					[ { dep: 0, ranges: [ 1, 4167, 5000, 6667, 10000, 15833, 25000, 45833 ]},
						{ dep: 1, ranges: [ 1, 6250, 7083, 8750, 12083, 17917, 27083, 47917 ]},
						{ dep: 2, ranges: [ 1, 8333, 9167, 10833, 14167, 20000, 29167, 50000 ]},
						{ dep: 3, ranges: [ 1, 10417, 11250, 12917, 16250, 22083, 31250, 52083 ]},
						{ dep: 4, ranges: [ 1, 12500, 13333, 15000, 18333, 24167, 33333, 54167 ]}]]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to BIR table failed. Null character in hash. Response 500");
		});
	});
	describe("Incorrect Insert (null in range)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to BIR table");
			chai.request(server)
			.post('/updateBIRComp')
			.send(
				[ [ { name: 'BIR', hash: [ [ 0, 0 ],
																 [ 0, 0.05 ],
																 [ 41.67, 0.1 ],
																 [ 208.33, 0.15 ],
																 [ 708.33, 0.2 ],
																 [ 1875, 0.25 ],
																 [ 4166.67, 0.3 ],
																 [ 10416.67, 0.32 ]]}],
					[ { dep: 0, ranges: [ 1, 4167, 5000, 6667, 10000, 15833, 25000, 45833 ]},
						{ dep: 1, ranges: [ 1, 6250, 7083, 8750, 12083, 17917, 27083, 47917 ]},
						{ dep: 2, ranges: [ 1, 8333, 9167, 10833, 14167, 20000, 29167, 50000 ]},
						{ dep: 3, ranges: [ null, 10417, 11250, 12917, 16250, 22083, 31250, 52083 ]},
						{ dep: 4, ranges: [ 1, 12500, 13333, 15000, 18333, 24167, 33333, 54167 ]}]]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to BIR table failed. Null in range. Response 500");
		});
	});
	describe("display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to BIR table view");
			chai.request(server)
			.get('/BIR')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Reached BIR table view. Response 200");
		});
	});
	describe("Insert Correct Values", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to BIR table");
			chai.request(server)
			.post('/updateBIRComp')
			.send(
				[ [ { name: 'BIR', hash: [ [ 0, 0 ],
																 [ 0, 0.05 ],
																 [ 41.67, 0.1 ],
																 [ 208.33, 0.15 ],
																 [ 708.33, 0.2 ],
																 [ 1875, 0.25 ],
																 [ 4166.67, 0.3 ],
																 [ 10416.67, 0.32 ]]}],
					[ { dep: 0, ranges: [ 1, 4167, 5000, 6667, 10000, 15833, 25000, 45833 ]},
						{ dep: 1, ranges: [ 1, 6250, 7083, 8750, 12083, 17917, 27083, 47917 ]},
						{ dep: 2, ranges: [ 1, 8333, 9167, 10833, 14167, 20000, 29167, 50000 ]},
						{ dep: 3, ranges: [ 1, 10417, 11250, 12917, 16250, 22083, 31250, 52083 ]},
						{ dep: 4, ranges: [ 1, 12500, 13333, 15000, 18333, 24167, 33333, 54167 ]}]]
			)
			.end(function(err, res){
				res.should.have.status(200);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.info("Success inserting to BIR table. Response 200");
		});
	});
});

describe("SSS", function(){
	describe("Incorrect input (char in credit)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 1250, to: 1749.99 },
						credit: 'a',
						totalER: 120.5,
						totalEE: 54.5,
						EC: 10,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to SSS table failed. Char in credit. Response 500");
		});
	});
	describe("Incorrect input (char in from)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 'a', to: 1749.99 },
						credit: 1500,
						totalER: 120.5,
						totalEE: 54.5,
						EC: 10,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to SSS table failed. Char in from. Response 500");
		});
	});
	describe("Incorrect input (char in to)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 1250, to: 'a' },
						credit: 1500,
						totalER: 120.5,
						totalEE: 54.5,
						EC: 10,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to SSS table failed. Char in to. Response 500");
		});
	});
	describe("Incorrect input (char in totalER)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 1250, to: 1749.99 },
						credit: 1500,
						totalER: 'a',
						totalEE: 54.5,
						EC: 10,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to SSS table failed. Char in totalERR. Response 500");
		});
	});
	describe("Incorrect input (blank totalEE)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 1250, to: 1749.99 },
						credit: 1500,
						totalER: 120.5,
						totalEE: null,
						EC: 10,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to SSS table failed. Blank totalEE. Response 500");
		});
	});
	describe("Incorrect input (no EC field)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 1250, to: 1749.99 },
						credit: 1500,
						totalER: 120.5,
						totalEE: 54.5,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to SSS table failed. No EC field. Response 500");
		});
	});
	describe("display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to SSS table view");
			chai.request(server)
			.get('/SSS')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Reached SSS table view. Response 200");
		});
	});
	describe("Insert", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to SSS table");
			chai.request(server)
			.post('/updateSSSComp')
			.send(
				[ { range: { from: 1250, to: 1749.99 },
						credit: 1500,
						totalER: 120.5,
						totalEE: 54.5,
						EC: 10,
						total: 175,
						}, //_id: 58c10c9b5c82d24530b510b4 },
					{ range: { from: 1750, to: 2249.99 },
						credit: 2000,
						totalER: 157.3,
						totalEE: 72.7,
						EC: 10,
						total: 230,
						}, //_id: 58c10c9b5c82d24530b510b5 },
					{ range: { from: 2250, to: 2749.99 },
						credit: 2500,
						totalER: 194.2,
						totalEE: 90.8,
						EC: 10,
						total: 285,
						}, //_id: 58c10c9b5c82d24530b510b6 },
					{ range: { from: 2750, to: 3249.99 },
						credit: 3000,
						totalER: 231,
						totalEE: 109,
						EC: 10,
						total: 340,
						}, //_id: 58c10c9b5c82d24530b510b7 },
					{ range: { from: 3250, to: 3749.99 },
						credit: 3500,
						totalER: 267.8,
						totalEE: 127.2,
						EC: 10,
						total: 395,
						}, //_id: 58c10c9b5c82d24530b510b8 },
					{ range: { from: 3750, to: 4249.99 },
						credit: 4000,
						totalER: 304.7,
						totalEE: 145.3,
						EC: 10,
						total: 450,
						}, //_id: 58c10c9b5c82d24530b510b9 },
					{ range: { from: 4250, to: 4749.99 },
						credit: 4500,
						totalER: 341.5,
						totalEE: 163.5,
						EC: 10,
						total: 505,
						}, //_id: 58c10c9b5c82d24530b510ba },
					{ range: { from: 4750, to: 5249.99 },
						credit: 5000,
						totalER: 378.3,
						totalEE: 181.7,
						EC: 10,
						total: 560,
						}, //_id: 58c10c9b5c82d24530b510bb },
					{ range: { from: 5250, to: 5749.99 },
						credit: 5500,
						totalER: 415.2,
						totalEE: 199.8,
						EC: 10,
						total: 615,
						}, //_id: 58c10c9b5c82d24530b510bc },
					{ range: { from: 5750, to: 6249.99 },
						credit: 6000,
						totalER: 452,
						totalEE: 218,
						EC: 10,
						total: 670,
						}, //_id: 58c10c9b5c82d24530b510bd },
					{ range: { from: 6250, to: 6749.99 },
						credit: 6500,
						totalER: 488.8,
						totalEE: 236.2,
						EC: 10,
						total: 725,
						}, //_id: 58c10c9b5c82d24530b510be },
					{ range: { from: 6750, to: 7249.99 },
						credit: 7000,
						totalER: 525.7,
						totalEE: 254.3,
						EC: 10,
						total: 780,
						}, //_id: 58c10c9b5c82d24530b510bf },
					{ range: { from: 7250, to: 7749.99 },
						credit: 7500,
						totalER: 562.5,
						totalEE: 272.5,
						EC: 10,
						total: 835,
						}, //_id: 58c10c9b5c82d24530b510c0 },
					{ range: { from: 7750, to: 8249.99 },
						credit: 8000,
						totalER: 599.3,
						totalEE: 290.7,
						EC: 10,
						total: 890,
						}, //_id: 58c10c9b5c82d24530b510c1 },
					{ range: { from: 8250, to: 8749.99 },
						credit: 8500,
						totalER: 636.2,
						totalEE: 308.8,
						EC: 10,
						total: 945,
						}, //_id: 58c10c9b5c82d24530b510c2 },
					{ range: { from: 8750, to: 9249.99 },
						credit: 9000,
						totalER: 673,
						totalEE: 327,
						EC: 10,
						total: 1000,
						}, //_id: 58c10c9b5c82d24530b510c3 },
					{ range: { from: 9250, to: 9749.99 },
						credit: 9500,
						totalER: 709.8,
						totalEE: 345.2,
						EC: 10,
						total: 1055,
						}, //_id: 58c10c9b5c82d24530b510c4 },
					{ range: { from: 9750, to: 10249.99 },
						credit: 10000,
						totalER: 746.7,
						totalEE: 363.3,
						EC: 10,
						total: 1110,
						}, //_id: 58c10c9b5c82d24530b510c5 },
					{ range: { from: 10250, to: 10749.99 },
						credit: 10500,
						totalER: 783.5,
						totalEE: 381.5,
						EC: 10,
						total: 1165,
						}, //_id: 58c10c9b5c82d24530b510c6 },
					{ range: { from: 10750, to: 11249.99 },
						credit: 11000,
						totalER: 820.3,
						totalEE: 399.7,
						EC: 10,
						total: 1220,
						}, //_id: 58c10c9b5c82d24530b510c7 },
					{ range: { from: 11250, to: 11749.99 },
						credit: 11500,
						totalER: 857.2,
						totalEE: 417.8,
						EC: 10,
						total: 1275,
						}, //_id: 58c10c9b5c82d24530b510c8 },
					{ range: { from: 11750, to: 12249.99 },
						credit: 12000,
						totalER: 894,
						totalEE: 436,
						EC: 10,
						total: 1330,
						}, //_id: 58c10c9b5c82d24530b510c9 },
					{ range: { from: 12250, to: 12749.99 },
						credit: 12500,
						totalER: 930.8,
						totalEE: 454.2,
						EC: 10,
						total: 1385,
						}, //_id: 58c10c9b5c82d24530b510ca },
					{ range: { from: 12750, to: 13249.99 },
						credit: 13000,
						totalER: 967.7,
						totalEE: 472.3,
						EC: 10,
						total: 1440,
						}, //_id: 58c10c9b5c82d24530b510cb },
					{ range: { from: 13250, to: 13749.99 },
						credit: 13500,
						totalER: 1004.5,
						totalEE: 490.5,
						EC: 10,
						total: 1495,
						}, //_id: 58c10c9b5c82d24530b510cc },
					{ range: { from: 13750, to: 14249.99 },
						credit: 14000,
						totalER: 1041.3,
						totalEE: 508.7,
						EC: 10,
						total: 1550,
						}, //_id: 58c10c9b5c82d24530b510cd },
					{ range: { from: 14250, to: 14749.99 },
						credit: 14500,
						totalER: 1078.2,
						totalEE: 526.8,
						EC: 10,
						total: 1605,
						}, //_id: 58c10c9b5c82d24530b510ce },
					{ range: { from: 14750, to: 15249.99 },
						credit: 15000,
						totalER: 1135,
						totalEE: 545,
						EC: 30,
						total: 1680,
						}, //_id: 58c10c9b5c82d24530b510cf },
					{ range: { from: 15250, to: 15749.99 },
						credit: 15500,
						totalER: 1171.8,
						totalEE: 563.2,
						EC: 30,
						total: 1735,
						}, //_id: 58c10c9b5c82d24530b510d0 },
					{ range: { from: 15750, to: Infinity },
						credit: 16000,
						totalER: 1208.7,
						totalEE: 581.3,
						EC: 30,
						total: 1790,
						}] //_id: 58c10c9b5c82d24530b510d1 } ]
			)
			.end(function(err, res){
				res.should.have.status(200);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.info("Success inserting to SSS table. Response 200");
		});
	});
});

describe("PhilHealth", function(){
	describe("Incorrect Insert (char in base)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to PhilHealth table");
			chai.request(server)
			.post('/updatePHComp')
			.send(
				[ { bracket: 1,
						range: { from: 0, to: 8999 },
						base: 'a',
						premium: 200,
						share: 100 },
					{ bracket: 2,
						range: { from: 9000, to: 9999 },
						base: 9000,
						premium: 225,
						share: 112.5 },
					{ bracket: 3,
						range: { from: 10000, to: 10999 },
						base: 10000,
						premium: 250,
						share: 125 },
					{ bracket: 4,
						range: { from: 11000, to: 11999 },
						base: 11000,
						premium: 275,
						share: 137.5 },
					{ bracket: 5,
						range: { from: 12000, to: 12999 },
						base: 12000,
						premium: 300,
						share: 150 },
					{ bracket: 6,
						range: { from: 13000, to: 13999 },
						base: 13000,
						premium: 325,
						share: 162.5 },
					{ bracket: 7,
						range: { from: 14000, to: 14999 },
						base: 14000,
						premium: 350,
						share: 175 },
					{ bracket: 8,
						range: { from: 15000, to: 15999 },
						base: 15000,
						premium: 375,
						share: 187.5 },
					{ bracket: 9,
						range: { from: 16000, to: 16999 },
						base: 16000,
						premium: 400,
						share: 200 },
					{ bracket: 10,
						range: { from: 17000, to: 17999 },
						base: 17000,
						premium: 425,
						share: 212.5 },
					{ bracket: 11,
						range: { from: 18000, to: 18999 },
						base: 18000,
						premium: 450,
						share: 225 },
					{ bracket: 12,
						range: { from: 19000, to: 19999 },
						base: 19000,
						premium: 475,
						share: 237.5 },
					{ bracket: 13,
						range: { from: 20000, to: 20999 },
						base: 20000,
						premium: 500,
						share: 250 },
					{ bracket: 14,
						range: { from: 21000, to: 21999 },
						base: 21000,
						premium: 525,
						share: 262.5 },
					{ bracket: 15,
						range: { from: 22000, to: 22999 },
						base: 22000,
						premium: 550,
						share: 275 },
					{ bracket: 16,
						range: { from: 23000, to: 23999 },
						base: 23000,
						premium: 575,
						share: 287.5 },
					{ bracket: 17,
						range: { from: 24000, to: 24999 },
						base: 24000,
						premium: 600,
						share: 300 },
					{ bracket: 18,
						range: { from: 25000, to: 25999 },
						base: 25000,
						premium: 625,
						share: 312.5 },
					{ bracket: 19,
						range: { from: 26000, to: 26999 },
						base: 26000,
						premium: 650,
						share: 325 },
					{ bracket: 20,
						range: { from: 27000, to: 27999 },
						base: 27000,
						premium: 675,
						share: 337.5 },
					{ bracket: 21,
						range: { from: 28000, to: 28999 },
						base: 28000,
						premium: 700,
						share: 350 },
					{ bracket: 22,
						range: { from: 29000, to: 29999 },
						base: 29000,
						premium: 725,
						share: 362.5 },
					{ bracket: 23,
						range: { from: 30000, to: 30999 },
						base: 30000,
						premium: 750,
						share: 375 },
					{ bracket: 24,
						range: { from: 31000, to: 31999 },
						base: 31000,
						premium: 775,
						share: 387.5 },
					{ bracket: 25,
						range: { from: 32000, to: 32999 },
						base: 32000,
						premium: 800,
						share: 400 },
					{ bracket: 26,
						range: { from: 33000, to: 33999 },
						base: 33000,
						premium: 825,
						share: 412.5 },
					{ bracket: 27,
						range: { from: 34000, to: 34999 },
						base: 34000,
						premium: 850,
						share: 425 },
					{ bracket: 28,
						range: { from: 35000, to: Infinity },
						base: 35000,
						premium: 875,
						share: 437.5 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to PhilHealth table failed. Char in base. Response 500");
		});
	});
	describe("Incorrect Insert (char in premium)", function(){
		financialwinston.info("Inserting to PhilHealth table");
		it("returns status 500", function(done){
			chai.request(server)
			.post('/updatePHComp')
			.send(
				[ { bracket: 1,
						range: { from: 0, to: 8999 },
						base: 8000,
						premium: 'a',
						share: 100 },
					{ bracket: 2,
						range: { from: 9000, to: 9999 },
						base: 9000,
						premium: 225,
						share: 112.5 },
					{ bracket: 3,
						range: { from: 10000, to: 10999 },
						base: 10000,
						premium: 250,
						share: 125 },
					{ bracket: 4,
						range: { from: 11000, to: 11999 },
						base: 11000,
						premium: 275,
						share: 137.5 },
					{ bracket: 5,
						range: { from: 12000, to: 12999 },
						base: 12000,
						premium: 300,
						share: 150 },
					{ bracket: 6,
						range: { from: 13000, to: 13999 },
						base: 13000,
						premium: 325,
						share: 162.5 },
					{ bracket: 7,
						range: { from: 14000, to: 14999 },
						base: 14000,
						premium: 350,
						share: 175 },
					{ bracket: 8,
						range: { from: 15000, to: 15999 },
						base: 15000,
						premium: 375,
						share: 187.5 },
					{ bracket: 9,
						range: { from: 16000, to: 16999 },
						base: 16000,
						premium: 400,
						share: 200 },
					{ bracket: 10,
						range: { from: 17000, to: 17999 },
						base: 17000,
						premium: 425,
						share: 212.5 },
					{ bracket: 11,
						range: { from: 18000, to: 18999 },
						base: 18000,
						premium: 450,
						share: 225 },
					{ bracket: 12,
						range: { from: 19000, to: 19999 },
						base: 19000,
						premium: 475,
						share: 237.5 },
					{ bracket: 13,
						range: { from: 20000, to: 20999 },
						base: 20000,
						premium: 500,
						share: 250 },
					{ bracket: 14,
						range: { from: 21000, to: 21999 },
						base: 21000,
						premium: 525,
						share: 262.5 },
					{ bracket: 15,
						range: { from: 22000, to: 22999 },
						base: 22000,
						premium: 550,
						share: 275 },
					{ bracket: 16,
						range: { from: 23000, to: 23999 },
						base: 23000,
						premium: 575,
						share: 287.5 },
					{ bracket: 17,
						range: { from: 24000, to: 24999 },
						base: 24000,
						premium: 600,
						share: 300 },
					{ bracket: 18,
						range: { from: 25000, to: 25999 },
						base: 25000,
						premium: 625,
						share: 312.5 },
					{ bracket: 19,
						range: { from: 26000, to: 26999 },
						base: 26000,
						premium: 650,
						share: 325 },
					{ bracket: 20,
						range: { from: 27000, to: 27999 },
						base: 27000,
						premium: 675,
						share: 337.5 },
					{ bracket: 21,
						range: { from: 28000, to: 28999 },
						base: 28000,
						premium: 700,
						share: 350 },
					{ bracket: 22,
						range: { from: 29000, to: 29999 },
						base: 29000,
						premium: 725,
						share: 362.5 },
					{ bracket: 23,
						range: { from: 30000, to: 30999 },
						base: 30000,
						premium: 750,
						share: 375 },
					{ bracket: 24,
						range: { from: 31000, to: 31999 },
						base: 31000,
						premium: 775,
						share: 387.5 },
					{ bracket: 25,
						range: { from: 32000, to: 32999 },
						base: 32000,
						premium: 800,
						share: 400 },
					{ bracket: 26,
						range: { from: 33000, to: 33999 },
						base: 33000,
						premium: 825,
						share: 412.5 },
					{ bracket: 27,
						range: { from: 34000, to: 34999 },
						base: 34000,
						premium: 850,
						share: 425 },
					{ bracket: 28,
						range: { from: 35000, to: Infinity },
						base: 35000,
						premium: 875,
						share: 437.5 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to PhilHealth table failed. Char in premium. Response 500");
		});
	});
	describe("Incorrect Insert (char in share)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to PhilHealth table");
			chai.request(server)
			.post('/updatePHComp')
			.send(
				[ { bracket: 1,
						range: { from: 0, to: 8999 },
						base: 8000,
						premium: 200,
						share: 'a' },
					{ bracket: 2,
						range: { from: 9000, to: 9999 },
						base: 9000,
						premium: 225,
						share: 112.5 },
					{ bracket: 3,
						range: { from: 10000, to: 10999 },
						base: 10000,
						premium: 250,
						share: 125 },
					{ bracket: 4,
						range: { from: 11000, to: 11999 },
						base: 11000,
						premium: 275,
						share: 137.5 },
					{ bracket: 5,
						range: { from: 12000, to: 12999 },
						base: 12000,
						premium: 300,
						share: 150 },
					{ bracket: 6,
						range: { from: 13000, to: 13999 },
						base: 13000,
						premium: 325,
						share: 162.5 },
					{ bracket: 7,
						range: { from: 14000, to: 14999 },
						base: 14000,
						premium: 350,
						share: 175 },
					{ bracket: 8,
						range: { from: 15000, to: 15999 },
						base: 15000,
						premium: 375,
						share: 187.5 },
					{ bracket: 9,
						range: { from: 16000, to: 16999 },
						base: 16000,
						premium: 400,
						share: 200 },
					{ bracket: 10,
						range: { from: 17000, to: 17999 },
						base: 17000,
						premium: 425,
						share: 212.5 },
					{ bracket: 11,
						range: { from: 18000, to: 18999 },
						base: 18000,
						premium: 450,
						share: 225 },
					{ bracket: 12,
						range: { from: 19000, to: 19999 },
						base: 19000,
						premium: 475,
						share: 237.5 },
					{ bracket: 13,
						range: { from: 20000, to: 20999 },
						base: 20000,
						premium: 500,
						share: 250 },
					{ bracket: 14,
						range: { from: 21000, to: 21999 },
						base: 21000,
						premium: 525,
						share: 262.5 },
					{ bracket: 15,
						range: { from: 22000, to: 22999 },
						base: 22000,
						premium: 550,
						share: 275 },
					{ bracket: 16,
						range: { from: 23000, to: 23999 },
						base: 23000,
						premium: 575,
						share: 287.5 },
					{ bracket: 17,
						range: { from: 24000, to: 24999 },
						base: 24000,
						premium: 600,
						share: 300 },
					{ bracket: 18,
						range: { from: 25000, to: 25999 },
						base: 25000,
						premium: 625,
						share: 312.5 },
					{ bracket: 19,
						range: { from: 26000, to: 26999 },
						base: 26000,
						premium: 650,
						share: 325 },
					{ bracket: 20,
						range: { from: 27000, to: 27999 },
						base: 27000,
						premium: 675,
						share: 337.5 },
					{ bracket: 21,
						range: { from: 28000, to: 28999 },
						base: 28000,
						premium: 700,
						share: 350 },
					{ bracket: 22,
						range: { from: 29000, to: 29999 },
						base: 29000,
						premium: 725,
						share: 362.5 },
					{ bracket: 23,
						range: { from: 30000, to: 30999 },
						base: 30000,
						premium: 750,
						share: 375 },
					{ bracket: 24,
						range: { from: 31000, to: 31999 },
						base: 31000,
						premium: 775,
						share: 387.5 },
					{ bracket: 25,
						range: { from: 32000, to: 32999 },
						base: 32000,
						premium: 800,
						share: 400 },
					{ bracket: 26,
						range: { from: 33000, to: 33999 },
						base: 33000,
						premium: 825,
						share: 412.5 },
					{ bracket: 27,
						range: { from: 34000, to: 34999 },
						base: 34000,
						premium: 850,
						share: 425 },
					{ bracket: 28,
						range: { from: 35000, to: Infinity },
						base: 35000,
						premium: 875,
						share: 437.5 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to PhilHealth table failed. Char in share. Response 500");
		});
	});
	describe("Incorrect Insert (char in from)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to PhilHealth table");
			chai.request(server)
			.post('/updatePHComp')
			.send(
				[ { bracket: 1,
						range: { from: 'a', to: 8999 },
						base: 8000,
						premium: 200,
						share: 100 },
					{ bracket: 2,
						range: { from: 9000, to: 9999 },
						base: 9000,
						premium: 225,
						share: 112.5 },
					{ bracket: 3,
						range: { from: 10000, to: 10999 },
						base: 10000,
						premium: 250,
						share: 125 },
					{ bracket: 4,
						range: { from: 11000, to: 11999 },
						base: 11000,
						premium: 275,
						share: 137.5 },
					{ bracket: 5,
						range: { from: 12000, to: 12999 },
						base: 12000,
						premium: 300,
						share: 150 },
					{ bracket: 6,
						range: { from: 13000, to: 13999 },
						base: 13000,
						premium: 325,
						share: 162.5 },
					{ bracket: 7,
						range: { from: 14000, to: 14999 },
						base: 14000,
						premium: 350,
						share: 175 },
					{ bracket: 8,
						range: { from: 15000, to: 15999 },
						base: 15000,
						premium: 375,
						share: 187.5 },
					{ bracket: 9,
						range: { from: 16000, to: 16999 },
						base: 16000,
						premium: 400,
						share: 200 },
					{ bracket: 10,
						range: { from: 17000, to: 17999 },
						base: 17000,
						premium: 425,
						share: 212.5 },
					{ bracket: 11,
						range: { from: 18000, to: 18999 },
						base: 18000,
						premium: 450,
						share: 225 },
					{ bracket: 12,
						range: { from: 19000, to: 19999 },
						base: 19000,
						premium: 475,
						share: 237.5 },
					{ bracket: 13,
						range: { from: 20000, to: 20999 },
						base: 20000,
						premium: 500,
						share: 250 },
					{ bracket: 14,
						range: { from: 21000, to: 21999 },
						base: 21000,
						premium: 525,
						share: 262.5 },
					{ bracket: 15,
						range: { from: 22000, to: 22999 },
						base: 22000,
						premium: 550,
						share: 275 },
					{ bracket: 16,
						range: { from: 23000, to: 23999 },
						base: 23000,
						premium: 575,
						share: 287.5 },
					{ bracket: 17,
						range: { from: 24000, to: 24999 },
						base: 24000,
						premium: 600,
						share: 300 },
					{ bracket: 18,
						range: { from: 25000, to: 25999 },
						base: 25000,
						premium: 625,
						share: 312.5 },
					{ bracket: 19,
						range: { from: 26000, to: 26999 },
						base: 26000,
						premium: 650,
						share: 325 },
					{ bracket: 20,
						range: { from: 27000, to: 27999 },
						base: 27000,
						premium: 675,
						share: 337.5 },
					{ bracket: 21,
						range: { from: 28000, to: 28999 },
						base: 28000,
						premium: 700,
						share: 350 },
					{ bracket: 22,
						range: { from: 29000, to: 29999 },
						base: 29000,
						premium: 725,
						share: 362.5 },
					{ bracket: 23,
						range: { from: 30000, to: 30999 },
						base: 30000,
						premium: 750,
						share: 375 },
					{ bracket: 24,
						range: { from: 31000, to: 31999 },
						base: 31000,
						premium: 775,
						share: 387.5 },
					{ bracket: 25,
						range: { from: 32000, to: 32999 },
						base: 32000,
						premium: 800,
						share: 400 },
					{ bracket: 26,
						range: { from: 33000, to: 33999 },
						base: 33000,
						premium: 825,
						share: 412.5 },
					{ bracket: 27,
						range: { from: 34000, to: 34999 },
						base: 34000,
						premium: 850,
						share: 425 },
					{ bracket: 28,
						range: { from: 35000, to: Infinity },
						base: 35000,
						premium: 875,
						share: 437.5 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to PhilHealth table failed. Char in from. Response 500");
		});
	});
	describe("Incorrect Insert (char in to)", function(){
		it("returns status 500", function(done){
			financialwinston.info("Inserting to PhilHealth table");
			chai.request(server)
			.post('/updatePHComp')
			.send(
				[ { bracket: 1,
						range: { from: 0, to: 'a' },
						base: 8000,
						premium: 200,
						share: 100 },
					{ bracket: 2,
						range: { from: 9000, to: 9999 },
						base: 9000,
						premium: 225,
						share: 112.5 },
					{ bracket: 3,
						range: { from: 10000, to: 10999 },
						base: 10000,
						premium: 250,
						share: 125 },
					{ bracket: 4,
						range: { from: 11000, to: 11999 },
						base: 11000,
						premium: 275,
						share: 137.5 },
					{ bracket: 5,
						range: { from: 12000, to: 12999 },
						base: 12000,
						premium: 300,
						share: 150 },
					{ bracket: 6,
						range: { from: 13000, to: 13999 },
						base: 13000,
						premium: 325,
						share: 162.5 },
					{ bracket: 7,
						range: { from: 14000, to: 14999 },
						base: 14000,
						premium: 350,
						share: 175 },
					{ bracket: 8,
						range: { from: 15000, to: 15999 },
						base: 15000,
						premium: 375,
						share: 187.5 },
					{ bracket: 9,
						range: { from: 16000, to: 16999 },
						base: 16000,
						premium: 400,
						share: 200 },
					{ bracket: 10,
						range: { from: 17000, to: 17999 },
						base: 17000,
						premium: 425,
						share: 212.5 },
					{ bracket: 11,
						range: { from: 18000, to: 18999 },
						base: 18000,
						premium: 450,
						share: 225 },
					{ bracket: 12,
						range: { from: 19000, to: 19999 },
						base: 19000,
						premium: 475,
						share: 237.5 },
					{ bracket: 13,
						range: { from: 20000, to: 20999 },
						base: 20000,
						premium: 500,
						share: 250 },
					{ bracket: 14,
						range: { from: 21000, to: 21999 },
						base: 21000,
						premium: 525,
						share: 262.5 },
					{ bracket: 15,
						range: { from: 22000, to: 22999 },
						base: 22000,
						premium: 550,
						share: 275 },
					{ bracket: 16,
						range: { from: 23000, to: 23999 },
						base: 23000,
						premium: 575,
						share: 287.5 },
					{ bracket: 17,
						range: { from: 24000, to: 24999 },
						base: 24000,
						premium: 600,
						share: 300 },
					{ bracket: 18,
						range: { from: 25000, to: 25999 },
						base: 25000,
						premium: 625,
						share: 312.5 },
					{ bracket: 19,
						range: { from: 26000, to: 26999 },
						base: 26000,
						premium: 650,
						share: 325 },
					{ bracket: 20,
						range: { from: 27000, to: 27999 },
						base: 27000,
						premium: 675,
						share: 337.5 },
					{ bracket: 21,
						range: { from: 28000, to: 28999 },
						base: 28000,
						premium: 700,
						share: 350 },
					{ bracket: 22,
						range: { from: 29000, to: 29999 },
						base: 29000,
						premium: 725,
						share: 362.5 },
					{ bracket: 23,
						range: { from: 30000, to: 30999 },
						base: 30000,
						premium: 750,
						share: 375 },
					{ bracket: 24,
						range: { from: 31000, to: 31999 },
						base: 31000,
						premium: 775,
						share: 387.5 },
					{ bracket: 25,
						range: { from: 32000, to: 32999 },
						base: 32000,
						premium: 800,
						share: 400 },
					{ bracket: 26,
						range: { from: 33000, to: 33999 },
						base: 33000,
						premium: 825,
						share: 412.5 },
					{ bracket: 27,
						range: { from: 34000, to: 34999 },
						base: 34000,
						premium: 850,
						share: 425 },
					{ bracket: 28,
						range: { from: 35000, to: Infinity },
						base: 35000,
						premium: 875,
						share: 437.5 } ]
			)
			.end(function(err, res){
				res.should.have.status(500);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.error("Inserting to PhilHealth table failed. Char in to. Response 500");
		});
	});
	describe("display page", function(){
		it("returns status 200", function(done){
			financialwinston.info("Going to PhilHealth table view");
			chai.request(server)
			.get('/PH')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			});
			financialwinston.info("Reacher PhilHealth table view. Response 200");
		});
	});
	describe("Insert", function(){
		it("returns status 200", function(done){
			financialwinston.info("Inserting to PhilHealth table");
			chai.request(server)
			.post('/updatePHComp')
			.send(
				[ { bracket: 1,
						range: { from: 0, to: 8999 },
						base: 8000,
						premium: 200,
						share: 100 },
					{ bracket: 2,
						range: { from: 9000, to: 9999 },
						base: 9000,
						premium: 225,
						share: 112.5 },
					{ bracket: 3,
						range: { from: 10000, to: 10999 },
						base: 10000,
						premium: 250,
						share: 125 },
					{ bracket: 4,
						range: { from: 11000, to: 11999 },
						base: 11000,
						premium: 275,
						share: 137.5 },
					{ bracket: 5,
						range: { from: 12000, to: 12999 },
						base: 12000,
						premium: 300,
						share: 150 },
					{ bracket: 6,
						range: { from: 13000, to: 13999 },
						base: 13000,
						premium: 325,
						share: 162.5 },
					{ bracket: 7,
						range: { from: 14000, to: 14999 },
						base: 14000,
						premium: 350,
						share: 175 },
					{ bracket: 8,
						range: { from: 15000, to: 15999 },
						base: 15000,
						premium: 375,
						share: 187.5 },
					{ bracket: 9,
						range: { from: 16000, to: 16999 },
						base: 16000,
						premium: 400,
						share: 200 },
					{ bracket: 10,
						range: { from: 17000, to: 17999 },
						base: 17000,
						premium: 425,
						share: 212.5 },
					{ bracket: 11,
						range: { from: 18000, to: 18999 },
						base: 18000,
						premium: 450,
						share: 225 },
					{ bracket: 12,
						range: { from: 19000, to: 19999 },
						base: 19000,
						premium: 475,
						share: 237.5 },
					{ bracket: 13,
						range: { from: 20000, to: 20999 },
						base: 20000,
						premium: 500,
						share: 250 },
					{ bracket: 14,
						range: { from: 21000, to: 21999 },
						base: 21000,
						premium: 525,
						share: 262.5 },
					{ bracket: 15,
						range: { from: 22000, to: 22999 },
						base: 22000,
						premium: 550,
						share: 275 },
					{ bracket: 16,
						range: { from: 23000, to: 23999 },
						base: 23000,
						premium: 575,
						share: 287.5 },
					{ bracket: 17,
						range: { from: 24000, to: 24999 },
						base: 24000,
						premium: 600,
						share: 300 },
					{ bracket: 18,
						range: { from: 25000, to: 25999 },
						base: 25000,
						premium: 625,
						share: 312.5 },
					{ bracket: 19,
						range: { from: 26000, to: 26999 },
						base: 26000,
						premium: 650,
						share: 325 },
					{ bracket: 20,
						range: { from: 27000, to: 27999 },
						base: 27000,
						premium: 675,
						share: 337.5 },
					{ bracket: 21,
						range: { from: 28000, to: 28999 },
						base: 28000,
						premium: 700,
						share: 350 },
					{ bracket: 22,
						range: { from: 29000, to: 29999 },
						base: 29000,
						premium: 725,
						share: 362.5 },
					{ bracket: 23,
						range: { from: 30000, to: 30999 },
						base: 30000,
						premium: 750,
						share: 375 },
					{ bracket: 24,
						range: { from: 31000, to: 31999 },
						base: 31000,
						premium: 775,
						share: 387.5 },
					{ bracket: 25,
						range: { from: 32000, to: 32999 },
						base: 32000,
						premium: 800,
						share: 400 },
					{ bracket: 26,
						range: { from: 33000, to: 33999 },
						base: 33000,
						premium: 825,
						share: 412.5 },
					{ bracket: 27,
						range: { from: 34000, to: 34999 },
						base: 34000,
						premium: 850,
						share: 425 },
					{ bracket: 28,
						range: { from: 35000, to: Infinity },
						base: 35000,
						premium: 875,
						share: 437.5 } ]
			)
			.end(function(err, res){
				res.should.have.status(200);
				// res.should.be.json;
				// res.should.be.a('array');
				done();
			})
			financialwinston.info("Success inserting to PhilHealth table. Response 200");
		});
	});
});
