$(document).ready(function () {
    // Load buses when the page is ready
    loadBuses();

    // Load buses from the API and display them as cards
    function loadBuses() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Buses", // API endpoint
            type: "GET", // HTTP method
            success: function (data) {
                const container = $("#busCardContainer").empty(); // Clear previous content

                // Check if no buses are available
                if (data.length === 0) {
                    container.append(`<p>No buses available.</p>`);
                    return;
                }

                // Loop through the data and create individual cards for each bus
                data.forEach((bus) => {
                    const busCard = createBusCard(bus); // Generate a unique bus card
                    container.append(busCard); // Append the card to the container
                });
            },
            error: function (xhr, status, error) {
                alert(`Error loading Buses: ${xhr.responseText || error || status}`); // Handle errors
            }
        });
    }

    // Create an HTML card for a bus
    function createBusCard(bus) {
        return `
        <div class="vehicle-card" data-bus-id="${bus.busId}">
            <div class="vehicle-image">
                <img src="data:image/jpeg;base64,${bus.image}" alt="Bus Image">
            </div>
            <div class="vehicle-details">
                <h3>${bus.model}</h3>
                <div class="status-badge ${getBadgeClass(bus.status)}">${bus.status}</div>
                <div class="vehicle-info">
                    <p><strong>Registration:</strong> ${bus.registrationNumber}</p>
                    <p><strong>Plate Number:</strong> ${bus.plateNumber}</p>
                    <p><strong>Capacity:</strong> ${bus.capacity} seats</p>
                    <p><strong>AC:</strong> ${bus.airConditioning || "Not Available"}</p>
                    <p><strong>WiFi:</strong> ${bus.wifi || "Not Available"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-update" data-bus-id="${bus.busId}">Update</button>
                    <button class="btn btn-delete" data-bus-id="${bus.busId}">Delete</button>
                </div>
            </div>
        </div>
        `;
    }

    // Function to assign badge class based on bus status
    function getBadgeClass(status) {
        const badgeClasses = {
            "AVAILABLE": "status-available",
            "NOT_AVAILABLE": "status-unavailable",
            "UNDER_MAINTENANCE": "status-maintenance"
        };
        return badgeClasses[status] || "status-unknown";
    }

    // Handle the form submission for adding a new bus
    $("#busForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission
        const bus = new FormData(this); // Create form data from the form

        $.ajax({
            url: "http://localhost:8080/api/v1/Buses", // API endpoint
            type: "POST", // HTTP method
            data: bus, // Form data
            contentType: false, // Allow file upload (multipart data)
            processData: false, // Prevent automatic query string creation
            success: function (newBus) {
                alert("Bus added successfully!");

                // Dynamically create and append the new bus card to the container
                const newBusCard = createBusCard(newBus); // Create the card for the new bus
                $("#busCardContainer").prepend(newBusCard); // Add it at the top of the container

                $("#busForm")[0].reset(); // Reset the form fields
                closeModal("BusModel"); // Close the modal after successful submission
            },
            error: function (xhr) {
                alert(`Error adding bus: ${xhr.responseText || "An error occurred."}`);
            }
        });
    });

    // Function to close a modal
    function closeModal(modalId) {
        $(`#${modalId}`).hide();
    }

    // Make closeModal available globally for use in HTML onclick attributes
    window.closeModal = closeModal;
});