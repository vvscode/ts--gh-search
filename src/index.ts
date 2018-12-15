import { fromEvent } from 'rxjs';
import { map, debounceTime, switchMap, tap } from 'rxjs/operators';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';

import './styles.css';

type SearchResult = {
  name: string;
  html_url: string;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
};

const searchInput = document.querySelector('input') as HasEventTargetAddRemove<{
  target: HTMLInputElement;
}>;
const outputWrapper = document.querySelector('#output') as HTMLInputElement;
const searchLoader = document.querySelector('.search__loader') as HTMLElement;

const showLoader = () => searchLoader.classList.remove('search__loader-hidden');
const hideLoader = () => searchLoader.classList.add('search__loader-hidden');

const githubSearch = (str: string): Promise<SearchResult[]> =>
  str
    ? fetch(`https://api.github.com/search/repositories?q=${str}`)
        .then(r => r.json())
        .then(data => data.items)
    : Promise.resolve([]);

let numberOfPendingRequests = 0;

const search$ = fromEvent(searchInput, 'keyup').pipe(
  debounceTime(500),
  map(ev => ev.target.value),
  tap(() => {
    numberOfPendingRequests++;
    if (numberOfPendingRequests > 0) {
      showLoader();
    }
  }),
  switchMap(str => githubSearch(str)),
  tap(() => {
    numberOfPendingRequests--;
    if (numberOfPendingRequests < 1) {
      hideLoader();
    }
  }),
);

search$.subscribe((results: SearchResult[]) => {
  outputWrapper.innerHTML = results
    .map(
      (el: SearchResult) => `
    <li>
      <a href="${el.html_url}" target="_blank">${el.name} by ${
        el.owner.login
      } (${el.stargazers_count} star(s))</a>
    </li>
    `,
    )
    .join('');
});
