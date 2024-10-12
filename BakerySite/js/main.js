$(document).ready(function () {
  // Hide error message on page load
  $('#loginErrorMessage').hide();

  // Check if SessionID exists in localStorage
  var sessionID = localStorage.getItem('session_id');

  // Debugging: Log the session ID
  console.log('Session ID:', sessionID);

  if (sessionID) {
      console.log('Session ID exists, showing the navbar.');
      $('#divLogin').hide();        // Hide the login form
      $('#navMain').show();         // Show the navigation bar
      $('#mainContent').show();     // Show the main content (e.g., tasks page)
      $('#btnHamburger').show();    // Show the hamburger button (if applicable)
      $('#btnLogout').show();       // Show logout button
      $('#btnAccount').show();      // Show account link
      $('#btnIngredient').show();   // Show ingredient link
      $('#btnRecipe').show();       // Show recipe link
      $('#btnTask').show();         // Show task link

      // Commenting out undefined functions to avoid errors
      // UpdateDivEnvironment();
      // updateEggInfo();
      // fillTable();
  } else {
      console.log('No Session ID, showing the login form.');
      $('#divLogin').show();        // Show the login form
      $('#navMain').hide();         // Hide the navigation bar
      $('#mainContent').hide();     // Hide the main content
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

              // Redirect to the tasks page
              window.location.href = 'tasks.html';
          } else {
              // Show error message if login fails
              $('#loginErrorMessage').show();
          }
      },
      error: function (err) {
          console.error('Login request failed', err);
          alert('An error occurred during login. Please try again.');
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

/* Password and input validation-related logic */
// Attach event listener to the password input
document.getElementById('txtLoginPassword').addEventListener('keypress', checkCapsLock);
document.getElementById('txtRegisterPassword').addEventListener('keypress', checkCapsLock);
document.getElementById('txtRegisterPassword').addEventListener('keypress', checkPasswordRequirements);

document.getElementById('txtLoginUsername').addEventListener('focusout', function () {
  check(document.getElementById('txtLoginUsername'), document.getElementById('errLoginUsername'));
});
document.getElementById('txtLoginPassword').addEventListener('input', function () {
  checkPasswordRequirements(document.getElementById('txtLoginPassword'), document.getElementById('passwordRequirements'));
});
document.getElementById('txtRegisterUsername').addEventListener('focusout', function () {
  check(document.getElementById('txtRegisterUsername'), document.getElementById('errRegisterUsername'));
});
document.getElementById('txtRegisterPassword').addEventListener('input', function () {
  checkPasswordRequirements(document.getElementById('txtRegisterPassword'), document.getElementById('passwordRequirements'));
});
document.getElementById('txtRegisterEmail').addEventListener('focusout', function () {
  check(document.getElementById('txtRegisterEmail'), document.getElementById('errRegisterEmail'));
});
document.getElementById('txtRegisterFirstName').addEventListener('focusout', function () {
  check(document.getElementById('txtRegisterFirstName'), document.getElementById('errRegisterFirstName'));
});
document.getElementById('txtRegisterLastName').addEventListener('focusout', function () {
  check(document.getElementById('txtRegisterLastName'), document.getElementById('errRegisterLastName'));
});

/* Modal Handling */
var modal = document.getElementById("settingsModal");
var link = document.getElementById("settingsLink");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Session management for refresh and setting location
sessionStorage.setItem('refresh', true);

if (sessionStorage.getItem('refresh')) {
    console.log('yes');
} else {
    sessionStorage.setItem('refresh', true);
    switch (userLoc) {
        case 'errorpage':
        case 'registration':
        case 'login':
            window.location.href = 'index.html';
            console.log(userLoc);
            setUserLocation(userLoc);
            break;
        case 'ingredient':
            window.location.href = 'ingredient.html';
            console.log(userLoc);
            setUserLocation(userLoc);
            break;
        case 'account':
            window.location.href = 'account.html';
            console.log(userLoc);
            setUserLocation(userLoc);
            break;
        case 'dashboard':
            window.location.href = 'dashboard.html';
            console.log(userLoc);
            setUserLocation(userLoc);
            break;
        case 'recipe':
            window.location.href = 'recipe.html';
            console.log(userLoc);
            setUserLocation(userLoc);
            break;
        case 'task':
            window.location.href = 'task.html';
            console.log(userLoc);
            setUserLocation(userLoc);
            break;
        default:
            break;
    }
}
