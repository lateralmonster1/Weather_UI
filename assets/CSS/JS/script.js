$(document).ready(function() {
    const apiKey = '97c44dcbaceed59279490fe218e200e1'; 
  
    function getWeather(city) {
      const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function(response) {
        displayCurrentWeather(response);
        displayForecast(response);
        addToHistory(city);
      });
    }
  
    function displayCurrentWeather(response) {
      const currentWeather = response.list[0];
      const cityName = response.city.name;
      const date = new Date(currentWeather.dt * 1000).toLocaleDateString();
      const icon = `http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
      const temp = currentWeather.main.temp;
      const wind = currentWeather.wind.speed;
      const humidity = currentWeather.main.humidity;
  
      $('#city-name').text(`${cityName} (${date})`);
      $('#current-weather').html(`
        <img src="${icon}" alt="Weather icon">
        <p>Temp: ${temp} °F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity} %</p>
      `);
    }
  
    function displayForecast(response) {
      const forecast = response.list.filter((_, index) => index % 8 === 0);
      $('#forecast').empty();
  
      forecast.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const icon = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
        const temp = day.main.temp;
        const wind = day.wind.speed;
        const humidity = day.main.humidity;
  
        $('#forecast').append(`
          <div class="forecast-card">
            <p>${date}</p>
            <img src="${icon}" alt="Weather icon">
            <p>Temp: ${temp} °F</p>
            <p>Wind: ${wind} MPH</p>
            <p>Humidity: ${humidity} %</p>
          </div>
        `);
      });
    }
  
    function addToHistory(city) {
      if (!localStorage.getItem('cities')) {
        localStorage.setItem('cities', JSON.stringify([]));
      }
      let cities = JSON.parse(localStorage.getItem('cities'));
      if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        displayHistory();
      }
    }
  
    function displayHistory() {
      const cities = JSON.parse(localStorage.getItem('cities')) || [];
      $('#history').empty();
      cities.forEach(city => {
        $('#history').append(`<li class="list-group-item">${city}</li>`);
      });
    }
  
    $('#search-button').on('click', function() {
      const city = $('#city-input').val().trim();
      if (city) {
        getWeather(city);
        $('#city-input').val('');
      }
    });
  
    $('#history').on('click', 'li', function() {
      const city = $(this).text();
      getWeather(city);
    });
  
    displayHistory();
  });
  