// !!! USE THIS FOR LATER, HAS FUNCTIONALITY FOR STORING RECORDED DATA IN A TABLE
function recordEggHarvest(intEggs) {
    let sessionID = sessionStorage.getItem('SessionID');
    //let observationDate = getDate();
    //let observationTime = getTime();
    var currentDate = new Date();
    currentDate = currentDate.toISOString()

    $.post('https://simplecoop.swollenhippo.com/eggs.php', {SessionID:sessionID, observationDateTime:currentDate, eggs:intEggs}, function(result) {
        result = JSON.parse(result);
        //console.log(result);
        if (result.LogID) {
            Swal.fire({
                title:"Success!",
                html:"<p>harvest logged</p>",
                icon:"success"
            })
        } else {
            Swal.fire({
                title: "Oops!",
                html: '<p>Egg harvest recorded failed</p>',
                icon: "error"
            })
        }
    });
}

$("#btnLogEggs").on('click',function(){
    let strEggs = $("#txtEggs").val();
    //Debugging statement to check the value entered by the user
    //console.log(strEggs);

    if (strEggs) {
        recordEggHarvest(strEggs);
    } else {
        Swal.fire({
            title: "Oops!",
            html: '<p>Number of eggs not provided</p>',
            icon: "error"
        })
    }
})

// result = JSON.parse(result);
function updateEggInfo() {
let strSessionID = sessionStorage.getItem('SessionID');

// Make GET request to eggs.php
$.get('https://simplecoop.swollenhippo.com/eggs.php', {SessionID: strSessionID, days: '7'}, function(result){
    result = JSON.parse(result);
    console.log('Data from eggs.php:', result);

    // Check if the result is empty or not an array
    if (!result || !Array.isArray(result)) {
        console.error('Invalid or empty response from server');
        return;
    }

    // Destroy existing chart if it exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Process data and create chart
    let labels = [];
    let data = [];
    result.forEach(function(record) {
        // Assuming your JSON response has fields 'currentDate' and 'intEggs'
        labels.push(record.LogDateTime); 
        data.push(record.Harvested); 
    });

    // Create Chart.js chart
    let ctx = document.getElementById('eggChart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Eggs Harvested',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
});
}