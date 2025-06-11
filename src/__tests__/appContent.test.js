import { createContent } from '../appContent.js';

describe('createContent', () => {
  test('должна вернуть main c классом .weather', () => {
    const mockWeather = {
      main: { temp: 25, pressure: 1012, humidity: 50 },
      wind: { speed: 3.2, deg: 180 },
      clouds: { all: 30 },
      weather: [{ description: 'clear sky', icon: '01d' }],
      name: 'Moscow',
    };

    const mainEl = createContent(mockWeather);

    expect(mainEl).toBeInstanceOf(HTMLElement);
    const temperatureEl = mainEl.querySelector('.weather__temperature');
    expect(temperatureEl).not.toBeNull();
    expect(temperatureEl?.textContent).toBe('25');
  });
});
