
const $button = $('#button');
const $inputField = $('#city');
const $weather = $('#weather1');
const $locations = [$("#location1"), $("#location2"), $("#location3")];
const $destination = $('.destination');
const $information = $('.information');
const $accommodations = [$('#accommodation1'), $('#accommodation2'), $('#accommodation3')];

// Get Open Weather

const weatherKey = '41e841dbdab5bd8a0363d586a87eba18';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='; 


const getWeather = async () => {
    const city = $inputField.val();
    const urlToFetch = `${weatherUrl}${city}&appid=${weatherKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        }
    } catch(error) {
        console.log(error);
    }
};

const displayWeather = (currentInfo) => {
    const weatherContent = weatherTemplate(currentInfo);
    $weather.append(weatherContent);
};


// Get FourSquare

const fourSquareKey = 'Y3FSJDWAIS2KDV2NJ5CQCSAV0RROBE12BNQNKNIIPEGROQVO';
const fourSquareId =  'WT1X5FBZ5U3MNILCXIEAYNLVL0DVIGOYGQCKY1GAZHY3EJOW';
const fourSquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=';

const getPlaces = async () => {
    const city = $inputField.val();
    const urlToFetch = `${fourSquareUrl}${city}&limit=10&client_id=${fourSquareId}&client_secret=${fourSquareKey}&v=20200708`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
            console.log(venues);
            return venues; 
        }

    } catch(error) {
        console.log(error);
    }
};

// Get Venue Photo

const photoUrl = 'https://api.foursquare.com/v2/venues/';

const venuePhoto = async (venue) => {
    const venueId = venue.id;
    urlToFetch = `${photoUrl}${venueId}/photos?group=venue&limit=10&client_id=${fourSquareId}&client_secret=${fourSquareKey}&v=20200708`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            //console.log(jsonResponse);
            const photoUrl = `${jsonResponse.response.photos.items[0].prefix}300x300${jsonResponse.response.photos.items[0].suffix}`;
            return photoUrl;
        }

    } catch(error) {
        console.log(error)
    }
};



const displayPlaces = (venues) => {        
        $locations.forEach(async location => {
            let randomIndex = Math.floor(Math.random() * venues.length);
            const venue = venues[randomIndex];
            const getVenuePhoto = await venuePhoto(venue);
            const placesContent = placesTemplate(venue, getVenuePhoto);
            location.append(placesContent)       
        });
        $destination.append(`<h2>${venues[0].location.city}</h2>`) 
        
    };


// Get Hotels

const hotelsKey = 'ff03f9496cmsh69afc9384b1ed09p1b6882jsn34c9feadbb17';

const getHotelsAreaId = async () => {
    const city = $inputField.val(); 
    const urlToFetch = `https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=${city}&rapidapi-key=${hotelsKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            //console.log(jsonResponse);
            const hotelsAreaId = jsonResponse.suggestions[0].entities[0].destinationId;
            return hotelsAreaId;
        }

    } catch(error) {
        console.log(error)
    }
};

const getHotels = async (hotelsAreaId) => {
    const urlToFetch = `https://hotels4.p.rapidapi.com/properties/list?currency=USD&locale=en_US&sortOrder=PRICE&destinationId=${hotelsAreaId}&pageNumber=1&checkIn=2020-01-08&checkOut=2020-01-15&pageSize=3&adults1=1&rapidapi-key=${hotelsKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const hotels = jsonResponse.data.body.searchResults.results;
            //console.log(hotels);
            return hotels;
        }
    } catch(error) {
        console.log(error);
    }
};


const getHotelsInfo = async (hotel) => {
    const hotelId = hotel.id;
    const urlToFetch = `https://hotels4.p.rapidapi.com/properties/get-details?locale=en_US&currency=USD&checkOut=2020-01-15&adults1=1&checkIn=2020-01-08&id=${hotelId}&rapidapi-key=${hotelsKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            //console.log(jsonResponse);
            //const hotelInfo = jsonResponse.data.body;
            //console.log(hotelInfo);
            return jsonResponse;
        }
    } catch(error) {
        console.log(error);
    }
  
};



/*const getHotelsPhoto = async (hotel) => {
    const hotelId = hotel.id;
    const urlToFetch = `https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=${hotelId}&rapidapi-key=${hotelsKey}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const hotelPhotoBaseUrl = jsonResponse.hotelImages[0].baseUrl;
            //console.log(hotelPhotoBaseUrl);
            const hotelPhotoUrl = hotelPhotoBaseUrl.replace('_{size}.jpg', '.jpg');
            return hotelPhotoUrl
        }
    } catch(error) {
        console.log(error);
    }
};*/


    
const displayHotels = (hotels) => {
    $accommodations.forEach(async (accommodation,index) => {
        const hotel = hotels[index];
        const hotelsData = await getHotelsInfo(hotel);
        const hotelAddress = hotelsData.data.body.propertyDescription.address.fullAddress;
        const hotelTagline = hotelsData.data.body.propertyDescription.tagline;
        const hotelPhotoSrc = hotel.thumbnailUrl;
        //const hotelPhotoSrc = await getHotelsPhoto(hotel);
        const hotelsContent = hotelsTemplate(hotel, hotelAddress, hotelTagline, hotelPhotoSrc);
        accommodation.append(hotelsContent);
    })
};






const runSearch = () => {
    $accommodations.forEach(accommodation => accommodation.empty());
    $destination.empty();
    $weather.empty();
    $locations.forEach(location => location.empty());
    $information.css("visibility", "visible");
    getWeather().then(weather => displayWeather(weather));
    getPlaces().then(venues => displayPlaces(venues));
    getHotelsAreaId().then(areaId => getHotels(areaId)).then(hotels => displayHotels(hotels));
    
   
};



button.addEventListener("click", runSearch);





const url = "https://exp.cdn-hotels.com/hotels/45000000/44560000/44555500/44555483/9f661fc2_{size}.jpg";
const workUrl = url.replace('_{size}.jpg', '.jpg');
console.log(workUrl);
