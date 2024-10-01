let strUsername = $('#txtRegisterUsername').val();
let strPassword = $('#txtRegisterPassword').val();
let strFirstName = $('#txtRegisterFirstName').val();
let strLastName = $('#txtRegisterLastName').val();
let strEmail = $('#txtRegisterEmail').val();
let strPhone = $('#numRegisterPhone').val();
let strEmployeeId = $('#txtRegisterEmployeeId').val();
let phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

$('#btnAbout').on('click',function(){
   $('#divNavButtons').slideToggle();
    //Slide Login or Register card before sliding About card down
    var userLoc;
    if ($('#divLogin').is(':visible')) {
        userLoc = 'login';
        $('#divLogin').slideUp();
    } else if ($('#divRegister').is(':visible')) {
        userLoc = 'register';
        $('#divRegister').slideUp();
    } else if ($('#divDashboard').is(':visible')) {
        userLoc = 'dashboard';
        $('#divDashboard').slideUp();              
    }   else {
        userLoc = sessionStorage.getItem('userLoc');
        }
    console.log(userLoc);
    setUserLocation(userLoc);
    $('#divAbout').slideDown();
})

$('#btnReturnLogin').on('click',function(){
    $('#divAbout').slideUp();
    var userLoc = sessionStorage.getItem('userLoc');
    console.log(userLoc);
    switch (userLoc) {
        case 'dashboard':
            $('#divDashboard').slideDown();
            break;
        case 'registration':
            $('#divRegistration').slideDown;
            break;
        case 'login':          
            $('#divLogin').slideDown();
            break;
        default:
            break;
    }
})

$('#btnLogin').on('click',function(){
    let strUsername = $('#txtLoginUsername').val();
    let strPassword = $('#txtLoginPassword').val();

    if(strUsername.length < 1 || strPassword.length < 1){
        Swal.fire({
            title: "Oops!",
            html: '<p>Email and Password cannot be blank</p>',
            icon: "error"
        })
    } else {

        $.post('/api/login', {username: strUsername, password: strPassword}, function(result){
            result = JSON.parse(result);
            console.log(result);

            if(result.Outcome != 'false') {
                sessionStorage.setItem('SessionID',result.SessionID);
                localStorage.setItem('SessionID', result.SessionID);

                $("#btnDashboard").show()
                $('#btnLogout').show();
                $("#btnAccount").show()
                $("#btnIngredient").show()
                $("#btnRecipe").show()
                $("#btnTask").show()
                //$('#divNavbar').slideUp();
                $('#divLogin').slideUp(function(){
                    $('#divDashboard').slideDown();
                });

                fillTable();

            } else {
                Swal.fire({
                    title: "Oops!",
                    html: '<p>Invalid username and/or password</p>',
                    icon: "error"
                })
            }                    
        });
    }
})

