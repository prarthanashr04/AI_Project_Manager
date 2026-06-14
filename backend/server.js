const express = require("express");
const db = require("./database/db");
const app = express();
app.use(express.json());
// app.get("/projects", (req, res) => {
//   const projects = [
//     {
//       id: 1,
//       name: "AI Project Manager",
//       description:
//         "Modern Angular 21 project management application with real-time collaboration",
//       status: "ACTIVE",
//       startDate: new Date("2026-01-15"),
//       endDate: new Date("2026-12-31"),
//       budget: 50000,
//       teamLead: "John Doe",
//       tags: ["Angular", "TypeScript", "Dashboard"],
//       color: "#3b82f6",
//     },
//     {
//       id: 2,
//       name: "E-Commerce Dashboard",
//       description:
//         "Admin dashboard for e-commerce platform with analytics and reporting",
//       status: "ACTIVE",
//       startDate: new Date("2026-02-01"),
//       endDate: new Date("2026-11-30"),
//       budget: 75000,
//       teamLead: "Jane Smith",
//       tags: ["E-Commerce", "Analytics", "Dashboard"],
//       color: "#8b5cf6",
//     },
//     {
//       id: 3,
//       name: "Chat Application",
//       description:
//         "Realtime messaging app with WebSocket integration and notifications",
//       status: "PLANNING",
//       startDate: new Date("2026-03-01"),
//       endDate: new Date("2026-09-30"),
//       budget: 35000,
//       teamLead: "Alice Johnson",
//       tags: ["WebSocket", "Real-time", "Chat"],
//       color: "#ec4899",
//     },
//   ];
//   res.json(projects);
// });

app.get("/projects", (req, res) => {
  const sql = "SELECT * FROM projects";

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }
    res.json(result);
  });
});

app.post("/projects", (req, res) => {
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
    "INSERT INTO projects(name,description,status,start_date,end_date,budget,team_lead,tags,color) VALUES (?,?,?,?,?,?,?,?,?)";
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

app.put("/projects/:id", (req, res) => {
  let id = req.params.id;
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
    "UPDATE projects SET name=?, description=?, status=?, start_date=?, end_date=?, budget=?, team_lead=?, tags=?, color=? WHERE id=?";
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
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }
    res.status(201).json({
      message: "Project Updated Successfully",
    });
  });
});

app.delete("/projects/:id", (req, res) => {
  let id = req.params.id;
  const sql = "DELETE FROM projects WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: err.message,
      });
    }
    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Project Not Found",
      });
    }
    res.status(200).json({
      message: "Project Deleted Successfully",
    });
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
