import { convertJsonToObject, convertObjectToJson, checkDataBooking } from './utility.js'
import Dates from './dates.js'

export function booking(e) {
    let jsonData = convertJsonToObject(e.target.closest('.result').getAttribute('data-info-hotel')),
        storageData = [];

    if(!localStorage.getItem('booking')) {
        addNumberToOrder(storageData ,jsonData)
    } else {
        let freeBooking = true;
        let bookedHotels = convertJsonToObject(localStorage.getItem('booking'))
        let filterHotelId = bookedHotels.filter(function(el) {
            return el.id == jsonData.id
        })
        filterHotelId.forEach(function(el) {
            let resultBooking = checkDataBooking(el.bookedDates, jsonData.bookedDates)
            if(!resultBooking) {
                freeBooking = resultBooking
            }
        })

        if(freeBooking) {
            addNumberToOrder(bookedHotels, jsonData)
        } else {
            alert('К сожалению данная дата уже занята ((')
        }
    }
}

export function addNumberToOrder(arrayOrders ,objectOrder) {
    arrayOrders.push(objectOrder)
    localStorage.setItem('booking', convertObjectToJson(arrayOrders))
    alert(orderInformation(objectOrder))
}

export function orderInformation(objectOrder) {
    return `Вы успешно забронировали номер в отеле ${objectOrder.name}. Заезд ${Dates.timestampToDate(objectOrder.bookedDates[0])}, выезд ${Dates.timestampToDate(objectOrder.bookedDates[1])}`;
}