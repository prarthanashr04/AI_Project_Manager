const db = require("../database/db");

function query(sql, values = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

module.exports = query;
