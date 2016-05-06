var compression = require('compression')
var express = require('express');
var requestLib = require('request');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bodyParser = require('body-parser');

var app = express();



var db = require('./lib/db.js')(app);
var rdf = require('./lib/rdf.js')(app);
var data = require('./lib/data.js')(app);
var cache = require('./lib/cache.js')(app);
var wiki = require('./lib/wiki.js')(app);

//always populate the table if it has to be created
app.db.createSearchTable(function(err,created){
	app.db.createImagesTable(function(err,created){
		app.db.createTriplesTable(function(err,created){
			if (created) app.db.populateBaseData(function(){
				
				//start indexing
				app.db.fullSearchReIndex()

				//re run the cacheinfo
				app.cache.startUp()
			});
		});
	});
})


app.set('port', (process.env.PORT || 5000));

app.use(compression());

app.use(express.static(__dirname + '/public'));

app.use( bodyParser.json() );

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', {
    open: '<%',
    close: '%>}'
    //we are using standard open/close tags, in the _.template system we use <# #>
});


app.use(cookieParser());
app.use(methodOverride());

var sess = {
    store: new RedisStore({client : app.cache.client }),
    secret: 'test',
    resave : false,
    saveUninitialized: false,
    cookie: {}
}

// if (process.env.NODE_ENV === 'production') {
//   sess.cookie.secure = true // serve secure cookies
// }


app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());





passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {

	var user = { domain : false, name: false, image: false, email: false};
	if (obj._json){
		if (obj._json.displayName) user.name = obj._json.displayName
		if (obj._json.image) user.image = obj._json.image.url
		if (obj._json.domain) user.domain = obj._json.domain	
		if (obj._json.emails) if (obj._json.emails[0]) if (obj._json.emails[0].value) user.email = obj._json.emails[0].value	
	}
	done(null, user);
});




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: (process.env.NODE_ENV==='production') ? "http://billi.nypl.org/auth/callback" : "http://localhost:5000/auth/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));






app.get('/', function(request, response) {

	
	
	//get the browse data
	var browseJson = app.cache.get('classificationsBaseLevel',function(err,data){
		response.render('pages/index', { classificationsBaseLevel: JSON.parse(data), user: request.user} );	
	});	
});



//handle content negoatiaion and forwarding to /about
app.get('/classification/:classification', function(request, response) { 
	//send to the /about page if they are asking for html
	if (request.accepts('text/html')) {
		response.redirect(303,'/classification/'+request.params.classification+'/about');
		return;
	}
	//otherwise try to accomdate their content negotation
	app.data.returnClassificationAsRows(request.params.classification,function(err,data,relatedData){
		if (data){
			if (request.accepts('text/n3') || request.accepts('text/plain')) {
				app.rdf.rows2rdf(data,"nt",function(err,results){
					response.type('text/n3');
					response.status(200).send(results);
				})
			}else if (request.accepts('application/json') || request.accepts('application/ld+json')) {
				app.rdf.rows2rdf(data,"jsonld",function(err,results){
					if (!err){
						response.type('application/ld+json');
						response.status(200).send(results);
					}else{
						response.type('application/ld+json');
						response.status(500).send("error");
					}
				})				
			}else if (request.accepts('text/turtle')) {
				app.rdf.rows2rdf(data,"turtle",function(err,results){
					response.type('text/turtle');
					response.status(200).send(results);
				})				
			}
		}else{
			response.status(404).send('Classmark not found');
		}
	});
});


