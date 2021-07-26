"use strict";
import { addCartItem } from "./cartView.js";
import { createDialog } from "./dialog.js";
import { searchItemByName } from "./utils.js";

export default class CartClass{
    constructor({divContainer}){
        this.itemsDiv = document.getElementById(divContainer);
    }

    init(){
      this.data = {
          addedItems : [],
          totalItems : []
        };
        this.totalCartValueDiv = document.getElementById("totalAmount");
        this.emptyBasketDiv = document.getElementById("emptyBasket");
        this.totalCartValue = 0;
        this.showEmptyBasketMessage();
        this.createData();
        this.addEventListeners();
    }

    addEventListeners(){
        //Using event delegation, as we do not need to set an event listener for every + or - button for every item.
        //Instead setting it on the entire cart list.
        document.getElementById("cartItems").addEventListener("click",this.AddorRemoveItemHandler.bind(this));
        document.getElementById("addItemButtons").addEventListener("click",this.addItemButtons.bind(this));
    }

    /**
     * This would be an async method to fetch the data from Jungsoo's market of their total inventory.
     * For this project I'm hardcoding the data provided in the sample.
     */
    createData(){
      const response = this.fetchResponse();
      //Creating Data model which holds all the inventory items.
      response.map((item) => {
          item.price = this.getPriceInteger(item.price);
          item.quantity = 0;
          this.data.totalItems.push(item);
      });
      this.totalCartValueDiv.innerHTML = (this.totalCartValue);
    }

    /**
     * Event listener to handle click on + or - button in cart item.
     */
    AddorRemoveItemHandler(event){
      if(!event.target.classList.contains("add-button-icon") && !event.target.classList.contains("remove-button-icon")){
        return;
      }
      const cartListItem = event.target.closest('li');
      const textsToUpdate = cartListItem?.querySelectorAll("p");
      event.target?.classList.contains("add-button-icon") ? this.increaseQuantity(textsToUpdate) : this.decreaseQuantity(cartListItem, textsToUpdate);
    }

    /**
     * Event listener for Adding Items, either by scan or by search
     * 
     */
    addItemButtons(event){
      if(!event.target?.classList.contains("scan-item-button") && !event.target?.classList.contains("search-item-button")){
        return;
      }
      event.target?.classList.contains("scan-item-button") ? createDialog("scan", this.data, this.addItemsToCart.bind(this)) : createDialog("search", this.data, this.addItemsToCart.bind(this));
    }

    /**
     * Increase quantity of a particular Item which is already on the cart.
     * 
     * @param {Array[]} textsToUpdate Array containing <p> elements.
     * 
     */
    increaseQuantity(textsToUpdate){
      // Getting 0th element: name of the Item.
      const nameOfItem = textsToUpdate[0].innerHTML;
      // Getting 1st element: quantity of the Item.
      let quantity = parseFloat(textsToUpdate[1].innerHTML) + 1;
      // Getting 2nd element: total cost of the Item (price*quantity).
      let cost = parseFloat(textsToUpdate[2].innerHTML);
      this.updateValuesOnCart(nameOfItem, textsToUpdate, quantity, cost, '+');
    }

    /**
     * Decrease quantity of a particular Item which is already on the cart or remove it completely. 
     * 
     * @param {Object} cartListItem <li> element of item in cart.
     * @param {Array[]} textsToUpdate Array containing <p> elements.
     * 
     */
    decreaseQuantity(cartListItem, textsToUpdate){
      const nameOfItem = textsToUpdate[0].innerHTML;
      let quantity = parseFloat(textsToUpdate[1].innerHTML) - 1;
      //Remove the item if it was the last quantity and update the cart value.
      if(quantity === 0){
        for(let i=0; i<this.data.addedItems.length; i++){
          let item = this.data.addedItems[i];
          if(item.name === nameOfItem){
            this.updateTotalCartCost(item.price, '-');
            this.data.addedItems.splice(i,1);
            break;
          }
        }
        cartListItem?.parentNode.removeChild(cartListItem);
        return;
      }
      let cost = parseFloat(textsToUpdate[2].innerHTML);
      this.updateValuesOnCart(nameOfItem, textsToUpdate, quantity, cost, '-');
    }

