import { renderBlock } from './lib.js'
import { getDataJson } from './utility.js'

export function renderUserBlock (userName:string, avatarImg:string, favoriteItemsAmount?:number) {
  const favoritesCaption = favoriteItemsAmount > 0 ? favoriteItemsAmount : 'ничего нет'
  const hasFavoriteItems = favoriteItemsAmount > 0 ? true : false

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarImg}" alt="${userName}" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}

export function getUserData () {
  let valueStorage: unknown = JSON.parse(localStorage.getItem('user'))
  if(valueStorage instanceof Object) {
    return valueStorage
  }
  return String(valueStorage)
}

export function getFavoritesAmount () {
  let valueStorage: unknown = JSON.parse(localStorage.getItem('favoriteItems'));
  if(valueStorage instanceof Object) {
    return valueStorage
  }
  return String(valueStorage)
}

export function toggleFavoriteItem(e) {
  let jsonData = e.target.closest('.result').getAttribute('data-info-hotel'),
      storageData = {};
  if(!localStorage.getItem('favoriteItems')) {
    let result = getDataJson(jsonData, ['id', 'name', 'image'])
    storageData[result.id] = result;
    localStorage.setItem('favoriteItems', JSON.stringify(storageData))
    e.target.classList.add('active');
    return;
  } else {
    let dataLocalStorage = getFavoritesAmount();
    let result = getDataJson(jsonData, ['id', 'name', 'image'])
    
    if(!dataLocalStorage[result.id]) {
      dataLocalStorage[result.id] = result;
      localStorage.setItem('favoriteItems', JSON.stringify(dataLocalStorage))
      e.target.classList.add('active');
      return;
    }

    if(dataLocalStorage[result.id]) {
      delete dataLocalStorage[result.id] = result;
      localStorage.setItem('favoriteItems', JSON.stringify(dataLocalStorage))
      e.target.classList.remove('active');
      return;
    }
  }
}