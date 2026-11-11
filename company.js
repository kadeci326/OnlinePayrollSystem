 
import { supabase } from "./supabase-config.js";

// Dashboard elements
const companyName = document.getElementById("companyName");
const companyDetails = document.getElementById("companyDetails");
const ownerDetails = document.getElementById("ownerDetails");
const totalEmployees = document.getElementById("totalEmployees");
const totalPayroll = document.getElementById("totalPayroll");
const employeeForm = document.getElementById("employeeForm");
const employeeMessage = document.getElementById("employeeMessage");
const employeeList = document.getElementById("employeeList");
const logoutButton = document.getElementById("logoutButton");

let currentCompany = null;

// Format Kenyan currency
function formatMoney(amount) {
    return "Ksh " + Number(amount || 0).toLocaleString("en-KE");
}

// EDIT EMPLOYEE
async function editEmployee(employee) {
    const newName = prompt(
        "Enter employee name:",
        employee.employee_name
    );

    if (newName === null || newName.trim() === "") return;

    const newSalary = prompt(
        "Enter basic salary:",
        employee.basic_salary
    );

    if (newSalary === null || newSalary.trim() === "") return;

    const newAllowance = prompt(
        "Enter house allowance:",
        employee.house_allowance || 0
    );

    if (newAllowance === null || newAllowance.trim() === "") return;

    if (
        !Number.isFinite(Number(newSalary)) ||
        !Number.isFinite(Number(newAllowance)) ||
        Number(newSalary) < 0 ||
        Number(newAllowance) < 0
    ) {
        alert("Please enter valid salary amounts.");
        return;
    }

    const { error } = await supabase
        .from("employees")
        .update({
            employee_name: newName.trim(),
            basic_salary: Number(newSalary),
            house_allowance: Number(newAllowance)
        })
        .eq("id", employee.id)
        .eq("company_id", currentCompany.id);

    if (error) {
        alert("Update failed: " + error.message);
        return;
    }

    alert("Employee updated successfully!");
    await loadEmployees();
}

// DELETE EMPLOYEE
async function deleteEmployee(employee) {
    const confirmed = confirm(
        "Are you sure you want to delete " +
        employee.employee_name + "?"
    );

    if (!confirmed) return;

    const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employee.id)
        .eq("company_id", currentCompany.id);

    if (error) {
        alert("Delete failed: " + error.message);
        return;
    }

    alert("Employee deleted successfully!");
    await loadEmployees();
}

