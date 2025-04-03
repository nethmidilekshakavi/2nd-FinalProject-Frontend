document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const paymentStatus = document.getElementById('payment-status');
    const paymentLoader = document.getElementById('payment-loader');

    // Format card number as user types (add spaces every 4 digits)
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';

        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        e.target.value = formattedValue;
    });

    // Format expiry date as MM/YY
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2);
        } else {
            e.target.value = value;
        }
    });

    // Form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loader
        paymentLoader.classList.remove('hidden');

        // Get form data
        const formData = {
            cardName: document.getElementById('cardName').value,
            cardNumber: document.getElementById('cardNumber').value.replace(/\s+/g, ''),
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
            amount: document.getElementById('amount').value,
            currency: document.getElementById('currency').value
        };

        // Basic validation
        if (!validateCardNumber(formData.cardNumber)) {
            showError('Invalid card number');
            return;
        }

        // Send payment request to backend
        fetch('/api/payment/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                paymentLoader.classList.add('hidden');

                if (data.status === 'SUCCESS') {
                    showSuccess('Payment successful! Transaction ID: ' + data.transactionId);
                    paymentForm.reset();
                } else {
                    showError(data.message || 'Payment failed. Please try again.');
                }
            })
            .catch(error => {
                paymentLoader.classList.add('hidden');
                showError('An error occurred. Please try again later.');
                console.error('Error:', error);
            });
    });

    // Helper functions
    function validateCardNumber(cardNumber) {
        // Basic Luhn algorithm for card validation
        if (!cardNumber || cardNumber.length < 13) return false;

        let sum = 0;
        let doubleUp = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));

            if (doubleUp) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            doubleUp = !doubleUp;
        }

        return sum % 10 === 0;
    }

    function showSuccess(message) {
        paymentStatus.textContent = message;
        paymentStatus.className = 'success';
        paymentStatus.classList.remove('hidden');

        setTimeout(() => {
            paymentStatus.classList.add('hidden');
        }, 5000);
    }

    function showError(message) {
        paymentStatus.textContent = message;
        paymentStatus.className = 'error';
        paymentStatus.classList.remove('hidden');
        paymentLoader.classList.add('hidden');
    }
});



document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const paymentData = {
        cardName: document.getElementById('cardName').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        amount: document.getElementById('amount').value,
        currency: document.getElementById('currency').value,
        paymentMethod: "CARD"
    };

    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log('Payment saved:', result);
});
