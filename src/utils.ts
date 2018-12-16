import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { SearchResult } from './types/SearchResult';
import { Scheduler, Observable } from 'rxjs';

export const githubSearch = (str: string): Promise<SearchResult[]> =>
  str
    ? fetch(`https://api.github.com/search/repositories?q=${str}`)
        .then(r => r.json())
        .then(data => data.items)
    : Promise.resolve([]);

export const getRender = (targetEl: HTMLElement) => (results: SearchResult[]) =>
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

export const getLoaderUpdater = (loaderElement: HTMLElement) => (
  show: boolean,
): void =>
  loaderElement.classList[show ? 'add' : 'remove']('search__loader-hidden');

export const getPipedObservable = (
  src$: Observable<string>,
  loaderUpdater = (x: boolean) => {},
  searchFunction: (s: string) => Promise<SearchResult[]>,
  scheduler?: Scheduler | undefined,
) => {
  let numberOfPendingRequests = 0;
  return src$.pipe(
    debounceTime(500, scheduler),
    tap(() => loaderUpdater(++numberOfPendingRequests > 0)),
    switchMap(str => searchFunction(str)),
    tap(() => loaderUpdater(--numberOfPendingRequests < 1)),
  );
};
