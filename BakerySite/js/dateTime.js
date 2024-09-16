/*
            function: dateTimeZip
            parameters: latitude, longitude, strZip
            purpose: This function takes the latitude, longitude, and zip code, and outputs the date and time at the location.
        */
            function dateTimeZip(latitude, longitude, strZip) {
                return new Promise((resolve, reject) => { //Setting up support for catch block
    
                const timeStamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
                const timeZoneApiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timeStamp}&key=${strGoogleMapsID}`;
                fetch(timeZoneApiUrl)
                    .then(response => { //Checks if timezone data can be fetched
                        if (!response.ok) {
                            throw new Error('Failed to fetch timezone data');
                        }
                        return response.json();
                    })
                    .then(timezoneData => { //Checks if API responds or not
                        if (timezoneData.status !== 'OK') {
                            throw new Error('Invalid response status from Google Maps API');
                        }
                        if (!timezoneData.timeZoneId) { //Checks if the program can find the Timezone ID
                            throw new Error('Timezone ID not found in response');
                        }
    
                        const timeZoneId = timezoneData.timeZoneId;
    
                        //Get current date and time in the location's timezone
                        const dateTimeApiUrl = `https://worldtimeapi.org/api/timezone/${timeZoneId}`;
                        return fetch(dateTimeApiUrl);
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch date and time data');
                        }
                        return response.json();
                    })
                    .then(data => { //Orders the dates and makes things prettier
                        const time = new Date(data.datetime);
                        const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const month = monthName[time.getMonth()];
                        const day = time.getDate();
                        const year = time.getFullYear();
                        const suffix = getSuffix(day); // Get the suffix for the day
    
                        const formattedDate = `${month} ${day}${suffix} ${year}`;
                        const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    
                        resolve({ date: formattedDate, time: formattedTime });
                    })
                    .catch(error => reject(error)); // Resolve or reject the promise based on the catch block
                });
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
    
            //Function in charge of setting the correct suffix for the date functions
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