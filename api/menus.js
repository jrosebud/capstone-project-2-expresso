const express = require('express');
const menusRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//check params
menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
  const values = {$menuId: menuId};
  db.get(sql, values, (error, menu) => {
    if (error) {
      next(error);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
}); 

//get route
menusRouter.get('/', (req, res, next) => {
	db.all('SELECT * FROM Menu', 
		(error, menus) => {
			if(error) {
				next(error);
			} else {
				res.status(200).json({menus: menus});
			}
		}
	); //close db.all
});

//get route for single employee
/*employeesRouter.get('/:id', (req, res, next) => {
	db.get('SELECT * FROM Employee WHERE Employee.id = $employeeId',
	{
		$employeeId: req.params.id
	},
	(error, employee) => {
		if(error) {
			next(error);
		} else if (employee) {
			res.status(200).json({employee: employee});
		} else {
			return res.status(404).send();
		}
	});
});

//post route for employees
employeesRouter.post('/', (req, res, next) => {
	//variables for information
	const name = req.body.employee.name;
	const position = req.body.employee.position;
	const wage = req.body.employee.wage;
	// check for empty fields
	if(!name || !position || !wage) {
		return res.status(400).send();
	} 
	
	// run the queries, yo
	const sql = "INSERT INTO Employee (name, position, wage) VALUES ($name, $position, $wage)";
	const values = {
		$name: name,
		$position: position,
		$wage: wage
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
				(error, employee) => {
					res.status(201).json({employee: employee});
				});
		}
	});
});

//put route for employees
employeesRouter.put('/:id', (req, res, next) => {
	//variables for information
	const name = req.body.employee.name;
	const position = req.body.employee.position;
	const wage = req.body.employee.wage;
	const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
	// check for empty fields
	if(!name || !position || !wage) {
		return res.status(400).send();
	} 
	
	const sql = "UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId";
	const values = {
		$name: name,
		$position: position,
		$wage: wage,
		$isCurrentEmployee: isCurrentEmployee,
		$employeeId: req.params.id
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM Employee WHERE Employee.id = ${req.params.id}`,
				(error, employee) => {
					res.status(200).json({employee: employee});
				});
		}
	});
});

//delete route for employees
employeesRouter.delete('/:id', (req, res, next) => {
	const sql = "UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = $employeeId";
	const values = {
		$employeeId: req.params.id
	}
	
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.id}`,
			(error, employee) => {
				res.status(200).json({employee: employee});
			});
		}
	});
});

//timesheet stuff
//timesheet params
employeesRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId';
  const values = {$timesheetId: timesheetId};
  db.get(sql, values, (error, timesheet) => {
    if (error) {
      next(error);
    } else if (timesheet) {
      req.timesheet = timesheet;
      next();
    } else {
      res.sendStatus(404);
    }
  });
}); 


//get timesheet for employee
employeesRouter.get('/:employeeId/timesheets', (req, res, next) => {
	db.all("SELECT * FROM Timesheet WHERE employee_id = $employeeId",
	{
		$employeeId: req.params.employeeId
	},
	(error, timesheets) => {
		if(error){
			next(error);
		} else if (timesheets) {
			res.status(200).json({timesheets: timesheets});
		} else {
			return res.status(404).send();
		}
	});
});

//post timesheet for employee
employeesRouter.post('/:employeeId/timesheets', (req, res, next) => {
	//variables for information
	const employeeId = req.params.employeeId;
	const hours = req.body.timesheet.hours;
	const rate = req.body.timesheet.rate;
	const date = req.body.timesheet.date;
	// check for empty fields
	if(!hours || !rate || !date) {
		return res.status(400).send();
	} 
	
	// run the queries, yo
	const sql = "INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)";
	const values = {
		$hours: hours,
		$rate: rate,
		$date: date,
		$employeeId: employeeId
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
				(error, timesheet) => {
					res.status(201).json({timesheet: timesheet});
				});
		}
	});
});

//put timesheet
employeesRouter.put('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
	//variables for information
	const employeeId = req.params.employeeId;
	const hours = req.body.timesheet.hours;
	const rate = req.body.timesheet.rate;
	const date = req.body.timesheet.date;
	const timesheetId = req.params.timesheetId;
	// check for empty fields
	if(!hours || !rate || !date) {
		return res.status(400).send();
	} 
	
	const sql = "UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId";
	const values = {
		$hours: hours,
		$rate: rate,
		$date: date,
		$employeeId: employeeId,
		$timesheetId: timesheetId
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`,
				(error, timesheet) => {
					res.status(200).json({timesheet: timesheet});
				});
		}
	});
});

//delete route for timesheets
employeesRouter.delete('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
	const sql = "DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId";
	const values = {
		$timesheetId: req.params.timesheetId
	}
	
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			res.status(204).send();
		}
	});
}); 
*/

//don't forget the export!!!!
module.exports = menusRouter;