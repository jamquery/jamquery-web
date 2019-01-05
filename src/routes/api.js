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

  const getJamquery = keyword =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT j.name, j.content, j.created, t.name as tag
          FROM tb_jamquery j
          JOIN tb_jamquery_tag_relation rel ON rel.jamquery_id = j.id
          JOIN tb_tag t ON rel.tag_id = t.id
          WHERE j.name LIKE ? OR t.name LIKE ?
          ORDER BY j.created DESC`,
        [`%${keyword}%`, `%${keyword}%`],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

  const groupTags = rows => {
    const map = new Map();
    rows.forEach(row => {
      let key = row.name;
      if (map[key] == undefined) {
        map[key] = {
          name: row.name,
          content: row.content,
          created: row.created,
          tags: [row.tag]
        };
      } else {
        map[key].tags.push(row.tag);
      }
    });
    return Object.values(map);
  };

  // TOOD: Levensthein algorithm
  router.get("/:keyword", (req, res) => {
    var keyword = req.params.keyword;

    getJamquery(keyword)
      .then(rows => {
        res.json(groupTags(rows));
      })
      .catch(error => {
        console.error(error);
      });
  });

  return router;
};

export default api;
