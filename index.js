// Setup express
var express = require("express");
var app = express();

// Setup mysql database
// dbconfig.json에 설정 정보를 입력해야 함.
var mysql = require("mysql");
var dbconfig = require("./dbconfig.json");

var connection = mysql.createConnection({
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database
});

connection.connect();

// 2. Setup rules (middlewares)
var router = express.Router();

function makeRawResponse() {
  var ret = "";
  for (var i = 0; i < arguments.length; i++) {
    ret += arguments[i];
    if (i != arguments.length - 1) {
      ret += "\n";
    }
  }
  return ret;
}

function renderLink(name, link) {
  return '<li><a href="' + link + '">' + name + "</a></li>";
}

router.get("/", function(req, res) {
  response = makeRawResponse(
    "Welcome to Jamquery!\n",
    "We have no landing page yet.\n",
    "/{keyword} for search\n",
    "/+{keyword} for add new link."
  );

  res.send(response);
});

router.get("/:keyword", function(req, res) {
  var keyword = req.params.keyword;

  console.log(
    "Incomming request from [" +
      req.hostname +
      "] for keyword [" +
      keyword +
      "]"
  );

  connection.query(
    "SELECT * FROM tb_jamquery WHERE name LIKE '%" + keyword + "%'",
    function(err, rows) {
      if (err) throw err;

      links = rows
        .map(function(row) {
          return renderLink(row.name, row.url);
        })
        .join("\n");

      links = "<ol>" + links + "</ol>";

      var response = makeRawResponse(
        "<p>You requested for keyword [" + keyword + "]</p>",
        links
      );

      res.send(response);
    }
  );
});

// mount the router on the app
app.use("/", router);

// Listening to requests
var args = process.argv;
if (args.length > 2) {
  port = parseInt(args[2]);
} else {
  port = 3000;
}

var server = app.listen(port, function() {
  console.log("Express server has started on port " + port);
});
