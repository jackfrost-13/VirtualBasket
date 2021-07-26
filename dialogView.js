import { createAddRemoveItem } from "./cartView.js";
import { searchBarcodeId } from "./dialog.js";

let html5QrcodeScanner;

/**
 * Create the view of the dialog.
 * 
 * @param {String} type "scan" or "search" based on which dialog it is.
 */
export function createDialogView(type){
    setHeaderTextOfDialog(type);
    type === 'scan' ? getContentOfScanDialog() : getContentOfSearchDialog();
    showDialog();
}

/**
 * Set the title of the dialog based on which operation it is.
 * 
 * @param {String} type "scan" or "search" based on which dialog it is.
 */
function setHeaderTextOfDialog(type){
    const dialogHeader = document.getElementById("dialogTitle");
    removeAllChilds(dialogHeader);
    const headerTextItem = document.createElement("div");
    const title = type === 'scan' ? document.createTextNode("Scan an Item") : document.createTextNode("Search For an Item");
    headerTextItem?.appendChild(title);
    dialogHeader?.appendChild(headerTextItem);
}

/**
 * Set the content of the reusable dialog with search items.
 */
function getContentOfSearchDialog(){
    const dialogContent = document.getElementById("dialogContent");
    const searchfieldDiv = `<div id="searchDiv" class="search-div">`;
    const searchResultsDiv = `<div id="searchResultsDiv"></div>`;
    const searchField = `<input id="search" class="search-field" placeholder="Enter Barcode Number" type="text"></input>`
    const searchButton = '<button id="searchButton" class="search-button"><img class="search-button-icon" src="./images/search.png" alt="Search"></button>';
    const clearButton = '<button id="clearButton" class="clear-button"><img class="clear-button-icon" src="./images/clear.png" alt="Clear Search"></button>';   
    dialogContent.innerHTML = searchfieldDiv + searchField + clearButton + searchButton + `</div>` + searchResultsDiv;
}

/**
 * Set the content of the reusable dialog with scan items.
 */
function getContentOfScanDialog(){
    const dialogContent = document.getElementById("dialogContent");
    const scanDiv = `<div id="scanDiv" class="scan-div"></div>`;
    const searchResultsDiv = `<div id="searchResultsDiv"></div>`;
    dialogContent.innerHTML = scanDiv +searchResultsDiv ; 
    addScanButton(dialogContent);
    html5QrcodeScanner = new Html5QrcodeScanner(
        "scanDiv", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
}

/**
 * After scan is successful, things to be done.
 * 
 * @param {String} decodedText Decoded text from the HTML5 Scanner.
 * @param {Object} decodedResult Decoded result from the HTML5 Scanner.
 */
function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    html5QrcodeScanner.clear();
    const scanDiv = document.getElementById("scanDiv");
    scanDiv?.classList.toggle("height-0", true);
    clearSearchResults();
    searchBarcodeId(decodedText);
    showScanButtonVisibility();
}

/**
 * Error handler in case object to be scanned for is not a QR code.
 * Library doesn't fully support the error handling. Was throwing a null exception hence not adding this to the code. 
 * 
 * @param {String} decodedText Decoded text from the HTML5 Scanner.
 * @param {Object} decodedResult Decoded result from the HTML5 Scanner. 
 */
function onScanFailure(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    html5QrcodeScanner.clear();
    const scanDiv = document.getElementById("scanDiv");
    scanDiv.classList.toggle("height-0");
    clearSearchResults();
    showScanError();
    showScanButtonVisibility();
}

/**
 * Show an error message if the Scannable object isn't even a QR code.
 */
function showScanError(){
    const searchResult = document.getElementById("searchResultsDiv");
    const searchedItem = document.createElement("div");
    searchedItem.classList.add("error-search");
    const displayText = document.createTextNode("Barcode could not be identified");
    searchedItem?.appendChild(displayText);
    searchResult?.appendChild(searchedItem);
}

/**
 * Scan button visibility
 */
function showScanButtonVisibility(){
    const scanButton = document.getElementById("scan-button");
    scanButton?.classList.toggle("scan-hide", false);
    scanButton?.classList.toggle("scan-show", true);
}
/**
 * Scan button hide
 */
function hideScanButtonVisibility(){
    const scanButton = document.getElementById("scan-button");
    scanButton?.classList.toggle("scan-hide", true);
    scanButton?.classList.toggle("scan-show", false);
}

/**
 * Add scan button to dialog content
 * 
 * @param {Object} dialogContent HTML object of the dialog.
 */
function addScanButton(dialogContent){
    const scanButton = document.createElement("button");
    scanButton.appendChild(document.createTextNode("Scan More"));
    scanButton.id = "scan-button";
    scanButton.onclick = renderScanAgain;
    dialogContent?.appendChild(scanButton);
    hideScanButtonVisibility();
}

/**
 * Render scan content if user wants to re-scan.
 */
function renderScanAgain(){
    clearSearchResults();
    hideScanButtonVisibility();
    html5QrcodeScanner.render(onScanSuccess);
    const scanDiv = document.getElementById("scanDiv");
    scanDiv?.classList.toggle("height-0", false);
}

/**
 * Create the item in the dialog which displays the searched and scan items.
 * 
 * @param {Object} item Holds a single item which needs to be added to the dialog.
 */
export function createFoundItem(item){
    const searchResult = document.getElementById("searchResultsDiv");
    const searchedItem = document.createElement("div");
    searchedItem.classList.add("searched-results");
    const itemElement = `<div class="item-intro">`;
    const name = `<p>${item.name}</p>`;
    const price = `<p>$${item.price}</p>`;
    const imageItemDiv = `<div class="image-quantity">`;
    const img = `<img class="image-found" src=${item.thumbnail} alt="${item.name}">`;
    const quantity = createAddRemoveItem(item);
    searchedItem.innerHTML = itemElement + name + price + `</div>` + imageItemDiv + img + quantity + `</div>`;
    searchResult?.appendChild(searchedItem);
}

/**
 * In case searched/scanned item is not found
 */
export function createNotFoundItem(){
    const searchResult = document.getElementById("searchResultsDiv");
    const searchedItem = document.createElement("div");
    searchedItem?.classList.add("error-search");
    const displayText = document.createTextNode("No Item with the matching barcode number exists.");
    searchedItem?.appendChild(displayText);
    searchResult?.appendChild(searchedItem);
}

/**
 * Clear searched results
 */
export function clearSearchResults(){
    const searchResult = document.getElementById("searchResultsDiv");
    const searchField = document.getElementById("search");
    searchField?.focus();
    removeAllChilds(searchResult);
}

/**
 * Show/Open the dialog
 */
function showDialog(){
    const dialog = document.getElementById("dialog");
    const shade = document.getElementById("shade");
    dialog.style.display = 'block';
    shade.style.opacity = 0.9;
    shade.style.display = 'block';
}

/**
 * Close/Hide the dialog
 */
export function hideDialog(){
    const dialogContent = document.getElementById("dialogContent");
    removeAllChilds(dialogContent);
    //If scanner is running, stop it.
    if(html5QrcodeScanner){
        html5QrcodeScanner.clear();
    }
    const dialog = document.getElementById("dialog");
    const shade = document.getElementById("shade");
    dialog.style.display = 'none';
    shade.style.opacity = 0;
    shade.style.display = 'none';
}

/**
 * Remove all childs of a parent.
 * 
 * @param {Object} element HTML object which needs all it's children cleared.
 */
function removeAllChilds(element){
    let child = element?.lastElementChild; 
    while (child) {
        element?.removeChild(child);
        child = element?.lastElementChild;
    }
}


