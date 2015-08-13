"use strict"

var pg = require('pg');
var exports = module.exports = {};

if (process.env.USER === 'matt'){
	process.env.DATABASE_URL = "postgres://matt@localhost:5432/billi"
}

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
								done();
							});
						});
					});
				}	
			}else{
				done();
			}
		});
	});
}






