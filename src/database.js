import mysql from "mysql";

export default () => {
  // Setup mysql database
  // dbconfig.json에 설정 정보를 입력해야 함.
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

  return connection;
};
