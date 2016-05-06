# billi

[![Build Status](https://travis-ci.org/nypl-registry/billi.svg?branch=master)](https://travis-ci.org/nypl-registry/billi)

## http://billi.nypl.org/

A Express application desgined to run on Heroku. Data payload in /data is ingested on deployment if the tables are empty. Builds a triple like store in the postgres database. Uses redis for google auth.

### lib/cache.js
Redis inilization

### lib/data.js
Methods to construct API responses

### lib/db.js
Interact with the db and translate the rows into triples

### lib/rdf.js
Converts the rows to RDF serializations

### lib/wiki.js
Talks to wikidata and dbpedia for staff enrichment of classmarks

