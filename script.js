// ** وظائف عربة التسوق **
let cart = JSON.parse(localStorage.getItem('djinaneCart')) || [];

function saveCart() {
    localStorage.setItem('djinaneCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

function addToCart(product) {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} أضيف إلى السلة!`); // إشعار بسيط للمستخدم
}

// استدعاء هذه الدالة عند تحميل الصفحة للتأكد من عرض العدد الصحيح للسلة
updateCartCount();
document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    // **** هام: استبدل هذا الرابط برابط Google Sheet الذي قمت بنشره (الذي ينتهي بـ ?output=csv) ****
    const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbydvlddTWTeOD9uSV5WbLzoleW0dym8GU7nADiQN_CPQDDQV_jIGooik3ZCPaRITzSB3g/exec'; 

    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }

    // دالة لجلب البيانات من Google Sheet وتحويلها إلى كائنات منتجات
function fetchAndRenderProducts() {
    fetch(googleSheetUrl)
        .then(response => response.json())
        .then(products => {
            renderProducts(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productsContainer.innerHTML = '<p style="color:red; text-align:center;">فشل تحميل المنتجات.</p>';
        });
}

    // دالة لتحويل نص CSV إلى مصفوفة من كائنات JavaScript
    function parseCsv(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue; // تجاهل الأسطر الفارغة
            const values = lines[i].split(',').map(value => value.trim());
            if (values.length !== headers.length) {
                console.warn('Skipping malformed row:', lines[i]);
                continue;
            }
            const product = {};
            for (let j = 0; j < headers.length; j++) {
                product[headers[j]] = values[j];
            }
            products.push(product);
        }
        return products;
    }

    // دالة لعرض المنتجات على الصفحة
    function renderProducts(products) {
        productsContainer.innerHTML = ''; // مسح أي محتوى سابق
        if (products.length === 0) {
            productsContainer.innerHTML = '<p style="text-align: center; color: #666;">لا توجد منتجات لعرضها حاليًا.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-body">
                        <span class="product-category">${product.category}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <span class="product-price">${parseFloat(product.price).toFixed(2)} د.ج</span>
                        <a href="#" class="add-to-cart-btn" 
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-price="${product.price}"
                            data-product-image="${product.image}"
                        >أضف إلى السلة</a>
                    </div>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productCard);
        });
    }

    // استدعاء دالة جلب وعرض المنتجات عند تحميل الصفحة
    fetchAndRenderProducts();
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        const product = {
            id: e.target.dataset.productId,
            name: e.target.dataset.productName,
            price: parseFloat(e.target.dataset.productPrice),
            image: e.target.dataset.productImage
        };
        addToCart(product);
    }
});
