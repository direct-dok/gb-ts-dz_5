import { renderBlock } from './lib.js'
import Dates from './dates.js'
import SearchFormData from './SearchFormData.interface.js'
import { renderSearchResultsBlock, getItemsResultSearch } from './search-results.js'
import { HomyApi } from './DataHotel/HomyApi.js'
import { SdkApi } from './DataHotel/SdkApi.js'
import Hotels from './DataHotel/Hotels.js'

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

export function processingSearchForm(e): void {
  e.preventDefault()

  let allInputs = Array.from(
    e.target.querySelectorAll('input')
  )

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

  search(dataSearch, resultSearch)
}

export async function search(dataSearch: SearchFormData, callBack): void {


  let sdkApi = new SdkApi(dataSearch)
  let homyApi = new HomyApi(dataSearch)
  const hotels = new Hotels();
  hotels.addObjectApi(sdkApi)
  hotels.addObjectApi(homyApi)

  let result = await hotels.getData()
  let error = null;


  if(result == 'error') {
    error = result
  }

  const resultSearch = callBack(error, result)
  renderSearchResultsBlock(resultSearch)
  
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