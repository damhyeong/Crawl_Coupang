import https from 'https'
import crypto from 'crypto'

export default class FindQuantity{
    constructor(gatherVendorItemIdArray, accessKey, secretKey){
        //console.log("constructor : gatherVendorItemIdArray => " + gatherVendorItemIdArray);
        /** 전체를 가져오는 듯 */
        this.gatherVendorItemArray = gatherVendorItemIdArray.getGatherVendorItemIdArray();
        this.ACCESS_KEY = accessKey;
        this.SECRET_KEY = secretKey;
        this.datetime;
        this.method = 'GET';
        this.vendorItemId;
        this.path;
        this.query;
        this.message;
        this.urlPath;
        this.algorithm = 'sha256';
        this.signature;
        this.authorization;
        this.options;
        console.log('FindQuantity 객체 생성 완료');
    }
    async inputQuantity(){
        //console.log("this.gatherVendorItemArray.length => " + this.gatherVendorItemIdArray.length);

        for(let i = 0; i < this.gatherVendorItemArray.length; i++){

            /** 한 페이지의 vendorItem 들을 전부 가져온다. */
            const vendorItemIdArray = this.gatherVendorItemArray.at(i);

            ////console.log("inputQuantity -> vendorItemIdArray : " + vendorItemIdArray);
            /** 비동기 형식으로 데이터 추출 -> vendorItemIdArray의 길이만큼 실행 */
            //console.log("vendorItemIdArray.length => " + vendorItemIdArray.length);

            //새로운 메소드 --> vendorItemIdArray => this.gatherVendorItemIdArray.at(i);
            await Promise.resolve(vendorItemIdArray).then((vendorItemIdObject) => {
                /** vendorItemIdObject는 하나의 제품을 의미한다. */
                //console.log("vendorItemIdObject.length => " + vendorItemIdObject.length);
                
                for(let j = 0; j < vendorItemIdObject.length; j++){
                    
                    //console.log("vendorItemIdObject.length => " + vendorItemIdObject.length);
                    ////console.log(vendorItemIdObject);
                    
                    this.datetime = new Date().toISOString().substr(2,17).replace(/:/gi, '').replace(/-/gi, '') + "Z";

                    const vendorItemIdObj = vendorItemIdObject.at(j);


                    const vendorItemId = vendorItemIdObj.getVendorItemId();

                    //console.log("vendorItemId : " + vendorItemId);
                    this.path ='/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/' + vendorItemId + '/inventories';

                    this.query = '';

                    this.message = this.datetime + this.method + this.path + this.query;
                    this.urlpath = this.path + '?' + this.query;


                    this.signature = crypto.createHmac(this.algorithm, this.SECRET_KEY).update(this.message).digest('hex');

                    this.authorization = 'CEA algorithm=HmacSHA256, access-key=' + this.ACCESS_KEY + ', signed-date=' + this.datetime + ', signature=' + this.signature;
                    ////console.log(this.authorization);

                    const options = {
                    hostname: 'api-gateway.coupang.com',
                    port: 443,
                    path: this.urlpath,
                    method: this.method,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': this.authorization,
                        'X-EXTENDED-TIMEOUT':90000
                    }
                    };

                    let body = [];

                    const req = https.request(options, res  => {
                    ////console.log(`statusCode: ${res.statusCode}`);
                    ////console.log(`reason: ${res.statusMessage}`);

                    res.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString();
                        const json = JSON.parse(body);
                        console.log(json["data"]);
                        vendorItemIdObj.setBuyableQuantity(json["data"]["amountInStock"]);
                        
                        
                    });
                    });

                    req.on('error', error => {
                        console.error(error);
                    });

                    req.end();
                }
            })
            
            /*
            for(let j = 0; j < vendorItemIdArray.length; j++){
                //console.log("vendorItemIdArray.at() : " + vendorItemIdArray.at(j));
                
            }
            */
        }
        console.log("inputQuantity 끝");
        return this.gatherVendorItemArray;
    }
    async getQuantityVendorArray(){
        return this.vendorItemIdArray;
    }
    //새로운 메소드
    async getGatherVendorItemIdArray(){
        return this.gatherVendorItemArray;
    }
}