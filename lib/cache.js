"use strict"

var pg = require('pg');
var redis = require('redis');
var url = require('url');


module.exports = function(app){


	var cache = {

		//* Initalization methods---------------------------------------------
		init : function(){

			if (process.env.REDIS_URL){
				var redisURL = url.parse(process.env.REDIS_URL);
				this.client = redis.createClient(redisURL.port, redisURL.hostname);
				this.client.auth(redisURL.auth.split(":")[1]);
			}else{
				this.client = redis.createClient('6379', 'localhost');
			}

			this.localCache = {};

			this.startUp();


		},


		//create the search table
		set: function(key,value,cb){
			this.client.set(key, value, cb);
		},

		get: function(key,cb){
			this.client.get(key, cb);
		},

		setClassifications: function(cb){	

			var self = this;


			var q = "select * from triples where subject in (select subject from triples where objecturi = 'skos:ConceptScheme')";
			app.db.simpleQuery(q,function(err,results){

				if (err) { 
					if (err.code === '42P01'){
						if (cb) cb(null,null)
						return false
					}

					console.log(err);

				}
				for (var x in results.rows){
					var row = results.rows[x];
					if (row.predicate === 'skos:prefLabel'){

						//self.set('label-'+row.subject,row.objectliteral);
						self.localCache['label-'+row.subject] = row.objectliteral;
					}
				}

				if (cb) cb(err,null);
			});
		},

		flushdb: function(cb){
		    this.client.flushdb( function (err, didSucceed) {
		        if (cb) cb(err,didSucceed)
		    });
		},

		startUp: function(cb){

			var self = this;

			self.setClassifications();


			app.data.buildClassificationBaseLevel(function(err,results){
				//now store it
				self.set('classificationsBaseLevel',JSON.stringify(results),function(err, results){
					if (cb) cb(err,true)
					console.log("Set Cache!")

				})			
			})	
		},

	}

	if (app){
		app.cache = cache;
		app.cache.init();
	}


	return cache;


}
