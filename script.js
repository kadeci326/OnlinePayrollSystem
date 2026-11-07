import { supabase } from "./supabase-config.js";
/* ==========================================
   ONLINE EMPLOYEE PAYROLL MANAGEMENT SYSTEM
   JavaScript Functionality
========================================== */

// Store employee records
let employees = JSON.parse(
    localStorage.getItem("payrollEmployees")
) || [];

// Track employee being edited
let editingEmployeeId = null;

// Get HTML elements
const employeeForm = document.getElementById("employeeForm");

const employeeName = document.getElementById("employeeName");
const basicSalary = document.getElementById("basicSalary");
const houseAllowance = document.getElementById("houseAllowance");

const grossSalary = document.getElementById("grossSalary");
const deduction = document.getElementById("deduction");
const netSalary = document.getElementById("netSalary");
const incomeCategory = document.getElementById("incomeCategory");

const calculateBtn = document.getElementById("calculateBtn");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const clearBtn = document.getElementById("clearBtn");

const employeeTableBody = document.getElementById("employeeTableBody");
const searchEmployee = document.getElementById("searchEmployee");

const totalEmployees = document.getElementById("totalEmployees");
const totalGross = document.getElementById("totalGross");
const totalDeduction = document.getElementById("totalDeduction");
const totalNet = document.getElementById("totalNet");

const printReportBtn = document.getElementById("printReportBtn");


// Format amounts in Kenyan Shillings
function formatMoney(amount) {
    return "Ksh " + Number(amount).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// Save employee records in browser storage
function saveEmployees() {
    localStorage.setItem(
        "payrollEmployees",
        JSON.stringify(employees)
    );
}


// Determine income category
function getIncomeCategory(gross) {

    if (gross >= 100000) {
        return "High Income";
    }

    if (gross >= 70000) {
        return "Upper Middle Income";
    }

    if (gross >= 40000) {
        return "Middle Income";
    }

    return "Low Income";
}


// Calculate salary
function calculateSalary() {

    const name = employeeName.value.trim();
    const basic = Number(basicSalary.value);
    const house = Number(houseAllowance.value);

    if (name === "") {
        alert("Please enter the employee name.");
        employeeName.focus();
        return null;
    }

    if (
        basicSalary.value === "" ||
        houseAllowance.value === "" ||
        !Number.isFinite(basic) ||
        !Number.isFinite(house) ||
        basic < 0 ||
        house < 0
    ) {
        alert("Please enter valid, non-negative salary amounts.");
        return null;
    }

    // Payroll calculations
    const gross = basic + house;
    const deducted = gross * 0.30;
    const net = gross - deducted;
    const category = getIncomeCategory(gross);

    // Display calculated results
    grossSalary.value = formatMoney(gross);
    deduction.value = formatMoney(deducted);
    netSalary.value = formatMoney(net);
    incomeCategory.value = category;

    return {
        name: name,
        basic: basic,
        house: house,
        gross: gross,
        deduction: deducted,
        net: net,
        category: category
    };
}


// Calculate button
calculateBtn.addEventListener("click", function () {
    calculateSalary();
});


// Add or update employee
addEmployeeBtn.addEventListener("click", function () {

    const result = calculateSalary();

    if (!result) {
        return;
    }

    if (editingEmployeeId !== null) {

        // Update existing employee
        const index = employees.findIndex(
            employee => employee.id === editingEmployeeId
        );

        if (index !== -1) {
            employees[index] = {
                ...result,
                id: editingEmployeeId
            };
        }

        editingEmployeeId = null;
        addEmployeeBtn.textContent = "Add Employee";

        alert("Employee record updated successfully!");

    } else {

        // Register new employee
        const newEmployee = {
            ...result,
            id: Date.now().toString() +
                Math.random().toString(36).slice(2, 7)
        };

        employees.push(newEmployee);

        alert("Employee registered successfully!");
    }

    saveEmployees();
    displayEmployees();
    updateDashboard();
    resetForm();
});


// Display employee records
function displayEmployees(records = employees) {

    employeeTableBody.replaceChildren();

    if (records.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 8;
        cell.textContent = "No employee records found.";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        employeeTableBody.appendChild(row);

        return;
    }

    records.forEach(function (employee) {

        const row = document.createElement("tr");

        const values = [
            employee.name,
            formatMoney(employee.basic),
            formatMoney(employee.house),
            formatMoney(employee.gross),
            formatMoney(employee.deduction),
            formatMoney(employee.net),
            employee.category
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Actions cell
        const actionsCell = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editEmployee(employee.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteEmployee(employee.id);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        employeeTableBody.appendChild(row);
    });
}


// Edit employee record
function editEmployee(id) {

    const employee = employees.find(
        item => item.id === id
    );

    if (!employee) {
        return;
    }

    employeeName.value = employee.name;
    basicSalary.value = employee.basic;
    houseAllowance.value = employee.house;

    grossSalary.value = formatMoney(employee.gross);
    deduction.value = formatMoney(employee.deduction);
    netSalary.value = formatMoney(employee.net);
    incomeCategory.value = employee.category;

    editingEmployeeId = id;
    addEmployeeBtn.textContent = "Update Employee";

    document.getElementById("registration").scrollIntoView({
        behavior: "smooth"
    });
}


// Delete employee record
function deleteEmployee(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this employee record?"
    );

    if (!confirmDelete) {
        return;
    }

    employees = employees.filter(
        employee => employee.id !== id
    );

    if (editingEmployeeId === id) {
        editingEmployeeId = null;
        resetForm();
    }

    saveEmployees();
    displayEmployees();
    updateDashboard();

    alert("Employee record deleted successfully!");
}


// Search employees
searchEmployee.addEventListener("input", function () {

    const searchText = searchEmployee.value
        .trim()
        .toLowerCase();

    const filteredEmployees = employees.filter(
        employee => employee.name.toLowerCase().includes(searchText)
    );

    displayEmployees(filteredEmployees);
});


// Update dashboard totals
function updateDashboard() {

    const numberOfEmployees = employees.length;

    const grossTotal = employees.reduce(
        (sum, employee) => sum + employee.gross,
        0
    );

    const deductionTotal = employees.reduce(
        (sum, employee) => sum + employee.deduction,
        0
    );

    const netTotal = employees.reduce(
        (sum, employee) => sum + employee.net,
        0
    );

    totalEmployees.textContent = numberOfEmployees;
    totalGross.textContent = formatMoney(grossTotal);
    totalDeduction.textContent = formatMoney(deductionTotal);
    totalNet.textContent = formatMoney(netTotal);
}


// Reset registration form
function resetForm() {

    employeeForm.reset();

    grossSalary.value = "";
    deduction.value = "";
    netSalary.value = "";
    incomeCategory.value = "";

    editingEmployeeId = null;
    addEmployeeBtn.textContent = "Add Employee";
}


// Clear button
clearBtn.addEventListener("click", function () {
    resetForm();
});


// Print payroll report
printReportBtn.addEventListener("click", function () {

    if (employees.length === 0) {
        alert("There are no employee records to print.");
        return;
    }

    window.print();
});


// Display current year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();


// Load saved records when website opens
function initializePayrollSystem() {

    displayEmployees();
    updateDashboard();
}

initializePayrollSystem();
