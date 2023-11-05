document.addEventListener("DOMContentLoaded", function () {
  const fetchButton = document.getElementById('fetchButton');
  const usernameInput = document.getElementById('username');
  const cityInput = document.getElementById('city');
  const resultsSection = document.getElementById('resultsSection'); // Updated the ID
  const API_KEY = 'f7b41a64bf0c4d4386720154230211';
  const backButton = document.getElementById('backButton'); //Back to user input

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
    toggleSections();

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

        // Clear the previous results
        resultsSection.innerHTML = ''; // Updated the element to resultsSection

        // Display last 5 unique days of contributions and weather data
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

              // Create a card for each result
              const card = document.createElement('div');
              card.className = 'bg-white p-4 rounded-md shadow-lg my-4';

              const dateElement = document.createElement('p');
              dateElement.className = 'text-lg font-semibold my-8';
              dateElement.textContent = `Date: ${date}`;

              const contributionElement = document.createElement('p');
              contributionElement.className = 'text-sm';
              contributionElement.textContent = `Contributions: ${contributionCount}`;

              const weatherElement = document.createElement('p');
              weatherElement.className = 'text-sm';
              if (result.weather) {
                weatherElement.textContent = `Weather: ${result.weather}°F`;
              } else {
                weatherElement.textContent = `Weather: Failed to retrieve weather information`;
              }

              // Append elements to the card
              card.appendChild(dateElement);
              card.appendChild(contributionElement);
              card.appendChild(weatherElement);

              // Append the card to the results section
              resultsSection.appendChild(card);
            });
          });
      })
      .catch(error => {
        resultsSection.textContent = `Failed to retrieve contributions. Error: ${error}`;
      });
  });
      // Back to stats page
      backButton.addEventListener('click', () => {
        toggleSections();
      });  
  function toggleSections() {
    const userInputSection = document.getElementById('userInputSection');
    const resultsSection = document.getElementById('resultsSection');

    if (userInputSection.classList.contains('hidden')) {
      userInputSection.classList.remove('hidden');
      resultsSection.classList.add('hidden');
      backButton.classList.add('hidden'); //Hide the back to input button
    } else {
      userInputSection.classList.add('hidden');
      resultsSection.classList.remove('hidden');
      backButton.classList.remove('hidden'); //show the back to input button
    }
  }

});
