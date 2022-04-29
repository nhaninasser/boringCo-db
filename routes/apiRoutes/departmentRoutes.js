const express = require('express');
const router = express.Router();
const db = require('../../db/connection');


//gets the departments
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});
//gets department by id
router.get('/department/:id', (req, res) => {
    const sql = `SELECT * FROM department WHERE ID = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});
// adds a department
router.post('/department', ({ body }, res) => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [body.name];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body,
        changes: result.affectedRows
      });
    });
  });



module.exports = router;
