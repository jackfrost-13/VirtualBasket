/**
 * Adds the Item to the cart.
 * 
 * @param {Object} item Holds a single item which needs to be added to the cart.
 * @returns {Object} HTML element containing the item in the cart. 
 */
export function addCartItem(item){
    const cart = document.getElementById("cartItems");
    const itemElement = createCartItem(item);
    //Prepending as it should add the recently added items to the top
    cart.prepend(itemElement);
    return itemElement;
}

/**
 * Create individual cart Items that are added to the cart
 * 
 * @param {Object} item Holds a single item which needs to be added to the cart.
 * @returns {Object} HTML element containing the item in the cart. 
 */
function createCartItem(item){
    let quantity = item.quantity;
    let cost = Number((quantity * item.price).toFixed(2));
    const cartItemElement = document.createElement("li");
    cartItemElement.classList.add('list-cart-item');
    const img = `<img src=${item.thumbnail} alt="${item.name}">`;
    const itemName = `<p>${item.name}</p>`;
    const quantityElement = createAddRemoveItem(item);
    const price = `<p>$${cost}</p>`;
    cartItemElement.innerHTML = img + itemName + quantityElement + price;
    return cartItemElement;
}

/**
 * Creating section for displaying quantity, a + button to add more and a - button to reduce the number
 * Minus also changes to Delete when only 1 item remains.
 * Reusing this component everywhere in the app.
 * 
 * @param {Object} item Holds a single item which needs to be added to the cart.
 * @returns {Object} HTML element containing the +, quantity and - elements. 
 */
export function createAddRemoveItem(item){
    let quantityElement = `<div class="quantity">`;
    const add = `<button class="add-button"><img class="add-button-icon" src="./images/plus.png" alt="plus"></button>`;
    const quantity = `<p>${item.quantity}</p>`;
    const remove = `<button class="remove-button"><img class="remove-button-icon" src="./images/minus.png" alt="minus"></button>`;
    quantityElement = quantityElement + add + quantity + remove + `</div>`;
    return quantityElement;
}