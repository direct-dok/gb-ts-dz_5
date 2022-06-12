import { renderBlock } from './lib.js'
import { addListenerForElements, checkPageElements } from './utility.js'
import { toggleFavoriteItem, getFavoritesAmount } from './user.js'
import { booking } from './booking.js'

export function renderSearchStubBlock () {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock (reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock (resultSearch: String) {

  if(resultSearch == 'Error') {
    renderEmptyOrErrorSearchBlock('Произошла ошибка, попробуйте повторить запрос');
    return;
  }

  if(!resultSearch) {
    renderEmptyOrErrorSearchBlock('По данным параметрам нет ни одного подходящего результата. Попробуйте изменить параметры поиска и повторите!');
    return;
  }

  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
      ${resultSearch}
    </ul>
    `
  )

  let elements = checkPageElements('.favorites');
  let buttonsReserve = checkPageElements('.reserved');
  if(elements.length) {
    addListenerForElements('click', elements, toggleFavoriteItem)
  }

  if(buttonsReserve.length) {
    addListenerForElements('click', buttonsReserve, booking)
  }
  
}

export function getItemsResultSearch(items: Array<String>): String {
  let resultHTML = '';

  items.forEach((elem) => {

    let favorite = getFavoritesAmount(),
        favoriteTrue = false;
    if(favorite && favorite[elem.id]) {
      favoriteTrue = true;
    }

    resultHTML += `
    <li class="result" data-info-hotel='${JSON.stringify(elem)}'>
    <div class="result-container">
      <div class="result-img-container">
        <div class="favorites ${favoriteTrue ? 'active' : ''}"></div>
        <img class="result-img" src="${elem.image}" alt="${elem.name}">
      </div>	
      <div class="result-info">
        <div class="result-info--header">
          <p>${elem.name}</p>
          <p class="price">${elem.price}&#8381;</p>
        </div>
        <div class="result-info--map"><i class="map-icon"></i> ${elem.remoteness ? elem.remoteness + ' км от вас' : 'не указано'}</div>
        <div class="result-info--descr">${elem.description}</div>
        <div class="result-info--footer">
            <div>
              <button class="reserved">Забронировать</button>
            </div>
          </div>
        </div>
      </div>
    </li>
    `;
  });

  return resultHTML;
}