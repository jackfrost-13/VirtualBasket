import { createDialogView, createFoundItem, clearSearchResults, hideDialog, createNotFoundItem } from "./dialogView.js";
import {searchItemByBarcodeId, searchItemByName} from "./utils.js";

let totalData = {};
let addedItems = [];
let addItemsToCart;

/**
 *Creates Dialog Box for search or scan
 * 
 * @param {String} type "scan" or "search" based on which dialog it is.
 * @param {Object} data Data Model of the App.
 * @param {Function} callback Callback method to be called after dialog closes.
 */
export function createDialog(type, data, callback){
    totalData = data;
    addedItems = [];
    createDialogView(type, searchBarcodeId);
    addEventListeners(type);
    addItemsToCart = callback;
}

/**
 * Adding Event Listeners to the dialog.
 * @param {String} type "scan" or "search" based on which dialog it is.
 */
function addEventListeners(type){
    const dialogHeaderComponent =  document.getElementById("dialogHeader");
    dialogHeaderComponent?.addEventListener("click", closeDialogHandler);
    const searchResultsDiv = document.getElementById("searchResultsDiv");
    searchResultsDiv?.addEventListener("click", itemAddorRemoveHandler);
    (type === "scan") ? addScanEventListeners() :  addSearchEventListeners();
}

/**
 * Adding Event listeners specific to search dialog.
 */
function addSearchEventListeners(){
    document.getElementById("searchDiv").addEventListener("click", searchAndClearSearchHandler);
    document.getElementById("search")?.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            searchByEnter();
        }
    });
}

/**
 * Adding Event listeners specific to scan dialog.
 */
 function addScanEventListeners(){
     //TODO Explicit event listeners for scan in the future.
}

/**
 *Closes the Dialog and pass the items which are to be added to cart.
 */
function closeDialogHandler(event){
    if(!event.target.classList.contains("close-dialog-button-icon")){
        return;
    }
    hideDialog();
    addItemsToCart(addedItems);
}

/** 
 * Handler for Adding or removing items after searching for them in the dialog.
 */
function itemAddorRemoveHandler(event){
    if(!event.target?.classList.contains("add-button-icon") && !event.target?.classList.contains("remove-button-icon")){
        return;
    }
    const searchListItem = event.target?.closest('div');
    const quantityUpdateText = searchListItem?.querySelector("p");
    const nameDiv = event.target?.closest('div').parentNode?.parentNode;
    const name = nameDiv.querySelector('p')?.innerHTML;
    event.target.classList.contains("add-button-icon") ? addItemToList(name, quantityUpdateText) : removeItemFromList(name, quantityUpdateText);
}

/**
 * Adds item to the list to items to be added to the cart.
 * 
 * @param {String} name Name of the Item
 * @param {Object} quantityUpdateText Contains the object of quantity element
 */
function addItemToList(name, quantityUpdateText){
    let quantity = parseFloat(quantityUpdateText.innerHTML) + 1;
    quantityUpdateText.innerHTML = quantity;
    updateAddedItems(name, quantity);
}

/**
 * Removes Item from the list of items which are already in the cart.
 * 
 * @param {String} name Name of the Item
 * @param {Object} quantityUpdateText Contains the object of quantity element
 * @returns 
 */
function removeItemFromList(name, quantityUpdateText){
    let quantity = parseFloat(quantityUpdateText.innerHTML);
    if(quantity === 0){
        return;
    }
    quantity = quantity - 1;
    quantityUpdateText.innerHTML = quantity;
    updateAddedItems(name, quantity);
}

/**
 * Updates the data model for the dialog which will be passed to the cart.
 * 
 * @param {String} name Name of the Item
 * @param {Number} quantity Number of items to be added, removed or updated in the cart.
 */
function updateAddedItems(name, quantity){
    let item = searchItemByName(name, addedItems);
    //If item already exists, just update quantity.
    if(item){
        item.quantity = quantity;
    }
    else{
        //Item is going to be inserted for the first time in the cart.
        item = searchItemByName(name, totalData.totalItems);
        if(item){
            const itemToAdd = {
                name : item.name,
                id: item.id,
                quantity: quantity,
                thumbnail: item.thumbnail,
                qrUrl: item.qrUrl,
                price: item.price,
                element: item.element
            };
            addedItems.push(itemToAdd);
        }
    }
}

/**
 * Handles the search button and clear search button functionality
 */
function searchAndClearSearchHandler(event){
    if(!event.target.classList.contains("search-button-icon") && !event.target.classList.contains("clear-button-icon")){
        return;
    }
    event.target.classList.contains("search-button-icon") ? search(event) : clearSearch(event);
}

/** 
 *Searches for an item from the inventory using the barcode number.
 */
function search(event){
    clearSearchResults();
    const searchField = event.target.closest('div').children[0];
    const value = searchField.value;
    searchBarcodeId(value);
}

/**
 * 
 * Search for an item after Enter press. 
 */
function searchByEnter(){
    clearSearchResults();
    const searchField = document.getElementById("search");
    const value = searchField?.value;
    if(value){
        searchBarcodeId(value);
    }
}

/**
 * Using this method to search for all barcode Ids and adding results to the search or scan dialog.
 * Re using this for both dialogs.
 * 
 * @param {String} value Barcode Number of Item which was searched or scanned for.
 */
export function searchBarcodeId(value){
    const item = searchItemByBarcodeId(value, totalData.totalItems);
    if(item){
        //If item is already in the cart, show it with correct quantity.
        let addedItem = searchItemByBarcodeId(value, totalData.addedItems);
        let updatedAddedItem = searchItemByBarcodeId(value, addedItems);
        if(updatedAddedItem){
            addedItem = updatedAddedItem;
        }
        if(addedItem){
            createFoundItem(addedItem);
        }
        //Show item with 0 quantity as user hasn't added it to cart.
        else{
            createFoundItem(item);
        }
    }
    else{
        createNotFoundItem();
    }
}

/**
 * Clear the search field and results when the cross is pressed.
 */
function clearSearch(event){
    clearSearchResults();
    const searchField = event.target.closest('div').children[0];
    searchField.value = "";
}
