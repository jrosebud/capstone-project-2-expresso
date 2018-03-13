const express = require('express');
const employeesRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//check params
/*employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  const sql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
  const values = {$employeeId: employeeId};
  db.get(sql, values, (error, employee) => {
    if (error) {
      next(error);
    } else if (employee) {
      req.employee = employee;
      next();
    } else {
      res.sendStatus(404);
    }
  });
}); */

//get route
employeesRouter.get('/', (req, res, next) => {
	db.all('SELECT * FROM Employee WHERE Employee.is_current_employee = 1'), 
	(error, employees) => {
		if(error) {
			next(error);
		} else {
			return res.status(200).send(employees);
			next();
		}
	}
});

//don't forget the export!!!!
module.exports = employeesRouter;