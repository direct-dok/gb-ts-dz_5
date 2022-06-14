export function addPrefixNull(number:number) :string | number {
    return number < 10 ? '0' + number : number
}

export async function fetchData(url:string) {
    let response = await fetch(url);
    let responseText = await response.text();
    let arrayResult = JSON.parse(responseText)

    return arrayResult;
}

export function getTimestamp (data:string):number {
    return Date.parse(data);
}

export function addListenerForElements(event, elements, callBack): void {
    elements = Array.from(elements)
    elements.forEach(function(elem) {
        elem.addEventListener(event, callBack)
    })
}

export function addLIstenerForElement(event, element, callBack): void {
    element.addEventListener(event, callBack)
}

export function checkPageElements(selector:string): object {
    return document.querySelectorAll(selector)
}

export function checkPageElement(selector:string): object {
    return document.querySelector(selector)
}

export function getDataJson(stringJson:string, keys:Array<string>): object {
    let object = JSON.parse(stringJson),
        objectResult = {};

    keys.forEach(function(elem) {
        objectResult[elem] = object[elem];
    })
    return objectResult;
}

export function convertJsonToObject(jsonString:string): array | object {
    return JSON.parse(jsonString)
}

export function convertObjectToJson(object:object): string {
    return JSON.stringify(object)
}

export function normalizeDataSDK(obj):object {
    let normalizeObject = {};
    normalizeObject['id'] = obj.id
    normalizeObject['name'] = obj.title
    normalizeObject['description'] = obj.details
    normalizeObject['image'] = obj.photos[0]
    normalizeObject['remoteness'] = 0
    normalizeObject['bookedDates'] = obj.bookedDates
    if(obj.totalPrice) {
        normalizeObject['price'] = obj.totalPrice
    }
    return normalizeObject;
}

export function checkDataBooking(bookingPeriod: number[], orderPeriod: number[]): boolean {
    if(
        (orderPeriod[0] > bookingPeriod[0] && orderPeriod[0] < bookingPeriod[1]) 
        || (orderPeriod[1] > bookingPeriod[0] && orderPeriod[1] < bookingPeriod[1])
        || (orderPeriod[0] == bookingPeriod[0] && orderPeriod[1] == bookingPeriod[1])
        || (orderPeriod[0] == bookingPeriod[1])
        || (orderPeriod[1] == bookingPeriod[0])
    ) {
        return false;
    }
    return true;
}