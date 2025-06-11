import { getWeatherData } from '../api.js';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'Test City', main: { temp: 20 } }),
  })
);

describe('getWeatherData', () => {
  test('должен вернуть объект погоды при корректном запросе', async () => {
    const data = await getWeatherData('Test City');
    expect(data).toEqual({ name: 'Test City', main: { temp: 20 } });
  });

  test('должен обработать ошибку fetch (и вывести в консоль)', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('API error'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const data = await getWeatherData('Fail City');

    expect(consoleSpy).toHaveBeenCalledWith('API error');

    expect(data).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
