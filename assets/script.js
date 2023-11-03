document.addEventListener("DOMContentLoaded", function() {
  const fetchButton = document.getElementById('fetchButton');
  const usernameInput = document.getElementById('username');
  const cityInput = document.getElementById('city');
  const contributionsDiv = document.getElementById('contributions');
  const API_KEY = 'f7b41a64bf0c4d4386720154230211';

  // Gets the saved info when you open the page
  const storedUsername = localStorage.getItem('username');
  const storedCityName = localStorage.getItem('cityName');

  // Replaces value with saved info
  if (storedUsername) {
    usernameInput.value = storedUsername;
  }

  if (storedCityName) {
    cityInput.value = storedCityName;
  }

  fetchButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const cityName = cityInput.value;

    // Once you enter a username and city, it is saved into local storage
    localStorage.setItem('username', username);
    localStorage.setItem('cityName', cityName);

    const githubUrl = `https://api.github.com/users/${username}/events/public`;

    // Making the GitHub request
    fetch(githubUrl)
      .then(response => response.json())
      .then(contributions => {
        const dates = [];
        const contributionsByDate = {};

        // Group contributions by date
        contributions.forEach(event => {
          const date = event.created_at.split('T')[0];
          if (!dates.includes(date)) {
            dates.push(date);
            contributionsByDate[date] = 0;
          }
          contributionsByDate[date] += 1;
        });

        // Display last 5 unique days of contributions and weather data
        contributionsDiv.innerHTML = '';
        const lastFiveUniqueDays = dates.slice(-5).reverse();

        const weatherPromises = lastFiveUniqueDays.map(date => {
          return fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${cityName}&dt=${date}`)
            .then(response => response.json())
            .then(data => {
              return { date, weather: data.forecast.forecastday[0].day.avgtemp_f };
            })
            .catch(error => {
              return { date, error };
            });
        });

        Promise.all(weatherPromises)
          .then(weatherResults => {
            weatherResults.forEach(result => {
              const date = result.date;
              const contributionCount = contributionsByDate[date];
              const contributionElement = document.createElement('p');
              contributionElement.textContent = `Contributions on ${date}: ${contributionCount}`;
              contributionsDiv.appendChild(contributionElement);

              if (result.weather) {
                const weatherElement = document.createElement('p');
                weatherElement.textContent = `Weather on ${date} in ${cityName}: ${result.weather}°F`;
                contributionsDiv.appendChild(weatherElement);
              } else {
                const weatherErrorElement = document.createElement('p');
                weatherErrorElement.textContent = `Failed to retrieve weather information for ${date}.`;
                contributionsDiv.appendChild(weatherErrorElement);
              }
            });
          });
      })
      .catch(error => {
        contributionsDiv.textContent = `Failed to retrieve contributions. Error: ${error}`;
      });
  });
});
