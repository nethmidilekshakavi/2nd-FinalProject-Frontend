$(document).ready(function () {
    loadUserDetails();

    // Load user details
    function loadUserDetails() {
        $.ajax({
            url: "http://localhost:8080/api/v1/user",
            type: "GET",
            success: function (data) {
                let tbody = $("#userTableBody").empty();
                data.forEach(user => {
                    let isAdmin = user.isAdmin ? "✅" : "";
                    let isAdminColor = user.isAdmin ? "red" : "";

                    let isUser = user.user ? "✅" : "";
                    let isUserColor = user.user ? "red" : "";

                    tbody.append(`
                        <tr>
                            <td>${user.userId}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${user.address}</td>
                            <td>${user.phone}</td>
                            <td>${user.username}</td>
                            <td id="isAdminColumn" style="color: ${isAdminColor};">${isAdmin}</td>
                            <td id="isUserColumn" style="color: ${isUserColor};">${isUser}</td>
                            
                            <td>
                                <img src="data:image/jpeg;base64,${user.image}" 
                                     alt="User Image" class="crop-image" 
                                     style="width: 70px; cursor: pointer;">
                            </td>
                            <td>
                            <button class="btn btn-delete" data-bus-id="${user.busId}" style="background: none; border: none;">
    <i class="fas fa-trash-alt" style="color: red; font-size: 20px;"></i>
</button>

</td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                alert("Error loading Users: " + (xhr.responseText || error || status));
            }
        });
    }
});
