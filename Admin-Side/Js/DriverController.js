$(document).ready(function () {
   loadDrivers()

    // Load all vehicles
    function loadDrivers() {
        $.ajax({
            url: "http://localhost:8080/api/d1/drivers",  // Ensure this matches backend
            type: "GET",
            success: function (data) {
                let tbody = $("#DriversTableBody").empty();
                data.forEach(allDrivers => {
                    tbody.append(`
                        <tr>
                           <td>${allDrivers.id}</td>
                            <td>${allDrivers.name}</td>
                            <td>${allDrivers.licenseNumber}</td>
                            <td>${allDrivers.phoneNumber}</td>
                            <td>${allDrivers.licenseExpiry}</td>
                            <td>
                                <span class="badge ${allDrivers.vehicleType === 'CAR' ? 'badge-success' :
                        allDrivers.vehicleType === 'VAN' ? 'badge-warning' :
                            allDrivers.type === 'BUS' ? 'badge-primary' :
                                'badge-danger'}">
                                    ${allDrivers.vehicleType}
                                </span>
                            </td>
                            <td>${allDrivers.isAvailable}</td>
                            <td>
                                <img src="data:image/jpeg;base64,${allDrivers.image}" 
                                    alt="Vehicle Image" class="crop-image" 
                                    style="width: 70px; cursor: pointer;">
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading vehicles:", xhr.responseText || error || status);
                alert("Error loading vehicles!");
            }
        });
    }
});