let PaymentUser = "";

function loadUserIDD() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error("JWT token not found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/user/getuserId",
        type: "GET",
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (data) {
            if (data && typeof data === 'object' && 'userId' in data) {
                PaymentUser = data.userId;
            } else {
                console.error("Invalid user ID:", data);
                PaymentUser = 0;
            }

            const userIdInput = document.getElementById("PaymentUserId");
            if (userIdInput) {
                userIdInput.value = PaymentUser;
            } else {
                console.error("User ID input field not found");
            }
        },
        error: function () {
            console.error("Error loading user ID");
            PaymentUser = 0;
        }
    });
}

document.addEventListener("DOMContentLoaded", loadUserIDD);

document.addEventListener("DOMContentLoaded", function () {
    const bookingJson = sessionStorage.getItem("selectedBooking");

    if (bookingJson) {
        const booking = JSON.parse(bookingJson);
        document.getElementById("paymentBookingId").value = booking.id || "";
        document.getElementById("amount").value = booking.price || "";
    } else {
        console.error("Booking data not found!");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const paymentForm = document.getElementById("paymentForm");

    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const booking = JSON.parse(sessionStorage.getItem("selectedBooking"));
        if (!booking) {
            console.error("No booking selected!");
            return;
        }

        const vehicleId = booking.id;
        const userId = PaymentUser;

        let paymentData = {
            user: { id: userId },
            amount: parseFloat(document.getElementById("amount").value),
            currency: document.getElementById("currency").value,
            paymentMethod: "CARD",
            cardName: document.getElementById("cardName").value,
            cardNumber: document.getElementById("cardNumber").value,
            expiryDate: document.getElementById("expiryDate").value,
            cvv: document.getElementById("cvv").value,
            busBooking: vehicleId.startsWith('B') ? { id: booking.id } : null,
            carBooking: vehicleId.startsWith('C') ? { id: booking.id } : null,
            vanBooking: vehicleId.startsWith('V') ? { id: booking.id } : null
        };

        document.getElementById("paymentSpinner").style.display = "inline-block";

        fetch("http://localhost:8080/api/payment/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData)
        })
            .then(res => res.ok ? res.json() : Promise.reject("Payment save failed"))
            .then(() => {
                document.getElementById("paymentSpinner").style.display = "none";
                Swal.fire({
                    title: 'Payment Completed!',
                    text: 'Your payment has been processed successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/receipt-page';
                });
            })
            .catch(err => {
                console.error("Error saving payment:", err);
                document.getElementById("paymentSpinner").style.display = "none";
                Swal.fire({
                    title: 'Payment Failed!',
                    text: 'There was an error processing your payment. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });
});
