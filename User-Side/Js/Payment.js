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
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            console.log("API Response:", data); // Debugging

            if (typeof data === 'object' && 'userId' in data) {
                PaymentUser = data.userId;  // Ensure correct property
            } else if (typeof data === 'string') {
                PaymentUser = parseInt(data, 10) || 0;
            } else {
                console.error("Invalid user ID data:", data);
                PaymentUser = 0;
            }

            const userIdInput = document.getElementById("PaymentUserId");
            if (userIdInput) {
                userIdInput.value = PaymentUser;
            } else {
                console.error("User ID input field not found");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading user ID:", error);
            PaymentUser = 0;

            const userIdInput = document.getElementById("PaymentUserId"); // Fixed ID
            if (userIdInput) {
                userIdInput.value = "0";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", loadUserIDD);

//Amount ekaBooking id ekai gatta
document.addEventListener("DOMContentLoaded", function () {
    const bookingJson = sessionStorage.getItem("selectedBooking");

    if (bookingJson) {
        const booking = JSON.parse(bookingJson);
        console.log("Loaded booking:", booking);

        document.getElementById("paymentBookingId").value = booking.id;
        document.getElementById("amount").value = booking.price;
    } else {
        console.error("No booking data found in sessionStorage!");
    }
});
