import { directionOfwWind, capitalizeFirstLetter } from './helper.js';

const addToHistory = (city) => {
  const history = getHistory();
  const existingIndex = history.indexOf(city);

  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }

  history.unshift(city);

  if (history.length > 5) {
    history.splice(5);
  }

  localStorage.setItem('weatherHistory', JSON.stringify(history));
};

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('weatherHistory')) || [];
  } catch {
    return [];
  }
};

const createHistorySection = () => {
  const historySection = document.createElement('section');
  const historyContainer = document.createElement('div');
  const historyTitle = document.createElement('h3');
  const historyList = document.createElement('ul');

  historySection.classList.add('history');
  historyContainer.classList.add('container', 'history__container');
  historyTitle.classList.add('history__title');
  historyList.classList.add('history__list');

  historyTitle.textContent = 'История поиска';

  const history = getHistory();

  if (history.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'История поиска пуста';
    emptyMessage.classList.add('history__empty');
    historyContainer.append(historyTitle, emptyMessage);
  } else {
    history.forEach((city) => {
      const historyItem = document.createElement('li');
      const historyLink = document.createElement('a');

      historyItem.classList.add('history__item');
      historyLink.classList.add('history__link');
      historyLink.textContent = city;
      historyLink.href = `/city/${encodeURIComponent(city)}`;

      historyLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.router) {
          window.router.navigate(`/city/${encodeURIComponent(city)}`);
        }
      });

      historyItem.append(historyLink);
      historyList.append(historyItem);
    });

    historyContainer.append(historyTitle, historyList);
  }

  historySection.append(historyContainer);
  return historySection;
};

export { addToHistory };

export const createContent = (data) => {
  const main = document.createElement('main');
  const section = document.createElement('section');
  const container = document.createElement('div');
  const inner = document.createElement('div');
  const iconBloc = document.createElement('img');
  const temperature = document.createElement('h2');
  const units = document.createElement('span');
  const description = document.createElement('p');
  const weatherInfo = document.createElement('div');
  const weatherInfoList = document.createElement('ul');
  const weatherInfoWind = document.createElement('li');
  const weatherInfoPressure = document.createElement('li');
  const weatherInfoHumidity = document.createElement('li');
  const weatherInfoClouds = document.createElement('li');

  section.classList.add('weather');
  container.classList.add('container', 'weather__container');
  inner.classList.add('weather__inner');
  iconBloc.classList.add('weather__icon');
  temperature.classList.add('weather__temperature');
  units.classList.add('weather__units');
  description.classList.add('weather__description');
  weatherInfo.classList.add('weather-info');
  weatherInfoList.classList.add('weather-info__list');
  weatherInfoWind.classList.add('weather-info__item');
  weatherInfoHumidity.classList.add('weather-info__item');
  weatherInfoPressure.classList.add('weather-info__item');
  weatherInfoClouds.classList.add('weather-info__item');

  temperature.textContent = Math.floor(data.main.temp);
  description.textContent = capitalizeFirstLetter(data.weather[0].description);
  if (data.weather && data.weather[0] && data.weather[0].icon) {
    iconBloc.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  } else {
    iconBloc.src = 'default-icon.png';
  }
  units.textContent = 'o';

  const createWeatherItemTitle = (text) => {
    const span = document.createElement('span');
    span.textContent = text;

    return span;
  };

  const createWeatherItemContent = (text) => {
    const p = document.createElement('p');
    p.textContent = text;

    return p;
  };

  weatherInfoWind.append(
    createWeatherItemTitle('Ветер'),
    createWeatherItemContent(
      data.wind.speed + ' м/с, ' + directionOfwWind(data.wind.deg)
    )
  );

  weatherInfoPressure.append(
    createWeatherItemTitle('Давление'),
    createWeatherItemContent(data.main.pressure + ' мм рт. ст.')
  );

  weatherInfoHumidity.append(
    createWeatherItemTitle('Влажность'),
    createWeatherItemContent(data.main.humidity + ' %')
  );

  weatherInfoClouds.append(
    createWeatherItemTitle('Облачность'),
    createWeatherItemContent(data.clouds.all + ' %')
  );

  const historySection = createHistorySection();

  main.append(section, historySection);
  section.append(container);
  container.append(inner, description, weatherInfo);
  inner.append(iconBloc, temperature, units);
  weatherInfo.append(weatherInfoList);
  weatherInfoList.append(
    weatherInfoWind,
    weatherInfoPressure,
    weatherInfoHumidity,
    weatherInfoClouds
  );

  return main;
};
