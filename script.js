// script.js

// Select elements
const productform = document.getElementById('productForm');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const productList = document.getElementById('productList');

// store uploaded products
let products = [];

// Show image preview
productImage.addEventListener('change', () => {
    const file = productImage.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function() {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Product Image Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Validate and submit form
productform.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = productName.ariaValueMax.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value.trim());

    if(name ==="" || description === "" || isNaN(price) || price <= 0) {
        message.textContent = "Please fill out all fields correctly.";
        message.style.color = "red";
        return;
    }

    
})