//This is the ID we generated:
        //UYHIR9L2

        //The following id is for OpenWeather. It was generated under Colton's account
        const strOpenWeatherID = "";

         //The following id is for GoogleMaps. It was generated under Gage's account
         const strGoogleMapsID = "";

        /*
            function: UpdateDivEnvironment
            parameters: none
            purpose: This function finds the weather at the address that the user entered.
        */
        function UpdateDivEnvironment() {
            //First, get the email from the session ID
            var strSessionID = localStorage.getItem('SessionID');
            $.get('https://simplecoop.swollenhippo.com/sessions.php', {SessionID: strSessionID}, function(result){
                result = JSON.parse(result);
                //Debugging statement to check result
                //console.log(result);

                //Second, get the user's address
                $.get('https://simplecoop.swollenhippo.com/useraddress.php', {Email: result.Email}, function(resultAddress){
                    resultAddress = JSON.parse(resultAddress);
                    //Debugging statement to verify address
                    //console.log(resultAddress);

                    let strZip = resultAddress.ZIP + ",US";

                    //Debugging statement to verify ZIP code
                    //console.log(strZip)

                    //Third, find latitude and longitude based on ZIP code for weather
                    $.get('http://api.openweathermap.org/geo/1.0/zip', {zip:strZip, appid: strOpenWeatherID}, function(latLonResult){
                        //Debugging statement to verify latitude and longitude
                        //console.log(latLonResult);

                        const latitude = latLonResult.lat;
                        const longitude = latLonResult.lon;

                        $.get('https://api.openweathermap.org/data/2.5/weather', {lat:latLonResult.lat,lon:latLonResult.lon,appid:strOpenWeatherID,units:'imperial'},function(weatherResult){
                            //debugging statement to verify the weather returned from OpenWeather
                            //console.log(weatherResult);
                            $('#spanLocation').empty(); //remove all children in divLocation
                            $('#spanCurrentTemp').empty(); //remove all children in spanCurrentTemp
                            $('#spanCurrentHumidity').empty(); //remove all children in spanCurrentHumidity
                            $('#spanLocation').append(resultAddress.City);
                            $('#spanCurrentTemp').append(weatherResult.main.temp);
                            $('#spanCurrentHumidity').append(weatherResult.main.humidity);
                        })
                    })
                })
            })

            
        }