"use strict"

var config = require("config");
// var cache = require('../lib/cache.js');
// var db = require('../lib/db.js');

module.exports = function(app){


	var data = {

		//returns the highest level classmarks
		buildClassificationBaseLevel: function(cb){

			var q = "Select * From triples where subject in (SELECT subject FROM triples where predicate = 'dbpedia:sequenceNumber' and objectliteral = '1')";

			var allResults = []

			app.db.simpleQuery(q,function(err,results){



				if (err) { 
					if (err.code === '42P01'){
						if (cb) cb(null,allResults)
						return
					}
					
					console.log(err);

				}

				var toDoClassifciations = [];



				//find all the classifciations we are going to do first
				for (var row in results.rows){
					row = results.rows[row];
					if (row.objecturi === 'skos:ConceptScheme'){
						toDoClassifciations.push(row.subject)
					}
				}		


				for (var aClassification in toDoClassifciations){

					var classification = toDoClassifciations[aClassification];
					var classmarks = {};


					
					for (var row in results.rows){
						row = results.rows[row];
						if (row.objecturi === classification){
							var hasBadPrefix = config['ignoreBaseLevelClassmarkPrefixes'].map(function(val){
								return row.subject.search(val.replace(/\*/g,'\\*').replace(/\-/g,'\\-') )
							})

							if (hasBadPrefix.reduce(function(a, b) {return a + b} )  < 0){
								classmarks[row.subject] = { prefLabel : "", hiddenLabel : ""}
							}				
						} 
					}

					//now we know what marks we want to use
					for (var row in results.rows){
						row = results.rows[row];
						if (row.predicate === 'skos:prefLabel' && classmarks[row.subject]){
							classmarks[row.subject].prefLabel =  row.objectliteral;
						}
						if (row.predicate === 'skos:hiddenLabel' && classmarks[row.subject]){
							classmarks[row.subject].hiddenLabel =  row.objectliteral;
						}
					}

					//gona sort by alpha to make sure
					var sortable = [];
					for (var c in classmarks) sortable.push(c)

					sortable.sort()

					var classmarkResults = {};
					for (var c in sortable) classmarkResults[sortable[c]] = classmarks[sortable[c]];


					allResults.push({ classification : classification, classmarks : classmarkResults})
				}


				if (cb) cb(err,allResults)
			});

		},


		apiReturnSearchResults: function(query, cb){




			var response = {
				data : []
			};

			if (!query){
				if (cb)	cb("Bad Query",response);
				return false;
			}

			//figure out && queries
			query = query.trim()
			query = query.split(' ').map(function(val){
				return val + ':*'
			}).join(' & ');


			var q = "SELECT * FROM search WHERE  to_tsvector('english', label) @@ to_tsquery($1) limit 25";
			
			var classmarks = {};

			app.db.argQuery(q,[query],function(err,results){

				if (!results){
					if (cb) cb(err,response)
					return false
				}

				//build search results in json api style since this is the only non RDF response we are doing
				for (var x in results.rows){



					var row = results.rows[x]
					var item = {

						type : "results",
						id   : row.id,
						attributes : {
							classification : app.cache.localCache['label-'+row.classification],
							label : row.label,
							classmark : row.hiddenlabel
						}

					}

					response.data.push(item);

				}

				if (err) console.log(err)
				if (cb) cb(err,response)

			})

		}

	}

	if (app){
		app.data = data;
		//app.data.init();
	}



	return data;



}