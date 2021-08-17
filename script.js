$(document).ready(function () {
  var apiKey = "514635bbd4899a3f7f9ebbad1a4e61e9";
  var day = moment().format("dddd");
  var date = moment().format("l");

  //cities parsed from local storage. If not cities recently searched, cities is set to an empty array
  var cities = JSON.parse(localStorage.getItem("cities")) || [];

  //Click event that fires when user inputs a city to search

  $("#submitBtn").on("click", function (e) {
    e.preventDefault();
    var cityName = $("#citySearchInput").val();
    $("#citySearchInput").val("");
    currentWeather(cityName);
    futureWeather(cityName);
  });

  //API call to gather current weather

  function currentWeather(cityName) {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`,
      dataType: "json",
    }).then(function (response) {
      //   console.log(response);
      //converts to Miles per hour
      var windSpeedMPS = response.wind.speed;
      var windSpeedMPH = windSpeedMPS * 2.237;
      var wind = windSpeedMPH.toFixed(0);

      //Adds searched city to local storage
      if (cities.indexOf(cityName) === -1) {
        cities.push(response.name);
      }
      localStorage.setItem("cities", JSON.stringify(cities));
      $("#searchHistory").html("");
      for (var i = 0; i < cities.length; i++) {
        $("#searchHistory").prepend(`
            <li class="list-group-item">${cities[i]}</li>
            `);
        $("li").click(function (event) {
          $("input").val($(this).text());
          $("#submitBtn").click();
        });
      }

      $("#weather").html(`<div class="card-header">
        <h2 class="card-title" id="cityName">${response.name}</h2>
        <h5>${day}</h5>
        <h5>${date}</h5>
      </div>
      <div class="card-body card-text">
        <div><img src="https://openweathermap.org/img/wn/${
          response.weather[0].icon
        }.png"></div>
        <h4>Temperature: ${response.main.temp.toFixed(0)}°F</h4>
        <h4> Humidity: ${response.main.humidity}%</h4> 
        <h4 id="uv"></h4>
        <h4> Wind Speed: ${wind} mph</h4>
      </div>`);

      var lat = response.coord.lat;
      var lon = response.coord.lon;

      //API call to get UV index data

      $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        dataType: "json",
      }).then(function (response) {
        const uv = response.value.toFixed(0);
        // console.log(uv);
        $("#uv").html(
          "UV Index: " +
            '<span class="badge badge-light text-white" id="uvColor">' +
            uv +
            "</span>"
        );
        if (uv >= 8) {
          $("#uvColor").css("background-color", "crimson");
        } else if (uv <= 7 && uv >= 5) {
          $("#uvColor").css("background-color", "royalblue");
        } else {
          $("#uvColor").css("background-color", "limegreen");
        }
      });
    });
  }

  //API call to get 5 day forecast daya

  function futureWeather(cityName) {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`,
      dataType: "json",
    }).then(function (response) {
      //display 5 day forecast data
      $("#fiveDayForecast").empty();
      var forecast = response.list;
      console.log(forecast);
      //   var futureWindSpeedMPS = forecast.wind.speed;
      //   var futureWindSpeedMPH = futureWindSpeedMPS * 2.237;
      //   var futureWind = futureWindSpeedMPH.toFixed(0);
      for (let i = 0; i < forecast.length; i = i + 8) {
        $("#fiveDayForecast").append(`
        <div class="col mb-4">
            <div class="card test-white bg-primary">
                <div class="card-body">
                    <h5 class="card-title">${moment(forecast[i].dt_txt).format(
                      "l"
                    )}</h5>
                    <div><img src="https://openweathermap.org/img/wn/${
                      forecast[i].weather[0].icon
                    }.png"</div>
                    <p class="card-text">Temp: ${forecast[i].main.temp.toFixed(
                      0
                    )}°F</p>
                    <p class="card-text">Wind Speed: ${(
                      forecast[i].wind.speed * 2.237
                    ).toFixed(0)} mph</p>
                    <p class="card-text">Humidity: ${
                      forecast[i].main.humidity
                    }%</p>
                </div>
            </div>
        </div>`);
      }
    });
  }
});

//https://api.openweathermap.org/data/2.5/weather?q=denver&appid=514635bbd4899a3f7f9ebbad1a4e61e9&units=imperial

// function apiCall() {
//   let denverApiCall =
//     "https://api.openweathermap.org/data/2.5/weather?q=denver&appid=" +
//     apiKey +
//     "&units=imperial";
//   $.ajax(denverApiCall).then(function (response) {
//     //this is where we should put the oneAPI call using lat long
//     console.log(response);
//   });

//   console.log("hello");
// }

// apiCall();
//display function to display response data