app.get('/classification/:classification/:format', function(request, response) { 
	
	//is there even data
	app.data.returnClassificationAsRows(request.params.classification,function(err,data,relatedData){
		if (data){

			var format = request.params.format.toLowerCase()
			if (format==='about'){
				app.data.parseAboutPageData(data,relatedData,function(err,about){

					app.cache.get('classificationsBaseLevel',function(err,classificationsBaseLevel){
						
						if (!classificationsBaseLevel){
							classificationsBaseLevel = {};
						}else{
							classificationsBaseLevel = JSON.parse(classificationsBaseLevel);
						}
						response.render('pages/about_classification', { data: about, classificationsBaseLevel: classificationsBaseLevel, user: request.user } );
					});

				})			
			}else if(format === 'nt' || format === 'n-triples'){
				app.rdf.rows2rdf(data.concat(relatedData),"nt",function(err,results){
					response.type('text/plain');
					response.status(200).send(results);
				})
			}else if(format === 'turtle'){
				app.rdf.rows2rdf(data.concat(relatedData),"turtle",function(err,results){
					response.type('text/turtle');
					response.status(200).send(results);
				})
			}else if(format.search('json') > -1){
				app.rdf.rows2rdf(data.concat(relatedData),"jsonld",function(err,results){
					if (!err){
						response.type('application/ld+json');
						response.status(200).send(results);
					}else{
						response.type('application/ld+json');
						response.status(500).send("error");
					}
				})	
			}
		}else{
			response.status(404).send('Classmark not found');
		}	
	});
})




