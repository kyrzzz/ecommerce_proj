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

    const name = productName.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value.trim());

    if(name ==="" || description === "" || isNaN(price) || price <= 0) {
        message.textContent = "Please fill out all fields correctly.";
        message.style.color = "red";
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        description,
        price,
        image: imagePreview.querySelector('img').src
    };

    products.push(newProduct);
    displayProducts();
    clearForm();
    message.textContent = "Product uploaded successfully!";
    message.style.color = "green";
});

// Display products
function displayProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class = "product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </div>
            `;
            productList.appendChild(productItem);
    });
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if(product) {
        productName.value = product.name;
        productDescription.value = product.description;
        productPrice.value = product.price;
        const previewImage = document.querySelector('.image-preview img');
        previewImage ? previewImage.src = product.image : null;
        productImage.files = new DataTransfer().files;
        message.textContent = "Edit the product and resubmit.";
        message.style.color = "blue";
        products = products.filter(p => p.id !== id); // Remove the product temporarily for re-upload
        displayProducts();
    }
}

// Delete product
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    displayProducts();
}

// Clear the form after submission
function clearForm() {
    productName.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productImage.value = "";
    imagePreview.style.display = 'none';
}


document.getElementById('sortNameBtn').addEventListener('click', () => {
    products.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts();
});

document.getElementById('sortPriceBtn').addEventListener('click', () => {
    products.sort((a, b) => a.price - b.price);
    displayProducts();
});

// File validation for image uploads (check file type and size)
productImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const fileType = file ? file.type.split('/')[1] : '';
    const fileSize = file ? file.size / 1024 /1024 : 0; // MB

    if(file) {
        if(!['jpg','jpeg','png'].includes(fileType)){
            message.textContent = "Invalid file type! Please upload a JPG, JPEG, or PNG file.";
            message.style.color = "red";
            productImage.value = ''; // Reset file input
            return;
        }

        if(fileSize>5){ // Limit to 5MB
            message.textContent = "File size exceeds 5MB! Please upload a smaller file.";
            message.style.color = "red";
            productImage.value =''; // Reset file input
            return;
        }

        // Display image preview if file is valid
        const reader = new FileReader();
        reader.onload = function(){
            imagePreview.innerHTML = `<img src="${reader.result}" alt ="Product Image Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});