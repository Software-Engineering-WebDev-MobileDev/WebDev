/*
function: setUserLocation
parameters: location
purpose: This function keeps track of what page the user is on
*/
function setUserLocation(location) {
    localStorage.setItem('userLoc', location);
    
}

/*
function: checkCapsLock
parameters: event
purpose: This function checks if caps lock is on and warns the user
*/
function checkCapsLock(event) {
    const capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    
    // Determine which input triggered the event
    if (event.target.id === 'txtLoginPassword') {
        const capsLockWarningLogin = document.getElementById('capsLockWarningLogin');
        capsLockWarningLogin.style.display = capsLockOn ? 'block' : 'none';
    } else if (event.target.id === 'txtRegisterPassword') {
        const capsLockWarningRegister = document.getElementById('capsLockWarningRegister');
        capsLockWarningRegister.style.display = capsLockOn ? 'block' : 'none';
    }
}

/*
function: getDate
parameters: none
purpose: This function displays the current Date
*/
function getDate() {
    var time = new Date();
    var monthName = ["Janurary", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
            
    var year = time.getFullYear();
    var month = monthName[time.getMonth()];
    var day = time.getDate();

    var orderedDate = month + " " + day + getSuffix(day) + " " + year;
    return orderedDate;
}

/*
    function: getTime
    parameters: none
    purpose: This function displays the current Time
*/
function getTime() {
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    var orderedTime = hours + ":" + minutes + ":" + seconds;
    return orderedTime
}
        
/*
function: getSuffix
parameters: day
purpose: This function is in charge of setting the correct suffix for the date functions
*/
function getSuffix(day) {
    if (day >=11 && day <= 13) {
        return "th";
    }

    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

/*
function: save_data_to_localstorage
parameters: input_id
purpose: Saves last entered username to login window between sessions
*/
function save_data_to_localstorage(input_id) {
    const input_val = document.getElementById(input_id).value;
    localStorage.setItem(input_id, input_val);
    console.log(input_val);
    } 
    
/*
function: init_values
parameters:
purpose: Displays saved username value from last entry
*/
function init_values() {
    txtLoginUsername.addEventListener("keyup", function() {
    save_data_to_localstorage("txtLoginUsername");
    });
    if (localStorage["txtLoginUsername"]) {
    txtLoginUsername.value = localStorage["txtLoginUsername"];
    }
}


async function fetchIngredients(){
    try{
        const response = await fetch('#get-ingredients-get');
        const ingredients = await response.json();
        displayIngredients(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
}

/*
function: displayIngredients
parameters: none
purpose: display ingredients as cards
*/
function displayIngredients() {
    const container = document.getElementById('ingredientContainer');
    ingredients.forEach(ingredient => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = ingredient.name;
        card.addEventListener('click', () => {
            window.location.href = `ingredient.html?id=${ingredient.id}`;
        });
        container.appendChild(card);
    });
}

// !!! LATER USEFUL FOR ANY TABLES NEEDED
/*
function fillTable() {
    let strSessionID = sessionStorage.getItem('SessionID');
    $.getJSON('https://simplecoop.swollenhippo.com/environment.php', {SessionID: strSessionID, days: '999'}, function(result) {
        if(result.length > 0) {
            $('#pNoObservations').hide();
            result.forEach(function(observation) {
                let strRow = `<tr><td>${observation.ObservationDateTime}</td><td>${observation.Temperature}</td><td>${observation.Humidity}</td></tr`;
                $('#tblEnvironment, tbody').append(strRow);
            });

        }

        $('#tblEnvironment').DataTable({
            "order": [[0, 'dsc']]
        });

    })
}  */


/*
function: checkPasswordRequirements
parameters: none
purpose: Get the password input field and the error elements, check input validity
*/
function checkPasswordRequirements() {
    const passwordInput = document.getElementById('txtRegisterPassword');
    const passwordRequirements = document.getElementById('passwordRequirements');
    const lengthReq = document.getElementById('lengthReq');
    const numberReq = document.getElementById('numberReq');
    const specialCharReq = document.getElementById('specialCharReq');
    const password = passwordInput.value;
    let valid = true;

    // Show the password requirements when the field is focused
    passwordRequirements.style.display = 'block';

    // Check password length
    if (password.length >= 8) {
        lengthReq.style.color = '#047609'; // Green if valid
    } else {
        lengthReq.style.color = '#B22222'; // Red if invalid
        valid = false;
    }

    // Check for at least one number
    if (/\d/.test(password)) {
        numberReq.style.color = '#047609'; // Green if valid
    } else {
        numberReq.style.color = '#B22222'; // Red if invalid
        valid = false;
    }

    // Check for at least one special character
    if (/[!@#$%^&*]/.test(password)) {
        specialCharReq.style.color = '#047609'; // Green if valid
    } else {
        specialCharReq.style.color = '#B22222'; // Red if invalid
        valid = false;
    }

    // Color the entire section green if all requirements are met
    if (valid) {
        passwordRequirements.style.color = '#047609'; // Green if all conditions are met
    } else {
        passwordRequirements.style.color = '#B22222'; // Red if any condition is unmet
    }

    return valid;
}

// Validate and display feedback
function validateField(element, condition, errorMsg) {
    const $field = $(element);
    const $error = $field.next('.error-message');

    if (condition) {
        $field.removeClass('error');
        if ($error.length) $error.remove();
    } else {
        $field.addClass('error');
        if (!$error.length) {
            $field.after(`<span class="error-message">${errorMsg}</span>`);
        }
    }
}

// Email in-use check (using AJAX for server-side verification simulation)
/*function checkEmailInUse(strEmail) {
    // Simulating an AJAX request for duplicate email check
    $.ajax({
        url: '/api/add_user_email', // Example endpoint
        method: 'POST',
        headers: { 
            'email_address': strEmail,  // Send email in the headers
            //'session_id': sessionID, // session ID
            'type': 'main' // Email type
        },
        success: function (response) {
            if (response.status === 'success') {
                validateField('#txtRegisterEmail', true, "");
            } else if (response.reason === 'Email is already in use.') {
                validateField('#txtRegisterEmail', false, "Email is already in use.");
            } else {
                validateField('#txtRegisterEmail', false, response.reason || "Unknown error.");
            }
        },
        error: function () {
            validateField('#txtRegisterEmail', false, "Unable to validate email. Please try again.");
        }
    });
}

*/