    /**
     *Update value of quantity, price of that item and total cart value.
     * 
     * @param {String} nameOfItem Name of the Item.
     * @param {Array[]} textsToUpdate Array containing <p> elements.
     * @param {Number} quantity Quantity of the Item.
     * @param {Number} cost Total cost of the Item (price*quantity).
     * @param {String} sign String value either '+' or '-'
     */
    updateValuesOnCart(nameOfItem, textsToUpdate, quantity, cost, sign){
      let costToBeUpdatedBy = 0;
      for(let i=0; i<this.data.addedItems.length; i++){
        let item = this.data.addedItems[i];
        if(item.name === nameOfItem){
          item.quantity = quantity;
          cost = Number((quantity * item.price).toFixed(2));
          costToBeUpdatedBy = item.price;
          break;
        }
      }
      //Update the Quantity.
      textsToUpdate[1].innerHTML = quantity;
      //Update the total Price of the item (quantity * price per item).
      textsToUpdate[2].innerHTML = "$" + cost;
      //Update Cost of Cart.
      this.updateTotalCartCost(costToBeUpdatedBy, sign);
    }

    /**
     * Change the cart quantity by the amount and whether it's a '+' or '-'.
     * 
     * @param {Number} amount The value by which the total cost needs to be changed.
     * @param {String} sign + or - based on increase or decrease in the Total value overall.
     */
    updateTotalCartCost(amount, sign){
      this.totalCartValue = sign === '+' ? (this.totalCartValue + amount) : (this.totalCartValue - amount);
      this.convertTotalCartValueToNumber();
      this.totalCartValueDiv.innerHTML =  "$" + this.totalCartValue;
      this.totalCartValue === 0 ? this.showEmptyBasketMessage() : this.hideEmptyBasketMessage();
    }

    convertTotalCartValueToNumber(){
      //Keeping it to 2 decimals and storing it as a number.
      this.totalCartValue = Number(this.totalCartValue.toFixed(2));
    }

    /**
     * Gets called with list of Items from the search or scan dialog.
     * 
     * @param {array[]} addItems Items to be added, removed or updated in the cart.
     */
    addItemsToCart(addItems){
      addItems?.map(itemToUpdate => {
        const item = searchItemByName(itemToUpdate.name, this.data.addedItems);
        //Item is present in the cart currently, check if needs deletion
        if(item){
          //Remove item if the quantity is 0 now.
          if(itemToUpdate.quantity === 0){
            const element = item.element;
            element?.parentNode.removeChild(element);
            for(let i=0; i<this.data.addedItems.length; i++){
              const addeditem = this.data.addedItems[i];
              if(addeditem.id === item.id){
                this.data.addedItems.splice(i,1);
                break;
              }
            }
          }
          //Update value of element
          else{
            const itemElement = item.element;
            const textsToUpdate = itemElement.querySelectorAll("p");
            item.quantity = itemToUpdate.quantity;
            let cost = Number((item.quantity * item.price).toFixed(2));
            textsToUpdate[1].innerHTML = item.quantity;
            textsToUpdate[2].innerHTML = "$" + cost;
          }
        }
        //Add Item if it is not in cart already
        else{
          //check if quantity of added item is more than 0.
          if(itemToUpdate.quantity > 0){
            const itemElement = addCartItem(itemToUpdate);
            itemToUpdate.element = itemElement;
            this.data.addedItems.push(itemToUpdate);
          }
        }
      });
      //Update Cart Value
      this.totalCartValue = 0;
      this.data.addedItems.map((item) => {
        this.totalCartValue = this.totalCartValue + Number((item.price * item.quantity).toFixed(2));
        this.convertTotalCartValueToNumber();
      });
      this.totalCartValueDiv.innerHTML = "$" + this.totalCartValue;
      this.totalCartValue === 0 ? this.showEmptyBasketMessage() : this.hideEmptyBasketMessage();
    }

    /**
     * Returns the Float value of the string which is passed along with $ attached to it.
     * 
     * @param {String} dollarPrice String value containing $.
     * @returns {Number} Conversion of the string to number without the $.
     */
    getPriceInteger(dollarPrice){
      const price = dollarPrice.slice(1);
      return parseFloat(price);
    }

    /**
     * Shows the Cart is empty message.
     */
    showEmptyBasketMessage(){
      this.emptyBasketDiv?.classList.toggle("empty-basket-hide", false);
    }

    /**
     * Hides the cart is empty message.
     */
    hideEmptyBasketMessage(){
      this.emptyBasketDiv?.classList.toggle("empty-basket-hide", true);
    }

    //Hard-coded response for the list of items available in the inventory.
    fetchResponse(){
      return [
        {
          "id": "0001",
          "qrUrl": "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=0001",
          "thumbnail": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/banana_1f34c.png",
          "name": "Banana",
          "price": "$1.00"
        },
        {
          "id": "0002",
          "qrUrl": "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=0002",
          "thumbnail": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/red-apple_1f34e.png",
          "name": "Apple",
          "price": "$4.00"
        },
        {
          "id": "0003",
          "qrUrl": "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=0003",
          "thumbnail": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/sparkles_2728.png",
          "name": "Other Stuff",
          "price": "$10.73"
        }
      ]
    }
}