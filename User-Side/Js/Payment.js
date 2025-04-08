

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/payhere-payment', async (req, res) => {
    try {
        const paymentData = {
            merchant_id: "1229897",
            merchant_secret: "MjM5Mjk5NzMxMTI5NTA3MTk0MDI0MDMxODUwMjY3MTMxNDY2ODc5NQ==", // Keep this secret and safe!
            order_id: req.body.order_id,
            amount: req.body.amount,
            currency: req.body.currency
        };

        // Simulating secure processing (PayHere direct post is not recommended here)
        console.log("Received payment data:", paymentData);

        res.json({status: "received", data: paymentData});

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({message: "Payment processing failed"});
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


window.onload = function () {
    const bookingId = sessionStorage.getItem("selectedBookingId");
    if (bookingId) {
        console.log("Received Booking ID:", bookingId);

        fetch(`http://localhost:8080/bookings/${bookingId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Booking not found");
                }
                return response.json();
            })
            .then(data => {
                console.log("Booking Details:", data);
                document.getElementById("booking-details").innerHTML = `
                        <p><strong>Booking ID:</strong> ${data.id}</p>
                        <p><strong>Customer Name:</strong> ${data.customerName}</p>
                        <p><strong>Amount:</strong> $${data.amount}</p>
                        <!-- තවත් details display කරන්න -->
                    `;
            })
            .catch(error => {
                console.error("Error fetching booking:", error);
                alert("Error loading booking details.");
            });
    } else {
        alert("No booking ID found in session!");
        window.location.href = "bookings.html"; // fallback
    }
}

