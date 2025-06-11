import { getWeatherData } from './api.js';
import { handleWeatherByGeolocation } from './geolocation.js';
import { cToF, fToC } from './helper.js';
import EventBus from './eventBus.js';

export const createHeader = (city) => {
  const header = document.createElement('header');
  const headerContainer = document.createElement('div');
  const headerCity = document.createElement('div');
  const headerUnits = document.createElement('div');
  const cityChange = document.createElement('button');
  const cityLocation = document.createElement('button');
  const cityName = document.createElement('h1');
  const unitsC = document.createElement('button');
  const unitsF = document.createElement('button');
  const cityInner = document.createElement('div');
  const searchBlock = document.createElement('div');
  const searchInput = document.createElement('input');
  const searchBtn = document.createElement('button');
  const errorBlock = document.createElement('p');

  header.classList.add('header');
  headerContainer.classList.add('container', 'header__container');
  headerCity.classList.add('header__city');
  headerUnits.classList.add('header__units');
  cityChange.classList.add('city__change', 'btn-reset');
  cityLocation.classList.add('city__location', 'btn-reset');
  cityName.classList.add('city__name');
  cityInner.classList.add('city__inner');
  unitsC.classList.add('units__c', 'btn-reset', 'unit-current');
  unitsF.classList.add('units__f', 'btn-reset');
  searchBlock.classList.add('search');
  searchInput.classList.add('search_input');
  searchBtn.classList.add('search_btn');
  errorBlock.classList.add('search__error');

  searchBtn.textContent = 'ok';
  cityName.textContent = city;
  cityChange.textContent = 'Сменить город';
  cityLocation.textContent = 'Мое местоположение';
  unitsC.textContent = 'C';
  unitsF.textContent = 'F';

  cityChange.addEventListener('click', () => {
    headerCity.innerHTML = '';
    searchBlock.append(searchInput, searchBtn, errorBlock);
    headerCity.append(searchBlock);
  });

  const showError = (message) => {
    errorBlock.classList.add('show-error');
    errorBlock.textContent = message;
  };

  searchBtn.addEventListener('click', async () => {
    if (!searchInput.value) {
      showError('Введите название города!');
      return;
    }

    if (window.router) {
      window.router.navigate(
        `/city/${encodeURIComponent(searchInput.value.trim())}`
      );
    } else {
      try {
        const weather = await getWeatherData(searchInput.value);

        if (weather.message) {
          showError(weather.message);
          return;
        }

        EventBus.emit('weather:update', { city: weather.name, weather });
      } catch (error) {
        showError('Не удалось загрузить данные. Попробуйте ещё раз.');
        console.log(error);
      }
    }
  });

  unitsC.addEventListener('click', () => {
    if (unitsC.classList.contains('unit-current')) {
      return;
    }

    unitsC.classList.add('unit-current');
    unitsF.classList.remove('unit-current');
    document.querySelector('.weather__units').textContent = 'o';

    const temperature = document.querySelector('.weather__temperature');
    const convertedTemp = fToC(+temperature.textContent);
    temperature.textContent = Math.round(convertedTemp);
  });

  unitsF.addEventListener('click', () => {
    if (unitsF.classList.contains('unit-current')) {
      return;
    }

    unitsF.classList.add('unit-current');
    unitsC.classList.remove('unit-current');
    document.querySelector('.weather__units').textContent = 'f';

    const temperature = document.querySelector('.weather__temperature');
    const convertedTemp = cToF(+temperature.textContent);
    temperature.textContent = Math.round(convertedTemp);
  });

  window.addEventListener('click', (e) => {
    if (
      e.target == searchInput ||
      e.target == searchBtn ||
      e.target == cityChange
    ) {
      return;
    } else {
      headerCity.innerHTML = '';
      errorBlock.classList.remove('show-error');
      searchInput.value = '';
      headerCity.append(cityName, cityInner);
    }
  });

  cityLocation.addEventListener('click', handleWeatherByGeolocation);

  header.append(headerContainer);
  headerContainer.append(headerCity, headerUnits);
  cityInner.append(cityChange, cityLocation);
  headerCity.append(cityName, cityInner);
  headerUnits.append(unitsC, unitsF);

  return header;
};
