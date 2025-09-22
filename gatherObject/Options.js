import OptionRows from './OptionRows.js';
import AttributeVendorItemMap from './AttributeVendorItemMap.js';

export default class Options{
    constructor(jsonInfo){
        this.jsonInfo = jsonInfo;
        this.attributeVendorItemMap = new AttributeVendorItemMap(this.jsonInfo["attributeVendorItemMap"]);
        this.optionRows = new OptionRows(this.jsonInfo["optionRows"]);
    }
    getJsonInfo = () => {
        return this.jsonInfo;
    }
    getAttributeVendorItemMap = () => {
        return this.attributeVendorItemMap;
    }
    getOptionRows = () => {
        return this.optionRows;
    }
}