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
    const departmentTable = new Table({});

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
      departmentTable.push([department.id, department.name]);
    });
    console.log(departmentTable.toString());
    prompt();
  } catch (error) {
    console.error(error);
  }
}
async function viewAllRoles() {
  try {
    const roleTable = new Table({});

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
      roleTable.push([role.id, role.title, role.salary, role.department_id]);
    });
    console.log(roleTable.toString());
    prompt();
  } catch (error) {
    console.error(error);
  }
}
async function viewAllEmployees() {
  try {
    const employeeTable = new Table({});

    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM employee", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    results.forEach((employee) => {
      employeeTable.push([
        employee.id,
        employee.fname,
        employee.lname,
        employee.role_id,
        employee.manager_id,
      ]);
    });
    console.log(employeeTable)
    console.log(employeeTable.toString());
    prompt();
  } catch (error) {
    console.error(error);
  }
}

function prompt() {
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
      } else if (response.selection == "view all employees") {
        viewAllEmployees();
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing selection");
    });
}

prompt();

app.use((req, res) => {
  res.status(404).end();
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
