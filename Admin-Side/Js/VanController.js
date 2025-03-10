$(document).ready(function () {
    loadVans();

    let selectVanId = null;

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
                             <td>
                            <span class="badge ${van.status == 'AVAILABLE' ? 'badge-success' :
                        van.status == 'NOT_AVAILABLE' ? 'badge-warning' :
                            van.status == 'UNDER_MAINTENANCE' ? 'badge-primary' :
                                'badge-danger'}">
                            ${van.status}
                         </span>
                         </td>
                           <td>
                                <img src="data:image/jpeg;base64,${van.image}" 
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
    }}
)