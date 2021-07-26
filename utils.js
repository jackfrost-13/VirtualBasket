/**
 * Utility method to search for item via barcode-number-id in a given array of items
 * 
 * @param {String} name Barcode of the item to be searched. 
 * @param {Array[]} items List of Items to be searched in.
 * @returns 
 */
export function searchItemByBarcodeId(name, items){
    let itemFound;
    for(let i=0; i< items.length; i++){
        let item = items[i];
        if(item.id === name){
            itemFound = item;
            break;
        }
    }
    return itemFound;
}

/**
 * Utility method to search for item via name in a given array of items
 * 
 * @param {String} name Name of the item to be searched. 
 * @param {Array[]} items List of Items to be searched in.
 * @returns 
 */
export function searchItemByName(name, items){
    let itemFound;
    for(let i=0; i< items.length; i++){
        let item = items[i];
        if(item.name === name){
            itemFound = item;
            break;
        }
    }
    return itemFound;
}