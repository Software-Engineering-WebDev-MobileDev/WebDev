// !!! REPLACE LATER WITH DIFFERENT SETTINGS

// When the user clicks the link, open the modal 
function openSettings() {
    modal.style.display = "block";
    getSettings();
    }
    
function saveSettings() {
    // Get values from input fields
    var doorOpenTime = $('#doorOpenTime').val();
    var doorCloseTime = $('#doorCloseTime').val();
    var doorStatusIndicator = document.getElementById('doorStatusIndicator').innerText;
    var fanTemperature = $('#fanTemperature').val();
    var heaterTemperature = $('#heaterTemperature').val();
    var settingsURL = ('https://simplecoop.swollenhippo.com/settings.php');

    var doorStatus = doorStatusIndicator === 'Open' ? 'Open' : 'Closed';

    var strSessionID = sessionStorage.getItem('SessionID');

    console.log({
            Door_Open: doorOpenTime,
            Door_Close: doorCloseTime,
            Door_Status: doorStatus,
            Fan_Temp: fanTemperature,
            Heater_Temp: heaterTemperature
        });

        /*
       !!! KEEP THESE, THEY WERE USED TO SAVE SETTINGS PREVIOUSLY AND UNTIL I FIGURE OUT A SECONDARY METHOD THIS NEEDS TO REMAIN


    var postSettings = {
        SessionID: sessionStorage.getItem('SessionID'),
        setting: "Door_Open_Time",
        value: doorOpenTime
    }

    //Saves Settings 
    $.post(settingsURL, postSettings, function(result) {
        // Handle the response
        console.log('Response:', result);
        console.log("Successfully saved settings")
    }).fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log("Failed to save settings")
    });

    var postSettings = {
        SessionID: sessionStorage.getItem('SessionID'),
        setting: "Door_Close_Time",
        value: doorCloseTime
    }

    //Saves Settings 
    $.post(settingsURL, postSettings, function(result) {
        // Handle the response
        console.log('Response:', result);
        console.log("Successfully saved settings")
    }).fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log("Failed to save settings")
    });

    var postSettings = {
        SessionID: sessionStorage.getItem('SessionID'),
        setting: "Door_Status",
        value: doorStatus
    }

    //Saves Settings 
    $.post(settingsURL, postSettings, function(result) {
        // Handle the response
        console.log('Response:', result);
        console.log("Successfully saved settings")
    }).fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log("Failed to save settings")
    });

    var postSettings = {
        SessionID: sessionStorage.getItem('SessionID'),
        setting: "Fan_Temperature",
        value: fanTemperature
    }

    //Saves Settings 
    $.post(settingsURL, postSettings, function(result) {
        // Handle the response
        console.log('Response:', result);
        console.log("Successfully saved settings")
    }).fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log("Failed to save settings")
    });

    var postSettings = {
        SessionID: sessionStorage.getItem('SessionID'),
        setting: "Heat_Temperature",
        value: heaterTemperature
    }

    //Saves Settings 
    $.post(settingsURL, postSettings, function(result) {
        // Handle the response
        console.log('Response:', result);
        console.log("Successfully saved settings")
    }).fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log("Failed to save settings")
    });*/


$.ajax({
    url: settingsURL,
    type: 'PUT', // Specify the HTTP method as PUT
    data: {
        SessionID: strSessionID,
        setting: "Door_Open_Time",
        value: doorOpenTime
    },
    success: function(result) {
        // Handle the success response
        console.log('Response:', result);
        console.log('Successfully saved settings');
    },
    error: function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log('Failed to save settings');
    }
});
$.ajax({
    url: settingsURL,
    type: 'PUT', // Specify the HTTP method as PUT
    data: {
        SessionID: strSessionID,
        setting: "Door_Close_Time",
        value: doorCloseTime
    },
    success: function(result) {
        // Handle the success response
        console.log('Response:', result);
        console.log('Successfully saved settings');
    },
    error: function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log('Failed to save settings');
    }
});

$.ajax({
    url: settingsURL,
    type: 'PUT', // Specify the HTTP method as PUT
    data: {
        SessionID: strSessionID,
        setting: "Door_Status",
        value: doorStatus
    },
    success: function(result) {
        // Handle the success response
        console.log('Response:', result);
        console.log('Successfully saved settings');
    },
    error: function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log('Failed to save settings');
    }
});

$.ajax({
    url: settingsURL,
    type: 'PUT', // Specify the HTTP method as PUT
    data: {
        SessionID: strSessionID,
        setting: "Fan_Temperature",
        value: fanTemperature
    },
    success: function(result) {
        // Handle the success response
        console.log('Response:', result);
        console.log('Successfully saved settings');
    },
    error: function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log('Failed to save settings');
    }
});

$.ajax({
    url: settingsURL,
    type: 'PUT', // Specify the HTTP method as PUT
    data: {
        SessionID: strSessionID,
        setting: "Heat_Temperature",
        value: heaterTemperature
    },
    success: function(result) {
        // Handle the success response
        console.log('Response:', result);
        console.log('Successfully saved settings');
    },
    error: function(xhr, status, error) {
        // Handle the failure
        console.error('Error:', error);
        console.log('Failed to save settings');
    }
});
}

