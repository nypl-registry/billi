"use strict"

var pg = require('pg');
var fs = require('fs');
var unzip = require('unzip');
var LineByLineReader = require('line-by-line');
var rimraf = require('rimraf');

var exports = module.exports = {};

if (process.env.USER === 'matt'){
	process.env.DATABASE_URL = "postgres://matt@localhost:5432/billi"
}


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



exports.populateBaseData = function(cb){
	console.log("Populating data");
	
	//load the zip file
	fs.createReadStream(__dirname + '/../data/billings.json.zip')
		//pipe it into the extract
		.pipe(unzip.Extract({ path: __dirname + '/../data/billings.json' })

			//when it is done extacting
			.on('close',function(){


				pg.connect(process.env.DATABASE_URL, function(err, client, done) {

					client.query("TRUNCATE triples", function(err, result) {

						//read the exacted file line by line
						var counter = 0;
						var lr = new LineByLineReader(__dirname + '/../data/billings.json/billings.json');

						lr.on('error', function (err) {
							console.log(err)
						});

						lr.on('line', function (line) {
							// pause emitting of lines...
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

									lr.resume();
								});





							}

							



						});

						lr.on('end', function () {

							//delete the extracted file

							rimraf(__dirname + '/../data/billings.json/',function(){

								console.log('done',counter)
							})



						});

					})

				})


			})
		);


}




