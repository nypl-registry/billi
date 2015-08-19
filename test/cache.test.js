var should = require('should')

var app = {};
var cache = require("../lib/cache.js")(app);
var db = require("../lib/db.js")(app);




describe('CACHE Tests', function () {

	this.timeout(60000)

	before(function(done) {	


		cache.flushdb(function(err,results){

			if (err) console.log(err)
			//drop the triple table and set the path to test data before we start
			app.db.billingsLoadDataZip               = __dirname + '/../data/billings.test.json.zip';
			app.db.billingsLoadDataZipOutput         = __dirname + '/../data/billings.test.json';
			app.db.billingsLoadDataZipOutputFilename = __dirname + '/../data/billings.test.json/billings.test.json';
			app.db.dropTriplesTable(function(err){
				if (err){
					if (err.code!='42P01') throw err			
				}
				app.db.dropSearchTable(function(err){
					if (err){
						if (err.code!='42P01') throw err				
					}				

					//build and populate data for these tests
					app.db.createTriplesTable(function(err,results){
						app.db.createSearchTable(function(err,results){
							app.db.populateBaseData(function(err,results){
								app.db.fullSearchReIndex(function(){
									done()
								})
							})
						})
					})
				})		
			})
		})
	})


	after(function(done) {	
		cache.flushdb(function(err,results){
			if (err) console.log(err)
			done()
		})
	})
	


	it('It should set the classifications ', function (done) {
		cache.setClassifications(function(err,results){
			cache.localCache['label-classification:billings'].should.equal('Billings');
			done()
		})
		
	})





	





})