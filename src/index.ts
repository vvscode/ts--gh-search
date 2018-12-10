import { fromEvent } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { HasEventTargetAddRemove } from 'rxjs/internal/observable/fromEvent';

type SearchResult = {
  name: string;
  html_url: string;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
};

const searchInput = document.querySelector(
  'input.search__input',
) as HasEventTargetAddRemove<{ target: HTMLInputElement }>;
const outputWrapper = document.querySelector('#output') as HTMLInputElement;

const githubSearch = (str: string): Promise<SearchResult[]> =>
  str
    ? fetch(`https://api.github.com/search/repositories?q=${str}`)
        .then(r => r.json())
        .then(data => data.items)
    : Promise.resolve([]);

fromEvent(searchInput, 'keyup')
  .pipe(debounceTime(500))
  .pipe(map(ev => ev.target.value))
  .pipe(switchMap(str => githubSearch(str)))
  .subscribe((results: SearchResult[]) => {
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

// .pipe(debounce(() => interval(1000)))
