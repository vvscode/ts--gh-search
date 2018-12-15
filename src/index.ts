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

const updateLoaderStatus = (show: boolean) =>
  searchLoader.classList[show ? 'add' : 'remove']('search__loader-hidden');

const githubSearch = (str: string): Promise<SearchResult[]> =>
  str
    ? fetch(`https://api.github.com/search/repositories?q=${str}`)
        .then(r => r.json())
        .then(data => data.items)
    : Promise.resolve([]);

const getRender = (targetEl = outputWrapper) => (results: SearchResult[]) =>
  (targetEl.innerHTML = results
    .map(
      (el: SearchResult) => `
    <li>
      <a href="${el.html_url}" target="_blank">${el.name} by ${
        el.owner.login
      } (${el.stargazers_count} star(s))</a>
    </li>
    `,
    )
    .join(''));

let numberOfPendingRequests = 0;
const render = getRender(outputWrapper);

const search$ = fromEvent(searchInput, 'keyup').pipe(
  debounceTime(500),
  map(ev => ev.target.value),
  tap(() => updateLoaderStatus(++numberOfPendingRequests > 0)),
  switchMap(str => githubSearch(str)),
  tap(() => updateLoaderStatus(--numberOfPendingRequests < 1)),
);

search$.subscribe(render);