$(document).ready(function () {
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    const emailRegex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

    // Add inline validation for other fields
    $('#txtRegisterUsername').on('input blur', function () {
        validateField(this, $(this).val().length > 0, "Username cannot be blank.");
    });

    $('#txtRegisterPassword').on('focus input blur', function () {
        checkPasswordRequirements(); // Check password requirements dynamically on focus and input
    });

    $('#txtRegisterFirstName').on('input blur', function () {
        validateField(this, $(this).val().length > 0, "First Name cannot be blank.");
    });

    $('#txtRegisterLastName').on('input blur', function () {
        validateField(this, $(this).val().length > 0, "Last Name cannot be blank.");
    });

    $('#txtRegisterEmail').on('input blur', function () {
        let value = $(this).val();
        if (emailRegex.test(value)) {
            checkEmailInUse(value); // Check if email is already in use
        } else {
            validateField(this, false, "Please enter a valid email.");
        }
    });

    $('#numRegisterPhone').on('input blur', function () {
        validateField(this, phoneRegex.test($(this).val()), "Phone number is not valid, please use the format xxx-xxx-xxxx.");
    });

    $('#txtRegisterEmployeeId').on('input blur', function () {
        validateField(this, $(this).val().length > 0, "Employee ID cannot be blank.");
    });
    
    // Final check on form submit
    $('#btnRegister').on('click', function () {
        $('input').trigger('blur'); // Trigger blur to validate all fields
        if ($('.error').length) {
            // Scroll to the first error if any errors exist
            $('html, body').animate({
                scrollTop: $('.error').first().offset().top - 20
            }, 500);
            return false; // Prevent form submission if errors are found
        }
        else {
            //create new user with users.php
            $.post('/api/create_account', {employee_id: strEmployeeId, first_name: strFirstName, last_name: strLastName, username: strUsername, password: strPassword},function(status){
                status = JSON.parse(status);
                console.log(status);
    
                if (status.Outcome == 'success') {
                    //create a session ID
                    $.post('https://simplecoop.swollenhippo.com/sessions.php', {Email: strEmail, Password: strPassword}, function(sessionResult){
                        sessionResult = JSON.parse(sessionResult);
                        console.log(sessionResult);
    
                        sessionStorage.setItem('SessionID',sessionResult.SessionID);
                    });
    
                    //record user's address
                    $.post('https://simplecoop.swollenhippo.com/useraddress.php', {Email: strEmail}, function(result){
                        console.log(result);
                    });
    
                    //show dashboard
                    //$('#divNavbar').slideUp();
                    $('#divRegister').slideUp(function(){
                        $('#divDashboard').slideDown();
                    });
    
                    fillTable();
                    
                } else { //user could not register
                    Swal.fire({
                        title: "Oops!",
                        html: '<p>Registration failed</p>',
                        icon: "error"
                    });
                }
            })
        }
        var observationDateTime = getTime();
        
        console.log(observationDateTime);
    }
    )});

// Email in-use check (using AJAX for server-side verification simulation)
function checkEmailInUse(email) {
    // Simulating an AJAX request for duplicate email check
    $.ajax({
        url: '/check-email', // Example endpoint
        method: 'POST',
        data: { email: email },
        success: function (response) {
            if (response.inUse) {
                validateField('#txtRegisterEmail', false, "Email is already in use.");
            } else {
                validateField('#txtRegisterEmail', true, "");
            }
        },
        error: function () {
            validateField('#txtRegisterEmail', false, "Unable to validate email. Please try again.");
        }
    });
}


$('#btnToggle').on('click',function(){
    $('#divLogin').slideUp(function(){
        $('#divRegister').slideDown();
    })
})

$('#btnReturn').on('click',function(){
    $('#divRegister').slideUp(function(){
        $('#divLogin').slideDown();
  })
})

$('#btnClear').on('click',function(){
    $('#txtRegisterUsername').val( '')
    $('#txtRegisterPassword').val( '')
    $('#txtRegisterFirstName').val( '')
    $('#txtRegisterLastName').val( '')
    $('#txtRegisterEmail').val( '')
    $('#txtRegisterEmployeeId').val( '')
    $('#numRegisterPhone').val( '')

})

$('#txtLoginPassword').keypress(function(event) {
    if(event.which === 13){
        $('#btnLogin').click();
    }
});

$('#txtEggs').keypress(function(event) {
    if(event.which === 13){
        event.preventDefault();
        $('#btnLogEggs').click();
    }
});

$('#btnRefresh').on('click', function(){

})

$('#btnLogout').on('click', function(){
    let strSessionID = sessionStorage.getItem('SessionID');
    sessionStorage.removeItem('SessionID');
    localStorage.removeItem('SessionID');
    $.ajax({
        url: 'https://simplecoop.swollenhippo.com/sessions.php',
        type: 'DELETE',
        data: strSessionID
    })
    $('#btnLogout').hide();
    window.location.reload();
    setUserLocation('login');
});

$('#btnIngredient').on('click', function(){
    window.location.href = 'ingredient.html';
})

$('#btnAccount').on('click', function(){
    window.location.href = 'account.html';
})

$('#btnDashboard').on('click', function(){
    window.location.href = 'dashboard.html';
})

$('#btnRecipe').on('click', function(){
    window.location.href = 'recipe.html';
})

$('#btnTask').on('click', function(){
    window.location.href = 'task.html';
})
