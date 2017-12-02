var async = require("async"),
  request = require("request"),
  _ = require("lodash"),
  elasticsearch = require('elasticsearch'),
  constants = require('./constants');

var es_host = constants.ES_HOST;

var client = new elasticsearch.Client({
  host: es_host,
  // log: 'trace'
});

function main() {

  var es_index = "test";
  var es_index_type = "test_type";

  function es_search(es_query, search_name) {
    client
      .search({
        index: es_index,
        type: es_index_type,
        body: es_query
      }, function (err, resp, status) {
        if (err) {
          console.log("error", err)
        } else {
          console.log("Result@" + search_name + ":", resp.hits.hits);
        }
      });
  }

  // 1. Age: > 25 & < 30
  var es_age_query = {
    "query": {
      "bool": {
        "must": [
          {
            "range": {
              "age": {
                "gt": 25,
                "lt": 30
              }
            }
          }
        ]
      }
    },
    "from": 0,
    "size": 1000
  };

  es_search(es_age_query, 'age');

  // 2. Name: Sanjeet
  var user_name = "Sanjeet"
  var es_name_query = {
    "query": {
      "bool": {
        "must": [
          {
            "term": {
              "name.keyword": user_name
            }
          }
        ]
      }
    },
    "from": 0,
    "size": 1000
  };

  es_search(es_name_query, 'name');

  // 3. Match all
  var es_match_all_query = {
    "query": {
      "bool": {
        "must": [
          {
            "match_all": {}
          }
        ]
      }
    },
    "from": 0,
    "size": 1000
  };

  es_search(es_match_all_query, 'matchAll');

}

main();

console.log("Searching!");
