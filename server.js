

const figlet = require('figlet');

figlet('Employee', 'Doom', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});
figlet('Manager', 'Doom', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

const Table = require('cli-table');

// Create a new table instance
const table = new Table({
    head: ['Name', 'Age', 'Gender'], 
    colWidths: [20, 10, 10] 
});

// Add some data to the table
table.push(
    ['John Doe', 30, 'Male'],
    ['Jane Smith', 25, 'Female'],
    ['Alex Johnson', 40, 'Male']
);

// Display the table in the console
console.log(table.toString());



