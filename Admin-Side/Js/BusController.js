$(document).ready(function () {
    loadBuses();

    // Load buses and populate the table
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
                            <td><span class="badge badge-success">${bus.status}</span></td>
                             <td>
                                <img src="data:image/jpeg;base64,${bus.image}" 
                                     alt="Crop Image" class="crop-image" 
                                     style="width: 70px; cursor: pointer;">
                            </td>

                        </tr>
                    `);
                });
            },
            error: function () {
                alert("Error loading vans!");
            }
        });
    }


    // Form submission handler for adding a bus
    $("#busForm").submit(function (event) {
        event.preventDefault();
        console.log("Form submitted");

        // Create FormData object
        const bus = new FormData();

        // Match the exact parameter names expected by the controller
        bus.append('busId', $("#busId").val());
        bus.append('registration', $("#registrationNumber").val());
        bus.append('model', $("#model").val());
        bus.append('plateNumber', $("#plateNumber").val());
        bus.append('year', $("#year").val());
        bus.append('capacity', $("#capacity").val());
        bus.append('air', $("#airConditioning").val());
        bus.append('wifi', $("#wifi").val());
        bus.append('status', $("#status").val());
        bus.append('date', $("#date").val());
        bus.append('image', $('#image')[0].files[0]);

        // Debug FormData
        for (let pair of bus.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Validate all fields are filled
        if (!$("#busId").val() || !$("#registrationNumber").val() || !$("#model").val() ||
            !$("#plateNumber").val() || !$("#year").val() || !$("#capacity").val() ||
            !$("#airConditioning").val() || !$("#wifi").val() || !$("#status").val() ||
            !$("#date").val() || !$('#image')[0].files[0]) {
            alert("Please fill in all fields!");
            return;
        }

        // Add Bus - POST request
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses",
            type: "POST",
            data: bus,
            contentType: false, // Let the browser set the content type with boundary
            processData: false, // Don't process the data
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

    // Helper function to close the modal if not already defined
    if (typeof closeModal !== 'function') {
        window.closeModal = function(modalId) {
            document.getElementById(modalId).style.display = 'none';
        };
    }
});