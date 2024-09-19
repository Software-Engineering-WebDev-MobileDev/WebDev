/*
function: setUserLocation
parameters: none
purpose: This function keeps track of what page the user is on
*/
function setUserLocation(location) {
    sessionStorage.setItem('userLoc', location);
}

/*
function: checkCapsLock
parameters: none
purpose: This function checks if caps lock is on and warns the user
*/
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
parameters: none
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
parameters: none
purpose: Saves last entered username to login window between sessions
*/
function save_data_to_localstorage(input_id) {
    const input_val = document.getElementById(input_id).value;
    localStorage.setItem(input_id, input_val);
    console.log(input_val);
    }
    
    
    txtLoginUsername.addEventListener("keyup", function() {
    save_data_to_localstorage("txtLoginUsername");
    });
    
    function init_values() {
    if (localStorage["txtLoginUsername"]) {
    txtLoginUsername.value = localStorage["txtLoginUsername"];
    }
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