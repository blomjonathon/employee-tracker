# Employee Tracker

A modern web-based employee management system built with Node.js, Express, MySQL, and a responsive Bootstrap frontend.

## Features

- **Department Management**: Add and view company departments
- **Role Management**: Create and manage job roles with salaries
- **Employee Management**: Add employees, assign roles, and set managers
- **Modern Web Interface**: Responsive design that works on all devices
- **Real-time Updates**: Instant feedback and data refresh
- **RESTful API**: Clean API endpoints for all operations

## Screenshots

The application features a clean, modern interface with:
- Navigation sidebar for easy access to different sections
- Responsive tables for data display
- Modal forms for adding new entries
- Toast notifications for user feedback
- Professional styling with Bootstrap 5

## Prerequisites

- Node.js (version 14 or higher)
- MySQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd employee-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your MySQL database**
   - Create a new database
   - Run the SQL scripts in the `db/` folder:
     ```bash
     mysql -u root -p < db/schema.sql
     mysql -u root -p < db/seeds.sql
     ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=departments_db
   PORT=3000
   ```

## Usage

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts during development.

### Production Mode
```bash
npm start
```

### Access the Application
Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Add a new department

### Roles
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Add a new role

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add a new employee
- `PUT /api/employees/:id/role` - Update employee role

### Dropdown Data
- `GET /api/departments/list` - Get departments for dropdowns
- `GET /api/roles/list` - Get roles for dropdowns
- `GET /api/employees/list` - Get employees for dropdowns

## Database Schema

The application uses three main tables:

- **department**: Stores company departments
- **role**: Stores job roles with salaries and department associations
- **employee**: Stores employee information with role and manager relationships

## Deployment

### Heroku
1. Create a new Heroku app
2. Add MySQL add-on (ClearDB or JawsDB)
3. Set environment variables in Heroku dashboard
4. Deploy using Git:
   ```bash
   git push heroku main
   ```

### Railway
1. Connect your GitHub repository
2. Add MySQL service
3. Set environment variables
4. Deploy automatically

### Vercel
1. Import your GitHub repository
2. Set environment variables
3. Deploy

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT` (usually set automatically by the platform)

## Project Structure

```
employee-tracker/
├── db/
│   ├── schema.sql          # Database schema
│   └── seeds.sql           # Sample data
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Custom CSS
│   └── script.js           # Frontend JavaScript
├── server.js               # Express server and API
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **Development**: Nodemon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include your environment details and error messages

## Future Enhancements

- User authentication and authorization
- Advanced search and filtering
- Data export functionality
- Employee performance tracking
- Department budget management
- Audit logging
