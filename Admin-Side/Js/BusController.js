$(document).ready(function () {
    loadBuses();

    // Load buses
    function loadBuses() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses",
            /*headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },*/
            type: "GET",
            success: function (data) {
                let tbody = $("#BusTaleBody").empty();
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
                           <td>
                             <span class="badge ${bus.status == 'AVAILABLE' ? 'badge-success' :
                        bus.status == 'NOT_AVAILABLE' ? 'badge-warning' :
                            bus.status == 'UNDER_MAINTENANCE' ? 'badge-primary' :
                                'badge-danger'}">
                             ${bus.status}
                          </span>
                          </td>
                            <td>
                                <img src="data:image/jpeg;base64,${bus.image}" 
                                    alt="Bus Image" class="crop-image" 
                                    style="width: 70px; cursor: pointer;">
                            </td>
                            <td>
                                <button class="btn btn-update" data-bus-id="${bus.busId}">Update</button>
                                <button class="btn btn-delete" data-bus-id="${bus.busId}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                alert("Error loading Buses: " + (xhr.responseText || error || status));
            }
        });
    }


    // Form submission handler for adding a bus
    $("#busForm").submit(function (event) {
        event.preventDefault();
        console.log("Form submitted");

        // Create FormData object
        const bus = new FormData();

        console.log(bus)

        // Match the exact parameter names expected by the controller
        bus.append('busId', $("#busId").val());
        bus.append('air', $("#airConditioning").val());
        bus.append('capacity', $("#capacity").val());
        bus.append('model', $("#model").val());
        bus.append('plateNumber', $("#plateNumber").val());
        bus.append('registration', $("#registrationNumber").val());
        bus.append('status', $("#status").val());
        bus.append('wifi', $("#wifi").val());
        bus.append('year', $("#year").val());
        bus.append('image', $('#image')[0].files[0]);

        // Append JSON stringified busData
        bus.append("busData", JSON.stringify(bus));

        // Append image file
        const imageFile = $('#image')[0].files[0];
        if (!imageFile) {
            alert("Please select an image!");
            return;
        }
        bus.append("image", imageFile);

        // Debug FormData
        for (let pair of bus.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Validate all fields are filled
        if (!$("#busId").val() || !$("#registrationNumber").val() || !$("#model").val() ||
            !$("#plateNumber").val() || !$("#year").val() || !$("#capacity").val() ||
            !$("#airConditioning").val() || !$("#wifi").val() || !$("#status").val() ||
            !$('#image')[0].files[0]) {
            alert("Please fill in all fields!");
            return;
        }

        // Add Bus - POST request
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses",
            type: "POST",
            data: bus,
            contentType: false, // Let the browser set content type with boundary
            processData: false, // Don't process FormData
            success: function (response) {
                console.log("Success:", response);
                alert("Bus added successfully!");
                loadBuses();
                $("#busForm")[0].reset(); // Reset form after successful submission
                closeModal('BusModel'); // Close the modal
            },
            error: function (xhr, status, error) {
                console.error("Error details:", xhr, status, error);
                console.error("Response:", xhr.responseText);
                alert("Error adding bus: " + (xhr.responseText || error || status));
            }
        });
    });

    // Helper function to close the modal
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    // Helper function to show modal
    window.showUpdateBusModel = function() {
        document.getElementById('UpdateBusModel').style.display = 'block';
    };

    // Update button click handler
    $(document).on("click", ".btn-update", function () {
        const busId = $(this).data("bus-id");
        console.log("Clicked Update Button - Bus ID:", busId);
        if (busId) {
            loadBusDataIntoUpdateForm(busId);
        }
    });

    // Function to load bus data into update form
    function loadBusDataIntoUpdateForm(busId) {
        console.log("Fetching data for Bus ID:", busId);

        $.ajax({
            url: `http://localhost:8080/api/v1/Buses/${busId}`,
            type: "GET",
            success: function (busData) {
                console.log("Fetched Bus Data:", busData);

                if (!busData) {
                    alert("Bus data not found for ID: " + busId);
                    return;
                }

                // Store busId in a hidden field for update operation
                $("#busIdUpdate").val(busId);
                $("#registrationNumberUpdate").val(busData.registrationNumber);
                $("#modelUpdate").val(busData.model);
                $("#plateNumberUpdate").val(busData.plateNumber);
                $("#yearUpdate").val(busData.year);
                $("#capacityUpdate").val(busData.capacity);

                // Correct way to handle checkboxes
                $("#airConditioningUpdate").val(busData.airConditioning);
                $("#wifiUpdate").val(busData.wifi);

                // If 'statusUpdate' is a dropdown, set value
                $("#statusUpdate").val(busData.status);

                // Show the update modal
                $("#UpdateBusModel").show();

                console.log("Form populated successfully.");
            },
            error: function (xhr, status, error) {
                alert("Error loading bus details: " + (xhr.responseText || error || status));
            }
        });
    }

    // Form submission handler for updating a bus
    $("#UpdateBusForm").submit(function(event) {
        event.preventDefault();
        console.log("Update form submitted");

        const busId = $("#busIdUpdate").val();

        if (!busId) {
            alert("Bus ID is missing!");
            return;
        }

        // Create FormData object
        const bus = new FormData();

        // Append updated bus details
        bus.append('air', $("#airConditioningUpdate").val());
        bus.append('capacity', $("#capacityUpdate").val());
        bus.append('model', $("#modelUpdate").val());
        bus.append('plateNumber', $("#plateNumberUpdate").val());
        bus.append('registration', $("#registrationNumberUpdate").val());
        bus.append('status', $("#statusUpdate").val());
        bus.append('wifi', $("#wifiUpdate").val())
        bus.append('year', $("#yearUpdate").val());
        bus.append('image',$('#imageUpdate')[0].files[0]);



        // Validate all fields are filled
        if (!$("#registrationNumberUpdate").val() || !$("#modelUpdate").val() ||
            !$("#plateNumberUpdate").val() || !$("#yearUpdate").val() || !$("#capacityUpdate").val() ||
            $("#statusUpdate").val() === "") {
            alert("Please fill in all fields!");
            return;
        }

        // Update Bus - PUT request
        $.ajax({
            url: `http://localhost:8080/api/v1/Buses/${busId}`,
            type: "PUT",
            data: bus,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log("Success:", response);
                alert("Bus updated successfully!");
                loadBuses();
                $("#UpdateBusForm")[0].reset();
                closeModal('UpdateBusModel');
            },
            error: function(xhr, status, error) {
                console.error("Error details:", xhr, status, error);
                console.error("Response:", xhr.responseText);
                alert("Error updating bus: " + (xhr.responseText || error || status));
            }
        });
    });

    // Delete button click handler
    $(document).on("click", ".btn-delete", function () {
        const busId = $(this).data("bus-id");
        if (confirm("Are you sure you want to delete this bus?")) {
            deleteBus(busId);
        }
    });

    // Function to delete a bus
    function deleteBus(busId) {
        $.ajax({
            url: `http://localhost:8080/api/v1/Buses/${busId}`,
            type: "DELETE",
            success: function () {
                alert("Bus deleted successfully!");
                loadBuses();
            },
            error: function (xhr, status, error) {
                alert("Error deleting bus: " + (xhr.responseText || error || status));
            }
        });
    }
});