const fetchButton = document.getElementById('fetchButton');
const usernameInput = document.getElementById('username');
const cityInput = document.getElementById('city');
const contributionsDiv = document.getElementById('contributions');

fetchButton.addEventListener('click', () => {
  const username = usernameInput.value;


  if (username) {
    const githubUrl = `https://api.github.com/users/${username}/events/public`;

    // Making the GitHub request
    fetch(githubUrl)
      .then(response => response.json())
      .then(contributions => {
        contributionsDiv.innerHTML = ''; // Clear previous contributions
        contributions.forEach(event => {
          const contributionElement = document.createElement('p');
          contributionElement.textContent = `${event.type} at ${event.created_at}`;
          contributionsDiv.appendChild(contributionElement);
        });
      })
      .catch(error => {
        contributionsDiv.textContent = `Failed to retrieve contributions. Error: ${error}`;
      });
  }});

// test date and city in right now, but we'll have those as inputs from the html 
var date = '2023-5-05'
var city = 'Austin'
// This is a temporary api key on a free trial that ends november 16
const apiKey = 'f7b41a64bf0c4d4386720154230211'
const weatherUrl = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${date}`

fetch(weatherUrl)
  .then(response => {
    return response.json();
  })
  .then(data => {
    // at the moment it returns the average temp of the day, but lots of things can be targetted
    var weather = (data.forecast.forecastday[0].day.avgtemp_f);
    console.log(weather);
  });