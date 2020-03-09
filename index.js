const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "captains_log"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    run();
});

function run() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "Which query would you like to run?",
        choices: [
            "Add a Department, Role, or Employee",
            "View Departments, Roles, or Employees",
            "Update Employee Role",
            "Exit"
        ]
      })
      .then(function(answer) {
        switch(answer.menu) {
            case "Add a Department, Role, or Employee":
                add();
                break;
            case "View Departments, Roles, or Employees":
                view();
                break;
            case "Update Employee Role":
                update();
                break;
            case "Exit":
                endConn();
        }
    });
}

function add() {
    inquirer.prompt({
        name: "add",
        type: "list",
        message: "What would you like to add?",
        choices: [
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Exit"
        ]
      })
      .then(function(answer) {
        switch(answer.add) {
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Exit":
                endConn();
        }
    });
}

function addDepartment() {
    inquirer.prompt({
        name: "addDepartment",
        message: "What is the name of the department you would like to add?"
    }).then(function(answer) {
        connection.query("INSERT INTO department (name) VALUES (?)", answer.addDepartment, function(err, res) {
            if (err) throw err;
        });
        run();
    });
}

function addRole() {
    inquirer.prompt([
    {
        name: "addRoleName",
        message: "What is the name of the role you would like to add?"
    },
    {
        name: "addRoleSalary",
        message: "What is the salary for this role?"
    },
    {
        name: "addRoleDeptId",
        message: "What is the department ID for this role?"
    }
    ]).then(function(answer) {
        connection.query("INSERT INTO role SET ?", {title: answer.addRoleName, salary: answer.addRoleSalary, department_id: answer.addRoleDeptId}, function(err, res) {
            if (err) throw err;
        });
        run();
    });
}

function addEmployee() {
    inquirer.prompt([
    {
        name: "addFirstName",
        message: "What is the first name of the employee you would like to add?"
    },
    {
        name: "addLastName",
        message: "What is the last name of the employee you would like to add?"
    },
    {
        name: "addRoleId",
        message: "What is the role ID for this employee?"
    },
    {
        name: "addManagerId",
        message: "What is the manager ID for this employee?"
    }
    ]).then(function(answer) {
        connection.query("INSERT INTO employee SET ?", {first_name: answer.addFirstName, last_name: answer.addLastName, role_id: answer.addRoleId, manager_id: answer.addManagerId}, function(err, res) {
            if (err) throw err;
        });
        run();
    });
}

function view() {
    inquirer.prompt({
        name: "view",
        type: "list",
        message: "What would you like to view?",
        choices: [
            "View Departments",
            "View Roles",
            "View Employees",
            "Exit"
        ]
      })
      .then(function(answer) {
        switch(answer.view) {
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Exit":
                endConn();
        }
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Press arrow key up or down to continue");
    });
    run();
}

function viewRoles() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Press arrow key up or down to continue");
    });
    run();
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Press arrow key up or down to continue");
    });
    run();
}

function update() {
    inquirer.prompt({
        name: "update",
        message: "Which employee would you like to update?"
      })
      .then(function(answer) {
        updateEmployee(answer.update);
    });
}

function updateEmployee(empId) {
    inquirer.prompt({
        name: "newRole",
        message: "What is the new role ID for this employee?"
    }).then(function(answer) {
        connection.query("UPDATE employee SET role_id =" + answer.newRole + " WHERE id =" + empId, function(err, res) {
            if (err) throw err;
        });
        run();
    });
}

function endConn() {
    connection.end();
}