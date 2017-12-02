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

var data = constants.USER_LIST;

function main() {

  var es_index = "test";
  var es_index_type = "test_type";

  async.series([
    // Delete Index if already exists
    function (deleteCallback) {
      client
        .indices
        .delete({index: es_index, ignore: [404]})
        .then(function (body) {
          // since we told the client to ignore 404 errors, the promise is resolved even
          // if the index does not exist
          console.log('index was deleted or never existed');
          deleteCallback(null);
        }, function (error) {
          // oh no!
          deleteCallback('error');
        });
    },

    // Create Index
    function (createCallback) {
      // create mappings
      var es_mappings = {
        "mappings": {}
      };
      es_mappings.mappings[es_index_type] = {
        "properties": {
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "ignore_above": 256,
                "type": "keyword"
              }
            }
          },
          "age": {
            "type": "long"
          }
        }
      };

      client
        .indices
        .create({index: es_index, body: es_mappings, ignore: [404]})
        .then(function (body) {
          // since we told the client to ignore 404 errors, the promise is resolved even
          // if the index does not exist
          console.log('index is created!');
          createCallback(null);
        }, function (error) {
          // oh no!
          createCallback('error');
        });
    },

    // Save doc to Index
    function (saveCallback) {
      // client.index({   index: es_index,   type: es_index_type,   body: data[0] },
      // function (error, response) {   console.log('response', response);
      // saveCallback(null); });

      async
        .eachSeries(data, function (thisItem, saveInnerCallback) {

          client
            .index({
              index: es_index,
              type: es_index_type,
              body: thisItem
            }, function (error, response) {
              console.log('response', response);
              saveInnerCallback(null);
            });
        }, function (err) {
          // if any of the doc processing produced an error, err would equal that error
          if (err) {
            // One of the iterations produced an error. All processing will now stop.
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
  function (err, results) {
    // results is now equal to ['one', 'two']
    if (err) {
      console.log("Error in async", err);
    } else {
      console.log("All is well!");
    }
  });

}

main();

console.log("Node Elasticsearch!");
