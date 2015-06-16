var db = require('dirty')('uome.db');

db.on('load', function() {
  // db.count = 0;
  // db.get('/',
  //   function(req, res) {
  //     if (!req.session) { //if (true) {//
  //       res.redirect("/login");
  //     } else {
  //       console.log("----------------------->>>");
  //       console.log(req.session);
  //       res.render('index');
  //     }//   });
  // db.set('/',
  //   function(req, res) {
  //     console.log("test");
  //     console.log(req, res);
  //     var type = req.body.type;
  //   });

  // db.forEach(function(key, val) {
  //   console.log('Found key: %s, val: %j', key, val);
  //   // db.rm(key);
  //   // console.log("deleting");
  // });

  db.set("transactions", []);

  var testMessage = {
    message: "walked the dog",
    user: "butch",
    created_at: new Date(),
    points: 50,
    hidden: false
  };

  var testArray = db.get("transactions");
  console.log("before");
  console.log(testArray);
  testArray.push(testMessage);
  console.log("after");
  for (var i = 0; i < testArray.length; i++) {
    console.log(testArray[i]);
  }
  db.set("transactions", testArray);

});

db.on('drain', function() {
  console.log('All records are saved on disk now.');
});

var http = require('http');

var server = http.createServer(function(req, res) {
  console.log("request");
  var data;
  if (req.method === "GET") {
    if (req.url === "/transactions") {
      console.log("getting");
      data = db.get("transactions");
    } else if (req.url === "/users") {
      data = db[req.username];
    }
  }
  if (req.method === "POST") {
    console.log(req.url);
    if (req.url === "/transactions") {
      console.log("post to transactions");
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxx")
      console.log(req.body);
      console.log(req.data);
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxx")
        // for (key in req) {
        //   console.log(key)
        // }
        // console.log(req.data);
      var newTransaction = req.data;
      var transactionArray = db.get("transactions");
      transactionArray.push(newTransaction);
      db.set("transactions", transactionArray);
    }
  }
  // if get posts, look for an index number and then count to the end
  // if get user, look for a key and send it back

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, accept",
    "Access-Control-Max-Age": 10 // Seconds.
  });
  data = JSON.stringify(data);
  res.end(data);
}).listen(3000);
