const db = require('../db/connection');

class Department {
    constructor(name) {
        this.name = name
    }

    addDepartment = () => {
        const initialPrompt = require('../index');

        db.execute(
            `INSERT INTO department (name) VALUES (?)`,
            [this.name],
            function (err, results, fields) {
                console.table(`Added to the database.`)
                return initialPrompt();
            })
    };
};

module.exports = Department