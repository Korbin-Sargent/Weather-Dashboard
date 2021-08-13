const apiKey = "514635bbd4899a3f7f9ebbad1a4e61e9";
//https://api.openweathermap.org/data/2.5/weather?q=denver&appid=514635bbd4899a3f7f9ebbad1a4e61e9&units=imperial

function apiCall() {
  let denverApiCall =
    "https://api.openweathermap.org/data/2.5/weather?q=denver&appid=" +
    apiKey +
    "&units=imperial";
  $.ajax(denverApiCall).then(function (response) {
    //this is where we should put the oneAPI call using lat long
    console.log(response);
  });

  console.log("hello");
}

apiCall();
//display function to display response data
