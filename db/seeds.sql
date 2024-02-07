INSERT INTO department (id, name) VALUES
(1, 'Clothing'),
(2, 'Electronics'),
(3, 'Grocery'),
(4, 'Toys'),
(5, 'Home and Kitchen'),
(6, 'Health and Beauty'),
(7, 'Sports and Outdoors'),
(8, 'Automotive'),
(9, 'Books'),
(10, 'Pet Supplies');

INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Manager', 80000, 1),
(2, 'Salesperson', 50000, 2),
(3, 'Cashier', 35000, 1),
(4, 'Technician', 60000, 3),
(5, 'Customer Service', 40000, 2);

INSERT INTO employee (id, fname, lname, rol_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Bob', 'Johnson', 3, 1),
(4, 'Alice', 'Williams', 4, 2),
(5, 'Charlie', 'Brown', 5, 1);