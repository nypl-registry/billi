var should = require('should')
var db = require("../lib/db.js")();


describe('DB', function () {

	this.timeout(10000)

	
	before(function(done) {

		db.init()

		//drop the triple table and set the path to test data before we start
		db.billingsLoadDataZip               = __dirname + '/../data/billings.test.json.zip';
		db.billingsLoadDataZipOutput         = __dirname + '/../data/billings.test.json';
		db.billingsLoadDataZipOutputFilename = __dirname + '/../data/billings.test.json/billings.test.json';

		db.dropTriplesTable(function(err){
			if (err){
				if (err.code!='42P01') throw err				
			}	

			db.dropSearchTable(function(err){
				if (err){
					if (err.code!='42P01') throw err				
				}	
				done()		
			})		
		})

	})


	it('It should build the triples table', function (done) {
		db.createTriplesTable(function(err,results){
			results.should.equal(true);
			db.testTriplesTable(function(err,results){				
				if (err) throw err;
				results.rowCount.should.equal(0);
				done()
			})

		})
		
	})

	it('It should build the search table', function (done) {
		db.createSearchTable(function(err,results){
			results.should.equal(true);
			db.testSearchTable(function(err,results){				
				if (err) throw err;
				results.rowCount.should.equal(0);
				done()
			})

		})
		
	})



	it('It should populate the test table', function (done) {
		db.populateBaseData(function(err,results){
			if (err) throw err;

			//the counter from the method
			results.should.equal(87)	

			db.countTriplesTable(function(err,results){		
	
				if (err) throw err;
				//the acutal database
				results.rows[0].count.should.equal('87')
				done()
			})

		})
		
	})

	it('It should return data specifc to a requested classmark - classmarkData', function (done) {

		db.returnClassmark('GIV',function(err,classmarkData,relatedMarksData){
			classmarkData.length.should.equal(14);
			classmarkData[0].subject.should.equal('class:giv');
			classmarkData[0].predicate.should.equal('skos:hiddenLabel');
			should.not.exist(classmarkData[0].objecturi);
			classmarkData[0].objectliteral.should.equal('GIV');
			classmarkData[0].literaldatatype.should.equal('@en');
			classmarkData[0].provenance['@context'].should.equal('http://www.w3.org/2004/02/skos/core#');
			done()
		})
	});


	it('It should return data specifc to a requested classmark - relatedMarksData', function (done) {
		db.returnClassmark('GIV',function(err,classmarkData,relatedMarksData){
			relatedMarksData.length.should.equal(29);
			done()
		})
	});
	

	it('It should return no resuts when a classmark is not found', function (done) {
		db.returnClassmark('NOTINHERERERE',function(err,classmarkData,relatedMarksData){
			classmarkData.should.equal(false);
			relatedMarksData.should.equal(false);
			done()
		})
	});

	it('It should return no resuts when a classmark bad', function (done) {
		db.returnClassmark(undefined,function(err,classmarkData,relatedMarksData){
			classmarkData.should.equal(false);
			relatedMarksData.should.equal(false);
			db.returnClassmark(false,function(err,classmarkData,relatedMarksData){
				classmarkData.should.equal(false);
				relatedMarksData.should.equal(false);
				db.returnClassmark(null,function(err,classmarkData,relatedMarksData){
					classmarkData.should.equal(false);
					relatedMarksData.should.equal(false);
					db.returnClassmark(67890,function(err,classmarkData,relatedMarksData){
						classmarkData.should.equal(false);
						relatedMarksData.should.equal(false);
						done()
					})
				})
			})
		})
	});


	it('It should reindex the search table fullSearchReIndex', function (done) {
		db.fullSearchReIndex(function(){
			done()
		})
	});


	it('It should return the hierarchy of a classmark returnClassmarkHierarchy', function (done) {
	

		db.returnClassmarkHierarchy("give", false, function(hierarchy){
			hierarchy[0].should.equal('History Other European')
			hierarchy[3].should.equal('Bulgaria')
			done()
		})
	});


	
	



	after(function(done) { 

			db.dropSearchTable(function(err){
				if (err){
					console.log(err)
					if (err.code!='42P01') throw err				
				}				
				db.dropTriplesTable(function(err){
					if (err){
						console.log(err)
						if (err.code!='42P01') throw err				
					}	
					done()	
				})

			})

	});




})