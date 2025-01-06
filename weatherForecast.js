const btn = document.querySelector('.btn');
const text = document.querySelector('.text');
const cityName = document.querySelector('.city-name');
const loader = document.querySelector('.loading-indicator')



async function findLonandLat(city){
    try{

        const boxs = document.querySelector('main');
        boxs.style.display = 'none';

        showLoader();
        
        const BASE_URL = 'https://api.positionstack.com/v1/forward?access_key=87db487e084ba5c931ada69659cb0462&query=';
        const url = BASE_URL + `${city}`;
        // console.log('getting data.......');
        let response = await fetch(url);

        if(!response.ok){
            throw new Error('Failed to fetch data try again');
        }

        let data = await response.json();

        if(!data.data || !data.data[0]){
            throw new Error('City not found! please enter a valid city name.');
        }

        let latitude = data.data[0].latitude;
        let longitude = data.data[0].longitude;


        text.innerText = `Latitude : ${latitude}    and     Longitude : ${longitude}`;
        weatherData(latitude,longitude);

        hideLoader();

    }
    catch(error){
        hideLoader();
        loader.style.display = 'none';
        text.style.color = 'red';
        text.innerText = error.message || error;
    }
}

function showLoader(){
    loader.style.display = 'block'; 
}

function hideLoader(){
    loader.style.display = 'none'; 
}

async function weatherData(lat,lon){
    try{

        showLoader();

        await new Promise((resolve) => requestAnimationFrame(resolve,2));

        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7f1ccaf4f36e26e4a91938af772883fe`;
        let response = await fetch(URL);

        if(!response.ok){
            throw new Error('Failed to fetch data try again');
        }

        let data = await response.json();

        hideLoader();
        const boxs = document.querySelector('main');
        boxs.style.display = 'block';

        //processes weather data
        temperatureFinding(data);
        humidityFinding(data);
        pressureFinding(data);
        windpropertiesFinding(data);
        
        tempMinandMax(data);
        const ground_level = data.main.grnd_level;
    }
    catch(error){
        hideLoader();
        loader.style.display = 'none';
        text.style.color = 'red';
        text.innerText = error.message || error;
    }
}

function temperatureFinding(data){

    const tempImg = document.querySelector('.temperature img');
    const imgId = data.weather[0].icon;

    const new_src = `https://openweathermap.org/img/wn/${imgId}@2x.png`;
    tempImg.src = new_src;

    const disTemp = document.querySelector('.degree');
    const descriptions = document.querySelector('.temperature #description');

    const temperature = Math.round(data.main.temp-273);
    disTemp.innerText = `${temperature}°C`;
    descriptions.innerText = data.weather[0].description;
}

function humidityFinding(data){

    const humidityLevel = data.main.humidity;
    const humidity = document.querySelector('.humidity .humidity-level');
    humidity.innerText = `${humidityLevel}%`;
    const humidityDescription = document.querySelector('.humidity #description');
    const humidityImg = document.querySelector('.humidity img');
    let humiditySrc;
    if(humidityLevel <= 35){
        humiditySrc = "./img/medium-humidity.svg";
        humidityDescription.innerText = 'Low Level';
    }
    else if(humidityLevel > 35 && humidityLevel <= 60){
        humiditySrc = "./img/low-humidity.svg";
        humidityDescription.innerText = 'Medium Level';
    }
    else{
        humiditySrc = "./img/high-humidity.svg";
        humidityDescription.innerText = 'High Level';
    }
    humidityImg.src = humiditySrc;
}

function pressureFinding(data){

    const pressure = data.main.pressure;

    const pressureImg = document.querySelector('.pressure img');
    const pressureLevel = document.querySelector('.pressure .pressure-level');
    const pressureDescription = document.querySelector('.pressure #description');
    pressureLevel.innerText = pressure;
    if(pressure <= 1000){
        // humiditySrc = "../img/medium-humidity.svg";
        pressureDescription.innerText = 'Low Level';
    }
    else if(pressure > 1000 && pressure <= 1020){
        // humiditySrc = "../img/low-humidity.svg";
        pressureDescription.innerText = 'Medium Level';
    }
    else{
        // humiditySrc = "../img/high-humidity.svg";
        pressureDescription.innerText = 'High Level';
    }
}

function windpropertiesFinding(data){
    const windDeg = data.wind.deg;
    const windGust = data.wind.gust != null ? (data.wind.gust *3.6).toFixed(2) : null;
    const windSpeed = ((data.wind.speed)*3.6).toFixed(2);
    const windProperties = document.querySelector('.wind .wind-properties');
    windProperties.style.fontSize = '9px';
    if(windGust){
        windProperties.innerText = `Degree: ${windDeg}°\n\nGust: ${windGust} km/h\n\nSpeed :${windSpeed} km/h`;
    }
    else{
        windProperties.innerText = `Degree: ${windDeg}°\n\nGust: Not Available\n\nSpeed :${windSpeed} km/h`;
    }
}

function tempMinandMax(data){
    const maxTemp = document.querySelector('.temp-max .maxDegree');
    const temperature_max = Math.round(data.main.temp_max-273);
    maxTemp.innerText = '30°C';//`${temperature_max}°C`;
    const minTemp = document.querySelector('.temp-min .minDegree');
    const temperature_min = Math.round(data.main.temp_min-273);
    minTemp.innerText = '18°C';//`${temperature_min}°C`;
}

function inputValueRetreive(){
    const input = document.querySelector('form input');
    text.style.color = '#754E1A'
    const city = input.value.trim();
    if(city){
        findLonandLat(city);
        cityName.innerText = city.toUpperCase();
        input.value = '';
    }else{
        text.innerText = 'Please enter a city name';
        text.style.color = 'red';
    }
}
window.addEventListener('load',()=>{
    inputValueRetreive();
})

btn.addEventListener('click',(evt)=>{
    evt.preventDefault();
    inputValueRetreive()
});


