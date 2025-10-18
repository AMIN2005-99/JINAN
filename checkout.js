document.addEventListener('DOMContentLoaded', () => {
    const checkoutProductsList = document.getElementById('checkout-products-list');
    const checkoutGrandTotal = document.getElementById('checkout-grand-total');
    const checkoutForm = document.getElementById('checkout-form');

    // عناصر الأخطاء
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const addressError = document.getElementById('address-error');

    // استيراد السلة من التخزين المحلي
    let cart = JSON.parse(localStorage.getItem('djinaneCart')) || [];

    // عرض ملخص الطلب
    function renderCheckoutSummary() {
        checkoutProductsList.innerHTML = '';
        let grandTotal = 0;

        if (cart.length === 0) {
            checkoutProductsList.innerHTML = '<p style="text-align:center;color:#666;">سلة التسوق فارغة. <a href="index.html">العودة للمنتجات</a>.</p>';
            checkoutForm.querySelector('.confirm-order-btn').disabled = true;
            return;
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            const listItem = `
                <li>
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${itemTotal.toFixed(2)} د.ج</span>
                </li>`;
            checkoutProductsList.insertAdjacentHTML('beforeend', listItem);
        });

        checkoutGrandTotal.textContent = `${grandTotal.toFixed(2)} د.ج`;
    }

    // عند إرسال النموذج
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // إعادة ضبط الأخطاء
        nameError.style.display = 'none';
        phoneError.style.display = 'none';
        addressError.style.display = 'none';

        const customerName = document.getElementById('customer-name').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const shippingAddress = document.getElementById('shipping-address').value.trim();

        let valid = true;
        if (customerName === '') {
            nameError.textContent = 'الاسم مطلوب.';
            nameError.style.display = 'block';
            valid = false;
        }
        if (phoneNumber === '' || !/^[0-9]{10,}$/.test(phoneNumber)) {
            phoneError.textContent = 'رقم هاتف صالح (10 أرقام على الأقل).';
            phoneError.style.display = 'block';
            valid = false;
        }
        if (shippingAddress === '') {
            addressError.textContent = 'العنوان مطلوب.';
            addressError.style.display = 'block';
            valid = false;
        }

        if (!valid) {
            alert('يرجى ملء الحقول المطلوبة.');
            return;
        }

        // إنشاء تفاصيل الطلب
        let orderDetails = '';
        let grandTotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            orderDetails += `${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} د.ج\n`;
        });

        // تكوين البيانات المرسلة
        const orderData = {
            name: customerName,
            phone: phoneNumber,
            address: shippingAddress,
            orderDetails: orderDetails,
            total: grandTotal.toFixed(2) + ' د.ج'
        };

        // 🔗 رابط Google Apps Script (الخاص بك)
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyhxG5oBHKQMJx0kQQiUpQwJx_uDIzWbJdYkfuFXJq0jJUd-tV7L9JalY5xKhYsN2Vx/exec';

        // إرسال الطلب إلى Google Sheets
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(() => {
            alert('✅ تم إرسال طلبك بنجاح!');
            localStorage.removeItem('djinaneCart');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('❌ خطأ أثناء الإرسال:', error);
            alert('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
        });
    });

    renderCheckoutSummary();
});
