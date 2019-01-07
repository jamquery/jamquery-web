import express from "express";

const api = connection => {
  const router = express.Router();

  const beginTransaction = () =>
    new Promise((resolve, reject) => {
      connection.beginTransaction(err => {
        if (err) reject(err);
        else resolve();
      });
    });

  const rollback = () =>
    new Promise((resolve, reject) => {
      connection.rollback(err => {
        if (err) reject(err);
        else resolve();
      });
    });

  const commit = () =>
    new Promise((resolve, reject) => {
      connection.commit(err => {
        if (err) reject(err);
        else resolve();
      });
    });

  const parseName = name => {
    let tags = [];

    while (true) {
      let startIndex = name.indexOf("[") + 1;
      let endIndex = name.indexOf("]", startIndex);
      if (endIndex === -1) {
        break;
      }

      let tag = name.slice(startIndex, endIndex).toLowerCase();
      name = name.slice(endIndex + 1).trim();
      tags.push(tag);
    }

    return {
      tags,
      name
    };
  };

  const findTag = tag =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM tb_tag WHERE tb_tag.name = ?`,
        [tag],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

  // Add new tag. Returns the id of inserted row.
  const addTag = tag =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO tb_tag (name) VALUES (?)`,
        [tag],
        (err, results, fields) => {
          if (err) reject(err);
          else resolve(results.insertId);
        }
      );
    });

  const createJamqueryTagRelation = (jamqueryId, tagId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO tb_jamquery_tag_relation (jamquery_id, tag_id) VALUES (?, ?)`,
        [jamqueryId, tagId],
        (err, results, fields) => {
          if (err) reject(err);
          else resolve(results.insertId);
        }
      );
    });

  // Add new jamquery. Returns the id of inserted row.
  const addJamquery = (name, content) =>
    new Promise((resolve, reject) => {
      const sql = `INSERT INTO tb_jamquery (name, content) VALUES (?, ?)`;
      connection.query(sql, [name, content], (err, results, fields) => {
        if (err) reject(err);
        else resolve(results.insertId);
      });
    });

  router.post("/", (req, res) => {
    let data = req.body;

    // Sanity check
    if (data == undefined || data.url == undefined || data.name == undefined) {
      res.status(400).send("Bad request format");
      return;
    }

    let parsedData = parseName(data.name);

    beginTransaction()
      .then(() => {
        return addJamquery(parsedData.name, data.url);
      })
      .then(jamqueryId => {
        return Promise.all(
          parsedData.tags.map(tag => {
            return findTag(tag)
              .then(rows => {
                if (rows.length > 0) {
                  return rows[0].id;
                } else {
                  return addTag(tag);
                }
              })
              .then(tagId => {
                return createJamqueryTagRelation(jamqueryId, tagId);
              });
          })
        ).then(relationIds => {
          res.json({
            id: jamqueryId
          });
          return commit();
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Internal Error");
        return rollback();
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
        res.status(500).send("Internal Error");
      });
  });

  return router;
};

export default api;
