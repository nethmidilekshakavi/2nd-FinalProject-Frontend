let UserId = 0
let userName = "";

function loadUserID() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user/getuserId",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            console.log("API Response:", data); // Debugging

            // Handle both JSON and string responses
            if (typeof data === 'object' && 'userId' in data) {
                UserId = data.userId;
            } else if (typeof data === 'string') {
                UserId = parseInt(data, 10) || 0;
            } else {
                console.error("Invalid user ID data:", data);
                UserId = 0;
            }

            // Set value in the input field
            const userIdInput = document.getElementById("userId");
            if (userIdInput) {
                userIdInput.value = UserId;
            } else {
                console.error("User ID input field not found");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading user ID:", error);
            UserId = 0;

            const userIdInput = document.getElementById("userId");
            if (userIdInput) {
                userIdInput.value = "0";
            }
        }
    });
}

function loadUserName() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user/getUsername",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function(data) {
            console.log("API name Response:", data); // Debugging

            // Check if data is an object with a "username" property or a string
            if (typeof data === 'object' && 'username' in data) {
                userName = data.username;
                console.log(userName)
            } else if (typeof data === 'string') {
                userName = data;
            } else {
                console.error("Invalid user name data:", data);
            }

            // Set the username in the UI
            const userNameElement = document.querySelector(".user-name");
            if (userNameElement) {
                userNameElement.textContent = "Welcome  "+userName;
            } else {
                console.error("User name element not found");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading user name:", error);
            const userNameElement = document.querySelector(".user-name");
            if (userNameElement) {
                userNameElement.textContent = "Guest";
            }
        }
    });
}

loadBusBookingDetails()

document.addEventListener("DOMContentLoaded", function () {
    loadUserID();
    loadUserName()

});


document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const busId = urlParams.get('busId');
    const busModel = urlParams.get('busModel');


    if (busId) {
        document.getElementById("busId").value = busId;
    } else {
        console.error("Bus ID not found in URL");
    }

    if (busModel) {
        document.getElementById("busModel").value = busModel;
    }

});


$("#bookingForm").submit(function(event) {
    event.preventDefault();

    // Get form data and create a JSON object
    const formData = {
        "user": $("#userId").val(),
        "bus": $("#busId").val(),
        "name": $("#fullName").val(),
        "email": $("#email").val(),
        "phone": $("#mobile").val(),
        "model": $("#busModel").val(),
        "pickupDate": $("#pickupDate").val(),
        "returnDate": $("#returnDate").val(),
        "pickupLocation": $("#pickupLocation").val(),
        "returnLocation": $("#dropLocation").val(),
        "additionalInfo": $("#additionalInfo").val(),
        "pickupTime":$("#pickupTime").val(),
        "returnTime":$("#returnTime").val()
    };

    // Send the form data to the backend using $.ajax
    $.ajax({
        url: 'http://localhost:8080/api/b1/busBooking/save',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json' // Set content type as JSON
        },
        data: JSON.stringify(formData), // Convert the form data object to JSON string
        success: function(response)
        {

            console.log(response)
            Swal.fire({
                icon: 'success',
                title: 'Booking Successful!',
                text: 'Your booking has been completed.',
                confirmButtonText: 'OK'
            });
            // Optionally clear the form or perform other actions
            $("#bookingForm")[0].reset();
        },
        error: function(xhr, status, error) {
            const errorMessage = xhr.responseText || error || status;
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'There was an issue with the booking. ' + errorMessage,
                confirmButtonText: 'OK'
            });
        }
    });
});


function loadBusBookingDetails() {
    $.ajax({
        url: "http://localhost:8080/api/b1/busBooking",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            let tbody = $("#busBookingView").empty();

            // Function to get badge class based on status
            function getBadgeClass(status) {
                const badgeClasses = {
                    "CONFIRMED": "status-confirmed",  // Green
                    "CANCELLED": "status-cancelled",  // Red
                    "PENDING": "status-pending"       // Yellow
                };
                return badgeClasses[status.toUpperCase()] || "status-unknown";  // Handle case sensitivity
            }

            data.forEach(bus => {
                tbody.append(`
                    <tr>
                        <td>${bus.id}</td>
                        <td>${bus.name}</td>
                        <td>${bus.model}</td>
                        <td>${bus.pickupDate}</td>
                        <td style="text-align: center;">${bus.pickupTime}</td>
                        <td style="text-align: center;">${bus.pickupLocation}</td>
                        <td style="text-align: center;">${bus.returnLocation}</td>
                        
                        <!-- Status with dynamic badge class -->
                        <td id="status-${bus.id}" class="status-badge ${getBadgeClass(bus.status)}" style="text-align: center;">
                            ${bus.status}
                        </td>

                        <td style="text-align: center;">
                            <button class="btn btn-cancel-busBooking" data-bus-id="${bus.id}" data-user-email="${bus.email}">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button class="btn btn-confirm-busBooking" data-bus-id="${bus.id}" data-user-email="${bus.email}">
                                <i class="fas fa-check"></i> Confirm
                            </button>
                        </td>
                    </tr>
                `);
            });

            // Add event listeners for Confirm button
            $(".btn-confirm-busBooking").off("click").on("click", function () {
                let busId = $(this).data("bus-id");
                let userEmail = $(this).data("user-email");
                confirmBooking(busId, userEmail, $(this));
            });

            // Add event listeners for Cancel button
            $(".btn-cancel-busBooking").off("click").on("click", function () {
                let busId = $(this).data("bus-id");
                let userEmail = $(this).data("user-email");
                cancelBooking(busId, userEmail, $(this));
            });
        },
        error: function (xhr, status, error) {
            alert("Error loading Bus Bookings: " + (xhr.responseText || error || status));
        }
    });
}

function confirmBooking(busId, userEmail, button) {
    $.ajax({
        url: `http://localhost:8080/api/b1/busBooking/confirm/${busId}`,
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({email: userEmail}),
        success: function () {
            alert("Booking confirmed successfully!");
            sendConfirmationEmail(userEmail);

            // Disable button and update text
            button.prop("disabled", true).text("Confirmed")
                .removeClass("btn-confirm-busBooking btn-warning")
                .addClass("btn-success");

            // Update status in table
            $(`#status-${busId}`).text("CONFIRMED")
                .removeClass("status-pending status-cancelled")
                .addClass("status-confirmed");
        },
        error: function (xhr, status, error) {
            alert("Error confirming booking: " + (xhr.responseText || error || status));
        }
    });
}

function cancelBooking(busId, userEmail, button) {
    $.ajax({
        url: `http://localhost:8080/api/b1/busBooking/cancel/${busId}`,
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({email: userEmail}),
        success: function () {
            alert("Booking cancelled successfully!");

            // Disable button and update text
            button.prop("disabled", true).text("Cancelled")
                .removeClass("btn-cancel-busBooking btn-warning")
                .addClass("btn-danger");

            // Update status in table
            $(`#status-${busId}`).text("CANCELLED")
                .removeClass("status-confirmed status-pending")
                .addClass("status-cancelled");
        },
        error: function (xhr, status, error) {
            alert("Error cancelling booking: " + (xhr.responseText || error || status));
        }
    });
}

// Function to send confirmation email
function sendConfirmationEmail(userEmail) {
    $.ajax({
        url: "http://localhost:8080/api/b1/email/sendConfirmation",
        type: "POST",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        data: JSON.stringify({email: userEmail}),
        success: function () {
            alert("Confirmation email sent successfully to " + userEmail);
        },
        error: function (xhr, status, error) {
            alert("Error sending email: " + (xhr.responseText || error || status));
        }
    });
}