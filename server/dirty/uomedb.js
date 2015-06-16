var db = require('dirty')('uome.db');

db.on('load', function() {
  db.forEach(function(key, val) {
    console.log('Found key: %s, val: %j', key, val);
    // db.rm(key);
    // console.log("deleting");
  });
  db.set("transactions", []);
});

db.on('drain', function() {
  console.log('All records are saved on disk now.');
});

var http = require('http');

var server = http.createServer(function(req, res) {
  var data;
  if (req.method === "GET") {
    if (req.url === "/transactions") {
      data = db.get("transactions");
    } else if (req.url === "/users") {
      data = db[req.username];
    }
  }
  if (req.method === "POST") {
    var uploadedData = '';
    req.on('data', function(chunk) {
        uploadedData += chunk;
      })
      .on('end', function() {
        uploadedData = JSON.parse(uploadedData);
        if (req.url === "/transactions") {
          var newTransaction = uploadedData;
          var transactionArray = db.get("transactions");
          transactionArray.push(newTransaction);
          db.set("transactions", transactionArray);
        }
      });
  }

  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    "access-control-allow-methods": "GET, POST",
    "Access-Control-Allow-Headers": "content-type, accept",
    "Access-Control-Max-Age": 10 // Seconds.
  });
  data = JSON.stringify(data);
  res.end(data);
}).listen(3000);
