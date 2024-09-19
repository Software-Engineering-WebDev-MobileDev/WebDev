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

        $.post('https://simplecoop.swollenhippo.com/sessions.php', {Email: strUsername, Password: strPassword}, function(result){
            result = JSON.parse(result);
            console.log(result);

            if(result.Outcome != 'false') {
                sessionStorage.setItem('SessionID',result.SessionID);
                localStorage.setItem('SessionID', result.SessionID);

                $('#btnLogout').show();
                $("#btnAccount").show()
                $("#btnDashboard").show()
                $("#btnInventory").show()
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

$('#btnRegister').on('click',function(){
    //define string variables to hold user input on the registration card
    let strUsername = $('#txtRegisterUsername').val();
    let strPassword = $('#txtRegisterPassword').val();
    let strFirstName = $('#txtRegisterFirstName').val();
    let strLastName = $('#txtRegisterLastName').val();
    let strEmail = $('#txtRegisterEmail').val();
    let strPhone = $('#numRegisterPhone').val();
    let phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

    let blnError = false; //This is set to true if the user entered something incorrect
    let strErrorMsg = ""; //Error messages are concatenated to this string

    if (strUsername < 1) {
        blnError = true;
        strErrorMsg += "Username cannot be blank. ";
    }
    if (strPassword < 1) {
        blnError = true;
        strErrorMsg += "Password cannot be blank. ";
    }
    if (strFirstName < 1) {
        blnError = true;
        strErrorMsg += "First name cannot be blank. ";
    }
    if (strLastName < 1) {
        blnError = true;
        strErrorMsg += "Last name cannot be blank. ";
    }
    if (strEmail < 1) {
        blnError = true;
        strErrorMsg += "Email cannot be blank. ";
    }
    if (strPhone < 1) {
        blnError = true;
        strErrorMsg += "Phone number cannot be blank. ";
    }

    if (!phoneRegex.test(strPhone)) {
        blnError = true;
        strErrorMsg += "Phone number is not valid, please use the format xxx-xxx-xxxx.  "
    }

    if (blnError) { //if there was incorrect input
        Swal.fire({
            title: "Oops!",
            html: '<p>' + strErrorMsg + '</p>',
            icon: "error"
        });
    } else {
        //create new user with users.php
        $.post('https://simplecoop.swollenhippo.com/users.php', {Email: strEmail, Password: strPassword, FirstName: strFirstName, LastName: strLastName, CoopID: strCoopID},function(result){
            result = JSON.parse(result);
            console.log(result);

            if (result.Outcome == 'New User Created') {
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
})
    

$('#txtRegisterEmail').focusout(function() {
    let value = $('#txtRegisterEmail').val();
    let emailRegEx = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    if(!emailRegEx.test(value)) {
        $('#txtRegisterEmail').addClass('err');
        $('#errRegisterEmail').text('Please Enter a Valid Email');
    } else {
        $('#txtRegisterEmail').removeClass('err');
        $('#errRegisterEmail').text('');
    }
}) 


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

$('#btnInventory').on('click', function(){
    window.location.href = 'inventory.html';
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
