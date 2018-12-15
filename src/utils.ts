import { SearchResult } from './types/SearchResult';

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
) => loaderElement.classList[show ? 'add' : 'remove']('search__loader-hidden');
