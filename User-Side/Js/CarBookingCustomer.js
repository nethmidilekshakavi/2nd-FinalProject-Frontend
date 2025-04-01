
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

            data.forEach(van => {
                tbody.append(`
                    <tr>
                        <td>${van.id}</td>
                        <td>${van.name}</td>
                        <td>${van.model}</td>
                        <td>${van.pickupDate}</td>
                        <td style="text-align: center;">${van.pickupTime}</td>
                        <td style="text-align: center;">${van.pickupLocation}</td>
                        <td style="text-align: center;">${van.returnLocation}</td>
                        
                        <!-- Status with dynamic badge class -->
                        <td id="status-${van.id}" class="status-badge ${getBadgeClass(van.status)}" style="text-align: center;">
                            ${van.status}
                        </td>

                        <td style="text-align: center;">
                            <button class="btn btn-cancel-vanBooking" data-van-id="${van.id}" data-user-email="${van.email}">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button class="btn btn-confirm-vanBooking" data-van-id="${van.id}" data-user-email="${van.email}">
                                <i class="fas fa-check"></i> Confirm
                            </button>
                        </td>
                    </tr>
                `);
            });

            // Add event listeners for Confirm button
            $(".btn-confirm-vanBooking").off("click").on("click", function () {
                let vanId = $(this).data("van-id");
                let userEmail = $(this).data("user-email");
                confirmBooking(vanId, userEmail, $(this));
            });

            // Add event listeners for Cancel button
            $(".btn-cancel-vanBooking").off("click").on("click", function () {
                let vanId = $(this).data("van-id");
                let userEmail = $(this).data("user-email");
                cancelBooking(vanId, userEmail, $(this));
            });
        },
        error: function (xhr, status, error) {
            alert("Error loading van Bookings: " + (xhr.responseText || error || status));
        }
    });
}
