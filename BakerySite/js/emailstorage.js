//Saves last entered username to login window between sessions
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