$(document).ready(function () {
    loadBuses();

    let selectBusId = null;

    // Load customers and populate the table
    function loadBuses() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses",
            /*headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },*/
            type: "GET",
            success: function (data) {
                let tbody = $("#busTable").empty();
                data.forEach(bus => {
                    tbody.append(`
                        <tr>
                            <td>${bus.busId}</td>
                            <td>${bus.registrationNumber}</td>
                            <td>${bus.model}</td>
                            <td>${bus.plateNumber}</td>
                            <td>${bus.capacity}</td>
                            <td>${bus.airConditioning}</td>
                            <td>${bus.wifi}</td>
                            <td>${bus.status}</td>
                        </tr>
                    `);
                });
            },
            error: function () {
                alert("Error loading vans!");
            }
        });
    }

    // Handle form submission (Add or Update customer)
    $("#vehicleForm").submit(function (event) {
        event.preventDefault();

        const bus = {
            id: $("#vehicleId").val().trim(),
            name: $("#vehicleName").val().trim(),
            type: $("#vehicleType").val().trim(),
            capacity: $("#vehicleCapacity").val().trim(),
            air: $("#vehicleAirConditioning").val().trim(),
            wifi: $("#vehicleWifi").val().trim(),
            status: $("#vehicleStatus").val().trim()
        };

        // Validate fields
        if (!bus.id || !bus.name || !bus.type || !bus.capacity || !bus.air|| !bus.wifi || !bus.status ) {
            alert("Please fill in all fields!");
            return;
        }

        if (selectBusId) {
            // Update Customer
            $.ajax({
                url: `http://localhost:8090/api/v2/customer/${selectBusId}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(bus),
                success: function () {
                    alert("Bus updated successfully!");
                    resetForm();
                    loadCustomers();
                },
                error: function () {
                    alert("Error updating bus!");
                }
            });
        } else {
            // Add Customer
            $.ajax({
                url: "http://localhost:8080/api/v1/Buses",
                type: "POST",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                },
                contentType: "application/json",
                data: JSON.stringify(bus),
                success: function () {
                    alert("Bus added successfully!");
                    resetForm();
                    loadCustomers();
                },
                error: function () {
                    alert("Error adding customer!");
                }
            });
        }
    }
)}
)