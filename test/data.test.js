var should = require('should')

var app = {};

var db = require("../lib/db.js")(app);
var data = require("../lib/data.js")(app);
var cache = require('../lib/cache.js')(app);
var rdf = require('../lib/rdf.js')(app);



describe('DATA Lib tests', function () {


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



	it('It should build rows from the cache and db returning the classification and first level classmarks', function (done) {

		data.returnClassificationAsRows('billings',function(err,results,relatedResults){
	
			for (var x in results){

				if (results[x].predicate){

					results[x].subject.should.equal('classification:billings')

					if (results[x].predicate === 'rdf:type'){
						results[x].objecturi.should.equal('skos:ConceptScheme')
					}
					if (results[x].predicate === 'skos:prefLabel'){
						results[x].objectliteral.should.equal('Billings')
					}
				}

			}

			for (var x in relatedResults){
				if (relatedResults[x].predicate){
					if (relatedResults[x].predicate === 'skos:inScheme'){
						relatedResults[x].objecturi.should.equal('classification:billings')
					}		
				}
			}



			done();


			
		});

	});


	it('It should build related data object for the about page info object', function (done) {

		db.returnClassmark('G',function(err,classmarkData,relatedMarksData){
			var relatedDataLookup = data.relatedData2Obj(relatedMarksData);
			should.exist(relatedDataLookup['class:gi'])
			relatedDataLookup['class:gi'].hiddenLabel[0].should.equal('GI')
			done();
		});

	});

	it('It should build about page info object', function (done) {

		db.returnClassmark('GIV',function(err,classmarkData,relatedMarksData){

			var aboutObj = data.parseAboutPageData(classmarkData,relatedMarksData, function(err,results){

				results.changenote.length.should.be.above(0);

				results.broaderHierarchy[0].subject.should.equal('class:g');
				results.broader[0].classmark.should.equal('GI');
				results.narrower[0].classmark.should.equal('GIVE');
				results.inScheme[0].should.equal('http://billi.nypl.org/classification/billings');
				results.hiddenLabel[0].should.equal('GIV');
				results.type[0].should.equal('http://www.w3.org/2004/02/skos/core#Concept');
				results.prefLabel[0].should.equal( 'Balkan States. Balkan War');

				done();

			});



		});

	});
	

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


	it('It should return a classmark single term search result', function (done) {
		data.apiReturnSearchResults('history',function(err,results){
			results.data[0].attributes.label.should.equal('History Other European')
			//console.log(results)
			done()
		})		
	})

	it('It should return a classmark multiple terms search result', function (done) {
		data.apiReturnSearchResults('history Balkan',function(err,results){
			results.data[0].attributes.label.should.equal('History Other European > Turkey In Europe: Bibliography > Balkan States. Balkan War')
			done()
		})		
	})

	it('It should return a classmark bad search result', function (done) {
		data.apiReturnSearchResults('',function(err,results){

			results.data.length.should.equal(0);
			data.apiReturnSearchResults(null,function(err,results){

				results.data.length.should.equal(0);
				done()
			})		


		})		
	})

	it('test if a classmark has a wikipedia link yet', function (done) {

		data.hasWiki('G',function(err,results){

			
			results.should.equal(false)

			done();
		});

	});


})