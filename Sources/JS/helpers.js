const weatherTemplate = (currentInfo) => {
    console.log(currentInfo)
    return `<p>${day.toDateString()}</p>
    <img src="http://openweathermap.org/img/wn/${currentInfo.weather[0].icon}@2x.png">
    <p>Condition: ${currentInfo.weather[0].main}</p>
    <p>Temperature: ${kelvinToCelcius(currentInfo.main.temp)}&deg;C</p>
    <p>Feels like: ${kelvinToCelcius(currentInfo.main.feels_like)}&deg;C</p>`;
    
}

// Convert Kelvin to Fahrenheit:

const kelvinToCelcius = k => (k - 273.15).toFixed(0);
const day = new Date()


// Places template

const placesTemplate = (venue, venuePhoto) => {
    return `<h4>${venue.name}</h4>
    <div class="venuePhoto-container">
    <img class="venuePhoto" src="${venuePhoto}";
    </div>
    <p>Address:</p>
    <p>${venue.location.formattedAddress[0]},</p>
    <p>${venue.location.formattedAddress[1]},</p>
    <p>${venue.location.formattedAddress[2]}</p>`
}


//Hotels template 

const hotelsTemplate = (hotel, hotelAddress, hotelTagline, hotelPhotoSrc) => {
    return `<h4>${hotel.name}</h4>
        <div class="hotel-container">
        <div class="hotel-img">
            <img src="${hotelPhotoSrc}" class="hotel-photo">
        </div>
            <div class="hotel-detail">
                <p>Address:</p>
                <p>${hotelAddress}</p>
                <p>Highlight:</p>
                <p>${hotelTagline}</p>
            </div>
        </div>`
};