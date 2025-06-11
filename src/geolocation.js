import { getWeatherData } from './api.js';

import EventBus from './eventBus.js';

export const handleWeatherByGeolocation = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumageAge: 0,
  };
  const success = async (pos) => {
    const crd = pos.coords;

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${crd.latitude}&lon=${crd.longitude}&apiKey=a31b273f8aaa4af6848ef7a73cb7c3dc`
    );
    const result = await response.json();

    const weather = await getWeatherData(result.features[0].properties.city);
    EventBus.emit('weather:update', {
      city: result.features[0].properties.city,
      weather,
    });
    console.log(result);
  };

  const error = (error) => {
    console.log(error.code + '' + error.message);
  };
  navigator.geolocation.getCurrentPosition(success, error, options);
};
