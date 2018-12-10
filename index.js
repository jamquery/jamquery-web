// 1. Get ready
var express = require("express");
var app = express();

// 2. Setup rules (middlewares)
var router = express.Router();

router.get("/", function(req, res) {
  response =
    "Welcome to Jamquery!\n" +
    "We have no landing page yet.\n" +
    "/{keyword} for search\n" +
    "/+{keyword} for add new link.";

  res.send(response);
});

function renderLink(name, link) {
  return '<a href="' + link + '">' + name + '</a>';
}

router.get("/:keyword", function(req, res) {
  var keyword = req.params.keyword;

  console.log(
    "Incomming request from [" +
      req.hostname +
      "] for keyword [" +
      keyword +
      "]"
  );

  // res.send(renderLink("Google", "https://www.google.com/"))
  res.send("You requested for keyword [" + keyword + "]");
});

// mount the router on the app
app.use("/", router);

// 3. Listening to requests
var args = process.argv;
if (args.length > 2) {
  port = parseInt(args[2]);
} else {
  port = 3000;
}

var server = app.listen(port, function() {
  console.log("Express server has started on port " + port);
});
