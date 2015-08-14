var express = require('express');
var app = express();


var db = require('./lib/db.js');

//always populate the table if it has to be created
db.createTriplesTable(function(err,created){
	if (created) db.populateBaseData();
});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