// LOAD COMPANY INFORMATION
async function loadCompany() {
    const {
        data: { session },
        error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        window.location.href = "company-login.html";
        return;
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (
        profileError ||
        !profile ||
        profile.role !== "company_owner"
    ) {
        alert("This account does not have company-owner access.");
        await supabase.auth.signOut();
        window.location.href = "company-login.html";
        return;
    }

    const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", session.user.id)
        .single();

    if (companyError || !company) {
        alert("Company information could not be loaded.");
        return;
    }

    currentCompany = company;

    companyName.textContent = company.company_name;
    companyDetails.textContent = company.company_name;
    ownerDetails.textContent = company.owner_name || "Not provided";

    await loadEmployees();
}

// LOAD EMPLOYEES
async function loadEmployees() {
    if (!currentCompany) return;

    const { data: employees, error } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("created_at", { ascending: false });

    if (error) {
        employeeMessage.textContent =
            "Could not load employees: " + error.message;
        return;

const payslipSelect = document.getElementById("payslipRecord");

payslipSelect.replaceChildren();

const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Select Payroll Record";
payslipSelect.appendChild(defaultOption);

for (const record of records) {
    const employee = employees.find(
        item => item.id === record.employee_id
    );

    const option = document.createElement("option");
    option.value = record.id;
    option.textContent =
        (employee ? employee.employee_name : "Unknown employee") +
        " - " + record.pay_period;

    payslipSelect.appendChild(option);

// GENERATE EMPLOYEE PAYSLIP
document.getElementById("generatePayslip").onclick = function() {
    const selectedId = payslipSelect.value;

    const record = records.find(
        item => item.id === selectedId
    );

    const display = document.getElementById("payslipDisplay");
    display.replaceChildren();

    if (!record) {
        display.textContent = "Please select a payroll record.";
        return;
    }

    const employee = employees.find(
        item => item.id === record.employee_id
    );

    const heading = document.createElement("h2");
    heading.textContent = currentCompany.company_name + " - PAYSLIP";

    const employeeName = document.createElement("p");
    employeeName.textContent =
        "Employee: " +
        (employee ? employee.employee_name : "Unknown employee");

    const month = document.createElement("p");
    month.textContent = "Payroll Month: " + record.pay_period;

    const basic = document.createElement("p");
    basic.textContent =
        "Basic Salary: " + formatMoney(record.basic_salary);

    const allowance = document.createElement("p");
    allowance.textContent =
        "House Allowance: " + formatMoney(record.house_allowance);

    const gross = document.createElement("p");
    gross.textContent =
        "Gross Salary: " + formatMoney(record.gross_salary);

    const deductions = document.createElement("p");
    deductions.textContent =
        "Deductions: " + formatMoney(record.deduction);

    const net = document.createElement("h3");
    net.textContent =
        "NET SALARY: " + formatMoney(record.net_salary);

    display.append(
        heading,
        employeeName,
        month,
        basic,
        allowance,
        gross,
        deductions,
        net
    );
};

}

    }

    totalEmployees.textContent = employees.length;

const payrollEmployeeSelect =
    document.getElementById("payrollEmployee");

payrollEmployeeSelect.replaceChildren();

const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Select Employee";
payrollEmployeeSelect.appendChild(defaultOption);

for (const employee of employees) {
    const option = document.createElement("option");
    option.value = employee.id;
    option.textContent = employee.employee_name;
    payrollEmployeeSelect.appendChild(option);
    payrollEmployeeSelect.onchange = function() {
    const selectedEmployee = employees.find(
        employee => employee.id === payrollEmployeeSelect.value
    );

    if (!selectedEmployee) {
        document.getElementById("payrollBasicSalary").value = "";
        document.getElementById("payrollHouseAllowance").value = "";
        return;
    }

    document.getElementById("payrollBasicSalary").value =
        selectedEmployee.basic_salary;

    document.getElementById("payrollHouseAllowance").value =
        selectedEmployee.house_allowance || 0;
};

    employeeList.replaceChildren();

    if (employees.length === 0) {
        employeeList.textContent = "No employees added yet.";
    }

    let payrollTotal = 0;

    for (const employee of employees) {
        payrollTotal +=
            Number(employee.basic_salary || 0) +
            Number(employee.house_allowance || 0);

        const card = document.createElement("div");

        const name = document.createElement("h4");
        const email = document.createElement("p");
        const phone = document.createElement("p");
        const salary = document.createElement("p");

        name.textContent = employee.employee_name;

        email.textContent =
            "Email: " + (employee.email || "Not provided");

        phone.textContent =
            "Phone: " + (employee.phone || "Not provided");

        salary.textContent =
            "Basic salary: " + formatMoney(employee.basic_salary) +
            " | House allowance: " +
            formatMoney(employee.house_allowance);

        // EDIT BUTTON
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit Employee";

        editButton.addEventListener("click", function() {
            editEmployee(employee);
        });

        // DELETE BUTTON
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete Employee";
        deleteButton.style.backgroundColor = "red";

        deleteButton.addEventListener("click", function() {
            deleteEmployee(employee);
        });

        card.append(
            name,
            email,
            phone,
            salary,
            editButton,
            deleteButton
        );

        employeeList.appendChild(card);
    }

    totalPayroll.textContent = formatMoney(payrollTotal);
}

// LOAD PAYROLL HISTORY
async function loadPayrollHistory() {
    const history = document.getElementById("payrollHistory");

    history.textContent = "Loading payroll history...";

    const { data: records, error } = await supabase
        .from("payroll_records")
        .select("*")
        .eq("company_id", currentCompany.id)
        .order("created_at", { ascending: false });

    if (error) {
        history.textContent =
            "Could not load payroll history: " + error.message;
        return;
    }

    history.replaceChildren();

    if (!records || records.length === 0) {
        history.textContent = "No payroll records found yet.";
        return;
    }

    const employeeIds = [
        ...new Set(records.map(record => record.employee_id))
    ];

    const { data: employees, error: employeeError } = await supabase
        .from("employees")
        .select("id, employee_name")
        .in("id", employeeIds)
        .eq("company_id", currentCompany.id);

    if (employeeError) {
        history.textContent =
            "Could not load employee names: " + employeeError.message;
        return;
    }

    for (const record of records) {
        const employee = employees.find(
            item => item.id === record.employee_id
        );

        const card = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent =
            employee ? employee.employee_name : "Unknown employee";

        const month = document.createElement("p");
        month.textContent = "Payroll Month: " + record.pay_period;

        const gross = document.createElement("p");
        gross.textContent =
            "Gross Salary: " + formatMoney(record.gross_salary);

        const deduction = document.createElement("p");
        deduction.textContent =
            "Deductions: " + formatMoney(record.deduction);

        const net = document.createElement("p");
        net.textContent =
            "Net Salary: " + formatMoney(record.net_salary);

        card.append(name, month, gross, deduction, net);
        history.appendChild(card);
    }
}

// ADD EMPLOYEE
employeeForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!currentCompany) {
        employeeMessage.textContent =
            "Company information is not ready.";
        return;
    }

    employeeMessage.textContent = "Saving employee...";

    const employee = {
        company_id: currentCompany.id,
        employee_name: document
            .getElementById("employeeName").value.trim(),
        email: document
            .getElementById("employeeEmail").value.trim() || null,
        phone: document
            .getElementById("employeePhone").value.trim() || null,
        basic_salary: Number(
            document.getElementById("basicSalary").value
        ),
        house_allowance: Number(
            document.getElementById("houseAllowance").value || 0
        )
    };

    const { data, error } = await supabase
        .from("employees")
        .insert([employee])
        .select();

    if (error) {
        employeeMessage.style.color = "red";
        employeeMessage.textContent =
            "Could not save employee: " + error.message;
        return;
    }

    if (!data || data.length === 0) {
        employeeMessage.style.color = "red";
        employeeMessage.textContent =
            "No employee record was returned by Supabase.";
        return;
    }

    employeeMessage.style.color = "green";
    employeeMessage.textContent = "Employee added successfully!";

    employeeForm.reset();
    document.getElementById("houseAllowance").value = 0;

    await loadEmployees();
    await loadPayrollHistory();
});

