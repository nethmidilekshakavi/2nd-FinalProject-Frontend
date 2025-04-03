
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


document.addEventListener("DOMContentLoaded", function () {
    loadUserID();
    loadUserName()

});

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');
    const carModel = urlParams.get('carModel');


    if (carId) {
        document.getElementById("carId").value = carId;
    } else {
        console.error("Car ID not found in URL");
    }

    if (carModel) {
        document.getElementById("carModel").value = carModel;
    }

});

$("#bookingFormCar").submit(function(event) {
    event.preventDefault();


    const formData = {
        "user": $("#userId").val(),
        "car": $("#carId").val(),
        "name": $("#fullName").val(),
        "email": $("#email").val(),
        "phone": $("#mobile").val(),
        "model": $("#carModel").val(),
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
        url: 'http://localhost:8080/api/c1/carBooking/save',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
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
            $("#bookingFormCar")[0].reset();
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

loadCarBookingDetails()

function loadCarBookingDetails() {
    $.ajax({
        url: "http://localhost:8080/api/c1/carBooking",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            let tbody = $("#carBookingView").empty();

            // Function to get badge class based on status
            function getBadgeClass(status) {
                const badgeClasses = {
                    "CONFIRMED": "status-confirmed",  // Green
                    "CANCELLED": "status-cancelled",  // Red
                    "PENDING": "status-pending"       // Yellow
                };
                return badgeClasses[status.toUpperCase()] || "status-unknown";  // Handle case sensitivity
            }

            data.forEach(car => {  // Change 'van' to 'car'
                tbody.append(`
        <tr>
            <td>${car.id}</td>
            <td>${car.name}</td>
            <td>${car.model}</td>
            <td>${car.pickupDate}</td>
            <td style="text-align: center;">${car.pickupTime}</td>
            <td style="text-align: center;">${car.pickupLocation}</td>
            <td style="text-align: center;">${car.returnLocation}</td>
            
            <!-- Status with dynamic badge class -->
            <td id="status-${car.carId}" class="status-badge ${getBadgeClass(car.status)}" style="text-align: center;">
                ${car.status}
            </td>

            <td style="text-align: center;">
               
<button class="btn btn-confirm-carBooking" data-car-id="${car.id}" data-user-email="${car.email}">
    <i class="fas fa-check"></i> Confirm
</button>
<button class="btn btn-cancel-carBooking" data-car-id="${car.id}" data-user-email="${car.email}">
    <i class="fas fa-times"></i> Cancel
</button>


            </td>
        </tr>
    `);
            });


            // Add event listeners for Confirm button
            $(".btn-confirm-carBooking").off("click").on("click", function () {
                let carId = $(this).data("car-id");
                let userEmail = $(this).data("user-email");
                confirmBookingCar(carId, userEmail, $(this));
            });

            // Add event listeners for Cancel button
            $(".btn-cancel-carBooking").off("click").on("click", function () {
                let carId = $(this).data("car-id");
                let userEmail = $(this).data("user-email");
                cancelBookingCar(carId, userEmail, $(this));
            });
        },
        error: function (xhr, status, error) {

        }
    });
}

function confirmBookingCar(carId, userEmail, button) {
    $.ajax({
        url: `http://localhost:8080/api/c1/carBooking/confirm/car/${carId}`,
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({email: userEmail}),
        success: function () {
            alert("Booking confirmed successfully!");
            sendConfirmationEmailCar(userEmail);

            // Disable button and update text
            button.prop("disabled", true).text("Confirmed")
                .removeClass("btn-confirm-carBooking btn-warning")
                .addClass("btn-success");

            // Update status in table
            $(`#status-${carId}`).text("CONFIRMED")
                .removeClass("status-pending status-cancelled")
                .addClass("status-confirmed");
        },
        error: function (xhr, status, error) {
            alert("Error confirming booking: " + (xhr.responseText || error || status));
        }
    });
}

$(document).ready(function () {
    // Attach click event listener to the Cancel button
    $(".btn-cancel-carBooking").click(function () {
        var carId = $(this).data("car-id");
        var userEmail = $(this).data("user-email");
        var button = $(this);

        // Call the cancelBookingCar function
        cancelBookingCar(carId, userEmail, button);
    });
});

function cancelBookingCar(carId, userEmail, button) {
    $.ajax({
        url: `http://localhost:8080/api/c1/carBooking/cancel/car/${carId}?userEmail=${encodeURIComponent(userEmail)}`,
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        },
        success: function () {
            alert("Booking cancelled successfully!");

            // Disable the button and update the text
            button.prop("disabled", true).text("Cancelled")
                .removeClass("btn-cancel-carBooking btn-warning")
                .addClass("btn-danger");

            // Update status in the table
            $(`#status-${carId}`).text("CANCELLED")
                .removeClass("status-confirmed status-pending")
                .addClass("status-cancelled");
        },
        error: function (xhr, status, error) {
            alert("Error cancelling booking: " + (xhr.responseText || error || status));
        }
    });
}



// Function to send confirmation email
function sendConfirmationEmailCar(userEmail) {
    $.ajax({
        url: "http://localhost:8080/api/c1/carBooking/sendConfirmation/car",
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
