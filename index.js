const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const Department = require('./lib/Department')

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    initialPrompt();
});

function initialPrompt() {
    inquirer.prompt({
        type: "list",
        name: "choices",
        message: "what do you want to do?",
        choices: [
            { name: "View all departments", value: "view_departments" },
            { name: "View all roles", value: "view_roles" },
            { name: "View all employees", value: "view_employees" },
            { name: "Add a department", value: "add_department" },
            { name: "Add a role", value: "add_role" },
            { name: "Add an employee", value: "add_employee" },
            { name: "Update an employee role", value: "update_employee_role" }
        ]
    }).then((answers) => {
        const { choices } = answers;

        if (choices === "view_departments") {
            viewDepartments();
        }

        if (choices === "view_roles") {
            viewRoles();
        }

        if (choices === "view_employees") {
            viewEmployees();
        }

        if (choices === "add_department") {
            addDepartment();
        }

        if (choices === "add_role") {
            addRole();
        }

        if (choices === "add_employee") {
            addEmployee();
        }

        if (choices === "update_employee_role") {
            updateEmployee();
        }
    });
}

const viewDepartments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    });
};