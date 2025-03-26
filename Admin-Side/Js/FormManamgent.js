document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".sidebar-menu");  // Ensuring you select the <a> elements

    function navigate() {
        const currentHash = window.location.hash || "#mainForm";

        sections.forEach(section => {
            section.classList.remove("active");
        });
        navLinks.forEach(link => {
            link.classList.remove("active");
        });

        sections.forEach(section => {
            if ("#" + section.id === currentHash) {
                section.classList.add("active");
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentHash) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("hashchange", navigate);
    navigate();
});


window.onload = function () {

    const bookingCtx = document.getElementById('bookingChart').getContext('2d');
    const bookingChart = new Chart(bookingCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Bookings',
                data: [65, 59, 80, 81, 56, 55, 72],
                backgroundColor: 'rgba(74, 111, 255, 0.2)',
                borderColor: 'rgba(74, 111, 255, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const vehicleCtx = document.getElementById('vehicleChart').getContext('2d');
    const vehicleChart = new Chart(vehicleCtx, {
        type: 'doughnut',
        data: {
            labels: ['Cars', 'Vans', 'Buses'],
            datasets: [{
                data: [24, 12, 12],
                backgroundColor: [
                    '#4A6FFF',
                    '#28a745',
                    '#ffc107'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
        }
    });
};


function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });


    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });


    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab:nth-child(${Array.from(document.querySelectorAll('.tab')).findIndex(tab => tab.getAttribute('onclick').includes(tabId)) + 1})`).classList.add('active');
}


// Function to show the Add New Bus modal==============================================
function showAddNewBusModal() {
    document.getElementById('vehicleModalTitle').textContent = 'Add New Bus';
    document.getElementById('BusModel').querySelector('form').reset();
    document.getElementById('BusModel').classList.add('show');
}

// Close modal when clicking outside of it (optional)
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// Function to show the Add New Van modal=================================================
function showAddNewVanModal() {
    document.getElementById('vehicleModalTitle1').textContent = 'Add New Van';
    document.getElementById('VanMode').querySelector('form').reset();
    document.getElementById('VanMode').classList.add('show');
}

// Close modal when clicking outside of it (optional)
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}


function showAddNewCarModal() {
    document.getElementById('vehicleModalTitle2').textContent = 'Add New Car';
    document.getElementById('CarMode').querySelector('form').reset();
    document.getElementById('CarMode').classList.add('show');
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show'); // Removes 'show' class
        modal.style.display = 'none'; // Ensures modal is hidden
    }
}

// Function to show the car Update modal=================================================


//Driver Section=========================================================================
function showAddNewDriverModal() {
    document.getElementById('DriverModelTitle').textContent = 'Add New Driver';
    document.getElementById('addDriverForm').querySelector('form').reset();
    document.getElementById('addDriverForm').classList.add('show');
}

function showAddInsuranceModal() {
    document.getElementById("modalTitle").textContent = "Add Insurance";
    document.getElementById("InsuranceForm").reset();
    document.getElementById("insuranceModal").classList.add("show");
}

loadUserName()

function loadUserName() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user/getUsername",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            console.log(data)
            if (data) {

                $('#user-name').text("Welcome: " + data);
            } else {
                $('#userRole').text("Role: Unknown");
            }
        }
    })
}

loadUserImage()
function loadUserImage() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user/getProPic",
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
        },
        success: function (data) {
            console.log("Profile Picture Response:", data); // Check the output in console

            if (data && data.startsWith("/")) { // If it's a URL
                $("#currentUserProImage").attr("src", data);
            } else if (data) { // If it's Base64
                $("#currentUserProImage").attr("src", "data:image/png;base64," + data);
            } else {
                $("#currentUserProImage").attr("src", "default-avatar.png"); // Default image
            }
        },
        error: function (xhr) {
            console.error("Error fetching profile image:", xhr);
            $("#currentUserProImage").attr("src", "default-avatar.png"); // Fallback image
        }
    });
}



