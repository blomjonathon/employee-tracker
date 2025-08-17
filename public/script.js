// Employee Tracker Frontend JavaScript

// Global variables
let departments = [];
let roles = [];
let employees = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    showSection('departments'); // Show departments by default
});

// Load all data from the API
async function loadAllData() {
    try {
        await Promise.all([
            loadDepartments(),
            loadRoles(),
            loadEmployees()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading data', 'error');
    }
}

// Load departments
async function loadDepartments() {
    try {
        const response = await fetch('/api/departments');
        if (!response.ok) throw new Error('Failed to fetch departments');
        departments = await response.json();
        renderDepartmentsTable();
    } catch (error) {
        console.error('Error loading departments:', error);
        showNotification('Error loading departments', 'error');
    }
}

// Load roles
async function loadRoles() {
    try {
        const response = await fetch('/api/roles');
        if (!response.ok) throw new Error('Failed to fetch roles');
        roles = await response.json();
        renderRolesTable();
        populateRoleDropdowns();
    } catch (error) {
        console.error('Error loading roles:', error);
        showNotification('Error loading roles', 'error');
    }
}

// Load employees
async function loadEmployees() {
    try {
        const response = await fetch('/api/employees');
        if (!response.ok) throw new Error('Failed to fetch employees');
        employees = await response.json();
        renderEmployeesTable();
        populateEmployeeDropdowns();
    } catch (error) {
        console.error('Error loading employees:', error);
        showNotification('Error loading employees', 'error');
    }
}

// Show different sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).style.display = 'block';
    
    // Update active button state
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    event.target.classList.add('active');
}

// Render departments table
function renderDepartmentsTable() {
    const tableContainer = document.getElementById('departments-table');
    
    if (departments.length === 0) {
        tableContainer.innerHTML = '<div class="alert alert-info">No departments found. Add your first department!</div>';
        return;
    }
    
    let tableHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    departments.forEach(dept => {
        tableHTML += `
            <tr>
                <td>${dept.id}</td>
                <td>${dept.name}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDepartment(${dept.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Render roles table
function renderRolesTable() {
    const tableContainer = document.getElementById('roles-table');
    
    if (roles.length === 0) {
        tableContainer.innerHTML = '<div class="alert alert-info">No roles found. Add your first role!</div>';
        return;
    }
    
    let tableHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Salary</th>
                    <th>Department ID</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    roles.forEach(role => {
        const department = departments.find(d => d.id === role.department_id);
        tableHTML += `
            <tr>
                <td>${role.id}</td>
                <td>${role.title}</td>
                <td>$${parseInt(role.salary).toLocaleString()}</td>
                <td>${department ? department.name : role.department_id}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRole(${role.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Render employees table
function renderEmployeesTable() {
    const tableContainer = document.getElementById('employees-table');
    
    if (employees.length === 0) {
        tableContainer.innerHTML = '<div class="alert alert-info">No employees found. Add your first employee!</div>';
        return;
    }
    
    let tableHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Manager</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    employees.forEach(emp => {
        const role = roles.find(r => r.id === emp.role_id);
        const manager = employees.find(m => m.id === emp.manager_id);
        tableHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.fname} ${emp.lname}</td>
                <td>${role ? role.title : 'N/A'}</td>
                <td>${manager ? `${manager.fname} ${manager.lname}` : 'None'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning me-2" onclick="showUpdateEmployeeModal(${emp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee(${emp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Populate dropdowns for forms
function populateRoleDropdowns() {
    const roleDropdowns = ['roleDepartment', 'employeeRole', 'updateEmployeeRole'];
    
    roleDropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Select Role</option>';
            roles.forEach(role => {
                dropdown.innerHTML += `<option value="${role.id}">${role.title}</option>`;
            });
        }
    });
}

function populateEmployeeDropdowns() {
    const employeeDropdowns = ['employeeManager', 'updateEmployeeSelect'];
    
    employeeDropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.innerHTML = '<option value="">No Manager</option>';
            employees.forEach(emp => {
                dropdown.innerHTML += `<option value="${emp.id}">${emp.fname} ${emp.lname}</option>`;
            });
        }
    });
}

// Modal functions
function showAddDepartmentModal() {
    document.getElementById('departmentName').value = '';
    new bootstrap.Modal(document.getElementById('addDepartmentModal')).show();
}

function showAddRoleModal() {
    document.getElementById('roleTitle').value = '';
    document.getElementById('roleSalary').value = '';
    document.getElementById('roleDepartment').value = '';
    new bootstrap.Modal(document.getElementById('addRoleModal')).show();
}

function showAddEmployeeModal() {
    document.getElementById('employeeFname').value = '';
    document.getElementById('employeeLname').value = '';
    document.getElementById('employeeRole').value = '';
    document.getElementById('employeeManager').value = '';
    new bootstrap.Modal(document.getElementById('addEmployeeModal')).show();
}

function showUpdateEmployeeModal(employeeId) {
    document.getElementById('updateEmployeeSelect').value = employeeId;
    document.getElementById('updateEmployeeRole').value = '';
    new bootstrap.Modal(document.getElementById('updateEmployeeModal')).show();
}

// Add functions
async function addDepartment() {
    const name = document.getElementById('departmentName').value.trim();
    if (!name) {
        showNotification('Please enter a department name', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/departments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) throw new Error('Failed to add department');
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('addDepartmentModal')).hide();
        await loadDepartments();
        
    } catch (error) {
        console.error('Error adding department:', error);
        showNotification('Error adding department', 'error');
    }
}

async function addRole() {
    const title = document.getElementById('roleTitle').value.trim();
    const salary = document.getElementById('roleSalary').value;
    const department_id = document.getElementById('roleDepartment').value;
    
    if (!title || !salary || !department_id) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, salary, department_id })
        });
        
        if (!response.ok) throw new Error('Failed to add role');
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('addRoleModal')).hide();
        await loadRoles();
        
    } catch (error) {
        console.error('Error adding role:', error);
        showNotification('Error adding role', 'error');
    }
}

