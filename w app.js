document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.querySelector(".city-input");
  const searchBtn = document.querySelector(".search-btn");
  const cityName = document.querySelector(".details h2");
  const detailFields = document.querySelectorAll(".details h6");
  const weatherCards = document.querySelectorAll(".sub-card");

  const apiKey = "363e189a2a5bd54cc42a1b878ba08fea";
  const defaultCity = "Lahore";
  cityInput.value = defaultCity;

  const clearWeatherData = () => {
    cityName.textContent = "";
    if (detailFields.length) {
      detailFields[0].textContent = "";
      detailFields[1].textContent = "";
      detailFields[2].textContent = "";
    }

    weatherCards.forEach((weatherCard) => {
      weatherCard.querySelector("h3").textContent = "";
      const cardDetailFields = weatherCard.querySelectorAll("h6");
      cardDetailFields[0].textContent = "";
      cardDetailFields[1].textContent = "";
      cardDetailFields[2].textContent = "";
    });
  };

  const fetchAndDisplayWeather = async (city) => {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const currentWeatherResponse = await fetch(currentWeatherUrl);
      const currentWeatherData = await currentWeatherResponse.json();

      const isCityValid = currentWeatherData.cod !== "404";

      cityName.textContent = isCityValid
        ? currentWeatherData.name
        : "Invalid City";
      if (detailFields.length) {
        detailFields[0].textContent = isCityValid
          ? `Temp: "${currentWeatherData.main.temp}" °C`
          : "Temp: °C";
        detailFields[1].textContent = isCityValid
          ? `Wind : ${currentWeatherData.wind.speed} M/S`
          : "Wind: M/S";
        detailFields[2].textContent = isCityValid
          ? `Humidity: ${currentWeatherData.main.humidity} %`
          : "Humidity: %";
      }

      if (!isCityValid) {
        weatherCards.forEach((weatherCard) => {
          weatherCard.querySelector("h3").textContent = "";
          const cardDetailFields = weatherCard.querySelectorAll("h6");
          cardDetailFields[0].textContent = "";
          cardDetailFields[1].textContent = "";
          cardDetailFields[2].textContent = "";
        });
        return;
      }

      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      const today = new Date().getDay();
      for (let i = 1; i <= 4; i++) {
        const forecast = forecastData.list[i * 8 - 1];
        const dayIndex = (today + i) % 7;
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayName = days[dayIndex];

        const weatherCard = weatherCards[i - 1];
        weatherCard.querySelector("h3").textContent = dayName;
        const cardDetailFields = weatherCard.querySelectorAll("h6");
        cardDetailFields[0].textContent = isCityValid
          ? `Temp: ${forecast.main.temp} °C`
          : "Temp: °C";
        cardDetailFields[1].textContent = isCityValid
          ? `Wind: ${forecast.wind.speed} M/S`
          : "Wind: M/S";
        cardDetailFields[2].textContent = isCityValid
          ? `Humidity: ${forecast.main.humidity} %`
          : "Humidity: %";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchAndDisplayWeather(defaultCity);

  searchBtn.addEventListener("click", async () => {
    const city = cityInput.value;

    fetchAndDisplayWeather(city);
  });
});
