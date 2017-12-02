var async = require("async"),
    request = require("request"),
    _ = require("lodash"),
    elasticsearch = require('elasticsearch');

var es_host = "http://localhost:9200/";

var client = new elasticsearch.Client({
  host: es_host,
  // log: 'trace'
});


function main() {  
  
  var es_index = "test";
  var es_index_type = "test_type";

  
  // 1. Age: > 25 & < 30  
  
  var es_query = {
    "query": {
        "bool": {
          "must": [
            {"range": {"age": {"gt": 25, "lt": 30} } }
          ]
        }
      }, 
      "from": 0, "size": 1000
    };

  client.search({
      index : es_index,
      type : es_index_type,
      body : es_query
    },function(err, resp, status){
      if(err){
        console.log("error",err)
      }
      else{
        console.log("Result: ", resp.hits.hits);      
      }
    });

}

main();

console.log("Search!");


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

