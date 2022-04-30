const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');

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
            { name: "Update an employee role", value: "update_employee_role" },
            { name: "Exit", value: "close_connection" }
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
        if (choices === "close_connection") {
            process.exit();
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

const viewRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role
                  JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    });
};

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager on employee.manager_id = manager.id
    ORDER BY employee.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    });
};

const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the name of the department?",
        }
    ])
        .then((answers) => {
            return new Department(answers.name).addDepartment()
        });
};


const addRole = () => {
    db.query(`SELECT name FROM department`,
        function (err, results, fields) {
            let names = results.map((names) => {
                return [names.name].join(" ")
            });
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: "What role do you want to add?",
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "What is the salary for this role?",
                },
                {
                    type: 'list',
                    name: 'department_name',
                    message: "What department is it?",
                    choices: names
                }
            ])
                .then((answers) => {
                    let departmentName = answers.department_name
                    db.query(
                        `SELECT id FROM department WHERE name = ?`,
                        [departmentName],
                        function (err, results, fields) {
                            const departmentId = results;
                            return new Role(answers.title, answers.salary, departmentId[0].id).addRole()
                        })
                })
        }
    )
}
const addEmployee = () => {
    db.query(`SELECT title from ROLE`,
        function (err, results, fields) {
            let titles = results.map((titles) => {
                return [titles.title].join(" ")
            })
            db.query(
                `SELECT first_name, last_name FROM employee`,
                function (err, results, fields) {
                    let names = results.map((names) => {
                        return [names.first_name, names.last_name].join(" ");
                    })

                    return inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: "What is the employee's first name?",
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: "What is the employee's last name?",
                        },
                        {
                            type: 'list',
                            name: 'role_title',
                            message: "What is this employee's role title?",
                            choices: titles
                        },
                        {
                            type: 'list',
                            name: 'manager_name',
                            message: "Who does this employee report to?",
                            choices: names
                        }

                    ])
                        .then((answers) => {
                            let roleTitle = answers.role_title
                            let managerName = answers.manager_name.split(" ")
                            let firstName = managerName[0].toString()
                            let lastName = managerName[1].toString()
                            let managerId = []
                            db.query(
                                `SELECT id FROM employee WHERE first_name = ? AND last_name =? `,
                                [firstName, lastName],
                                function (err, results1, fields) {
                                    managerId.push(results1[0])
                                }
                            )
                            db.query(
                                `SELECT id FROM role WHERE title = ?`,
                                [roleTitle],
                                function (err, results, fields) {
                                    const roleId = results
                                    return new Employee(answers.first_name, answers.last_name, roleId[0].id, managerId[0].id).addEmployee()
                                })
                        })
                })
        })
}

const updateEmployee = () => {
    db.query(`SELECT first_name, last_name FROM employee`,
        function (err, results, fields) {
            let names = results.map((names) => {
                return [names.first_name, names.last_name].join(" ");
            })
            db.query(
                `SELECT title FROM role`,
                function (err, results, fields) {
                    let titles = results.map((titles) => {
                        return [titles.title].join(" ")
                    })

                    return inquirer.prompt([
                        {
                            type: 'list',
                            name: 'name',
                            message: "Which employee would you like to update?",
                            choices: names
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: "What is this employee's new role?",
                            choices: titles
                        }
                    ])
                        .then((answers) => {
                            const name = answers.name.split(" ")
                            const firstName = name[0]
                            const lastName = name[1]
                            const role = answers.role_id.split(" ")
                            const roleId = role.pop()

                            return new Employee(firstName, lastName, roleId).updateEmployee()
                        })
                }
            )
        }
    )
};


module.exports = initialPrompt;