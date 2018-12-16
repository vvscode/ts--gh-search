import { fromEvent } from 'rxjs';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';
import {
  githubSearch,
  getRender,
  getLoaderUpdater,
  getPipedObservable,
} from './utils';
import { map } from 'rxjs/operators';

import './styles.css';

const searchInput = document.querySelector('input') as HasEventTargetAddRemove<{
  target: HTMLInputElement;
}>;
const outputWrapper = document.querySelector('#output') as HTMLInputElement;
const searchLoader = document.querySelector('.search__loader') as HTMLElement;

const render = getRender(outputWrapper);
const loaderUpdater = getLoaderUpdater(searchLoader);

const search$ = fromEvent(searchInput, 'keyup').pipe(
  map(ev => ev.target.value),
);

getPipedObservable(search$, loaderUpdater, githubSearch).subscribe(render);
