"use strict"

var pg = require('pg');
var QueryStream = require('pg-query-stream');
var fs = require('fs');
var unzip = require('unzip');
var LineByLineReader = require('line-by-line');
var rimraf = require('rimraf');
var es = require('event-stream');
var config = require("config");


module.exports =  function(app){


	var db = {


		init: function(){

			if (process.env.USER === 'matt'){
				process.env.DATABASE_URL = "postgres://matt@localhost:5432/billi";
			}

			if (process.env.TRAVIS === 'travis'){
				process.env.DATABASE_URL = "postgres://postgres@localhost:5432/billi";
			} 

			//* These are the file vars that can change for testing

			this.billingsLoadDataZip               = __dirname + '/../data/billings.json.zip';
			this.billingsLoadDataZipOutput         = __dirname + '/../data/billings.json';
			this.billingsLoadDataZipOutputFilename = __dirname + '/../data/billings.json/billings.json';

		},


		//* Initalization methods---------------------------------------------

		//create the search table
		createSearchTable:  function(cb){

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT * FROM search limit 1', function(err, result) {
					if (err) { 
						if (err.code === '42P01'){

							console.log("building search table")

							var createTableSql = '';


							createTableSql = createTableSql + 'CREATE TABLE search (';
							createTableSql = createTableSql + '	id serial primary key,';
							createTableSql = createTableSql + '	subject	varchar(32) collate "C",';
							createTableSql = createTableSql + '	hiddenlabel	varchar(64),';
							createTableSql = createTableSql + '	classification varchar(64),';
							createTableSql = createTableSql + '	label	text';
							createTableSql = createTableSql + ')';


							client.query(createTableSql, function(err, result) {

								if (err) console.error("Could not create the search table!",err);

								client.query("Create Index on search ((lower(subject)))", function(err, result) {
									if (err) console.error("Could not create search subject index!",err);
									client.query("CREATE INDEX ON search USING gin(to_tsvector('english', label));", function(err, result) {
										if (err) console.error("Could not create search to_tsvector index!");
										if (cb) cb(null,true)
										done();							

									});
								});
							});
						}else{
							if (cb) cb(null,false)
						}				
					}else{
						if (cb) cb(null,false)
						done();				
					}
				});
			});
		},



		//creates the triple table and indexes if it does not exist
		createTriplesTable: function(cb){

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT * FROM triples limit 1', function(err, result) {
					if (err) { 
						if (err.code === '42P01'){

							console.log("building triples table")

							var createTableSql = '';



							createTableSql = createTableSql + 'CREATE TABLE triples (';
							createTableSql = createTableSql + '	id serial primary key,';
							createTableSql = createTableSql + '	subject	varchar(32) collate "C",';
							createTableSql = createTableSql + '	predicate	varchar(64),';
							createTableSql = createTableSql + '	objectUri	varchar(64) collate "C",';
							createTableSql = createTableSql + '	objectLiteral	text,';
							createTableSql = createTableSql + '	literalDataType	varchar(32),';
							createTableSql = createTableSql + '	provenance	json';
							createTableSql = createTableSql + ')';


							client.query(createTableSql, function(err, result) {

								if (err) console.error("Could not create the triples table!",err);

								client.query("Create Index on triples ((lower(subject)))", function(err, result) {
									if (err) console.error("Could not create subject index!",err);
									client.query("Create Index on triples ((lower(objectUri))) WHERE objectUri IS NOT NULL", function(err, result) {
										if (err) console.error("Could not create objectUri index!");
										if (cb) cb(null,true)
										done();

										

									});
								});
							});
						}else{
							if (cb) cb(null,false)
						}

						
					}else{
						if (cb) cb(null,false)
						done();				
					}
				});
			});
		},





		//populates the billings (and other) datasets into the empty table
		populateBaseData : function(cb){
			console.log("Populating data");

			var self = this;

			//load the zip file
			fs.createReadStream(self.billingsLoadDataZip)
				//pipe it into the extract
				.pipe(unzip.Extract({ path: self.billingsLoadDataZipOutput })

					//when it is done extacting
					.on('close',function(){


						pg.connect(process.env.DATABASE_URL, function(err, client, done) {

							client.query("TRUNCATE triples", function(err, result) {

								//read the exacted file line by line
								var counter = 0;
								var lr = new LineByLineReader(self.billingsLoadDataZipOutputFilename);

								lr.on('error', function (err) {
									console.log(err)							
								});

								lr.on('line', function (line) {

									lr.pause();

									try {
										var triple = JSON.parse(line);
									} catch (err) {
										console.log(err);
									}
									counter++

									if (triple){


										var queryText = 'INSERT INTO triples(subject, predicate,objectUri,objectLiteral,literalDataType,provenance) VALUES($1, $2, $3, $4, $5, $6)'
										client.query(queryText, [triple.subject, triple.predicate, triple.objectUri, triple.objectLiteral, triple.literalDataType, triple.provenance], function(err, result) {
											
											if(err){
												console.log(err)
											}

											if (counter%10000===0) console.log("Status:",counter);

											lr.resume();


											

											
										});
									}
								});

								lr.on('end', function () {
									//delete the extracted file
									rimraf(self.billingsLoadDataZipOutput,function(err){
										if (err) console.log(err);
										console.log('done',counter);
										if (cb) cb(null,counter);
										done();;
									})
								});
							})
						})
					})
				);
		},




		//populates the full text search table
		fullSearchReIndex: function(callback){

			var self = this;

			var counter = 0
			console.log("Reindexing the search table")

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {

				client.query("TRUNCATE search", function(err, result) {

					var query = new QueryStream('SELECT * FROM triples WHERE objectUri = $1', ['skos:Concept']);
					var stream = client.query(query);

					stream.pipe(es.map(function (data, cb) {


						stream.pause();
						
						
						//is this one of the prefixes that we don't want to include in the search index?
						var classmark = data.subject.replace('class:','');
						var firstTwo = classmark.substring(0,2);
						var firstThree = classmark.substring(0,3);
						var firstFour = classmark.substring(0,4);


						if (config['ignoreSearchClassmarkPrefixes'].indexOf(firstTwo) === -1 && config['ignoreSearchClassmarkPrefixes'].indexOf(firstThree) === -1 && config['ignoreSearchClassmarkPrefixes'].indexOf(firstFour) === -1){



							//classmark	
							//okay, get the full parents for this one to add to the search index
							self.returnClassmarkHierarchy(classmark,function(hierarchy){
								
								//add it to the search table
								var label = hierarchy.join(" > ");

								//get the hidden label first
								self.returnClassmark(classmark,function(err,classmarkData){
									
									

									if (err){
										console.log(err);
										stream.resume();
										cb();
										return
									}

									var hiddenLabel = self.returnFieldFromRows('skos:hiddenLabel',classmarkData);
									var classification = self.returnFieldFromRows('skos:inScheme',classmarkData);


									hiddenLabel = (hiddenLabel[0]) ? hiddenLabel[0] : "";
									classification = (classification[0]) ? classification[0] : "";


									pg.connect(process.env.DATABASE_URL, function(err2, client2, done2) {

										var queryText = 'INSERT INTO search(subject, label, hiddenlabel, classification) VALUES($1, $2, $3, $4)'
										client2.query(queryText, [data.subject, label, hiddenLabel, classification ], function(err, result) {
											counter++
											if (counter%100===0) console.log("Status:",counter);
											stream.resume();
											if (err) console.log(err)
											cb();
											done2();
										});
									});


								})


							})


						}else{
							stream.resume();
							cb();
						}
						
				

					}));


					//release the client when the stream is finished
					stream.on('end', function(){
						setTimeout(function(){
							console.log("Donme!")
							if (callback) callback();
							done();
						},1000)
					});




				});



			})	


		},







		//***Recall methods
		returnClassmark: function(classmark,cb){


			if (!classmark){
				if (cb) cb("bad classmark",false,false);
				return false;
			}


			pg.connect(process.env.DATABASE_URL, function(err, client, done) {

				if (err){
					if (cb) cb(err,false,false);
					done();
					return false;
				}

				classmark = 'class:' + classmark.toString().toLowerCase().replace(/\s/g,'_');

				client.query('SELECT * FROM triples WHERE subject = ($1)', [classmark], function(err, result) {


					if (err){
						if (cb) cb(err,false,false);
						done();
						return false;
					}				

					//console.log(result)

					//now we need the info for all the things referenced
					var relatedMarks = [];
					for (var x in result.rows){
						if (result.rows[x].objecturi != null && result.rows[x].objecturi != classmark){
							relatedMarks.push(result.rows[x].objecturi)
						}
					}

					var classmarkData = (result.rows.length>0) ? result.rows : false;


					if (!classmarkData) {
						if (cb) cb(err,classmarkData,false);
						done();
						return false;
					}

					var params = relatedMarks.map(function(item, idx) {return '$' + (parseInt(idx)+1) } );

					client.query('SELECT * FROM triples WHERE subject in (' + params.join(',') + ')', relatedMarks, function(err, result) {

						if (err){					
							if (cb) cb(err,classmarkData,false);
							done();
							return false;
						}					

						var relatedMarksData = (result.rows) ? result.rows : false;

						cb(err,classmarkData,relatedMarksData)
						done();

					})

				})


			})


		},






		//give it what field you want eg 'skos:label' and it will return that value from database results
		returnFieldFromRows: function(predicate, rows){


			var results = []

			for (var x in rows){
				if (rows[x].predicate === predicate){

					if (rows[x].objectliteral){
						results.push(rows[x].objectliteral);
					}else{
						results.push(rows[x].objecturi);
					}
				}
			}

			return results;

		},






		//retruns a array of the labels of the parent traversing up the hierarchy starting from what was passed.
		returnClassmarkHierarchy: function(classmark,callback){
			var self = this;

			var hierarchy = []
			var getParent = function(childClassmark){
				self.returnClassmark(childClassmark,function(err,classmarkData){

					if (err) callback([]);
					
					var parent = self.returnFieldFromRows('skos:broader',classmarkData);
					var label = self.returnFieldFromRows('skos:prefLabel',classmarkData);

					if (label[0]) hierarchy.push(label[0])
					if (parent.length>0){
						parent = parent[0].split('class:')[1]
						getParent(parent)
					}else{
						callback(hierarchy.reverse())
					}	
				})
			}
			getParent(classmark)
		},







		simpleQuery: function(query,cb){

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {

				if (err){
					if (cb) cb(err,false);
					done();
					return false;
				}
				var queryResult = client.query(query, function(err, result) {
					cb(err, result);
					done();
				})


			})

		},


		argQuery: function(query,argArray,cb){

			pg.connect(process.env.DATABASE_URL, function(err, client, done) {

				if (err){
					if (cb) cb(err,false);
					done();
					return false;
				}


				var queryResult = client.query(query,argArray, function(err, result) {
					

					cb(err, result)
					done()
				})


			})

		},





		//used for testing
		dropTriplesTable: function(cb){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				if (err) cb(err);
				client.query("DROP table triples", function(err, result) {
					if (cb) cb(err,result)
					done();
				});
			});
		},

		dropSearchTable: function(cb){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				if (err) cb(err);
				client.query("DROP table search", function(err, result) {
					if (cb) cb(err,result)
					done();
				});
			});
		},
		testTriplesTable: function(cb){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT * FROM triples limit 1', function(err, result) {
					cb(err,result)
					done();
				})
			})
		},
		testSearchTable: function(cb){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT * FROM search limit 1', function(err, result) {
					cb(err,result)
					done();
				})
			})
		},
		countTriplesTable: function(cb){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				client.query('SELECT count(*) FROM triples', function(err, result) {
					cb(err,result)
					done();
				})
			})
		}
	}


	if (app){
		app.db = db;
		app.db.init();
	}

	return db;

};










