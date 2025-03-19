/*
$(document).ready(function () {
    loadBusBooking();

    // Load buses
    function loadBusBooking() {
        $.ajax({
            url: "http://localhost:8080/api/b1/busBooking",
            /!*headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },*!/
            type: "GET",
            success: function (data) {
                let tbody = $("#busBookingView").empty();
                data.forEach(bus => {
                    tbody.append(`
                        <tr>
                            <td>${bus.id}</td>
                            <td>${bus.name}</td>
                            <td>${bus.phone}</td>
                            <td>${bus.busId}</td>
                            <td>${bus.pickupLocation}</td>
                            <td>${bus.pickupDate}</td>
                            <td>${bus.additionalInfo}</td>
                          
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                alert("Error loading Buses: " + (xhr.responseText || error || status));
            }
        });
    }
})*/
