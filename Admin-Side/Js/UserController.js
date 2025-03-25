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
                        <tr  style="text-align: center;">
                            <td  style="text-align: center;">${user.userId}</td>
                            <td  style="text-align: center;">${user.firstName}</td>
                            <td  style="text-align: center;">${user.lastName}</td>
<td  style="text-align: center;">${user.email}</td>
                            <td  style="text-align: center;">${user.address}</td>
                            <td style="text-align: center;">${user.phone}</td>
                           
                                                        <td>
  <span id="role">${user.role}</span>
  <button class="edit-btn" onclick="openModal()"><i class="fas fa-edit"></i></button>
</td>
                   
                            
                            <td>
                                <img src="data:image/jpeg;base64,${user.image}" 
                                     alt="User Image" class="crop-image" 
                                     style="width: 50px; cursor: pointer;">
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



document.getElementById("EditeRole").addEventListener("click", function () {
    saveRole();
});

function openModal(userId, currentRole) {
    document.getElementById("roleModal").setAttribute("data-user-id", userId);
    document.getElementById("roleInput").value = currentRole;
    document.getElementById("roleModal").style.display = "block";
}

/*function closeModal() {
    document.getElementById("roleModal").style.display = "none";
}*/

function saveRole() {
    const roleInput = document.getElementById("roleInput").value;
    const userId = document.getElementById("roleModal").getAttribute("data-user-id");

    fetch(`/editRole/${userId}`, {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        body: JSON.stringify({ editRole: roleInput })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            closeModal();
            location.reload();
        })
        .catch(error => console.error("Error:", error));
}







