
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
    submitButton.style.display = isDisabled ? "block" : "none";
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
