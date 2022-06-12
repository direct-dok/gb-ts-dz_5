import { Api } from './Api.interface.js'
import SearchFormData from '../SearchFormData.interface.js'
import { fetchData, getTimestamp } from '../utility.js'

export class HomyApi implements Api {

    protected city: String
    protected checkin: String
    protected checkout: String
    protected price: String
    protected coordinates: String

    protected url: String 

    constructor(dataSearch: SearchFormData) {
        this.city = dataSearch.city
        this.checkin = dataSearch.checkin
        this.checkout = dataSearch.checkout
        this.coordinates = dataSearch.coordinates

        this.url = `http://localhost:3030/places?` +
        `checkInDate=${getTimestamp(this.checkin)}&` +
        `checkOutDate=${getTimestamp(this.checkout)}&` +
        `coordinates=${this.coordinates}`

        if(dataSearch.price) {
            this.price = dataSearch.price
            this.url += `&maxPrice=${dataSearch.price}`
        }
    }

    async execute() {
        let result = await fetchData(this.url)
        result = result.map(el => {
            el.bookedDates = [getTimestamp(this.checkin), getTimestamp(this.checkout)]
            return el
        })
        if(result.code == 400) {
            return 'error';
        }
        return result;
    }

}