const homeProductList = document.getElementById("home-list");
const storedProduct = localStorage.getItem('products');
const main = document.getElementById('main-content');
let originalContent = main.innerHTML;
function ShowSidebar(){
  const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
  sidebar.style.display = 'none'
}
const goBackToMain = () => {
   main.innerHTML = originalContent;
}
const showProductInDetails = (product) => {
  console.log("Clicked product:", product)
  main.innerHTML  = `<header> 
     <img height="24px" width="30px"src="data:image/png;base64,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" alt="Burundian Flag" class="flag-icon">
    <h1>Buramart</h1>
      <div class="search-bar">
        <input type="text" placeholder="Search Your products..." />
        <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg></button>
      </div>
      <nav>
        <ul class="sidebar">
         <li onclick=hideSidebar()><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(48, 48, 199)"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>
         <li><a href="settings.html">Settings</a></li>
         <li><a href="#categories">More Like This</a></li>
        
         <li><a href="seller.html"> Seller</a></li>
         <li class="account">
          <a href="#">Account</a>
          <ul class="account-dropdown">
            <li><a href="#">Login</a></li>
            <li><a href="#">Register</a></li>
            <li><a href="#">Switch User</a></li>
          </li>
          </ul>
        </li>
          
        </ul>
      </nav>
      <nav>
        <ul>
          <a class="home-icon" href="index.html"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg></a>
          <li><a href="index.html" class="hideOnMobile">Home</a></li>
         <li><a href="#categories"class="hideOnMobile">More Like This</a></li>
         <li><a href="seller.html"class="hideOnMobile"> Seller</a></li>
         <li><a href="settings.html"class="hideOnMobile"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></a></li>
         <li class="account">
          <a class="accounts-icon"href="index.html"><svg class="account-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" /></svg></a>
          <ul class="account-dropdown">
            <li><a href="#">Login</a></li>
            <li><a href="#">Register</a></li>
            <li><a href="#">Switch User</a></li>
          </li>
          </ul>
        </li>
         <li><a href="cart.html" ><svg xmlns="http://www.w3.org/2000/svg" class="cart-icon active" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg></a></li>
         
          <li class="menu-button" onclick=ShowSidebar()><a href="#"><svg class="menu-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>
          
        </ul>
      </nav>
      <script>
        function ShowSidebar(){
          const sidebar = document.querySelector('.sidebar')
          sidebar.style.display = 'flex'
        }
        function hideSidebar(){
            const sidebar = document.querySelector('.sidebar')
          sidebar.style.display = 'none'
        }
        </script>
    </header>
  
  <main>
    <div class="product-details-container">
      <div class="product-image">
        <img src="${product.image}" alt="Product 1">
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>Price: $${product.price}</strong></p>
      </div>
      <div class="contact-buttons1" >
        <a href="https://wa.me/25765381604" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>
        <a href="tel:+25768154810" class="btn-contact"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="20px" fill="white"viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></a>
       <a class="btn-contact" ><svg height="20" width="20" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></a>
       </div>
    </div>
    <section id="products" class="products">
      <h2>More Like This</h2>
      <div class="product-list">
    
       <!-- Product 5 -->
       <div class="product-card"  >
        <div >
          <h3 style="padding: 0; margin: 0; gap: 0;">Product Name 1</h3>
          <img src="icons&images/sofa-img.jpg" alt="Product 1" > 
        </div> 
      <div class="product-details">
        <p class="price">$100</p>
        <div class="product-details">
          <p class="description">This is a great product that you’ll love!</p>
          </div>
        </div> 
      </div>
       
    </section>
  `;
}
if (storedProduct) {
  // Convert JSON string back to array
  const products = JSON.parse(storedProduct);  // Fixed the variable name

  homeProductList.innerHTML = '';

  products.forEach((product) => {  // Now iterating over the correct variable
    homeProductList.innerHTML += `
      <div onclick = showProductInDetails(${JSON.stringify(product).replace(/'/g, "&apos;")}) class="product-card">
        <div>
          <h3 style="padding: 0; margin: 0; gap: 0;">${product.name}</h3>
          <img  src="${product.image}" alt="${product.name}"> 
        </div> 
        <div class="product-details">
          <p class="price">$${product.price}</p>
          <div class="product-details">
            <a ><p class="description">${product.description  || ''}</p></a>
          </div>
        </div>
      </div>`;
  });
} else {
  alert('No product data found in Local Storage.');
} 