// Send a GET request to retrieve settings
function getSettings(){
    var doorOpenTime = $('#doorOpenTime').val();
    var doorCloseTime = $('#doorCloseTime').val();
    var doorStatusIndicator = document.getElementById('doorStatusIndicator').innerText;
    var fanTemperature = $('#fanTemperature').val();
    var heaterTemperature = $('#heaterTemperature').val();
    var settingsURL = ('https://simplecoop.swollenhippo.com/settings.php');

    var doorStatus = doorStatusIndicator === 'Open' ? 'Open' : 'Closed';

    var strSessionID = sessionStorage.getItem('SessionID');
    
    var settingsData = [doorOpenTime, doorCloseTime, doorStatus, fanTemperature, heaterTemperature];

$.get(settingsURL, { SessionID: strSessionID, setting: "Door_Open_Time"})
    .done(function(response) {
        // Handle the successful response
        response = JSON.parse(response);
        console.log();
        console.log('Settings retrieved successfully:', response);
        $('#doorOpenTime').val(response.Value);
    })
    .fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error retrieving settings:', error);
        // Use default settings instead
        const defaultSettings = {
            doorOpenTime: '09:00',
            doorCloseTime: '17:00',
            doorStatus: 'Closed',
            fanTemperature: '72',
            heaterTemperature: '68'
        };
        updateSettingsUI(defaultSettings);
    });

    $.get(settingsURL, { SessionID: strSessionID, setting: "Door_Close_Time"})
    .done(function(response) {
        // Handle the successful response
        response = JSON.parse(response);
        console.log();
        console.log('Settings retrieved successfully:', response);
        $('#doorCloseTime').val(response.Value);
    })
    .fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error retrieving settings:', error);
        // Use default settings instead
        const defaultSettings = {
            doorOpenTime: '09:00',
            doorCloseTime: '17:00',
            doorStatus: 'Closed',
            fanTemperature: '72',
            heaterTemperature: '68'
        };
        updateSettingsUI(defaultSettings);
    });

    $.get(settingsURL, { SessionID: strSessionID, setting: "Door_Status"})
    .done(function(response) {
        // Handle the successful response
        response = JSON.parse(response);
        console.log();
        console.log('Settings retrieved successfully:', response);
        $('#doorStatus').val(response.Value);
    })
    .fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error retrieving settings:', error);
        // Use default settings instead
        const defaultSettings = {
            doorOpenTime: '09:00',
            doorCloseTime: '17:00',
            doorStatus: 'Closed',
            fanTemperature: '72',
            heaterTemperature: '68'
        };
        updateSettingsUI(defaultSettings);
    });

    $.get(settingsURL, { SessionID: strSessionID, setting: "Fan_Temperature"})
    .done(function(response) {
        // Handle the successful response
        response = JSON.parse(response);
        console.log();
        console.log('Settings retrieved successfully:', response);
        $('#fanTemperature').val(response.Value);
    })
    .fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error retrieving settings:', error);
        // Use default settings instead
        const defaultSettings = {
            doorOpenTime: '09:00',
            doorCloseTime: '17:00',
            doorStatus: 'Closed',
            fanTemperature: '72',
            heaterTemperature: '68'
        };
        updateSettingsUI(defaultSettings);
    });

    $.get(settingsURL, { SessionID: strSessionID, setting: "Heat_Temperature"})
    .done(function(response) {
        // Handle the successful response
        response = JSON.parse(response);
        console.log();
        console.log('Settings retrieved successfully:', response);
        $('#heaterTemperature').val(response.Value);
    })
    .fail(function(xhr, status, error) {
        // Handle the failure
        console.error('Error retrieving settings:', error);
        // Use default settings instead
        const defaultSettings = {
            doorOpenTime: '09:00',
            doorCloseTime: '17:00',
            doorStatus: 'Closed',
            fanTemperature: '72',
            heaterTemperature: '68'
        };
        updateSettingsUI(defaultSettings);
    });
}

//Function for the + and - buttons working to adjust the temperature in settings
function adjustTemperature(elementId, step) {
    var inputElement = document.getElementById(elementId);
    var currentValue = parseInt(inputElement.value);
    var newValue = currentValue + step;
    inputElement.value = newValue;
}

//Function to tell the button in settings if the status of the Door is Opened or Closed, and what the button should say
function toggleDoor() {
    var doorStatus = document.getElementById('doorStatusIndicator');
    var doorActionButton = document.getElementById('doorActionButton');
    
    if (doorStatus.innerText === 'Closed') {
        doorStatus.innerText = 'Open';
        doorActionButton.innerText = 'Close Door';
        console.log('Door Opened')
    } else {
        doorStatus.innerText = 'Closed';
        doorActionButton.innerText = 'Open Door';
        console.log('Door Closed')
    }
}