let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
const smallsearchInput = document.getElementById('small-search-input')
const cartList = document.getElementById("list");
const searchInput = document.getElementById('search-input');


// Initial display of products on page load




function deleteProduct(index) {
    cartProducts.splice(index, 1); // Remove the product from the array
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts)); // Update local storage
    displayProducts(); // Re-render the product list
    
    cartProducts.length === 0 ? 
    setTimeout(() => {
        alert('Cart Cleared successfully!');
      }, 100) :
    setTimeout(() => {
      alert('Cart Product deleted successfully!');
    }, 100);  // Delay the alert slightly}
  }

function displayProducts() {
    cartList.innerHTML = ''; // Clear the current list before adding new products
    
    cartProducts.forEach((product, index) => {
      cartList.innerHTML += `
        <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <button class="remove-btn" onclick = deleteProduct(${index})>Remove</button>
      </div>`
      
    });
    
  }
displayProducts();
const searchProducts = () => {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
  const searchInputValue = searchInput.value || smallsearchInput.value;

  // Map products with their original index before filtering
  const foundProducts = cartProducts
    .map((product, index) => ({ product, originalIndex: index })) // Keep track of original index
    .filter(item => item.product.name.toLowerCase() === searchInputValue.toLowerCase()); // Case-insensitive search

  if (foundProducts.length === 0) {
    cartList.innerHTML = "You Have no Product under such name";
    return;
  }

  cartList.innerHTML = '';
  foundProducts.forEach(({ product, originalIndex }) => {  // Use originalIndex here
    cartList.innerHTML += `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <button class="remove-btn" onclick="deleteProduct(${originalIndex})">Remove</button>
      </div>`; 
  });
}
 