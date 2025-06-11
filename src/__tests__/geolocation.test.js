/**
 * @jest-environment jsdom
 */
import { handleWeatherByGeolocation } from '../geolocation.js';
import { getWeatherData } from '../api.js';

jest.mock('../api.js', () => ({
  getWeatherData: jest.fn(),
}));

jest.mock('../helper.js', () => ({
  resetWeatherContent: jest.fn(),
}));

describe('handleWeatherByGeolocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window.navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: jest.fn(),
      },
    });

    global.fetch = jest.fn();
  });

  it('должен корректно обработать success-сценарий (ветвь success)', async () => {
    jest
      .spyOn(navigator.geolocation, 'getCurrentPosition')
      .mockImplementation((successFn) => {
        successFn({ coords: { latitude: 12.34, longitude: 56.78 } });
      });

    const mockGeoData = {
      features: [
        {
          properties: { city: 'Test City' },
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockGeoData),
    });

    getWeatherData.mockResolvedValueOnce('Mocked Weather Data');

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    handleWeatherByGeolocation();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledWith(
      'https://api.geoapify.com/v1/geocode/reverse?lat=12.34&lon=56.78&apiKey=a31b273f8aaa4af6848ef7a73cb7c3dc'
    );
    expect(getWeatherData).toHaveBeenCalledWith('Test City');
    expect(consoleSpy).toHaveBeenCalledWith(mockGeoData);

    consoleSpy.mockRestore();
  });

  it('должен корректно обработать error-сценарий (ветвь error)', () => {
    jest
      .spyOn(navigator.geolocation, 'getCurrentPosition')
      .mockImplementation((_, errorFn) => {
        errorFn({ code: 1, message: 'Permission denied' });
      });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    handleWeatherByGeolocation();

    expect(consoleSpy).toHaveBeenCalledWith('1Permission denied');

    consoleSpy.mockRestore();
  });

  it('передаёт правильные опции в getCurrentPosition', () => {
    handleWeatherByGeolocation();

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumageAge: 0,
      }
    );
  });
});
