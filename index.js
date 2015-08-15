var express = require('express');
var app = express();


var db = require('./lib/db.js');
var rdf = require('./lib/rdf.js');


//always populate the table if it has to be created
db.createTriplesTable(function(err,created){

	if (created) db.populateBaseData();
});


db.returnClassmark('zzh',function(err,data,relatedData){

	rdf.rows2rdf(data,'jsonld')


})


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get('/', function(request, response) {
  response.render('pages/index');
});


//send to the /about page
app.get('/classmark/:classmark', function(request, response) { 

	console.log(request.headers.accept)

	if (request.accepts('nt')) {

	}else{
		response.redirect(303,'/classmark/'+request.params.classmark+'/about');
	}


});







app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


