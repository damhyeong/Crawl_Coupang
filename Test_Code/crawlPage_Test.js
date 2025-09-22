import axios from 'axios';
import cheerio from 'cheerio';
import https from 'https';
//import vm from 'vm'

axios.defaults.headers = {
    'Cache-Control' : 'no-store',
    'Pragma' : 'no-store',
    'Expires' : '0',
};

await axios({
    method : "get", //통신 방식
    url : "https://www.coupang.com/vp/products/6885375946?vendorItemId=83700609483&isAddedCart=",// 서버
    
    headers : {'X-Requested-With' : 'XMLHttpRequest', 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    'Content-Type' : 'application/json', 'Cookie' : ''}, //요청 헤더 설정
    //params : {language : "utf-8"}, // ? 파라미터를 전달
    responseType : "blob", //브라우저, arraybuffer, document, json, text, stream 이 존재
    responseEncoding : 'utf8',
    httpsAgent : new https.Agent({keepAlive : true}),
    withCredentials : false, 
    timeout : 5000
}).then(function (response){
    
    const $ = cheerio.load(response.data);
    $('script', response.data).each((index, element) => {
        //console.log(element.childNodes); --> function(exports) 확인
        //console.log(element.children); --> function(exports) 확인
        
        if(element.children[0] != undefined){
            if(index == 4){

                let initString = element.children[0].data;
                let fIndex = initString.indexOf("exports.sdp = ");
                let lIndex = initString.indexOf("exports.sdpIssueTypes");
                console.log(fIndex + " : " + lIndex);
                
                let trimString1 = initString.slice(fIndex + 14, lIndex).trim();
                let trimString2 = trimString1.slice(0, trimString1.length-1);
                //iJsonArray.push(JSON.parse(trimString2));
                console.log(JSON.parse(trimString2));
            }
        }
    })
}).catch(function (error){
    console.log(error);
    console.log('에러남');
    
}).finally(function(){
    console.log('마무리');
});