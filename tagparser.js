import database from "./src/database";

const connection = database();

const sql = `select * from tb_jamquery`;
const map = {};
const nameMap = {};

const printMap = () => {
    console.log(map);
}

const parseRow = (row) => {
    const tags = [];
    var name = row.name;

    while (true) {
        let startIndex = name.indexOf("[") + 1;
        let endIndex = name.indexOf("]", startIndex);
        
        if (endIndex === -1) {
            break;
        }

        let tag = name.slice(startIndex, endIndex);
        name = name.slice(endIndex + 1).trim();
        tags.push(tag);
    }

    map[row.id] = tags;
    nameMap[row.id] = name;
    console.log(`Tags for "${name}"`);
    console.log(`[${tags}]`);
};

connection.query(sql, (err, rows, fields) => {
    rows.forEach(parseRow);
    Object.keys(map).forEach(key => {
        let tags = map[key];
        let newName = nameMap[key];
        if (tags.length > 0) {
            tags.forEach(tag => {
                connection.query(`INSERT IGNORE INTO tb_tag (name) VALUES (?)`,
                    [tag],
                    (err, results, fields) => {
                        if (err) {
                            console.error(`Error while insert tag ${tag}. abort.`);
                            process.exit(1);
                        }

                        if (results.insertId === 0) {
                            console.log(`tag ${tag} already exists. insertion ignored.`);
                        } else {
                            console.log(`tag ${tag} inserted as id ${results.insertId}`);
                        }

                        connection.query(`SELECT id FROM tb_tag WHERE name=?`, [tag], (err, rows, fields) => {
                            let tagId = rows[0].id;

                            connection.query(`INSERT IGNORE INTO tb_jamquery_tag_relation (jamquery_id, tag_id) VALUES (?, ?)`,
                                [key, tagId],
                                (err, results, fields) => {
                                    if (err) {
                                        console.error(`Error while insert relation jamquery:${key} - tag:${tagId}. abort.`);
                                        process.exit(1);
                                    }

                                    console.log(`Sucessfully inserted relation jamquery:${key} - tag:${tagId}.`);
                                }
                            );

                            connection.query(`UPDATE tb_jamquery SET content=? WHERE id=?`,
                                [newName, key],
                                (err, results, fields) => {
                                    console.log(results);
                                }
                            );
                        });
                    }
                );
            });
        }
    });
});
