
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
    const busId = urlParams.get('vanId');
    const vanModel = urlParams.get('vanModel');


    if (busId) {
        document.getElementById("vanId").value = busId;
    } else {
        console.error("Van ID not found in URL");
    }

    if (vanModel) {
        document.getElementById("vanModel").value = vanModel;
    }

});

$("#bookingFormVan").submit(function(event) {
    event.preventDefault();


    const formData = {
        "user": $("#userId").val(),
        "van": $("#vanId").val(),
        "name": $("#fullName").val(),
        "email": $("#email").val(),
        "phone": $("#mobile").val(),
        "model": $("#vanModel").val(),
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
        url: 'http://localhost:8080/api/v1/vanBooking/save',
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
            $("#bookingFormVan")[0].reset();
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

loadVanBookingDetails()

function loadVanBookingDetails() {
    $.ajax({
        url: "http://localhost:8080/api/v1/vanBooking",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            let tbody = $("#vanBookingView").empty();

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
                confirmBookingVan(vanId, userEmail, $(this));
            });

            // Add event listeners for Cancel button
            $(".btn-cancel-vanBooking").off("click").on("click", function () {
                let vanId = $(this).data("van-id");
                let userEmail = $(this).data("user-email");
                cancelBookingVan(vanId, userEmail, $(this));
            });
        },
        error: function (xhr, status, error) {

        }
    });
}


function confirmBookingVan(vanId, userEmail, button) {
    $.ajax({
        url: `http://localhost:8080/api/v1/vanBooking/confirm/van/${vanId}`,
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({email: userEmail}),
        success: function () {
            alert("Booking confirmed successfully!");
            sendConfirmationEmailVan(userEmail);

            // Disable button and update text
            button.prop("disabled", true).text("Confirmed")
                .removeClass("btn-confirm-vanBooking btn-warning")
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
    $(".btn-cancel-vanBooking").click(function () {
        var vanId = $(this).data("van-id");
        var userEmail = $(this).data("user-email");
        var button = $(this);

        // Call the cancelBookingCar function
        cancelBookingVan(vanId, userEmail, button);
    });
});

function cancelBookingVan(userId, userEmail, button) {
    $.ajax({
        url: `http://localhost:8080/api/v1/vanBooking/cancel${userId}?userEmail=${encodeURIComponent(userEmail)}`,
        type: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        },
        success: function () {
            alert("Booking cancelled successfully!");

            // Disable the button and update the text
            button.prop("disabled", true).text("Cancelled")
                .removeClass("btn-cancel-vanBooking btn-warning")
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

function sendConfirmationEmailVan(userEmail) {
    $.ajax({
        url: "http://localhost:8080/api/v1/vanBooking/sendConfirmation/van",
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


function calculateDistanceAndPriceVan(pickupLocation, dropLocation) {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [pickupLocation],
            destinations: [dropLocation],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        },
        function (response, status) {
            if (status === 'OK') {
                const distanceText = response.rows[0].elements[0].distance.text;
                const distanceValue = response.rows[0].elements[0].distance.value; // in meters
                const distanceInKm = distanceValue / 1000;

                const price = Math.round(distanceInKm * 100); // 1km = 100LKR
                document.getElementById("price").value = price + "";
            } else {
                console.error('Error fetching distance matrix:', status);
                document.getElementById("price").value = "Distance error";
            }
        }
    );
}
pickupAutocomplete.addListener("place_changed", function () {
    const place = pickupAutocomplete.getPlace();
    if (!place.geometry) {
        alert("No details available for input: '" + place.name + "'");
        return;
    }

    pickupLocationLatLng = place.geometry.location;
    pickupMarker.setPosition(pickupLocationLatLng);
    map.setCenter(pickupLocationLatLng);
    map.setZoom(12);

    const infoWindow = new google.maps.InfoWindow({
        content: `<strong>Pickup Location:</strong> ${place.formatted_address}`
    });
    infoWindow.open(map, pickupMarker);
});
dropAutocomplete.addListener("place_changed", function () {
    const place = dropAutocomplete.getPlace();
    if (!place.geometry) {
        alert("No details available for input: '" + place.name + "'");
        return;
    }

    dropLocationLatLng = place.geometry.location;
    dropMarker.setPosition(dropLocationLatLng);
    map.setCenter(dropLocationLatLng);
    map.setZoom(12);

    const infoWindow = new google.maps.InfoWindow({
        content: `<strong>Drop-off Location:</strong> ${place.formatted_address}`
    });
    infoWindow.open(map, dropMarker);

    // Distance calculation and price set
    if (pickupLocationLatLng && dropLocationLatLng) {
        calculateDistanceAndPriceVan(pickupLocationLatLng, dropLocationLatLng);
    }
});
