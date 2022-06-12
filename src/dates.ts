import { addPrefixNull } from "./utility.js"

export default class Dates {

    static getDateToday() :string {
        const today = new Date()
        
        return Dates._parseDate(today);
    }

    static getLastDayNextMoth() :string {
        const date = new Date();
        let nextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);

        
        return Dates._parseDate(nextMonth);
    }

    static calculateFutureDay(increaseDay:number) :string {
        const date = new Date();
        let futureDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + increaseDay);

        return Dates._parseDate(futureDay);
    }

    static timestampToDate(timestamp:number) {
        const date = new Date(timestamp);
        let day = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return Dates._parseDate(day);
    }

    static _parseDate(date) :string {
        let year = date.getFullYear()
        let month = addPrefixNull(date.getMonth() + 1)
        let day = addPrefixNull(date.getDate())
        let resultDate = `${year}-${month}-${day}`
        return resultDate
    }
}