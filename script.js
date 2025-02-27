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

function displayProducts(filteredProducts = products) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <p>Rating: ${product.rating || "Not Rated"}</p> <!-- Display current rating -->
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="openDeleteModal(${product.id})">Delete</button>
                <div class="product-rating">
                    <label for="rating-${product.id}">Rate this product:</label>
                    <input type="number" id="rating-${product.id}" min="1" max="5" step="1" />
                    <button onclick="submitRating(${product.id})">Submit Rating</button>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });
}


// Cancel Delete
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('confirmationModal').style.display = 'none';
    productToDelete = null; // Reset the product to delete
});

// Confirm Delete
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (productToDelete !== null) {
        deleteProduct(productToDelete);
        document.getElementById('confirmationModal').style.display = 'none';
        productToDelete = null; // Reset the product to delete
    }
});


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

//delete confirmation logic
let productToDelete = null; //store the product to be deleted

//open the modal and confirm delete
function openDeleteModal(id) {
    productToDelete = id;
    document.getElementById('confirmationModal').style.display ='flex';
}

//close the modal
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('confirmationModal').style.display = 'none';
});

//confirm delete action
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    deleteProduct(productToDelete);
    document.getElementById('confirmationModal').style.display = 'none';
});

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    displayProducts();
}

function submitRating(productId) {
    const ratingInput = document.getElementById(`rating-${productId}`);
    const rating = parseInt(ratingInput.value);

    if (rating >= 1 && rating <= 5) {
        const product = products.find(p => p.id === productId);
        if (product) {
            product.rating = rating; // Update the product's rating
            displayProducts(); // Re-render the product list to show the updated rating
        }
    } else {
        alert("Invalid rating value. Please enter a rating between 1 and 5.");
    }
}


// Search functionality for product name or description
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayFilteredProducts(filteredProducts);
});

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
                <div class="product-rating">
                    <label for="rating">Rate this product:</label>
                    <input type="number" id="rating" min="1" max="5" step="1" />
                    <button onclick="submitRating(product.id)">Submit Rating</button>
                </div>
            </div>
        `;
        productList.appendChild(productItem);
    });
}
