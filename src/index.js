import express from "express";
import mysql from "mysql";
import fs from "fs";
import path from "path";

// Setup express
const app = express();

// Setup mysql database
// dbconfig.json에 설정 정보를 입력해야 함.
const raw = fs.readFileSync(path.join(__dirname, "../config", "dbconfig.json"));
const dbconfig = JSON.parse(raw);
const connection = mysql.createConnection({
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database
});

connection.connect();

// 2. Setup rules (middlewares)
const router = express.Router();

const makeRawResponse = (...responses) => {
  var ret = "";
  for (var i = 0; i < responses.length; i++) {
    ret += responses[i];
    if (i != responses.length - 1) {
      ret += "\n";
    }
  }
  return ret;
};

const renderLink = (name, link) => {
  return '<li><a href="' + link + '">' + name + "</a></li>";
};

router.get("/", (req, res) => {
  var response = makeRawResponse(
    "Welcome to Jamquery!",
    "We have no landing page yet.",
    "/{keyword} for search",
    "/+{keyword} for add new link."
  );

  res.send(response);
});

router.get("/:keyword", (req, res) => {
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
    (err, rows) => {
      if (err) throw err;

      var links = rows.map(row => renderLink(row.name, row.url)).join("\n");

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
var server = app.listen(3000, () => {
  console.log("Express server has started on port " + 3000);
});
