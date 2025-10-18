document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary');
    const itemsTotalPriceElement = document.getElementById('items-total-price');
    const grandTotalPriceElement = document.getElementById('grand-total-price');
    
    // استيراد متغير السلة والدوال من script.js
    // (افتراضًا أن script.js يتم تحميله قبل cart.js في HTML)
    // أو يمكن إعادة تعريفها هنا إذا كنت تفضل فصل الكود تمامًا
    let cart = JSON.parse(localStorage.getItem('djinaneCart')) || [];

    function saveCart() {
        localStorage.setItem('djinaneCart', JSON.stringify(cart));
        // بما أن script.js مرتبط أيضا، فإنه سيحدث العداد في الهيدر
        // إذا لم يكن مرتبطا، سنحتاج لنداء updateCartCount() هنا
    }

    function renderCart() {
        cartItemsList.innerHTML = ''; // مسح المحتوى الحالي
        let itemsTotalPrice = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-message">سلة التسوق فارغة.</p>';
            cartSummary.style.display = 'none'; // إخفاء الملخص إذا كانت السلة فارغة
        } else {
            cart.forEach(item => {
                itemsTotalPrice += item.price * item.quantity;
                const cartItemDiv = `
                    <div class="cart-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>${item.price.toFixed(2)} د.ج</p>
                        </div>
                        <div class="cart-item-actions">
                            <button class="decrease-quantity-btn">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity-btn">+</button>
                            <button class="remove-item-btn">إزالة</button>
                        </div>
                    </div>
                `;
                cartItemsList.insertAdjacentHTML('beforeend', cartItemDiv);
            });
            cartSummary.style.display = 'block'; // إظهار الملخص
        }

        itemsTotalPriceElement.textContent = `${itemsTotalPrice.toFixed(2)} د.ج`;
        grandTotalPriceElement.textContent = `${itemsTotalPrice.toFixed(2)} د.ج`; // لا يوجد شحن حاليًا
        saveCart(); // تأكد من حفظ التغييرات وتحديث العداد في الهيدر (عبر script.js)
    }

    // معالجة تغيير الكمية وإزالة المنتجات
    cartItemsList.addEventListener('click', (event) => {
        const target = event.target;
        const cartItemDiv = target.closest('.cart-item');
        if (!cartItemDiv) return;

        const productId = cartItemDiv.dataset.productId;
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex === -1) return; // المنتج غير موجود

        if (target.classList.contains('increase-quantity-btn')) {
            cart[itemIndex].quantity += 1;
        } else if (target.classList.contains('decrease-quantity-btn')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            }
        } else if (target.classList.contains('remove-item-btn')) {
            cart.splice(itemIndex, 1); // إزالة المنتج بالكامل
        }
        renderCart(); // أعد عرض السلة بعد التعديل
    });

    // استدعاء عرض السلة عند تحميل الصفحة
    renderCart();
});