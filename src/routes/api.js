import express from "express";

const api = connection => {
  const router = express.Router();

  router.post("/", (req, res) => {
    const data = req.body;

    // Sanity check
    if (data == undefined || data.url == undefined || data.name == undefined) {
      res.status(400).send("Bad request format");
      return;
    }

    const sql = `INSERT INTO tb_jamquery (name, url) VALUES (?, ?)`;
    connection.query(sql, [data.name, data.url], function(
      err,
      results,
      fields
    ) {
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
      `SELECT * FROM tb_jamquery WHERE name LIKE '%${keyword}%' ORDER BY updated DESC`,
      (err, rows) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  });

  return router;
};

export default api;
