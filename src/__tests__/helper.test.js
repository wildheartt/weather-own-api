import {
  directionOfwWind,
  capitalizeFirstLetter,
  cToF,
  fToC,
  resetWeatherContent,
} from '../helper.js';

import * as appHeader from '../appHeader.js';
import * as appContent from '../appContent.js';

describe('helper.js', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();

    jest.restoreAllMocks();
  });

  describe('directionOfwWind', () => {
    test('<= 22.5 -> "северный"', () => {
      expect(directionOfwWind(0)).toBe('северный');
      expect(directionOfwWind(22.5)).toBe('северный');
    });

    test('> 22.5 и <= 67.5 -> "северо-восточный"', () => {
      expect(directionOfwWind(30)).toBe('северо-восточный');
      expect(directionOfwWind(67.5)).toBe('северо-восточный');
    });

    test('> 67.5 и <= 122.5 -> "восточный"', () => {
      expect(directionOfwWind(90)).toBe('восточный');
      expect(directionOfwWind(120)).toBe('восточный');
    });

    test('> 122.5 и <= 157.5 -> "юго-восточный"', () => {
      expect(directionOfwWind(130)).toBe('юго-восточный');
      expect(directionOfwWind(157.5)).toBe('юго-восточный');
    });

    test('> 157.5 и <= 202.5 -> "южный"', () => {
      expect(directionOfwWind(160)).toBe('южный');
      expect(directionOfwWind(202.5)).toBe('южный');
    });

    test('> 202.5 и <= 247.5 -> "юго-западный"', () => {
      expect(directionOfwWind(210)).toBe('юго-западный');
      expect(directionOfwWind(247.5)).toBe('юго-западный');
    });

    test('> 247.5 и <= 292.5 -> "западный"', () => {
      expect(directionOfwWind(250)).toBe('западный');
      expect(directionOfwWind(292.5)).toBe('западный');
    });

    test('> 292.5 и <= 337.5 -> "северо-западный"', () => {
      expect(directionOfwWind(300)).toBe('северо-западный');
      expect(directionOfwWind(337.5)).toBe('северо-западный');
    });

    test('> 337.5 -> "северный"', () => {
      expect(directionOfwWind(340)).toBe('северный');
      expect(directionOfwWind(359)).toBe('северный');
    });
  });

  describe('capitalizeFirstLetter', () => {
    test('корректно делает первую букву заглавной', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('привет')).toBe('Привет');
    });

    test('возвращает пустую строку, если входная строка пуста (предохранительно)', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });
  });

  describe('cToF', () => {
    test('преобразует градусы C в F', () => {
      expect(cToF(0)).toBe(32);
      expect(cToF(100)).toBe(212);
      expect(cToF(-40)).toBe(-40);
    });
  });

  describe('fToC', () => {
    test('преобразует градусы F в C', () => {
      expect(fToC(32)).toBe(0);
      expect(fToC(212)).toBe(100);
      expect(fToC(-40)).toBe(-40);
    });
  });

  describe('resetWeatherContent', () => {
    test('перерисовывает body и сохраняет город в localStorage', () => {
      jest.spyOn(appHeader, 'createHeader').mockImplementation((city) => {
        const header = document.createElement('header');
        header.textContent = `Header for ${city}`;
        return header;
      });

      jest.spyOn(appContent, 'createContent').mockImplementation((weather) => {
        const main = document.createElement('main');
        main.textContent = `Temp: ${weather?.main?.temp ?? 'no-temp'}`;
        return main;
      });
      resetWeatherContent('Moscow', { main: { temp: 25 } });

      const storedCity = JSON.parse(localStorage.getItem('city'));
      expect(storedCity).toBe('Moscow');

      const headerEl = document.querySelector('header');
      const mainEl = document.querySelector('main');
      expect(headerEl).not.toBeNull();
      expect(mainEl).not.toBeNull();

      expect(headerEl?.textContent).toBe('Header for Moscow');
      expect(mainEl?.textContent).toBe('Temp: 25');
    });
  });
});
