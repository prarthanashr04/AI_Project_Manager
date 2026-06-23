const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./database/db");
const initDatabase = require("./database/init");
const authRoutes = require("./routes/auth.routes");
const requireAuth = require("./middleware/auth.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:4200",
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/auth", authRoutes);

app.get("/projects", requireAuth, (req, res) => {
  const sql = "SELECT * FROM projects WHERE user_id = ?";

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json(result);
  });
});

app.post("/projects", requireAuth, (req, res) => {
  const {
    name,
    description,
    status,
    startDate,
    endDate,
    budget,
    teamLead,
    tags,
    color,
  } = req.body;

  const sql =
    "INSERT INTO projects(name,description,status,start_date,end_date,budget,team_lead,tags,color,user_id) VALUES (?,?,?,?,?,?,?,?,?,?)";
  const values = [
    name,
    description,
    status,
    startDate,
    endDate,
    budget,
    teamLead,
    Array.isArray(tags) ? tags.join(",") : tags,
    color,
    req.user.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.status(201).json({
      message: "Project Created Successfully",
      projectId: result.insertId,
    });
  });
});

app.put("/projects/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  const {
    name,
    description,
    status,
    startDate,
    endDate,
    budget,
    teamLead,
    tags,
    color,
  } = req.body;

  const sql =
    "UPDATE projects SET name=?, description=?, status=?, start_date=?, end_date=?, budget=?, team_lead=?, tags=?, color=? WHERE id=? AND user_id=?";
  const values = [
    name,
    description,
    status,
    startDate,
    endDate,
    budget,
    teamLead,
    Array.isArray(tags) ? tags.join(",") : tags,
    color,
    id,
    req.user.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }

    res.status(200).json({
      message: "Project Updated Successfully",
    });
  });
});

app.delete("/projects/:id", requireAuth, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM projects WHERE id=? AND user_id=?";

  db.query(sql, [id, req.user.id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }

    res.status(200).json({
      message: "Project Deleted Successfully",
    });
  });
});

initDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
