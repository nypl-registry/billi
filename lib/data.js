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

				var classifciationsData = {};

				//build the classifications data
				for (var aClassification in toDoClassifciations){

					aClassification = toDoClassifciations[aClassification];
					classifciationsData[aClassification] = { prefLabel : "", note : ""}


					for (var row in results.rows){
						row = results.rows[row];
						if (row.subject === aClassification && row.predicate === 'skos:prefLabel') classifciationsData[aClassification].prefLabel = row.objectliteral;
						if (row.subject === aClassification && row.predicate === 'skos:note') classifciationsData[aClassification].note = row.objectliteral;
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


					allResults.push({ classification : classification, classmarks : classmarkResults, prefLabel : classifciationsData[classification].prefLabel, note : classifciationsData[classification].note })
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

		},


		relatedData2Obj: function(relatedData){

			var relatedDataLookup = {};
			for (var x in relatedData){

				var triple = relatedData[x];

				if (!relatedDataLookup[triple.subject]){
					relatedDataLookup[triple.subject] = {

						prefLabel : [],
						hiddenLabel: [],
						note: []

					};
				}
				if (triple.predicate === 'skos:prefLabel' && triple.literaldatatype === '@en' && relatedDataLookup[triple.subject].prefLabel.indexOf(triple.objectliteral) == -1) relatedDataLookup[triple.subject].prefLabel.push(triple.objectliteral);
				if (triple.predicate === 'skos:hiddenLabel' && triple.literaldatatype === '@en' && relatedDataLookup[triple.subject].hiddenLabel.indexOf(triple.objectliteral) == -1) relatedDataLookup[triple.subject].hiddenLabel.push(triple.objectliteral);
				if (triple.predicate === 'skos:note' && triple.literaldatatype === '@en' && relatedDataLookup[triple.subject].note.indexOf(triple.objectliteral) == -1) relatedDataLookup[triple.subject].note.push(triple.objectliteral);

			}

			return relatedDataLookup;
		},


		parseAboutPageData: function(data, relatedData, cb){

			//create a little lookup table for related data
			var relatedDataLookup = this.relatedData2Obj(relatedData);


			var aboutObj  = {

				prefLabel : [],
				type: [],
				hiddenLabel : [],
				inScheme :[],
				note : [],
				narrower : [], //{classmark: "XX", prefLabel: "XX"}
				broader : [], //{classmark: "XX", prefLabel: "XX"}
				related : [], //{classmark: "XX", prefLabel: "XX"}
				classification: [], //{classmark: "XX", prefLabel: "XX"}
				changenote:[],
				broaderHierarchy: false



			}




			for (var x in data){

				var triple = data[x];

				if (triple.predicate === 'skos:prefLabel' && triple.literaldatatype === '@en') aboutObj.prefLabel.push(triple.objectliteral);
				if (triple.predicate === 'skos:hiddenLabel' && triple.literaldatatype === '@en') aboutObj.hiddenLabel.push(triple.objectliteral);
				if (triple.predicate === 'skos:note' && triple.literaldatatype === '@en') aboutObj.note.push(triple.objectliteral);
				if (triple.predicate === 'rdf:type') aboutObj.type.push( app.rdf.expandPrefix(triple.objecturi));
				if (triple.predicate === 'skos:inScheme') aboutObj.inScheme.push( app.rdf.expandPrefix(triple.objecturi));

				if (triple.predicate === 'skos:narrower'){
					if (relatedDataLookup[triple.objecturi]){
						for (var y in relatedDataLookup[triple.objecturi].hiddenLabel){
							aboutObj.narrower.push( { classmark: relatedDataLookup[triple.objecturi].hiddenLabel[y], prefLabel : (relatedDataLookup[triple.objecturi].prefLabel[y]) ? relatedDataLookup[triple.objecturi].prefLabel[y] : " ??? ERROR"  }  );
						}				
					}
				} 

				if (triple.predicate === 'skos:broader'){
					if (relatedDataLookup[triple.objecturi]){
						for (var y in relatedDataLookup[triple.objecturi].hiddenLabel){
							aboutObj.broader.push( { classmark: relatedDataLookup[triple.objecturi].hiddenLabel[y], prefLabel : (relatedDataLookup[triple.objecturi].prefLabel[y]) ? relatedDataLookup[triple.objecturi].prefLabel[y] : " ??? ERROR"  }  );
						}				
					}
				} 

				if (triple.predicate === 'skos:relatedMatch'){
					if (relatedDataLookup[triple.objecturi]){
						for (var y in relatedDataLookup[triple.objecturi].hiddenLabel){
							aboutObj.related.push( { classmark: relatedDataLookup[triple.objecturi].hiddenLabel[y], prefLabel : (relatedDataLookup[triple.objecturi].prefLabel[y]) ? relatedDataLookup[triple.objecturi].prefLabel[y] : " ??? ERROR"  }  );
						}				
					}
				} 

				if (triple.provenance['@graph']){
					for (var p in triple.provenance['@graph']){
						aboutObj.changenote.push(triple.predicate + ' ' + triple.provenance['@graph'][p].changeNote);
					}
				}	

			}

			if (aboutObj.broader[0]){
				app.db.returnClassmarkHierarchy(aboutObj.broader[0].classmark, true, function(results){
					aboutObj.broaderHierarchy = results
					if (cb) cb(null, aboutObj);
				})
			}else{

				if (cb) cb(null, aboutObj);
			}
		}

	}

	if (app){
		app.data = data;
		//app.data.init();
	}



	return data;



}