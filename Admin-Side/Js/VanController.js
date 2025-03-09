$(document).ready(function () {
    loadVans();

    let selectBusId = null;

    // Load customers and populate the table
    function loadVans() {
        $.ajax({
            url: "http://localhost:8080/api/v1/Vans",
            /*headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            },*/
            type: "GET",
            success: function (data) {
                let tbody = $("#VanTableBody").empty();
                data.forEach(van => {
                    tbody.append(`
                        <tr>
                            <td>${van.vanId}</td>
                            <td>${van.registrationNumber}</td>
                            <td>${van.model}</td>
                            <td>${van.plateNumber}</td>
                            <td>${van.capacity}</td>
                            <td>${van.airConditioning}</td>
                            <td>${van.wifi}</td>
                            <td><span class="badge badge-success">${van.status}</span></td>

                        </tr>
                    `);
                });
            },
            error: function () {
                alert("Error loading vans!");
            }
        });
    }}
)