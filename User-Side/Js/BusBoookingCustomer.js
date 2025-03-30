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
                userNameElement.textContent = userName;
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




