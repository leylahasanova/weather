let input = document.querySelector('input');
let btn = document.querySelector('button');
let cityName = document.getElementById('cityName');
let lastUpdated = document.getElementById('lastUpdated');
let temperature = document.getElementById('temperature');
let wind = document.getElementById('wind');
let humidity = document.getElementById('humidity');
let cityList = document.getElementById('cityList');
let lastSearches = [];


if (localStorage.getItem('lastSearches')) {
    lastSearches = JSON.parse(localStorage.getItem('lastSearches'));
    updateLastSearches();
}

function getData(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=6cc33596a0c640a5951130652240502&q=${city}`)
        .then(res => res.json())
        .then(data => {
            cityName.innerHTML = data.location.name;
            lastUpdated.innerHTML = data.current.last_updated;
            temperature.innerHTML = data.current.temp_c + "°C";
            wind.innerHTML = "<p>Wind</p>"   + data.current.wind_kph + " km/h"; 
            humidity.innerHTML = "<p>Humidity</p>" + data.current.humidity + "%";

          
            const alreadySearched = lastSearches.some(search => search.city.toLowerCase() === city.toLowerCase());
            if (!alreadySearched) {
               
                lastSearches.push({ city: data.location.name, temperature: data.current.temp_c });
                if (lastSearches.length > 5) {
                    lastSearches.shift(); 
                }
                localStorage.setItem('lastSearches', JSON.stringify(lastSearches));
                updateLastSearches();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function updateLastSearches() {
    cityList.innerHTML = ""; 
    lastSearches.forEach(search => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `${search.city} ${search.temperature}°C`;
        cityList.appendChild(listItem);
    });
}

btn.addEventListener("click", () => {
    let city = input.value.trim();
    if (city) {
        getData(city);
    }
});
