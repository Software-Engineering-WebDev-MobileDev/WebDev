/*$('#btnAbout').on('click',function(){
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
        userLoc = localStorage.getItem('userLoc');
        }
    console.log(userLoc);
    setUserLocation(userLoc);
    $('#divAbout').slideDown();
})
*/
$('#btnReturnLogin').on('click',function(){
    userLoc = localStorage.getItem('userLoc');
    console.log(userLoc);
    switch (userLoc) {
        case 'errorPage':
            $('#divErrorPage').slideDown();
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
        $('#errLoginUsername').text('Username cannot be blank').addClass('error-message');
        $('#errLoginPassword').text('Password cannot be blank').addClass('error-message');

    } else {

        $.ajax({
            url: "/api/login",
            method: "POST",
            headers: {
                username: strUsername,
                password: strPassword,
            },
            success: function(result) {
                console.log(result);

                userLoc = 'errorpage'
                setUserLocation(userLoc);
                $("#btnHamburger").show();
                $("#btnDashboard").show();
                $('#btnLogout').show();
                $("#btnAccount").show();
                $("#btnIngredient").show();
                $("#btnRecipe").show();
                $("#btnTask").show();
                //$('#divNavbar').slideUp();
                $('#divLogin').slideUp(function(){
                    // $('#divErrorPage').slideDown();
                    userLoc = 'task'
                    window.location.href = "/task";
                });
                localStorage.setItem('session_id', result['session_id'])
                return result['session_id'];
            },
            error: function(e) {
                console.log(e);

                if (e.status === 400) { // Assuming 401 is returned for incorrect credentials
                    $('#errLoginUsername').text('');
                    $('#errLoginPassword').text('Incorrect username or password').addClass('error-message');
                } else {
                    $('#errLoginUsername').text('An error occurred. Please try again.').addClass('error-message');
                }
                return e;
            }
        });
    }
})

$(document).ready(function () {
    let strUsername = $('#txtRegisterUsername');
    let strPassword = $('#txtRegisterPassword');
    let strFirstName = $('#txtRegisterFirstName');
    let strLastName = $('#txtRegisterLastName');
    let strEmail = $('#txtRegisterEmail');
    let strPhone = $('#numRegisterPhone');
    let strEmployeeId = $('#txtRegisterEmployeeId');
    const phoneRegex = /^\(?\d{3}\)?[\d -]?\d{3}[\d -]?\d{4}$/;
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
            //checkEmailInUse(value); // Check if email is already in use
        } else {
            validateField(this, false, "Please enter a valid email.");
        }
    });

    $('#numRegisterPhone').on('input blur', function () {
        validateField(this, phoneRegex.test($(this).val()), "Phone number is not valid, please use the format xxx-xxx-xxxx or xxxxxxxxxx.");
    });

    $('#txtRegisterEmployeeId').on('input blur', function () {
        validateField(this, $(this).val().length > 0, "Employee ID cannot be blank.");
    });
    
    $('#btnRegister').on('click', function () {

        if ($('.error').length) {
            // Scroll to the first error if any errors exist
            $('html, body').animate({
                scrollTop: $('.error').first().offset().top - 20
            }, 500);
            return false; // Prevent form submission if errors are found
        }
        else {
        $('input').trigger('blur'); // Trigger blur to validate all fields
    
        // Make the AJAX request
        $.ajax({
            url: "/api/create_account",
            method: "POST",
            headers: {
                employee_id: strEmployeeId.val(),
                first_name: strFirstName.val(),
                last_name: strLastName.val(),
                username: strUsername.val(),
                password: strPassword.val(),
                email_address: strEmail.val(),
                phone_number: strPhone.val()
            },
            success: function(result) {
                console.log(result);
                

                //show Error Page
                //$('#divNavbar').slideUp();
                $('#divRegister').slideUp(function(){
                $('#divErrorPage').slideDown();
                userLoc = 'errorpage'
                setUserLocation(userLoc);
                });
                var observationDateTime = getTime();
        
                console.log(observationDateTime);
                return result['session_id'];
            },
            error: function(e) {
                console.log(e);
                return e;
            }
        })};
    })
    });

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
    let strSessionID = localStorage.getItem('session_id');
    fetch('/api/logout', {
        method: "POST",
        headers: {
            session_id: strSessionID
        }
    }).then(() => {}).catch(() => {});
    localStorage.removeItem('session_id');
    $('#btnLogout').hide();
    localStorage.setItem('userLoc', "login");
    // Redirect to the login page
    window.location.href = 'index.html';
});

$('#btnIngredient').on('click', function(){
    window.location.href = 'ingredient.html';
    userLoc = 'ingredient';
    setUserLocation(userLoc);
})

$('#btnAccount').on('click', function(){
    window.location.href = 'account.html';
    userLoc = 'account';
    setUserLocation(userLoc);
})

$('#btnDashboard').on('click', function(){
    window.location.href = 'dashboard.html';
    userLoc = 'dashboard';
    setUserLocation(userLoc);
})

$('#btnRecipe').on('click', function(){
    window.location.href = 'recipe.html';
    userLoc = 'recipe';
    setUserLocation(userLoc);
})

$('#btnTask').on('click', function(){
    window.location.href = 'task.html';
    userLoc = 'task';
    setUserLocation(userLoc);
})