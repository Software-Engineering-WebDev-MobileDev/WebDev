// User's session_id to be used
const sessionID = localStorage.getItem('session_id');

function updateGreeting() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var greeting = document.getElementById("greeting")

    if (firstName || lastName) {
        greeting.innerText = "Hi, " + firstName + " " + lastName;
    } else {
        greeting.innerText = "Hi, there!";
    }
}

function toggleEditMode() {
    var formElements = document.querySelectorAll('#accountForm input');
    isDisabled = formElements[0].disabled;

    formElements.forEach(function(element) {
        element.disabled = !isDisabled; // Toggle the disabled attribute
    });

    var submitButton = document.getElementById("submitButton");
    submitButton.style.display = isDisabled ? "inline-block" : "none";
}

function submitForm() {
    updateGreeting();
    // Here you can add code to handle form submission, such as sending data to a server
    alert("Form submitted!");

    toggleEditMode(); // Disable form again after submission
    document.getElementById("submitButton").style.display = "none"; // Hide Submit button again
}

function togglePassword() {
    var passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

async function fillValues() {
    const info = await fetch(`/api/my_info`,
        {
            method: 'GET',
            headers: {
                session_id: sessionID,
            },
        }
    ).then(async (response) => {
        if (response.ok) {
            // Get the user's info
            const result = await response.json();
            const info = result["content"];
            // HTML elements
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const username = document.getElementById('username');
            const emailPrimary = document.getElementById('emailPrimary');
            const emailSecondary = document.getElementById('emailSecondary');
            const phonePrimary = document.getElementById('phonePrimary');
            const phoneSecondary = document.getElementById('phoneSecondary');

            firstName.value = info["FirstName"];
            lastName.value = info["LastName"];
            username.value = info["Username"];

            if (info["Emails"].length > 0) {
                for (const email of info["Emails"]) {
                    if (email["EmailTypeID"] === "primary") {
                        emailPrimary.value = email["EmailAddress"];
                        emailPrimary.id = email["EmailId"];
                        break;
                    }
                }
                if (!emailPrimary.value && info["Emails"].length > 0) {
                    emailPrimary.value = info["Emails"][0]["EmailAddress"];
                    emailPrimary.id = info["Emails"][0]["EmailId"];
                }
                for (const email of info["Emails"]) {
                    if (email["EmailTypeID"] === "primary") {
                        emailSecondary.value = email["EmailAddress"];
                        emailSecondary.id = email["EmailId"];
                        break;
                    }
                }
                if (!emailPrimary.value && info["Emails"].length > 1) {
                    emailSecondary.value = info["Emails"][1]["EmailAddress"];
                    emailSecondary.id = info["Emails"][1]["EmailId"];
                }
            }

            if (info["PhoneNumbers"].length > 0) {
                for (const Phone of info["PhoneNumbers"]) {
                    if (Phone["PhoneTypeID"] === "primary") {
                        phonePrimary.value = Phone["PhoneNumber"];
                        phonePrimary.id = Phone["PhoneNumberID"];
                        break;
                    }
                }
                if (!phonePrimary.value && info["PhoneNumbers"].length > 0) {
                    phonePrimary.value = info["PhoneNumbers"][0]["PhoneNumber"];
                    phonePrimary.id = info["PhoneNumbers"][0]["PhoneNumberID"];
                }
                for (const Phone of info["PhoneNumbers"]) {
                    if (Phone["PhoneTypeID"] === "primary") {
                        phoneSecondary.value = Phone["PhoneNumber"];
                        phoneSecondary.id = Phone["PhoneNumberID"];
                        break;
                    }
                }
                if (!phonePrimary.value && info["PhoneNumbers"].length > 1) {
                    phoneSecondary.value = info["PhoneNumbers"][1]["PhoneNumber"];
                    phoneSecondary.id = info["PhoneNumbers"][1]["PhoneNumberID"];
                }
            }
        }
        else {
            alert("Error getting your info!")
        }
    }
    ).catch((e) => {
        console.error(e);
        alert("Error getting your info!");
    });
}

const showPassword = document.getElementById("showPassword");
showPassword.addEventListener("mousedown", togglePassword);

const editButton = document.getElementById("editButton");
editButton.addEventListener("mousedown", toggleEditMode);

const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("mousedown", submitForm);

fillValues().then(() => {});