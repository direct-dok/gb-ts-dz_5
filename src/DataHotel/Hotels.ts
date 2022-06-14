import Api from './Api.interface.js'

export default class Hotels {

    protected apiObjectsList = []
    protected resultData = []

    constructor(apiObject: Api = null) {
        if(apiObject) {
            this.apiObjectsList.push(apiObject)
        }
    }

     async getData() {

        let result = this.apiObjectsList.map(async el => {
            return await el.execute();
        })

        let results = await Promise.all(result)
    
        try {
            results.forEach((el) => {
                el.forEach(elemArray => {
                    this.resultData.push(elemArray)
                })
            })
        } catch(e) {
            return 'error'
        }
        
        return this.resultData;

    }

    addObjectApi(apiObject: Api): void {
        this.apiObjectsList.push(apiObject)
    }
}