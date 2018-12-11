import express from "express";
import mysql from "mysql";
import fs from "fs";
import path from "path";
import helmet from "helmet";

// Setup express
const app = express();

// Setup mysql database
// dbconfig.json에 설정 정보를 입력해야 함.
const raw = fs.readFileSync(path.join(__dirname, "../config", "dbconfig.json"));
const dbconfig = JSON.parse(raw);
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME
});

// Establishing connection
connection.connect(err => {
  if (err) {
    console.error("Error connecting to mysql: " + err.stack);
    return;
  }

  console.log("Connected to mysql as id " + connection.threadId);
});

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
    "We have no landing page yet."
  );

  res.send(response);
});

router.post("/", (req, res) => {
  const data = req.body;

  // Sanity check
  if (data == undefined || data.url == undefined || data.name == undefined) {
    res.status(400).send("Bad request format");
    return;
  }

  const sql = `INSERT INTO tb_jamquery (name, url) VALUES (?, ?)`;
  connection.query(sql, [data.name, data.url], function(err, results, fields) {
    if (err) {
      console.error("Error occurred while performing the query: " + sql);
      res.status(500).send("Internal Error occured");
      return;
    }

    res.json({
      id: results.insertId
    });
  });
});

// TOOD: Levensthein algorithm
router.get("/:keyword", (req, res) => {
  var keyword = req.params.keyword;

  connection.query(
    "SELECT * FROM tb_jamquery WHERE name LIKE '%" + keyword + "%'",
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

app.use(helmet());

app.use(function(err, req, res, next) {
  // Do logging and user-friendly error message display
  console.error(err.stack);
  res.status(500).send("internal server error");
});

app.use(express.json());

// mount the router on the app
app.use("/", router);

// Listening to requests
var server = app.listen(3000, () => {
  console.log("Express server has started on port " + 3000);
});
