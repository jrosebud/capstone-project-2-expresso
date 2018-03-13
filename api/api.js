//require express
const express = require('express');

//set up routers
const apiRouter = express.Router();
const employeesRouter = require('./employees.js');

apiRouter.use('/employees', employeesRouter);

module.exports = apiRouter;