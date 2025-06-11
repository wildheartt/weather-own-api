export const getWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=365b15496e0f99d1b576928df6934d2a&lang=ru&units=metric`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
