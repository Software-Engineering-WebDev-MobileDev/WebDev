$(document).ready(function() {
    // Check if SessionID exists in localStorage
    var sessionID = localStorage.getItem('SessionID');
    if (sessionID) {
        sessionStorage.setItem('SessionID', sessionID);
        $('#divLogin').hide();
        $('#divDashboard').slideDown();
        $('#divEnvironment').slideDown();
        $("#btnLogout").show()
        UpdateDivEnvironment();
        updateEggInfo();
        fillTable();
        
    }
    
})

function check(a,b){
  // init
  var valid = true;

  let field = a;
  let error = b;
  if (!field.checkValidity()) {
    valid = false;
    field.classList.add("err");
    error.innerHTML = " Please Enter a valid input\r\n ";
  } else {
    field.classList.remove("err");
    error.innerHTML = "";
  }

  return valid;
}

function checkCapsLock(event) {
    const capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    const passwordInput = document.getElementById('txtLoginPassword');
    const capsLockWarning = document.getElementById('capsLockWarning');

    if (capsLockOn && passwordInput === document.activeElement) {
        capsLockWarning.style.display = 'block';
    } else {
        capsLockWarning.style.display = 'none';
    }
}

// Attach event listener to the password input
document.getElementById('txtLoginPassword').addEventListener('keypress', checkCapsLock);


// Get the modal
var modal = document.getElementById("settingsModal");

// Get the link that opens the modal
var link = document.getElementById("settingsLink");


// Get the <span> element that closes the modal
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


