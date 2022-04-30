const db = require('../db/connection');

class Role {
    constructor(title, salary, department_id) {
        this.title = title,
            this.salary = salary,
            this.department_id = department_id
    }
    addRole = () => {
        const initialPrompt = require('../index');

        db.execute(
            `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
            [this.title, this.salary, this.department_id],
            function (err, results, fields) {
                console.table(`Added to the database.`)
                return initialPrompt();
            })
    };
};

module.exports = Role