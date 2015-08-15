"use strict"

var config = require("config");
var N3 = require('n3');
var rdfExt = require('rdf-ext')();


var exports = module.exports = {};

exports.expandPrefix = function(value){


	for (var x in config['Prefixes']){
		value = value.replace(x,config['Prefixes'][x]);
	}

	return value;
}


//converts database row results to rdf
exports.rows2rdf = function(data,sieralization,cb){

	if (!Array.isArray(data)){
		if (cb) cb(false)
		return false
	}

	var useSieralization = 'N-Triples';
	if (sieralization === 'nt') useSieralization = 'N-Triples';
	if (sieralization === 'turtle') useSieralization = 'Turtle';
	if (sieralization === 'jsonld') useSieralization = 'N-Triples';

	var writer = N3.Writer({ format: useSieralization,  prefixes: { 'skos': 'http://www.w3.org/2004/02/skos/core#', 'rdf' : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'classmark' : config['Prefixes']['class:'], 'classification' : config['Prefixes']['classification:']  } });

	for (var x in data){

		var row = data[x];

		if (row.predicate==='dbpedia:sequenceNumber') continue;

		var subject = exports.expandPrefix(row.subject);
		var predicate = exports.expandPrefix(row.predicate);
		if (row.objecturi){

			var object = exports.expandPrefix(row.objecturi); 

		}else{

			var object = '"' + row.objectliteral;
			if (row.literaldatatype){

				if (row.literaldatatype === 'xml:integer'){
					object = object + '"^^' + row.literaldatatype.replace('xml:',config['Prefixes']['xml:']);
				}else{
					object = object + '"' + row.literaldatatype;
				}
				
			}else{
				object = object + '"';
			}

		}

		writer.addTriple(

			subject,
			predicate,
			object

		)
	}





	writer.end(function (error, result){


		if (sieralization === 'jsonld'){
			rdfExt.parseTurtle(result, function (graph) {
				rdfExt.serializeJsonLd(graph, function (result) {

					console.log(result);
				})
			});
		}else{
			cb(result)
		}
	})




}
