const fetchButton = document.getElementById('fetchButton');
const usernameInput = document.getElementById('username');
const cityInput = document.getElementById('city');
const contributionsDiv = document.getElementById('contributions');
const API_KEY = 'f7b41a64bf0c4d4386720154230211'

fetchButton.addEventListener('click', () => {
  const username = usernameInput.value;
  const cityName = cityInput.value;
  console.log(username);
  console.log(cityName);
 
  const githubUrl = `https://api.github.com/users/${username}/events/public?per_page=5`;

    // Making the GitHub request
    fetch(githubUrl)
      .then(response => response.json())
      .then(contributions => {
        
         // Extract the date portion from the datetime string
        var datetime = contributions[0].created_at;
        const date = datetime.split('T')[0];
        contributionsDiv.innerHTML = ''; // Clear previous contributions
        contributions.forEach(event => {
          const contributionElement = document.createElement('p');
          contributionElement.textContent = `${event.type} at ${event.created_at}`;
          contributionsDiv.appendChild(contributionElement);
        });
        const weatherUrl = `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${cityName}&dt=${date}`
        fetch(weatherUrl)
          .then(response => {
            return response.json();
          })
          .then(data => {
            // at the moment it returns the average temp of the day, but lots of things can be targetted
            var weather = (data.forecast.forecastday[0].day.avgtemp_f);
            console.log(weather);
        });
      })
      .catch(error => {
        contributionsDiv.textContent = `Failed to retrieve contributions. Error: ${error}`;
      });
    });