// PROCESS AND SAVE PAYROLL
const payrollForm = document.getElementById("payrollForm");

payrollForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const employeeId =
        document.getElementById("payrollEmployee").value;

    const month =
        document.getElementById("payrollMonth").value;

    const basicSalary = Number(
        document.getElementById("payrollBasicSalary").value
    );

    const houseAllowance = Number(
        document.getElementById("payrollHouseAllowance").value
    );

    const deductions = Number(
        document.getElementById("payrollDeductions").value
    );

    const payrollMessage =
        document.getElementById("payrollMessage");

    if (!employeeId || !month) {
        payrollMessage.textContent =
            "Please select an employee and payroll month.";
        return;
    }

    if (
        !Number.isFinite(basicSalary) ||
        !Number.isFinite(houseAllowance) ||
        !Number.isFinite(deductions) ||
        deductions < 0
    ) {
        payrollMessage.textContent =
            "Please enter valid salary and deduction amounts.";
        return;
    }

    const gross = basicSalary + houseAllowance;
    const net = gross - deductions;

    if (deductions > gross) {
        payrollMessage.textContent =
            "Deductions cannot be greater than gross salary.";
        return;
    }

    document.getElementById("grossSalary").textContent =
        formatMoney(gross);

    document.getElementById("deductionAmount").textContent =
        formatMoney(deductions);

    document.getElementById("netSalary").textContent =
        formatMoney(net);

    payrollMessage.textContent = "Saving payroll...";

    const { data, error } = await supabase
        .from("payroll_records")
        .insert([{
            company_id: currentCompany.id,
            employee_id: employeeId,
            pay_period: month,
            gross_salary: gross,
            deduction: deductions,
            net_salary: net
        }])
        .select();

    if (error) {
        payrollMessage.style.color = "red";
        payrollMessage.textContent =
            "Payroll could not be saved: " + error.message;
        return;
    }

    payrollMessage.style.color = "green";
    payrollMessage.textContent =
        "Payroll calculated and saved successfully!";
        
});

// LOGOUT
logoutButton.addEventListener("click", async function() {
    await supabase.auth.signOut();
    window.location.href = "company-login.html";
});
// PRINT EMPLOYEE PAYSLIP
document.getElementById("printPayslip").addEventListener("click", function() {
    const payslip = document.getElementById("payslipDisplay");

    if (!payslip || payslip.innerText.trim() === "") {
        alert("Please generate a payslip first.");
        return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow pop-ups to print the payslip.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Payslip</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                }
                h2 {
                    text-align: center;
                }
                h3 {
                    border-top: 1px solid #333;
                    padding-top: 15px;
                }
            </style>
        </head>
        <body>
            ${payslip.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});


// START DASHBOARD
loadCompany();
