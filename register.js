import { supabase } from "./supabase-config.js";

const registrationForm = document.getElementById(
    "companyRegistrationForm"
);

const registrationMessage = document.getElementById(
    "registrationMessage"
);

registrationForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    registrationMessage.textContent = "Creating your company account...";

    const companyName = document.getElementById("companyName").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const email = document.getElementById("companyEmail").value.trim();
    const phone = document.getElementById("companyPhone").value.trim();
    const password = document.getElementById("companyPassword").value;

    try {

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,

            options: {
                data: {
                    company_name: companyName,
                    owner_name: ownerName,
                    phone: phone
                },
                emailRedirectTo: window.location.origin + "/OnlinePayrollSystem/"
            }
        });

        if (error) {
            registrationMessage.textContent = error.message;
            return;
        }

        registrationMessage.textContent =
            "Registration submitted! Check your email to confirm your account.";

        registrationForm.reset();

    } catch (error) {

        registrationMessage.textContent =
            "Something went wrong. Please try again.";

        console.error(error);
    }

});