
let PaymentUser = "";
let Amount = 0;
let BookingIdd = 0;

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
    // Retrieve selected booking details from sessionStorage
    const bookingJson = sessionStorage.getItem("selectedBooking");

    console.log(bookingJson); // Check if booking data is available in sessionStorage.
    if (bookingJson) {
        const booking = JSON.parse(bookingJson);
        document.getElementById("paymentBookingId").value = booking.id || "";
        document.getElementById("amount").value = booking.price || "";
        Amount = booking.price
        BookingIdd = booking.id
    } else {
        console.error("Booking data not found!");
        alert("Booking data not found! Please try again.");
    }
});

const bookingId = sessionStorage.getItem("selectedBookingId");
const bookingJson = sessionStorage.getItem("selectedBooking");

if (bookingId && bookingJson) {
    const booking = JSON.parse(bookingJson);
    console.log("Booking ID:", bookingId);
    console.log("Booking Details:", booking);
} else {
    console.error("No booking data found!");
}

let bookingData = JSON.parse(sessionStorage.getItem('bookingData'));


$("#paymentForm").on("submit", function (e) {
    e.preventDefault();
    $("#payButton").prop("disabled", true);
    $("#paymentSpinner").show();

    const paymentData = {
        bookingId: BookingIdd,
        user: PaymentUser,
        paymentMethod: $("input[name='paymentMethod']:checked").val(),
        cardName: $("#cardName").val(),
        cardNumber: $("#cardNumber").val(),
        expiryDate: $("#expiryDate").val(),
        cvv: $("#cvv").val(),
        amount: Amount,
        currency: $("#currency").val()
    };

    $.ajax({
        url: "http://localhost:8080/api/payment/save",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paymentData),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (response) {
            console.error("hiiiii"+paymentData)
            Swal.fire("Payment Successful!", "Your transaction was completed.", "success");
            $("#paymentForm")[0].reset();
            $("#paymentSpinner").hide();
            $("#payButton").prop("disabled", false);

            // Optionally clear session data if payment is complete
            sessionStorage.removeItem("bookingId");
            sessionStorage.removeItem("bookingData");
        },
        error: function (xhr, status, error) {
            Swal.fire("Payment Failed", "Something went wrong. Try again.", "error");
            console.error("Error response:", xhr.responseText);
            $("#paymentSpinner").hide();
            $("#payButton").prop("disabled", false);
        }
    });
});


let paidBookingIds = [];

function fetchPaidBookingIds() {
    $.ajax({
        url: "http://localhost:8080/api/payment/paid-bookings",
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (response) {
            paidBookingIds = response;
            updatePaymentButton(); // After fetching paid bookings, check and update the button.
        },
        error: function () {
            console.error("Failed to fetch paid booking IDs.");
        }
    });
}

// This function will check if the current booking ID is in the paidBookingIds array
function updatePaymentButton(BookingIdd, paidBookingIds) {
    // Check if the booking is already paid
    if (paidBookingIds.includes(BookingIdd)) {
        // If booking is already paid, update the button accordingly
        $(`#payButton-${BookingIdd}`)
            .text("Payment ✓") // Change the button text
            .removeClass("btn-primary") // Remove the primary color class
            .addClass("btn-success") // Add the success color class
            .prop("disabled", true); // Disable the button

        // Optional: Update the view ticket button as well
        $(`#viewTicketBtn-${BookingIdd}`)
            .text("E-Ticket Ready") // Change the text of the view ticket button
            .removeClass("btn-outline") // Remove the outline class
            .addClass("btn-success"); // Add the success color class
    } else {
        // If not paid, keep the button as "Make Payment"
        $(`#payButton-${BookingIdd}`)
            .text("Make Payment") // Set the text to 'Make Payment'
            .removeClass("btn-success") // Remove the success color class
            .addClass("btn-primary") // Add the primary color class
            .prop("disabled", false); // Enable the button
    }
}


// Call the fetchPaidBookingIds function when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve selected booking details from sessionStorage
    const bookingJson = sessionStorage.getItem("selectedBooking");
    if (bookingJson) {
        const booking = JSON.parse(bookingJson);
        BookingIdd = booking.id;

        // After the page loads, check if the booking has been paid
        fetchPaidBookingIds();
    }
});

