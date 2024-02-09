const Table = require("cli-table");
const inquirer = require("inquirer");
const mysql = require("mysql2");

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
    const departmentTable = new Table({
      head: ["id", "name"],
    });

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

function getDepartmentNames() {
  db.query(`SELECT name FROM department`, function (err, results) {
    if (err) {
      console.error(err);
      return callback(err, null);
    }
    const departmentNames = results.map(obj => obj.name);
    console.log(departmentNames)
  });
}

async function viewAllRoles() {
  try {
    const roleTable = new Table({
      head: ["id", "title", "salary", "department_id"],
    });

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
    const employeeTable = new Table({
      head: ["id", "fname", "lname", "role_id", "department_id"],
    });

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
    console.log(employeeTable.toString());
    prompt();
  } catch (error) {
    console.error(error);
  }
}

function addDepartment(addDepartmentName) {
  db.query(
    `INSERT INTO department (name) VALUES ('${addDepartmentName}')`,
    function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log("Department added successfully!");
        prompt();
      }
    }
  );
}

function addRole(addRole, addSalary, addRoleDepartment) {
  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES ('${addRole}', '${addSalary}', '${addRoleDepartment}')`,
    function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log("role added successfully!");
        prompt();
      }
    }
  );
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
      } else if (response.selection == "add a department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "newDepartment",
              message: "What is the name of the department?",
            },
          ])
          .then((response) => {
            addDepartment(response.newDepartment);
          });
      } else if (response.selection == "add a role") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "newRole",
              message: "What is the name of the role?",
            },
            {
              type: "input",
              name: "newSalary",
              message: "What is the salary of this role?",
            },
            {
              type: "list",
              name: "newRoleDepartment",
              message: "Which department will this role be in?",
              choices: getDepartmentNames(),
            },
          ])
          .then((response) => {
            addRole(
              response.newRole,
              response.newSalary,
              response.newRoleDepartment
            );
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing selection");
    });
}
// prompt()
console.log(getDepartmentNames());
