
$(document).ready(function () {
    loadUserDetails();

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
                                <button class="btn btn-delete" data-user-id="${user.userId}" style="background: none; border: none;">
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
                alert("Error loading Users: " + (xhr.responseText || error || status));
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
            data: JSON.stringify({ editRole: newRole }),
            success: function (response) {
                alert("User role updated successfully!");
                $(`#role-${userId}`).text(newRole);
            },
            error: function (xhr, status, error) {
                alert("Error updating role: " + (xhr.responseText || error || status));
            }
        });
    }
});
