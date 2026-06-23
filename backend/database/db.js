const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "SQLrootpassword",
  database: process.env.DB_NAME || "project_management",
});

connection.connect((err) => {
  if (err) {
    console.error("Connection failed:" + err);
    return;
  }
  console.log("MySqL Connected Successfully");
});
module.exports = connection;
