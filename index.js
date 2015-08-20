var express = require('express');
var app = express();


var db = require('./lib/db.js')(app);
var rdf = require('./lib/rdf.js')(app);
var data = require('./lib/data.js')(app);
var cache = require('./lib/cache.js')(app);


//always populate the table if it has to be created
app.db.createSearchTable(function(err,created){
	app.db.createTriplesTable(function(err,created){
		if (created) app.db.populateBaseData(function(){
			
			//start indexing
			app.db.fullSearchReIndex()

			//re run the cacheinfo
			app.cache.startUp()
		});
	});
})



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', {
    open: '<%',
    close: '%>}'
    //we are using standard open/close tags, in the _.template system we use <# #>
});


app.get('/', function(request, response) {

	//get the browse data
	var browseJson = app.cache.get('classificationsBaseLevel',function(err,data){
		response.render('pages/index', { classificationsBaseLevel: JSON.parse(data)} );
	
	});




	
});


app.get('/api/search/:query', function(request, response) { 

	
	if (!request.params.query) request.params.query = "";
	var query = request.params.query.trim();
	if (query.length < 3){
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({ data: [] }));
	}else{
		data.apiReturnSearchResults(query, function(err,results){
			response.setHeader('Content-Type', 'application/json');
			response.send(JSON.stringify(results));
		})
	}


});


app.get('/classmark/:classmark/:format', function(request, response) { 

	//is there even data
	db.returnClassmark(request.params.classmark,function(err,data,relatedData){
		if (data){

			var format = request.params.format.toLowerCase()


			if (format==='about'){

			}else if(format === 'nt' || format === 'n-triples'){
				rdf.rows2rdf(data,"nt",function(err,results){
					response.type('text/plain');
					response.status(200).send(results);
				})
			}else if(format === 'turtle'){
				rdf.rows2rdf(data,"turtle",function(err,results){
					response.type('text/turtle');
					response.status(200).send(results);
				})
			}else if(format.search('json') > -1){
				rdf.rows2rdf(data,"jsonld",function(err,results){
					response.type('application/json');
					response.status(200).send(results);
				})	
			}
		}else{
			response.status(404).send('Classmark not found');
		}	
	});
})


//handle content negoatiaion and forwarding to /about
app.get('/classmark/:classmark', function(request, response) { 
	//send to the /about page if they are asking for html
	if (request.accepts('text/html')) {
		response.redirect(303,'/classmark/'+request.params.classmark+'/about');
		return;
	}
	//otherwise try to accomdate their content negotation
	db.returnClassmark(request.params.classmark,function(err,data,relatedData){
		if (data){
			if (request.accepts('text/n3') || request.accepts('text/plain')) {
				rdf.rows2rdf(data,"nt",function(err,results){
					response.type('text/n3');
					response.status(200).send(results);
				})
			}else if (request.accepts('application/json') || request.accepts('application/ld+json')) {
				rdf.rows2rdf(data,"jsonld",function(err,results){
					response.type('application/ld+json');
					response.status(200).send(results);
				})				
			}else if (request.accepts('text/turtle')) {
				rdf.rows2rdf(data,"turtle",function(err,results){
					response.type('text/turtle');
					response.status(200).send(results);
				})				
			}
		}else{
			response.status(404).send('Classmark not found');
		}
	});
});







app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


