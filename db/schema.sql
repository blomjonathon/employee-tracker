DROP DATABASE IF EXISTS departments_db;

CREATE DATABASE departments_db;

USE departments_db;

CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);

CREATE TABLE employee (
    id INT PRIMARY KEY,
    fname VARCHAR(30),
    lname VARCHAR(30),
    role_id INT,
    manager_id INT
);

