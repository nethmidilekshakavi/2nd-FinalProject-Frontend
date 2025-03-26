let UserId = 0;

function loadUserID() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user/userId",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            if (data && typeof data === 'object' && 'userId' in data) {
                UserId = data.userId;
                console.log("User ID loaded:", UserId);
            } else {
                console.error("Invalid user ID data:", data);
                UserId = 0;
            }

            const userIdInput = document.getElementById("userId");
            if (userIdInput) {
                userIdInput.value = UserId;
            } else {
                console.error("User ID input field not found");
            }

            loadBusesUser();
        },
        error: function(xhr, status, error) {
            console.error("Error loading user ID:", error);
            UserId = 0;

            const userIdInput = document.getElementById("userId");
            if (userIdInput) {
                userIdInput.value = "0";
            }
        }
    });
}

// Call the function when page loads
document.addEventListener("DOMContentLoaded", function () {
    loadUserID();
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
