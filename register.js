 import { supabase } from "./supabase-config.js";

const registrationForm = document.getElementById("companyRegistrationForm");
const registrationMessage = document.getElementById("registrationMessage");

registrationForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    registrationMessage.style.color = "blue";
    registrationMessage.textContent = "Registering your company...";

    const companyName = document.getElementById("companyName").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const email = document.getElementById("companyEmail").value.trim();
    const phone = document.getElementById("companyPhone").value.trim();
    const password = document.getElementById("companyPassword").value;

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    company_name: companyName,
                    owner_name: ownerName,
                    phone: phone
                },
                emailRedirectTo: "https://kadeci326.github.io/OnlinePayrollSystem/"
            }
        });

        if (error) {
            registrationMessage.style.color = "red";
            registrationMessage.textContent = "Registration failed: " + error.message;
            return;
        }

        if (data.user) {
            registrationMessage.style.color = "green";
            registrationMessage.textContent =
                "Account created successfully! Check your email to confirm registration.";
        } else {
            registrationMessage.style.color = "red";
            registrationMessage.textContent =
                "No account was returned. Please try again.";
        }

    } catch (error) {
        registrationMessage.style.color = "red";
        registrationMessage.textContent =
            "Error: " + error.message;
    }
});