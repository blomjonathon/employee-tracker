const figlet = require("figlet");
const Table = require("cli-table");
const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "jonathon123",
    database: "departments_db",
  },
  console.log(`Connected to the departments_db database.`)
);

async function viewAllDepartments() {
  try {
    const departmenTable = new Table({});

    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM department", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    results.forEach((department) => {
      departmenTable.push([department.id, department.name]);
    });
    console.log(departmenTable.toString());
  } catch (error) {
    console.error(error);
  }
}

async function viewAllRoles() {
  try {
    const rollTable = new Table({});

    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM role", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    results.forEach((role) => {
      rollTable.push([
        role.id,
        role.title,
        role.salary,
        role.department_id,
      ]);
    });
    console.log(rollTable.toString());
  } catch (error) {
    console.error(error);
  }
}

app.use((req, res) => {
  res.status(404).end();
});

inquirer
  .prompt([
    {
      type: "list",
      name: "selection",
      message: "What would you like to do?",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
      ],
    },
  ])
  .then((response) => {
    if (response.selection == "view all departments") {
      viewAllDepartments();
    } else if (response.selection == "view all roles") {
      viewAllRoles();
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Error processing selection");
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// function createGraphic() {
//   figlet("Employee", "Doom", function (err, data) {
//     if (err) {
//       console.log("Something went wrong...");
//       console.dir(err);
//       return;
//     }
//     console.log(data);
//   });
//   figlet("Manager", "Doom", function (err, data) {
//     if (err) {
//       console.log("Something went wrong...");
//       console.dir(err);
//       return;
//     }
//     console.log(data);
//   });
// }

// createGraphic()
