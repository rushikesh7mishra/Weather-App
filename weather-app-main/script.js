async function getJson(city){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=01c11d354d867a15cbad8f667e806a55&units=metric`);
        const cityData = await response.json();
        return {
            cityName: cityData.name,
            date: getTime(cityData.sys.sunrise).date,
            weather: cityData.weather[0].description,
            temp: cityData.main.temp,
            feelsLike: cityData.main.feels_like,
            tempMin: cityData.main.temp_min,
            tempMax: cityData.main.temp_max,
            humidity: cityData.main.humidity,
            sunrise: getTime(cityData.sys.sunrise).time,
            sunset: getTime(cityData.sys.sunset).time,
            clouds: cityData.clouds.all,
        };
    }
    catch{
        handleError();
    }
}

function getTime(unixTimestamp){
    dateObj = new Date(unixTimestamp * 1000);
    let localTime = dateObj.getTime();
    localOffset = dateObj.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;
    const offset = 5.5;  
    const ISTtime = utc + (3600000*offset);
    const time = new Date(ISTtime).toLocaleTimeString();
    const date = new Date(ISTtime).toLocaleDateString();
    return {time, date};
}

const searchBtn = document.getElementById('searchBtn');
const searchBar = document.querySelector('.search-bar');
const citySearch = document.getElementById('citySearch');
const citySubmit = document.getElementById('citySubmit');
const cityName = document.querySelector('.name');
const desc = document.querySelector('.desc');
const feelsLike = document.querySelector('.feels-like');
const temp = document.querySelector('.temp');
const tempMin = document.querySelector('.temp-min');
const tempMax = document.querySelector('.temp-max');
const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const clouds = document.querySelector('.clouds');

citySearch.addEventListener('keydown', (e) => {
    if(e.keyCode === 13){
        searchBar.classList.remove('show');
        searchBtn.style.display = 'block';

        getJson(citySearch.value).then(res => {
            loadContent(res);
        });
    }
});

searchBtn.addEventListener('click', (e) => {
    searchBar.classList.add('show');
    e.target.style.display = 'none';
});

citySubmit.addEventListener('click', () => {
    searchBar.classList.remove('show');
    searchBtn.style.display = 'block';

    getJson(citySearch.value).then(res => {
        loadContent(res);
    });
});

function loadContent(res){
    cityName.textContent = res.cityName;
    desc.textContent = res.weather;
    temp.textContent = `${res.temp} °C`;
    feelsLike.textContent = `Feels like ${res.feelsLike} °C`;
    tempMin.textContent = `Minimum temperature - ${res.tempMin} °C`;
    tempMax.textContent = `Maximum temperature - ${res.tempMax} °C`;
    sunrise.textContent = `Sunrise - ${res.sunrise} IST`;
    sunset.textContent = `Sunset - ${res.sunset} IST`;
    humidity.textContent = `Humidity - ${res.humidity}%`;
    clouds.textContent = `Clouds - ${res.clouds}%`;
}

function handleError(){
    cityName.textContent = 'Oops! City Not Found!';
    desc.textContent = '';
    temp.textContent = ``;
    feelsLike.textContent = ``;
    tempMin.textContent = ``;
    tempMax.textContent = ``;
    sunrise.textContent = ``;
    sunset.textContent = ``;
    humidity.textContent = ``;
    clouds.textContent = ``;
}

getJson('bhubaneswar').then(res => loadContent(res));