import { fromEvent } from 'rxjs';
import { map, debounceTime, switchMap, tap } from 'rxjs/operators';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';
import { githubSearch, getRender, getLoaderUpdater } from './utils';

import './styles.css';

const searchInput = document.querySelector('input') as HasEventTargetAddRemove<{
  target: HTMLInputElement;
}>;
const outputWrapper = document.querySelector('#output') as HTMLInputElement;
const searchLoader = document.querySelector('.search__loader') as HTMLElement;

let numberOfPendingRequests = 0;
const render = getRender(outputWrapper);
const loaderUpdater = getLoaderUpdater(searchLoader);

const search$ = fromEvent(searchInput, 'keyup').pipe(
  map(ev => ev.target.value),
  debounceTime(500),
  tap(() => loaderUpdater(++numberOfPendingRequests > 0)),
  switchMap(str => githubSearch(str)),
  tap(() => loaderUpdater(--numberOfPendingRequests < 1)),
);

search$.subscribe(render);
