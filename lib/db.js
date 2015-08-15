"use strict"

var pg = require('pg');
var fs = require('fs');
var unzip = require('unzip');
var LineByLineReader = require('line-by-line');
var rimraf = require('rimraf');

var exports = module.exports = {};

if (process.env.USER === 'matt'){
	process.env.DATABASE_URL = "postgres://matt@localhost:5432/billi";
}else if (process.env.USER === 'matt'){
	process.env.DATABASE_URL = "postgres://postgres@localhost:5432/billi";
} 




//* These are the file vars that can change for testing

exports.billingsLoadDataZip               = __dirname + '/../data/billings.json.zip';
exports.billingsLoadDataZipOutput         = __dirname + '/../data/billings.json';
exports.billingsLoadDataZipOutputFilename = __dirname + '/../data/billings.json/billings.json';



//* Initalization methods---------------------------------------------

//creates the triple table and indexes if it does not exist
exports.createTriplesTable = function(cb){

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {

		client.query('SELECT * FROM triples limit 1', function(err, result) {

			if (err) { 


				if (err.code === '42P01'){

					console.log("building table")

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

						if (err) console.error("Could not create the triples table!");

						client.query("Create Index on triples ((lower(subject)))", function(err, result) {
							if (err) console.error("Could not create subject index!");
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
}



//populates the billings (and other) datasets into the empty table
exports.populateBaseData = function(cb){
	console.log("Populating data");

	//load the zip file
	fs.createReadStream(exports.billingsLoadDataZip)
		//pipe it into the extract
		.pipe(unzip.Extract({ path: exports.billingsLoadDataZipOutput })

			//when it is done extacting
			.on('close',function(){


				pg.connect(process.env.DATABASE_URL, function(err, client, done) {

					client.query("TRUNCATE triples", function(err, result) {

						//read the exacted file line by line
						var counter = 0;
						var lr = new LineByLineReader(exports.billingsLoadDataZipOutputFilename);

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
							rimraf(__dirname + '/../data/billings.json/',function(){
								console.log('done',counter)
								if (cb) cb(null,counter)
							})
						});
					})
				})
			})
		);
}



//***Recall methods

exports.returnClassmark = function(classmark,cb){


	if (!classmark){
		if (cb) cb("bad classmark",false,false);
		return false;
	}


	pg.connect(process.env.DATABASE_URL, function(err, client, done) {

		if (err){
			if (cb) cb(err,false,false);
			return false;
		}

		classmark = 'class:' + classmark.toString().toLowerCase().replace(/\s/g,'_');

		client.query('SELECT * FROM triples WHERE subject = ($1)', [classmark], function(err, result) {


			if (err){
				if (cb) cb(err,false,false);
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
			var params = relatedMarks.map(function(item, idx) {return '$' + (parseInt(idx)+1) } );

			client.query('SELECT * FROM triples WHERE subject in (' + params.join(',') + ')', relatedMarks, function(err, result) {

				if (err){
					if (cb) cb(err,classmarkData,false);
					return false;
				}					

				var relatedMarksData = (result.rows) ? result.rows : false;

				cb(err,classmarkData,relatedMarksData)

			})

		})


	})


}


//used for testing
exports.dropTriplesTable = function(cb){

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if (err) cb(err);
		client.query("DROP table triples", function(err, result) {
			if (cb) cb(err,result)
		});
	});
}

exports.testTriplesTable = function(cb){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM triples limit 1', function(err, result) {
			cb(err,result)
		})
	})
}
exports.countTriplesTable = function(cb){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT count(*) FROM triples', function(err, result) {
			cb(err,result)
		})
	})
}