app.get('/classmark/:classmark/:format', function(request, response) { 



	//is there even data
	db.returnClassmark(request.params.classmark,function(err,data,relatedData){
		if (data){

			var format = request.params.format.toLowerCase()
			if (format==='about'){
				app.data.parseAboutPageData(data,relatedData,function(err,about){
					response.render('pages/about_classmark', { data: about, user: request.user } );
				})			
			}else if(format === 'nt' || format === 'n-triples'){
				rdf.rows2rdf(data.concat(relatedData),"nt",function(err,results){
					response.type('text/plain');
					response.status(200).send(results);
				})
			}else if(format === 'turtle'){
				rdf.rows2rdf(data.concat(relatedData),"turtle",function(err,results){
					response.type('text/turtle');
					response.status(200).send(results);
				})
			}else if(format.search('json') > -1){
				rdf.rows2rdf(data.concat(relatedData),"jsonld",function(err,results){
					if (!err){
						response.type('application/ld+json');
						response.status(200).send(results);
					}else{
						response.type('application/ld+json');
						response.status(500).send("error");
					}
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
					if (!err){
						response.type('application/ld+json');
						response.status(200).send(results);
					}else{
						response.type('application/ld+json');
						response.status(500).send("error");
					}
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




app.get('/api/classmark/:query', function(request, response) { 

	if (!request.params.query) request.params.query = "";
	var query = request.params.query.trim();

	requestLib('http://' + process.env.SHADOWCAT_API + "/api/classmark/" + query, function (error, res, body) {
	  	


	  if (!error && response.statusCode == 200) {
		response.setHeader('Content-Type', 'application/json');
		response.send(body);
	  }else{
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({ data : [] }));

	  }


	})



});



app.get('/api/lccrange/:query', function(request, response) { 

	if (!request.params.query) request.params.query = "";
	var query = request.params.query.trim();

	requestLib('http://' + process.env.SHADOWCAT_API + "/api/lccrange/" + query, function (error, res, body) {
	  	
	  if (!error && response.statusCode == 200) {
		response.setHeader('Content-Type', 'application/json');
		response.send(body);
	  }else{
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify({ data : [] }));
	  }
	})
});



app.get('/api/wikidata/:query', function(request, response) { 
	if (!request.params.query) request.params.query = "";
	var query = request.params.query.trim();
	requestLib('https://www.wikidata.org/w/api.php?action=wbsearchentities&search='+query+'&language=en&limit=10&format=json', function (error, res, body) {
	  

	  if (!error && response.statusCode == 200) {
		response.setHeader('Content-Type', 'application/json');
		response.send(body);
	  }else{
		response.setHeader('Content-Type', 'application/json');
		response.send('{"searchinfo":{"search":"asdfasdf"},"search":[],"success":1}');
	  }
	});
});

app.post('/api/editfirsttriple/', function(request, response) { 

	if (request.user){

		var agent = request.user.name + ' (' + request.user.email + ')';


		if (request.body.uri && request.body.predicate && request.body.value){
			app.data.returnSingleTriple(request.body.uri, request.body.predicate,function(err,triple){
				if (triple){


					app.data.updateSingleTriple(triple,request.body.predicate,request.body.value, agent, function(err,results){
						if (err){
							response.setHeader('Content-Type', 'application/json');
							response.send(JSON.stringify({success:false,error:err}) );
						}else{
							response.setHeader('Content-Type', 'application/json');
							response.send(JSON.stringify({success:true}) );
						}
					})

				}else{


					

						//there might not be a note already to edit, if not create a tempoary triple for it
						var triple = { subject: request.body.uri }
						app.data.updateSingleTriple(triple,request.body.predicate,request.body.value, agent, function(err,results){
							if (err){
								response.setHeader('Content-Type', 'application/json');
								response.send(JSON.stringify({success:false,error:err}) );
							}else{
								response.setHeader('Content-Type', 'application/json');
								response.send(JSON.stringify({success:true}) );
							}
						})
				


				}

			})
		}else{
			response.setHeader('Content-Type', 'application/json');
			response.send('{"success":false,"error":"Not all required paramaters provided."}');
		}
	}else{
		response.status(500).send("Not Logged In");
	}
});






app.get('/login', function(request, response) { 

    passport.authenticate("google",
    {
        scope:
        [
            "email",
        ],
        state: new Buffer(JSON.stringify({referrer: request.get('Referrer')})).toString('base64')

    })(request, response);



});


app.get('/auth/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),

  function(request, response) {
  	//if they used a non nypl domain

  	
  	if (request.user){
  		if (request.user._json.domain === 'nypl.org' || request.user._json.domain === 'bookops.org'){

  			var ref ="/";

  			if (request.query.state){
  				ref = JSON.parse(new Buffer(request.query.state, 'base64').toString('ascii'));
  				ref = ref.referrer
  			}
  			response.redirect(ref);
  			return true;
  		}
  	}
  	response.redirect('/nonstafflogin');    
  });


app.get('/nonstafflogin', function(request, response){
	request.logout();
	response.render('pages/non_staff_login', { user: request.user } );	
});


app.get('/logout', function(request, response){
	request.logout();
	response.redirect('/');
});

app.get('/image/:classmark', function(request, response, next) {
	app.db.argQuery('select * from images where subject = ($1) limit 1', [request.params.classmark],function(err, data) {
		data = data.rows
		if (err || data.length == 0){
			response.status(404).send("Image not found");
		}else{
			response.writeHead(200, {'Content-Type': 'image/jpeg' });
			response.end(data[0].image, 'binary');
		}
	});
});


app.get('/connect/:classmark/to/:wikiEntity', function(request, response, next) {
	
	if (request.user){
		
		var agent = request.user.name + ' (' + request.user.email + ')';


		if (request.params.wikiEntity === 'null'){

			app.wiki.setToNull(request.params.classmark, agent,function(err,results){

				if (err){
					response.status(500).send("Problems! " + err);
				}else{
					response.redirect(request.get('Referrer')); 
				}
				
			});

		}else{

			app.wiki.process(request.params.classmark,request.params.wikiEntity, agent,function(err,results){
				if (err){
					response.status(500).send("Problems! " + err);
				}else{
					response.redirect(request.get('Referrer')); 
				}
			}, request.query.smallthumb )
			
		}


	}else{
		response.status(401).send("You are not logged in.");
	}


});

app.get('/disconnect/:classmark/from/wiki', function(request, response, next) {	
	if (request.user){		
		var agent = request.user.name + ' (' + request.user.email + ')';
		app.wiki.disconnect(request.params.classmark, agent,function(err,results){
			if (err){
				response.status(500).send("Problems! " + err);
			}else{
				response.redirect(request.get('Referrer')); 
			}
		})
	}else{
		response.status(401).send("You are not logged in.");
	}
});



app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


