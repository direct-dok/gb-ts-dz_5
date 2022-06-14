import { renderBlock } from './lib.js'
import Dates from './dates.js'
import SearchFormData from './SearchFormData.interface.js'
import { renderSearchResultsBlock, getItemsResultSearch } from './search-results.js'
import { HomyApi } from './DataHotel/HomyApi.js'
import { SdkApi } from './DataHotel/SdkApi.js'
import Hotels from './DataHotel/Hotels.js'
import { checkPageElement } from './utility.js'

export function renderSearchFormBlock (dateToday:string, lastDayNextMoth:string) :void {

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" name="city" disabled value="Санкт-Петербург" />
            <input type="hidden" name="coordinates" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${Dates.calculateFutureDay(1)}" min="${dateToday}" max="${lastDayNextMoth}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${Dates.calculateFutureDay(3)}" min="${dateToday}" max="${lastDayNextMoth}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}

export function filterSortResult(e, formSelector = null) {
  let formElement = checkPageElement(formSelector)
  processingSearchForm(null, formElement, e.target.value)
}

export function processingSearchForm(e, formDomElement = null, actionFilter = 'all'): void {
  
  let allInputs = null

  if(e) {
    e.preventDefault()

    allInputs = Array.from(
      e.target.querySelectorAll('input')
    )
  }

  if(formDomElement) {
    allInputs = Array.from(
      formDomElement.querySelectorAll('input')
    )
  }

  let dataSearch: SearchFormData = {
    city: '',
    checkin: '',
    checkout: '',
    price: '',
    coordinates: ''
  }

  allInputs.forEach(function(field:any) {
    dataSearch[field.name] = field.value
  })

  search(dataSearch, resultSearch, actionFilter)
}

export async function search(dataSearch: SearchFormData, callBack, filterAction): void {

  let sdkApi = new SdkApi(dataSearch)
  let homyApi = new HomyApi(dataSearch)
  const hotels = new Hotels();
  hotels.addObjectApi(sdkApi)
  hotels.addObjectApi(homyApi)

  let result = await hotels.getData()
  let error = null;


  if(result == 'error') {
    error = result
  } else {
    result = filterSearchResult(result, filterAction)
  }

  

  const resultSearch = callBack(error, result)
  
  renderSearchResultsBlock(resultSearch, filterAction)
  
}

interface ResultSearch {
  (error?: Error, places?: Object): String
}

const resultSearch: ResultSearch = (error?: Error, places?: Object[]): String => {
  if(error) {
    console.error('Произошла ошибка поиска')
    return 'Error';
  }

  return getItemsResultSearch(places);
  
}

export function filterSearchResult(array: Object[], actionFilter: String): Object[] {
  let actions = actionsForFilter()
  let results = actions ? 
                  actions[actionFilter](array) : 
                  array;
  return results;
}

export function actionsForFilter() {
  return {
    all: function (arr) {
      return arr
    },
    cheap: function (arr) {
      let result = arr.sort(function(a, b) {
        return a.price - b.price
      })
      return result
    },
    expensive: function (arr) {
      let result = arr.sort(function(a, b) {
        return b.price - a.price
      })
      return result
    },
    closer: function (arr) {
      let result = arr.sort(function(a, b) {
        return a.remoteness - b.remoteness
      })
      result = result.filter(elem => elem.remoteness > 0)
      return result
    }
  }
}