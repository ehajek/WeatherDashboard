
function initPage() {
    const inputEl = document.getElementById("citySearch");
    const searchEl = document.getElementById("searchBtn");
    const nameEl = document.getElementById("cityName");
    const currentPicEl = document.getElementById("mainWeatherSymbol");
    const currentTempEl = document.getElementById("temp");
    const currentWindEl = document.getElementById("wind");
    const currentHumidityEl = document.getElementById("humidity");
    const currentUVEl = document.getElementById("indexUV");
    const historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    const APIKey = "3777e7c4d79f5a1aecae2a61339edbc5";

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",us&appid=" + APIKey;
        fetch(queryURL)
        .then(function(response) {
        return response.json();  
        })
        .then(function(response) {
            var currentDate = new Date();
            var correctDate = moment(currentDate).format('MM/DD/YYYY')   
            nameEl.setAttribute("class","search");
            nameEl.innerHTML = response.name + " " + correctDate;
            let weatherPic = response.weather[0].icon;
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt",response.weather[0].description);
            currentTempEl.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let UVQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=" + APIKey;
            fetch(UVQueryURL) 
            .then(function(data) {
                return data.json();  
            })
            .then(function(data) {
                let uvLevel = data.current.uvi;
                let currentUV = document.createElement("span");
                currentUVEl.innerHTML = ""
                if (uvLevel <= 2) {
                    currentUV.setAttribute("class","badge badge-pill bg-secondary");
                } else if (uvLevel <= 5) {
                    currentUV.setAttribute("class","badge badge-pill bg-success");
                } else if (uvLevel <= 7) {
                    currentUV.setAttribute("class","badge badge-pill bg-warning");
                } else if (uvLevel <= 10) {
                    currentUV.setAttribute("class","badge badge-pill bg-danger");
                } else {
                    currentUV.setAttribute("class","badge badge-pill bg-primary");
                }
                currentUV.innerHTML = data.current.uvi;
                currentUVEl.append(currentUV);
            });
            let cityID = response.id;
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            fetch(forecastQueryURL) 
            .then(function(resources) {
                return resources.json();
            })
            .then(function(resources) {
                const forecastEls = document.querySelectorAll(".forecast");
                for (i=0; i<forecastEls.length; i++) {
                    forecastEls[i].innerHTML = "";
                    const forecastIndex = i*8 + 4;
                    const forecastDate = new Date(resources.list[forecastIndex].dt * 1000);
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth() + 1;
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement("p");
                    forecastDateEl.setAttribute("class","mt-3 mb-0 forecastDate");
                    forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                    forecastEls[i].append(forecastDateEl);
                    const forecastWeatherEl = document.createElement("img");
                    forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + resources.list[forecastIndex].weather[0].icon + "@2x.png");
                    forecastWeatherEl.setAttribute("alt",resources.list[forecastIndex].weather[0].description);
                    forecastEls[i].append(forecastWeatherEl);
                    const forecastTempEl = document.createElement("p");
                    forecastTempEl.innerHTML = "Temp: " + k2f(resources.list[forecastIndex].main.temp) + " &#176F";
                    forecastEls[i].append(forecastTempEl);
                    const forecastHumidityEl = document.createElement("p");
                    forecastHumidityEl.innerHTML = "Humidity: " + resources.list[forecastIndex].main.humidity + "%";
                    forecastEls[i].append(forecastHumidityEl);
                }
            })
        });  
    }
    searchEl.addEventListener("click",function() {
        const searchTerm = inputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}
initPage();

