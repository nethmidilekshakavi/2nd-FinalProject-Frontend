$(document).ready(function () {
    loadUserDetails();
    loadBusBookingDetails();

    function loadUserDetails() {
        $.ajax({
            url: "http://localhost:8080/api/v1/user",
            type: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },
            success: function (data) {
                let tbody = $("#userTableBody").empty();
                data.forEach(user => {
                    tbody.append(`
                        <tr>
                            <td>${user.userId}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td style="text-align: center;">${user.email}</td>
                            <td>${user.address}</td>
                            <td>${user.phone}</td>
                            <td>
                                <label class="toggle-switch">
                                    <input type="checkbox" class="toggle-role" data-user-id="${user.userId}" ${user.role === 'ADMIN' ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <span id="role-${user.userId}" class="role-text">${user.role}</span>
                            </td>
                            <td>
                                <img src="data:image/jpeg;base64,${user.image}" 
                                     alt="User Image" class="crop-image" 
                                     style="width: 50px; cursor: pointer;">
                            </td>
                            <td>
                                <button class="btn btn-delete-user" data-user-id="${user.userId}" style="background: none; border: none;">
                                    <i class="fas fa-trash-alt" style="color: red; font-size: 20px;"></i>
                                </button>
                            </td>
                        </tr>
                    `);
                });

                $(".toggle-role").change(function () {
                    let userId = $(this).data("user-id");
                    let newRole = $(this).is(":checked") ? "ADMIN" : "USER";

                    updateUserRole(userId, newRole);
                });
            },
            error: function (xhr, status, error) {

            }
        });
    }



    function updateUserRole(userId, newRole) {
        $.ajax({
            url: `http://localhost:8080/api/v1/user/editRole/${userId}`,
            type: "PUT",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({editRole: newRole}),
            success: function (response) {
                alert("User role updated successfully!");
                $(`#role-${userId}`).text(newRole);
            },
            error: function (xhr, status, error) {
                alert("Error updating role: " + (xhr.responseText || error || status));
            }
        });
    }


    //delete cars
    $(document).on("click", ".btn-delete-user", function () {
        const userId = $(this).data("user-id");


        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `http://localhost:8080/api/v1/user/${userId}`,
                    type: "DELETE",
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'User deleted successfully',
                            confirmButtonText: 'OK'
                        });
                        loadUserDetails() //
                    },
                    error: function (xhr, status, error) {
                        const errorMessage = xhr.responseText || error || status;
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Error deleting user: ' + errorMessage,
                            confirmButtonText: 'OK'
                        });
                    }
                });
            }
        });
    });


})


