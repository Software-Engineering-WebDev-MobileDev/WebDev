$(document).ready(function () {
    // Hide error message on page load
    $('#loginErrorMessage').hide();
  
    // Check if SessionID exists in localStorage
    var sessionID = localStorage.getItem('session_id');
  
    // Debugging: Log the session ID
    console.log('Session ID:', sessionID);
  
    // Detect the current page (login page or task page)
    var currentPage = window.location.pathname;
  
    // Check if we are on the login page
    if (currentPage === '/index.html' || currentPage === '/') {
        if (sessionID) {
            // If session exists and we're on the login page, redirect to task page
            console.log('Session ID exists, redirecting to task.html');
            window.location.href = 'task.html';
        }
    } else if (currentPage === '/task.html') {
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
  });
  
  // Login functionality
  $('#btnLogin').click(function () {
    var username = $('#txtLoginUsername').val();
    var password = $('#txtLoginPassword').val();
  
    // Basic validation
    if (username === '' || password === '') {
        alert('Please enter both username and password.');
        return;
    }
  
    // Perform an AJAX request to validate the user
    $.ajax({
        url: '/login',  // Replace with your actual backend login route
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            username: username,
            password: password
        }),
        success: function (response) {
            if (response.success) {
                // Store the session ID returned by the backend
                localStorage.setItem('session_id', response.session_id);
  
                // Redirect to task.html after successful login
                window.location.href = 'task.html';
            } else {
                // Show the red error message if login fails
                $('#loginErrorMessage').text('⚠ Invalid login credentials! Please try again.').show();
            }
        },
        error: function (err) {
            console.error('Login request failed', err);
            $('#loginErrorMessage').text('An error occurred during login. Please try again.').show();
        }
    });
  });
  
  // Logout functionality
  $('#btnLogout').click(function () {
    var sessionID = localStorage.getItem('session_id');
  
    // Perform an AJAX request to logout
    $.ajax({
        url: '/logout',  // Replace with your actual backend logout route
        type: 'POST',
        headers: {
            'session_id': sessionID
        },
        success: function () {
            // Remove session ID from localStorage
            localStorage.removeItem('session_id');
  
            // Redirect to the login page
            window.location.href = 'index.html';
        },
        error: function (err) {
            console.error('Logout request failed', err);
        }
    });
  });
  