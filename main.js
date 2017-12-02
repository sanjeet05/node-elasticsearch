var async = require("async"),
    request = require("request"),
    _ = require("lodash"),
    elasticsearch = require('elasticsearch');

var es_host = "http://localhost:9200/";

var client = new elasticsearch.Client({
  host: es_host,
  // log: 'trace'
});

var data = [
  {"name": "Ramanan", "age": 28}, 
  {"name": "Sanjeet", "age": 35}
];


function main() {  
  
  var es_index = "test";
  var es_index_type = "test_type";

  async.series([
    // Delete Index if already exists
    function(deleteCallback) {
        client.indices.delete({
          index: es_index,
          ignore: [404]
        }).then(function (body) {
          // since we told the client to ignore 404 errors, the
          // promise is resolved even if the index does not exist
          console.log('index was deleted or never existed');
          deleteCallback(null);
        }, function (error) {
          // oh no!
          deleteCallback('error');
        });        
    },

    // Create Index
    function(createCallback) {
      // create mappings
      var es_mappings = {"mappings": {}};
      es_mappings.mappings[es_index_type] = {
        "properties": {
          "name": {"type": "text",                 
                    "fields": {
                      "keyword": {
                      "ignore_above": 256,
                      "type": "keyword"
                      }
                    }
                  }, 
          "age": {"type": "long"}        
        }
      };

      client.indices.create({
        index: es_index,
        body: es_mappings,
        ignore: [404]
      }).then(function (body) {
        // since we told the client to ignore 404 errors, the
        // promise is resolved even if the index does not exist
         console.log('index is created!');
         createCallback(null);
      }, function (error) {
        // oh no!
        createCallback('error');
      });
    },

    // Save doc to Index
    function(saveCallback) {
        // client.index({
        //   index: es_index,
        //   type: es_index_type,        
        //   body: data[0]
        // }, function (error, response) {
        //   console.log('response', response);
        //   saveCallback(null);
        // });

        async.eachSeries(data, function(thisItem, saveInnerCallback) {

          client.index({
            index: es_index,
            type: es_index_type,        
            body: thisItem
          }, function (error, response) {
            console.log('response', response);
            saveInnerCallback(null);
          });
        }, function(err) {
            // if any of the doc processing produced an error, err would equal that error
            if( err ) {
              // One of the iterations produced an error.
              // All processing will now stop.
              console.log('A doc failed to process');
              saveCallback('error');
            } else {
              console.log('All doc have been processed successfully');
              saveCallback(null);
            }
        });
    }
  ],

  // optional callback
  function(err, results) {    
    // results is now equal to ['one', 'two']
    if(err){
      console.log("Error in async", err);
    }else{
      console.log("All is well!");
    }
  });

}

main();

console.log("Hello Test!");


// python code

// import requests
// import json

// data = [{"name": "Ramanan", "age": 28}, {"name": "Sanjeet", "age": 35}]

// es_host = "http://localhost:9200"
// es_index = "test"
// es_index_type = "test_type"


// def python_requests(request_method, url, data=None, timeout=None, headers=None, auth=None):
//     return requests.request(method=request_method, url=url, data=data, timeout=timeout, headers=headers, auth=auth)


// # Delete if already exists
// python_requests("DELETE", es_host + "/" + es_index)

// # Create & put mapping
// mappings = {"mappings": {es_index_type: {"properties": {"name": {"type": "text", "fields": {"keyword": {
//     "ignore_above": 256, "type": "keyword"}}, "age": {"type": "long"}}}}}}
// # http://localhost:9200/test
// python_requests("PUT", es_host + "/" + es_index, data=json.dumps(mappings))

// # Index data
// for i in data:
//     # http://localhost:9200/test/test_type
//     python_requests("POST", es_host + "/" + es_index + "/" + es_index_type,
//                     headers={"Content-Type": "application/json"},
//                     data=json.dumps(i))

// # Query data
// search_uri = es_host + "/" + es_index + "/" + es_index_type + "/_search"

// # 1. Age: > 25 & < 30
// query = {"query": {"bool": {"must": [{"range": {"age": {"gt": 25, "lt": 30}}}]}}, "from": 0, "size": 1000}
// print(python_requests("POST", search_uri, data=json.dumps(query)).text)

// # 2. Name: Sanjeet
// query = {"query": {"bool": {"must": [{"term": {"name.keyword": "Sanjeet"}}]}}, "from": 0, "size": 1000}
// print(python_requests("POST", search_uri, data=json.dumps(query)).text)

// # 3. Match all
// query = {"query": {"bool": {"must": [{"match_all": {}}]}}, "from": 0, "size": 1000}
// print(python_requests("POST", search_uri, data=json.dumps(query)).text)

