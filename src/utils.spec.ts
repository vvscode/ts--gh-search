import { getLoaderUpdater } from './utils';

describe('getLoaderUpdater', () => {
  let el: HTMLElement;
  beforeEach(() => (el = document.createElement('div')));

  it('is function', () => expect(typeof getLoaderUpdater).toBe('function'));
  it('returns function', () =>
    expect(typeof getLoaderUpdater(el)).toBe('function'));

  it('adds class on true as param', () => {
    const updater = getLoaderUpdater(el);
    expect(el.classList.contains('search__loader-hidden')).toBeFalsy();
    updater(true);
    expect(el.classList.contains('search__loader-hidden')).toBeTruthy();
  });

  it('removes class on true as param', () => {
    const updater = getLoaderUpdater(el);
    el.classList.add('search__loader-hidden');
    updater(false);
    expect(el.classList.contains('search__loader-hidden')).toBeFalsy();
  });
});
