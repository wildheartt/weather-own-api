import { createHeader } from '../appHeader.js';

jest.mock('../api.js', () => ({
  getWeatherData: jest.fn(() =>
    Promise.resolve({ main: { temp: 12 }, name: 'MockCity' })
  ),
}));

describe('createHeader', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('клик по searchBtn без ввода города должен показать ошибку', () => {
    const headerEl = createHeader('TestCity');
    document.body.append(headerEl);

    const cityChangeBtn = headerEl.querySelector('.city__change');
    cityChangeBtn.click();

    const searchBtn = headerEl.querySelector('.search_btn');
    expect(searchBtn).not.toBeNull();

    searchBtn.click();

    const errorBlock = headerEl.querySelector('.search__error');
    expect(errorBlock).not.toBeNull();
    expect(errorBlock.textContent).toContain('Введите название города');
  });
});
