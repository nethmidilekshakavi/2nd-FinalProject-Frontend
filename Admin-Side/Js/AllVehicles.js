$(document).ready(function () {
    loadBuses();

    // Load all vehicles
    function loadBuses() {
        $.ajax({
            url: "http://localhost:8080/allVehicles",  // Ensure this matches backend
            type: "GET",
            success: function (data) {
                let tbody = $("#AllVehicleBody").empty();
                data.forEach(allVehicles => {
                    tbody.append(`
                        <tr>
                           <td>
                            ${allVehicles.vanId ? allVehicles.vanId : ''} 
                            ${allVehicles.busId ?  + allVehicles.busId : ''} 
                            ${allVehicles.carId ? + allVehicles.carId : ''}
                            </td>

                            <td>${allVehicles.registrationNumber}</td>
                            <td>${allVehicles.model}</td>
                            <td>${allVehicles.plateNumber}</td>
                            <td>${allVehicles.capacity}</td>
                            <td>${allVehicles.airConditioning}</td>
                            <td>${allVehicles.wifi}</td>
                            <td>
                                <span class="badge ${allVehicles.status === 'AVAILABLE' ? 'badge-success' :
                        allVehicles.status === 'NOT_AVAILABLE' ? 'badge-warning' :
                            allVehicles.status === 'UNDER_MAINTENANCE' ? 'badge-primary' :
                                'badge-danger'}">
                                    ${allVehicles.status}
                                </span>
                            </td>
                            <td>
                                <img src="data:image/jpeg;base64,${allVehicles.image}" 
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
