const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SQLrootpassword",
  database: "project_management",
});

connection.connect((err) => {
  if (err) {
    console.error("Connection failed:" + err);
    return;
  }
  console.log("MySqL Connected Successfully");
});
module.exports = connection;
