//중앙 컨트롤러 역할을 하게 될 소스

import ControlExcel from "./ControlExcel.js";
import CrawlWebPages from "./CrawlWebPages.js";
import FindQuantity from "./FindQuantity.js";
import {resolve} from 'path';

/*
1. 엑셀 정보를 엑셀 컨트롤러에게서 Array 형태로 받아온다.
2. 그 String Array 정보를 CrawlWebPages를 생성하고, startAxios() 하여 시작.
3. 위의 메소드가 끝날 때 까지 wait.
4. 끝난 후, 받아온 vendorItemId array 정보를 엑셀 컨트롤러에 넘긴다.
*/
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const wrapSlept = async () => { await sleep(2000) };

class Controller{
    constructor(){
    }
    async start(){
        this.controlExcel = new ControlExcel();
        const absolutePath = resolve('./urlGather_s.xlsx');

        //여기는 웹 페이지에서 엑셀 파일 읽은 후 데이터 집어넣는 방식으로 해야함. -> 물론 서버는 개별로.(정보유출 방지)
        this.controlExcel.readExcelFile(absolutePath); //웹 페이지 해석
        this.urlArray = await this.controlExcel.getUrlArray(); //url String Array 반환
        this.accessKey = await this.controlExcel.getAccessKey();
        this.secretKey = await this.controlExcel.getSecretKey();

       
        this.crawlWebPages = new CrawlWebPages(this.urlArray); 
        await this.crawlWebPages.startAxios(); 
        await this.crawlWebPages.createClasses();
        this.gatherVendorItemArray = await this.crawlWebPages.getGatherVendorItemIdArray(); //

        //새로운 메소드
        //this.newGatherVendorItemArray = await this.findQuantity.inputQuantity();

        //새로운 메소드
        //this.newGatherVendorItemArray = await this.findQuantity.getGatherVendorItemIdArray();
        

        await this.controlExcel.writeExcelFile(this.gatherVendorItemArray.getGatherVendorItemIdArray());
        /*
        await this.controlExcel.writeExcelFile(this.gatherVendorItemArray.getGatherVendorItemIdArray()).then(() => {
            this.controlExcel.makeAoaData();
        });
        */
        //console.log('끝');
        //await this.controlExcel.makeAoaData();
        //그 다음 엑셀로 내보내기
        while(true){
            if(this.controlExcel.isPlacedAoa()){
                console.log(this.controlExcel.getAoa());
                break;
            }
            await wrapSlept(1000);
        }

        console.log('real end');
        //모두 작성 한 뒤, Controller의 run 메소드로 제작. 위의 변수는 선언만 해두기.
    }
}

const controller = new Controller();
await controller.start();