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

//get route for single menu
menusRouter.get('/:menuId', (req, res, next) => {
	db.get('SELECT * FROM Menu WHERE Menu.id = $menuId',
	{
		$menuId: req.params.menuId
	},
	(error, menu) => {
		if(error) {
			next(error);
		} else if (menu) {
			res.status(200).json({menu: menu});
		} else {
			return res.status(404).send();
		}
	});
});

//post route for menus
menusRouter.post('/', (req, res, next) => {
	//variables for information
	const title = req.body.menu.title;
	// check for empty fields
	if(!title) {
		return res.status(400).send();
	} 
	
	// run the queries, yo
	const sql = "INSERT INTO Menu (title) VALUES ($title)";
	const values = {
		$title: title
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
				(error, menu) => {
					res.status(201).json({menu: menu});
				});
		}
	});
});

//put route for menus
menusRouter.put('/:id', (req, res, next) => {
	//variables for information
	const title = req.body.menu.title;
	// check for empty fields
	if(!title) {
		return res.status(400).send();
	} 
	
	const sql = "UPDATE Menu SET title = $title WHERE Menu.id = $menuId";
	const values = {
		$title: title,
		$menuId: req.params.id
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM Menu WHERE Menu.id = ${req.params.id}`,
				(error, menu) => {
					res.status(200).json({menu: menu});
				});
		}
	});
});

//delete route for menus
menusRouter.delete('/:id', (req, res, next) => {
	const query = "SELECT * FROM MenuItem WHERE MenuItem.menu_Id = $menuId";
	const values = {$menuId: req.params.id};
	db.all(query, values, (error, menuitems) => {
		if(error){
			next(error);
		} else if(menuitems.length === 0){
			db.run(`DELETE FROM Menu WHERE Menu.id = ${req.params.id}`,
			(error, menu) => {
				res.status(204).send();
			});
		} else {
			return res.status(400).send();
		}
	}); // end db.get
}); 


//menu items stuff
//menu items params
menusRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = {$menuItemId: menuItemId};
  db.get(sql, values, (error, menuItem) => {
    if (error) {
      next(error);
    } else if (menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.sendStatus(404);
    }
  });
}); 

//get menu items for menus
menusRouter.get('/:menuId/menu-items', (req, res, next) => {
	//getting all menu items for a specific menu id
	const query = "SELECT * FROM MenuItem WHERE MenuItem.menu_Id = $menuId";
	const values = {$menuId: req.params.menuId};
	db.all(query, values, (error, menuitems) => {
		if(error){
			next(error);
		} else if(menuitems.length === 0){
			//menuitems is an empty array but I can't seem to send it
			return res.send(menuitems);
		} else if(menuitems){
			db.all(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`,
			(error, menuItems) => {
				if(error){
					next(error);
				} else {
					res.status(200).json({menuItems: menuItems});
				}
			});
		} else {
			return res.status(404).send();
		}
	}); // end db.get
});

//post menu items
menusRouter.post('/:menuId/menu-items', (req, res, next) => {
	//variables for information
	const name = req.body.menuItem.name,
	description = req.body.menuItem.description,
	inventory = req.body.menuItem.inventory,
	price = req.body.menuItem.price,
	menu_id = req.params.menuId;
	// check for empty fields
	if(!name || !inventory || !price) {
		return res.status(400).send();
	} 
	
	const sql = "INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menu_id)";
	const values = {
		$name: name,
		$description: description,
		$inventory: inventory,
		$price: price,
		$menu_id: menu_id
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
				(error, menuItem) => {
					res.status(201).json({menuItem: menuItem});
				});
		}
	}); 
});

//post route for menu items
menusRouter.put('/:menuId/menu-items/:menuItemId', (req, res, next) => {
	//variables for information
	const name = req.body.menuItem.name,
	description = req.body.menuItem.description,
	inventory = req.body.menuItem.inventory,
	price = req.body.menuItem.price,
	menu_id = req.params.menuId,
	id = req.params.menuItemId;
	// check for empty fields
	if(!name || !inventory || !price) {
		return res.status(400).send();
	} 
	
	const sql = "UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menu_id WHERE MenuItem.id = $id";
	const values = {
		$name: name,
		$description: description,
		$inventory: inventory,
		$price: price,
		$menu_id: req.params.menuId,
		$id: req.params.menuItemId
	}
	db.run(sql, values, function(error){
		if(error){
			next(error);
		} else {
			db.get(
				`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
				(error, menuItem) => {
					res.status(200).json({menuItem: menuItem});
				});
		}
	});
}); 

//delete route for menu items
menusRouter.delete('/:menuId/menu-items/:menuItemId', (req, res, next) => {
	const query = "SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId";
	const values = {$menuItemId: req.params.menuItemId};
	db.all(query, values, (error, menuitems) => {
		if(error){
			next(error);
		} else if(menuitems){
			db.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`,
			(error, menu) => {
				res.status(204).send();
			});
		} else {
			return res.status(404).send();
		}
	}); // end db.get
}); 

//don't forget the export!!!!
module.exports = menusRouter;