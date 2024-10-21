$(document).ready(function () {
  init_values();

    // Check if SessionID exists in localStorage
    var sessionID = localStorage.getItem('SessionID');
    if (sessionID) {
        sessionStorage.setItem('SessionID', sessionID);
        
        $('#divLogin').hide();
        $('#divDashboard').slideDown();
        $("#btnLogout").show()
        $("#btnAccount").show()
        $("#btnDashboard").show()
        $("#btnIngredient").show()
        $("#btnRecipe").show()
        $("#btnTask").show()
        UpdateDivEnvironment();
        updateEggInfo();
        fillTable();
        
    }
    // Hide error message on page load
    $('#loginErrorMessage').hide();
  
    // Check if SessionID exists in localStorage
    var sessionID = localStorage.getItem('session_id');
  
    // Debugging: Log the session ID
    console.log('Session ID:', sessionID);
  
    // Detect the current page (login page or task page)
    var currentPage = window.location.pathname;
  
    // Handle login page logic
    if (currentPage.includes('index.html') || currentPage === '/') {
        if (sessionID) {
            // If session exists and we're on the login page, redirect to task page
            console.log('Session ID exists, redirecting to task.html');
            window.location.href = 'task.html';
        }
    } else if (currentPage.includes('task.html')) {
        // If we are on the task page and no session ID, redirect to login
        if (!sessionID) {
            console.log('No session ID, redirecting to login page');
            window.location.href = 'index.html';
        } else {
            // Show task page if session exists
            $('#navMain').show();
            $('#mainContent').show();
        }
    }
  
    // Attach event listener to the password input
document.getElementById('txtLoginPassword').addEventListener('keypress', checkCapsLock);

// Attach event listener to the password registration
document.getElementById('txtRegisterPassword').addEventListener('keypress', checkCapsLock);

// Attach event listener to password input to check requirements in real-time
document.getElementById('txtRegisterPassword').addEventListener('keypress', checkPasswordRequirements);

document.getElementById('txtLoginUsername').addEventListener('focusout', function() {
  check(document.getElementById('txtLoginUsername'), document.getElementById('errLoginUsername'));
});

document.getElementById('txtLoginPassword').addEventListener('input', function() {
  check(document.getElementById('txtLoginPassword'), document.getElementById('passwordRequirements'));
});

document.getElementById('txtRegisterUsername').addEventListener('focusout', function() {
  check(document.getElementById('txtRegisterUsername'), document.getElementById('errRegisterUsername'));
});

document.getElementById('txtRegisterPassword').addEventListener('input', function() {
  checkPasswordRequirements(document.getElementById('txtRegisterPassword'), document.getElementById('passwordRequirements'));
});

document.getElementById('txtRegisterEmail').addEventListener('focusout', function() {
  check(document.getElementById('txtRegisterEmail'), document.getElementById('errRegisterEmail'));
});

document.getElementById('txtRegisterFirstName').addEventListener('focusout', function() {
  check(document.getElementById('txtRegisterFirstName'), document.getElementById('errRegisterFirstName'));
});

document.getElementById('txtRegisterLastName').addEventListener('focusout', function() {
  check(document.getElementById('txtRegisterLastName'), document.getElementById('errRegisterLastName'));
});
});