async function addEmployee() {
    const fname = document.getElementById('employeeFname').value.trim();
    const lname = document.getElementById('employeeLname').value.trim();
    const role_id = document.getElementById('employeeRole').value;
    const manager_id = document.getElementById('employeeManager').value || null;
    
    if (!fname || !lname || !role_id) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fname, lname, role_id, manager_id })
        });
        
        if (!response.ok) throw new Error('Failed to add employee');
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal')).hide();
        await loadEmployees();
        
    } catch (error) {
        console.error('Error adding employee:', error);
        showNotification('Error adding employee', 'error');
    }
}

async function updateEmployeeRole() {
    const employeeId = document.getElementById('updateEmployeeSelect').value;
    const roleId = document.getElementById('updateEmployeeRole').value;
    
    if (!employeeId || !roleId) {
        showNotification('Please select both employee and role', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/employees/${employeeId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role_id: roleId })
        });
        
        if (!response.ok) throw new Error('Failed to update employee role');
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('updateEmployeeModal')).hide();
        await loadEmployees();
        
    } catch (error) {
        console.error('Error updating employee role:', error);
        showNotification('Error updating employee role', 'error');
    }
}

// Delete functions (you can implement these if needed)
function deleteDepartment(id) {
    if (confirm('Are you sure you want to delete this department?')) {
        // Implement delete API call
        showNotification('Delete functionality not implemented yet', 'info');
    }
}

function deleteRole(id) {
    if (confirm('Are you sure you want to delete this role?')) {
        // Implement delete API call
        showNotification('Delete functionality not implemented yet', 'info');
    }
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        // Implement delete API call
        showNotification('Delete functionality not implemented yet', 'info');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('bg-success', 'bg-danger', 'bg-info');
    
    switch (type) {
        case 'success':
            toast.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-danger', 'text-white');
            break;
        default:
            toast.classList.add('bg-info', 'text-white');
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
