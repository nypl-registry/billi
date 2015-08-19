"use strict";


(function() {






	var billi = {


		//searching 
		//See if we are on the search home page
		bindSearch: function(){

			var self = this;

			var searchTimeout = null;

			var searchEl = document.getElementById('search-input');

			if (searchEl){
				searchEl.addEventListener('keyup', function(e) {

				    if (searchTimeout) window.clearTimeout(searchTimeout);
				    
				    if ( e.keyCode === 27){
						searchEl.value = "";
						document.getElementById('search-results').innerHTML = "";
						return false;
					}

				    searchTimeout = window.setTimeout(function(){
				    	if (searchEl.value.length<3) return false;				    	
				    	self.search(searchEl.value);
				    },100)





				}); 

			
			}


		},

		search: function(query){


			var self = this;

			var request = new XMLHttpRequest();
			request.open('GET', '/api/search/' + query, true);

			request.onload = function() {
			  if (request.status >= 200 && request.status < 400) {
			    // Success!
			    var data = JSON.parse(request.responseText);

			    var template = _.template(self.searchTemplate);

			    self.searchResults.innerHTML = template({items: data.data });



			  } else {
			    // We reached our target server, but it returned an error

			  }
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			};

			request.send();





		}



	}




	document.addEventListener("DOMContentLoaded", function() {
	  
	  billi.searchTemplate = document.getElementById("search-results-template").innerHTML,
	  billi.searchResults = document.getElementById("search-results")
	  billi.bindSearch();


	});




})();