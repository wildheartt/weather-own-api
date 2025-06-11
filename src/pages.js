import { getWeatherData } from './api.js';
import { createContent, addToHistory } from './appContent.js';
import { createHeader } from './appHeader.js';

// Главная страница
export const HomePage = async (context) => {
  try {
    const savedCity = JSON.parse(localStorage.getItem('city')) || 'Москва';
    const weather = await getWeatherData(savedCity);

    if (weather.message) {
      const moscowWeather = await getWeatherData('Москва');
      renderWeatherPage(moscowWeather);
    } else {
      renderWeatherPage(weather);
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    renderErrorPage('Не удалось загрузить данные о погоде');
  }
};

export const CityPage = async (context) => {
  const { params } = context;
  const { city } = params;

  if (!city) {
    renderErrorPage('Город не указан');
    return;
  }

  try {
    const weather = await getWeatherData(city);

    if (weather.message) {
      renderErrorPage(`Город "${city}" не найден`);
    } else {
      renderWeatherPage(weather);
      localStorage.setItem('city', JSON.stringify(weather.name));
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    renderErrorPage(`Не удалось загрузить данные для города "${city}"`);
  }
};

export const NotFoundPage = (context) => {
  renderErrorPage('Страница не найдена', true);
};

const renderWeatherPage = (weather) => {
  document.body.innerHTML = '';
  const header = createHeader(weather.name);
  const content = createContent(weather);
  document.body.append(header, content);

  addToHistory(weather.name);
};

const renderErrorPage = (message, isNotFound = false) => {
  document.body.innerHTML = '';

  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
  `;

  const errorTitle = document.createElement('h1');
  errorTitle.textContent = isNotFound ? '404' : 'Ошибка';
  errorTitle.style.cssText = `
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 20px;
  `;

  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;
  errorMessage.style.cssText = `
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
  `;

  const homeButton = document.createElement('button');
  homeButton.textContent = 'На главную';
  homeButton.style.cssText = `
    padding: 12px 24px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  `;

  homeButton.addEventListener('click', () => {
    // Используем глобальный роутер для навигации
    if (window.router) {
      window.router.navigate('/');
    } else {
      window.location.href = '/';
    }
  });

  homeButton.addEventListener('mouseover', () => {
    homeButton.style.backgroundColor = '#2980b9';
  });

  homeButton.addEventListener('mouseout', () => {
    homeButton.style.backgroundColor = '#3498db';
  });

  errorContainer.append(errorTitle, errorMessage, homeButton);
  document.body.append(errorContainer);
};
