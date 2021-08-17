    const inputEl = document.getElementById("citySearch");
    const searchEl = document.getElementById("searchBtn");
    const nameEl = document.getElementById("cityName");
    const iconEl = document.getElementById("weatherIcons");
    const currentTempEl = document.getElementById("temp");
    const currentWindEl = document.getElementById("wind");
    const currentHumidityEl = document.getElementById("humidity");
    const currentUVEl = document.getElementById("indexUV");
    const historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    const APIKey = "3777e7c4d79f5a1aecae2a61339edbc5";

function initPage() {

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",us&appid=" + APIKey;
        fetch(queryURL)
        // console.log(queryURL)
        .then(function(data){
            return data.json();})
                .then(function(response) {
                    if (response.cod === "404") {
                        console.log("false");
                    } else {
                    var currentDate = new Date();
                    var correctDate = moment(currentDate).format('MM/DD/YYYY')   
                    nameEl.setAttribute("class", "search");
                    nameEl.innerHTML = response.name + " " + "(" + correctDate + ")";
                    let weatherIcon = response.weather[0].id;
                    let weatherIconComplete = "wi wi-owm-"+weatherIcon+" deep-purple-text";
                    iconEl.className = weatherIconComplete;
                    currentTempEl.innerHTML = "Temperature: " + kelFehr(response.main.temp) + " &#176F";
                    currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
                    currentWindEl.innerHTML = "Wind: " + response.wind.speed + " MPH";
                    let lat = response.coord.lat;
                    let lon = response.coord.lon;
                    let UVQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=" + APIKey;
                    fetch(UVQueryURL) 
                    .then(function(data) {
                        return data.json();  
                    })
                    .then(function(data) {
                        let uvLevel = data.current.uvi;
                        currentUVEl.innerHTML = ""
                        if (uvLevel === 0) {currentUVEl.setAttribute("class","btn-small cyan black-text");} 
                        else if (uvLevel <= 2) {currentUVEl.setAttribute("class","btn-small teal accent-3 accent-2 black-text");} 
                        else if (uvLevel <= 5) {currentUVEl.setAttribute("class","btn-small lime accent-2 black-text");} 
                        else if (uvLevel <= 7) {currentUVEl.setAttribute("class","btn-small orange lighten-1 black-text");} 
                        else if (uvLevel <= 10) {currentUVEl.setAttribute("class","btn-small red darken-2 white-text");} 
                        else {currentUVEl.setAttribute("class","btn-small deep-purple darken-3 white-text");}
                        currentUVEl.innerHTML = data.current.uvi;
                        // currentUVEl.append(currentUV);
                    })
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
                            const forecastDateEl = document.createElement("h5");
                            forecastDateEl.setAttribute("class","col forecastDate");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);
                            let forcastIcon = resources.list[forecastIndex].weather[0].id;
                            let forcastIconComplete = "wi wi-owm-"+forcastIcon+" deep-purple-text";
                            iconEl.className = weatherIconComplete;
                            const forecastWeatherEl = document.createElement("h3");
                            forecastWeatherEl.className = forcastIconComplete;
                            forecastEls[i].append(forecastWeatherEl);
                            //Temp
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + kelFehr(resources.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            //Wind
                            const forecastWindEl = document.createElement("p");
                            forecastWindEl.innerHTML = "Wind: " + resources.list[forecastIndex].wind.speed + "MPH";
                            forecastEls[i].append(forecastWindEl);
                            //Humidity
                            const forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.innerHTML = "Humidity: " + resources.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
                }
            });
        }
        searchEl.addEventListener("click",function() {
            const searchTerm = inputEl.value;
            let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + ",us&appid=" + APIKey;
            fetch(queryURL)
            .then(function(data){
                return data.json();})
                .then(function(response) {
                if (response.cod === "404") {
                    window.alert("City is not found, please try again.");
                    console.log("false");
                } else if (searchTerm === ""){
                    return false;
                } else {
                    getWeather(searchTerm);
                    searchHistory.push(searchTerm);
                    localStorage.setItem("search",JSON.stringify(searchHistory));
                    renderSearchHistory();
                }
            })
        });

        function kelFehr(Kelvin) {
            return Math.floor((Kelvin *1.8) -459.67);
        }
        function renderSearchHistory() {
            historyEl.innerHTML = "";
            for (let i=0; i<searchHistory.length; i++) {
                const oldCity = document.createElement("input");
                oldCity.setAttribute("type","text");
                oldCity.setAttribute("readonly",true);
                oldCity.setAttribute("class", "card-panel grey lighten-3 z-depth-1 center-align");
                oldCity.setAttribute("id", "historyCard");
                oldCity.setAttribute("value", searchHistory[i]);
                oldCity.addEventListener("click",function() {
                    getWeather(oldCity.value);
                })
            historyEl.append(oldCity);
        }
    }
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}
initPage();