"use strict"

var config = require("config");
var requestLib = require('request');
var rdfExt = require('rdf-ext')();
var fs = require('fs');


module.exports = function(app){



	var wiki = {




		process: function(classmark, wikidata, agent, cb){

			//ask wikidata for the info

			if (classmark.search("class:") === -1) classmark = 'class:' + classmark;



			requestLib('https://www.wikidata.org/wiki/Special:EntityData/'+wikidata+'.json', function (error, res, body) {
			  

			  if (!error && res.statusCode == 200) {
				
			  	//we got the wikidata
			  	var data = JSON.parse(body)

			  	var wikiEng = false

			  	if (data.entities){
			  		if (data.entities[wikidata]){
			  			if (data.entities[wikidata].sitelinks){
			  				if (data.entities[wikidata].sitelinks.enwiki){
			  					if (data.entities[wikidata].sitelinks.enwiki.url){
			  						wikiEng = data.entities[wikidata].sitelinks.enwiki.url
			  					}
			  				}
			  			}
			  		}
			  	}

			  	if (wikiEng){

			  		var dbpediaUrl = wikiEng.replace("https://en.wikipedia.org/wiki/","http://dbpedia.org/data/") + '.ntriples';
			  		var dbpediaUri = wikiEng.replace("https://en.wikipedia.org/wiki/","http://dbpedia.org/resource/");
			  		var dbpediaSlug = wikiEng.replace("https://en.wikipedia.org/wiki/","");

			  		var comment = false;
			  		var commentShort = false;
			  		var commentLabel = false;

			  		var imageUrl = false;
			  		

					requestLib(dbpediaUrl, function (error, res, body) {

						if (!error && res.statusCode == 200) {


							rdfExt.parseNTriples(body, function (graph,err) {


								if (!err){

									graph = graph.toArray()							
									for (var x in graph){
										//our one
										if (dbpediaUri === graph[x].subject.toString()){
											//try to find the enligh comment
											if (graph[x].predicate.toString() === 'http://dbpedia.org/ontology/abstract'){
												if (graph[x].object.language === 'en'){
													comment = graph[x].object.toString();
												}
											}
											if (graph[x].predicate.toString() === 'http://www.w3.org/2000/01/rdf-schema#comment'){
												if (graph[x].object.language === 'en'){
													commentShort = graph[x].object.toString();
												}
											}
											if (graph[x].predicate.toString() === 'http://www.w3.org/2000/01/rdf-schema#label'){
												if (graph[x].object.language === 'en'){
													commentLabel = graph[x].object.toString();
												}
											}
											

											//thumbnail
											if (graph[x].predicate.toString() === 'http://dbpedia.org/ontology/thumbnail'){
												imageUrl = graph[x].object.toString();
											}							
											
										}

									}

									if (imageUrl) imageUrl = imageUrl.replace("=300","=200")


									app.data.hasWiki(classmark,function(err,results){


										//throw in those new mappings

										var t1 = JSON.parse(JSON.stringify(app.db.newTripleTemplate))

										t1.subject = classmark;
										t1.predicate = 'skos:mappingRelation';
										t1.objectUri = 'wikidata:' + wikidata;
										t1.objectLiteral = null;
										t1.literalDataType = null;
										t1.provenance['@graph'][0].changeNote = t1.provenance['@graph'][0].changeNote + agent

										app.db.insertTriple(t1)

										var t2 = JSON.parse(JSON.stringify(app.db.newTripleTemplate))

										t2.subject = classmark;
										t2.predicate = 'skos:mappingRelation';
										t2.objectUri = 'dbpr:' + dbpediaSlug;
										t2.objectLiteral = null;
										t2.literalDataType = null;
										t2.provenance['@graph'][0].changeNote = t2.provenance['@graph'][0].changeNote + agent

										app.db.insertTriple(t2)



										//does it already have a wikipedia connection?
										if (!results){									

											//we want to grab the image and store it and stuff and set the abstract
											
											//if we could not find the best data try other objects
											if (!comment && commentShort) comment = commentShort
											if (!comment && commentLabel) comment = commentLabel


											//first put in the comment
											if (comment){

												var t3 = JSON.parse(JSON.stringify(app.db.newTripleTemplate))

												t3.subject = classmark;
												t3.predicate = 'rdfs:comment';
												t3.objectUri = null;
												t3.objectLiteral = comment;
												t3.literalDataType = "@en";
												t3.provenance['@graph'][0].changeNote = t3.provenance['@graph'][0].changeNote + agent
												app.db.insertTriple(t3)
											}	

											//make search better by indexing on this term as well
											if (commentLabel){
												app.data.addLabelToSearch(classmark,commentLabel)
											}


											//the see also for the wikipedia page
											var t4 = JSON.parse(JSON.stringify(app.db.newTripleTemplate))

											t4.subject = classmark;
											t4.predicate = 'rdfs:seeAlso';
											t4.objectUri = wikiEng;
											t4.objectLiteral = null;
											t4.literalDataType = null;
											t4.provenance['@graph'][0].changeNote = t4.provenance['@graph'][0].changeNote + agent
											app.db.insertTriple(t4)


											if (imageUrl){

												requestLib(imageUrl).pipe(fs.createWriteStream('tmp_img')).on('close', function(){

												  fs.readFile('tmp_img', 'hex', function(err, imgData) {

												    imgData = '\\x' + imgData;

												    app.db.argQuery('insert into images (subject,image) values ($1,$2)',[classmark,imgData],function(err, writeResult) {

												    	//we downloaded the image and put it into the database, now lets add the new triples

												    	//set the image
														var t5 = JSON.parse(JSON.stringify(app.db.newTripleTemplate))

														t5.subject = classmark;
														t5.predicate = 'dbpo:thumbnail';
														t5.objectUri = imageUrl;
														t5.objectLiteral = null;
														t5.literalDataType = null;
														t5.provenance['@graph'][0].changeNote = t5.provenance['@graph'][0].changeNote + agent

														app.db.insertTriple(t5)

														if (cb) cb(null,true)



												    });


												  });

												});
											}else{

												//no image url found to save
												if (cb) cb(null,true)
											}


										}else{

											//done
											if (cb) cb(null,true)

										}


									})

								}else{
									cb("ERROR: Error parsing the DBpedia triples",false)
								}

							});



						}else{
							cb("ERROR: Could not talk to dbpedia",false)
						}
					});		  

			  	}else{
					cb("ERROR: Could not find the engligh wikipedia link",false)
			  	}



			  }else{
				
				cb("ERROR: Could not connect to wikidata",false)

			  }
			});

		},


		setToNull: function(classmark){

			//x-nypl:null

		}




	}




	if (app){
		app.wiki = wiki;
		//app.rdf.init();
	}

	return wiki;



}