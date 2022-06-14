import { Api } from './Api.interface.js'
import { FlatRentSdk, addDays, cloneDate } from '../flat-rent-sdk.js'
import SearchFormData from '../SearchFormData.interface.js'
import { normalizeDataSDK, getTimestamp } from '../utility.js'

export class SdkApi implements Api {

    protected dataSearch = {}
    protected sdkApi: Object

    constructor(dataSearch: SearchFormData) {
        const today = new Date()

        this.dataSearch.city = dataSearch.city
        this.dataSearch.checkInDate = cloneDate(today)
        this.dataSearch.checkOutDate = addDays(cloneDate(today), 1)
        
        if(dataSearch.price) {
            this.dataSearch.price = dataSearch.price
        }

        this.sdkApi = new FlatRentSdk()

    }

    async execute() {
        try {
            let result = await this.sdkApi.search(this.dataSearch)
            result = this.normalizeData(result)
            result = result.map(el => {
                el.bookedDates = [getTimestamp(this.dataSearch.checkInDate), getTimestamp(this.dataSearch.checkOutDate)]
                return el
            })
            return result
        } catch (e) {
            console.error(e)
            return 'error'
        }      
    }

    normalizeData(objectData) {
        return objectData.map(function(el) {
            return normalizeDataSDK(el)
        })
    }

}