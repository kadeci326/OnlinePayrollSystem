
import { supabase } from "./supabase-config.js";

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

function formatMoney(amount) {
    return "Ksh " + Number(amount || 0).toLocaleString("en-KE");
}

// Load the logged-in company
async function loadCompany() {
    const { data: { session }, error: sessionError } =
        await supabase.auth.getSession();

    if (sessionError || !session) {
        window.location.href = "index.html";
        return;
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (profileError || !profile || profile.role !== "company_owner") {
        alert("This account does not have company-owner access.");
        await supabase.auth.signOut();
        window.location.href = "index.html";
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

// Load employees belonging to this company
async function loadEmployees() {
    if (!currentCompany) return;

     const { data, error } = await supabase
    .from("employees")
    .insert([employee])
    .select();

if (error) {
    employeeMessage.style.color = "red";
    employeeMessage.textContent = "Could not save employee: " + error.message;
    return;
}

 console.log("SUPABASE INSERT RESULT:", data, error);

if (!data || data.length === 0) {
    employeeMessage.style.color = "red";
    employeeMessage.textContent =
        "No employee record was returned by Supabase.";
    return;
}

    if (error) {
        employeeMessage.textContent = "Could not load employees: " + error.message;
        return;
    }

    totalEmployees.textContent = employees.length;
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
        email.textContent = "Email: " + (employee.email || "Not provided");
        phone.textContent = "Phone: " + (employee.phone || "Not provided");
        salary.textContent = "Basic salary: " +
            formatMoney(employee.basic_salary) +
            " | House allowance: " +
            formatMoney(employee.house_allowance);

        card.append(name, email, phone, salary);
        employeeList.appendChild(card);
    }

    totalPayroll.textContent = formatMoney(payrollTotal);
}

// Add a new employee
employeeForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!currentCompany) {
        employeeMessage.textContent = "Company information is not ready.";
        return;
    }

    employeeMessage.textContent = "Saving employee...";

    const employee = {
        company_id: currentCompany.id,
        employee_name: document.getElementById("employeeName").value.trim(),
        email: document.getElementById("employeeEmail").value.trim() || null,
        phone: document.getElementById("employeePhone").value.trim() || null,
        basic_salary: Number(document.getElementById("basicSalary").value),
        house_allowance: Number(document.getElementById("houseAllowance").value || 0)
    };

    const { error } = await supabase
        .from("employees")
        .insert([employee]);

    if (error) {
        employeeMessage.textContent = "Could not save employee: " + error.message;
        return;
    }

    employeeMessage.textContent = "Employee added successfully!";
    employeeForm.reset();
    document.getElementById("houseAllowance").value = 0;

    await loadEmployees();
});

// Log out
logoutButton.addEventListener("click", async function() {
    await supabase.auth.signOut();
    window.location.href = "index.html";
});

loadCompany();
