const query = require("../utils/db-query");

async function ensureColumn(tableName, columnName, definition) {
  const rows = await query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [tableName, columnName]
  );

  if (rows.length === 0) {
    await query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function ensureForeignKey(constraintName, sql) {
  const rows = await query(
    `
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND CONSTRAINT_NAME = ?
    `,
    [constraintName]
  );

  if (rows.length === 0) {
    await query(sql);
  }
}

async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      token_version INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'PLANNING',
      start_date DATE,
      end_date DATE,
      budget DECIMAL(12, 2) DEFAULT 0,
      team_lead VARCHAR(100),
      tags TEXT,
      color VARCHAR(20),
      user_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_projects_user_id
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

  await ensureColumn("projects", "user_id", "INT NULL");
  await ensureForeignKey(
    "fk_projects_user_id",
    `
      ALTER TABLE projects
      ADD CONSTRAINT fk_projects_user_id
      FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
    `
  );
}

module.exports = initDatabase;
