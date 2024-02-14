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
      head: ["id", "fname", "lname", "role_id", "manager_id"],
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
function addEmployee(addFname, addLname, roleId, mId) {
  db.query(
    `INSERT INTO employee (fname, lname, role_id, manager_id) VALUES ('${addFname}', '${addLname}', '${roleId}','${mId}')`,
    function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log("employee added successfully!");
        prompt();
      }
    }
  );
}
async function getDepartmentNamesandIds() {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query("SELECT id, name FROM department", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getEmployeesObj() {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT fname, lname, role_id, manager_id FROM employee",
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getRoles(){
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id, title FROM role",
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function updateEmployee(employee, employeeRole){
  db.query(
    `INSERT INTO employee (fname, role_id) VALUES ('${employee}', '${employeeRole}')`,
    function (err, results) {
      if (err) {
        console.error(err);
      } else {
        console.log("employee updated successfully!");
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
    .then(async (response) => {
      const rolesObj = await getRoles()
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
        const departmentObj = await getDepartmentNamesandIds();
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
              choices: departmentObj.map((department) => department.name),
            },
          ])
          .then((response) => {
            let filteredObj = departmentObj.filter(
              (department) => department.name === response.newRoleDepartment
            );
            addRole(response.newRole, response.newSalary, filteredObj[0].id);
          });
      } else if (response.selection == "add an employee") {
        const newEmployeeManagerObj = await getEmployeesObj();
        inquirer
          .prompt([
            {
              type: "input",
              name: "newEmployeeFname",
              message: "What is the first name of the employee?",
            },
            {
              type: "input",
              name: "newEmployeeLname",
              message: "What is the last name of the employee?",
            },
            {
              type: "list",
              name: "newEmployeeRole",
              message: "What is employee's role?",
              choices: rolesObj.map((role) => role.title)
            },
            {
              type: "list",
              name: "newEmployeeManager",
              message: "Who is the employee's manager?",
              choices: newEmployeeManagerObj.map((employee) => employee.fname),
            },
          ])
          .then((response) => {
            let employeeFilter = newEmployeeManagerObj.filter(
              (employee) => employee.fname === response.newEmployeeManager
            );
            let roleFilter = rolesObj[0].id
            console.log(roleFilter)
            addEmployee(
              response.newEmployeeFname,
              response.newEmployeeLname,
              roleFilter,
              employeeFilter[0].manager_id
            );
          });
      } else if (response.selection == 'update an employee role') {
        const employeeList = await getEmployeesObj()
        inquirer
          .prompt([
            {
              type: "list",
              name: "updateEmployee",
              message: "Which employee's role do you want to update?",
              choices: employeeList.map((employee) => employee.fname)
            },
            {
              type: "list",
              name: "updateEmployeeRole",
              message: "Which role will the new employee have?",
              choices: rolesObj.map((role) => role.title)
            }
          ])
          .then((response) => {
            const selectedEmployee = employeeList.find((employee) => employee.fname === response.updateEmployee);
            const selectedRole = rolesObj.find((role) => role.title === response.updateEmployeeRole);
            
            updateEmployee(selectedEmployee.fname, selectedRole.id)
          });
      } 
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error processing selection");
    });
}
prompt();
