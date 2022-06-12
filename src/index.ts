import { renderSearchFormBlock, processingSearchForm } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock, getUserData } from './user.js'
import { renderToast } from './lib.js'
import Dates from './dates.js'

window.addEventListener('DOMContentLoaded', () => {
  renderUserBlock('Alex Morph', './img/avatar.png', 14)
  renderSearchFormBlock(
    Dates.getDateToday(),
    Dates.getLastDayNextMoth()
  )
  renderSearchStubBlock()
  renderToast(
    {text: 'Это пример уведомления. Используйте его при необходимости', type: 'success'},
    {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
  )

  let searchForm = document.querySelector('.search-form form')
  searchForm.addEventListener('submit', processingSearchForm)
})
