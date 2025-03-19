/*
$(document).ready(function () {
    loadBuses();

    // Load all vehicles
    function loadBuses() {
        $.ajax({
            url: "http://localhost:8080/allVehicles",
            type: "GET",
            success: function (data) {
                let tbody = $("#AllVehicleBody").empty();
                data.forEach(vehicle => {
                    let vehicleId = "";

                    // Check if it's a bus, van, or car by checking the ID field
                    if (vehicle.busId) {
                        vehicleId = vehicle.busId;
                    } else if (vehicle.vanId) {
                        vehicleId = vehicle.vanId;  // Use vanId for vans
                    } else if (vehicle.carId) {
                        vehicleId = vehicle.carId;  // Use carId for cars
                    }

                    // Append the vehicle data to the table
                    tbody.append(`
                        <tr>
                            <td>${vehicleId}</td>
                            <td>${vehicle.registrationNumber}</td>
                            <td>${vehicle.model}</td>
                            <td>${vehicle.plateNumber}</td>
                            <td>${vehicle.capacity}</td>
                            <td>${vehicle.airConditioning}</td>
                            <td>${vehicle.wifi}</td>
                            <td>
                                <span class="badge ${vehicle.status === 'AVAILABLE' ? 'badge-success' :
                        vehicle.status === 'NOT_AVAILABLE' ? 'badge-warning' :
                            vehicle.status === 'UNDER_MAINTENANCE' ? 'badge-primary' :
                                'badge-danger'}">
                                    ${vehicle.status}
                                </span>
                            </td>
                            <td>
                                <img src="data:image/jpeg;base64,${vehicle.image}" 
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
*/
