import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector('#search-box');
inputSearch.addEventListener('input', debounce(inInputSearch, DEBOUNCE_DELAY));
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function inInputSearch(event) {
  const countryName = event.target.value.trim();
  clearHtmlMarkup();

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (data.length < 10 && data.length > 1) {
        createCoutryList(data);
      }

      if (data.length === 1) {
        countryList.innerHTML = '';
        createCountryInfo(data);
      }
    })

    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCoutryList(data) {
  const markup = data
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li><img src='${svg}' alt ='${official}' width = 30px height = 25px><span align="center">  ${official}</span></li>`
    )
    .join('');
  countryList.innerHTML = markup;
}

function createCountryInfo(data) {
  const markup = data
    .map(
      ({
        name: { official },
        flags: { svg },
        population,
        capital,
        languages,
      }) =>
        `
        <img src='${svg}' alt ='${official}' width = 30px height = 25px <h1><b style="font-size: 30px"> ${official}</b></h1><br>
        <span><b>Capital:</b> ${capital}</span><br>
        <span><b>Population:</b> ${population}</span><br>
        <span><b>Languages:</b> ${Object.values(languages)}</span>
        `
    )
    .join('');
  countryInfo.innerHTML = markup;
}

function clearHtmlMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
