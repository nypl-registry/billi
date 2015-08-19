var should = require('should')

var app = {};

var db = require("../lib/db.js")(app);
var data = require("../lib/data.js")(app);
var cache = require('../lib/cache.js')(app);



describe('DATA Lib Tests', function () {

	this.timeout(60000)

	before(function(done) {	
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

								app.cache.flushdb(function(err,results){

									//build the local cache
									app.cache.setClassifications(function(err,results){
										done()
									})

								})

								
							})
						})
					})
				})
			})		
		})
	})

	

	it('It should build the base level navigation for classifications and store them in the cache', function (done) {
		data.buildClassificationBaseLevel(function(err,results){
			results[0].classification.should.equal('classification:billings');
			results[0].classmarks['class:g'].prefLabel.should.equal('History Other European');
			
			//now store it
			cache.set('classificationsBaseLevel',JSON.stringify(results),function(err, results){
				cache.get('classificationsBaseLevel',function(err,cacheResults){

					var cacheResults = JSON.parse(cacheResults);
					cacheResults[0].classification.should.equal('classification:billings');
					cacheResults[0].classmarks['class:g'].prefLabel.should.equal('History Other European');
					done();
				})				
			})			
		})		
	})


	// it('It should return a classmark single term search result', function (done) {
	// 	data.apiReturnSearchResults('history',function(err,results){
	// 		results.data[0].attributes.label.should.equal('History Other European')
	// 		//console.log(results)
	// 		done()
	// 	})		
	// })

	// it('It should return a classmark multiple terms search result', function (done) {
	// 	data.apiReturnSearchResults('history Balkan',function(err,results){
	// 		results.data[0].attributes.label.should.equal('History Other European > Turkey In Europe: Bibliography > Balkan States. Balkan War')
	// 		done()
	// 	})		
	// })

	// it('It should return a classmark bad search result', function (done) {
	// 	data.apiReturnSearchResults('',function(err,results){

	// 		results.data.length.should.equal(0);
	// 		data.apiReturnSearchResults(null,function(err,results){

	// 			results.data.length.should.equal(0);
	// 			done()
	// 		})		


	// 	})		
	// })


})