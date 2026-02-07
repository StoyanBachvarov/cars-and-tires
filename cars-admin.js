// ========================================
// Global Variables & State
// ========================================

let currentTab = 'cars';
let carsData = [];
let tiresData = [];
let editingItem = null;
let deleteCallback = null;

// Bootstrap modal instances
let carModal;
let tireModal;
let viewDetailsModal;
let deleteModal;

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap modals
    carModal = new bootstrap.Modal(document.getElementById('carModal'));
    tireModal = new bootstrap.Modal(document.getElementById('tireModal'));
    viewDetailsModal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Load data from localStorage
    loadData();
    
    // Render initial view
    renderCars();
    updateCounts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show success message if data was initialized
    if (!localStorage.getItem('adminInitialized')) {
        showAlert('Admin panel initialized successfully!', 'success');
        localStorage.setItem('adminInitialized', 'true');
    }
});

// ========================================
// Data Management
// ========================================

function loadData() {
    // Load cars
    const carsJSON = localStorage.getItem('cars');
    if (carsJSON) {
        carsData = JSON.parse(carsJSON);
    } else {
        carsData = generateSampleCars();
        saveCars();
    }
    
    // Load tires
    const tiresJSON = localStorage.getItem('tires');
    if (tiresJSON) {
        tiresData = JSON.parse(tiresJSON);
    } else {
        tiresData = generateSampleTires();
        saveTires();
    }
}

function saveCars() {
    localStorage.setItem('cars', JSON.stringify(carsData));
    updateCounts();
}

function saveTires() {
    localStorage.setItem('tires', JSON.stringify(tiresData));
    updateCounts();
}

function generateSampleCars() {
    const carBrands = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Volkswagen'];
    const carModels = {
        'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander'],
        'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
        'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'],
        'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
        'Mercedes': ['C-Class', 'E-Class', 'GLC', 'GLE'],
        'Audi': ['A4', 'A6', 'Q5', 'Q7'],
        'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder'],
        'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas']
    };
    const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Green', 'Yellow'];
    const transmissions = ['Automatic', 'Manual', 'CVT'];
    
    const cars = [];
    for (let i = 0; i < 12; i++) {
        const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
        const models = carModels[brand];
        const model = models[Math.floor(Math.random() * models.length)];
        const year = 2015 + Math.floor(Math.random() * 10);
        const price = 15000 + Math.floor(Math.random() * 50000);
        
        cars.push({
            id: Date.now() + i,
            brand,
            model,
            year,
            price,
            kilometers: 10000 + Math.floor(Math.random() * 150000),
            color: colors[Math.floor(Math.random() * colors.length)],
            transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
            fuelType: Math.random() > 0.5 ? 'Gasoline' : 'Diesel',
            doors: Math.random() > 0.5 ? 4 : 2,
            seats: Math.random() > 0.3 ? 5 : 7,
            isHot: Math.random() > 0.7
        });
    }
    return cars;
}

function generateSampleTires() {
    const tireBrands = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Dunlop'];
    const tireWidths = ['195', '205', '215', '225', '235', '245', '255', '265'];
    const tireHeights = ['45', '50', '55', '60', '65', '70'];
    const tireWheels = ['15', '16', '17', '18', '19', '20'];
    
    const tires = [];
    for (let i = 0; i < 12; i++) {
        const brand = tireBrands[Math.floor(Math.random() * tireBrands.length)];
        const width = tireWidths[Math.floor(Math.random() * tireWidths.length)];
        const height = tireHeights[Math.floor(Math.random() * tireHeights.length)];
        const wheel = tireWheels[Math.floor(Math.random() * tireWheels.length)];
        
        tires.push({
            id: Date.now() + i,
            brand,
            width,
            height,
            wheel,
            price: 80 + Math.floor(Math.random() * 250),
            season: Math.random() > 0.7 ? 'Winter' : Math.random() > 0.5 ? 'Summer' : 'All-Season',
            loadIndex: 85 + Math.floor(Math.random() * 20),
            speedRating: ['H', 'V', 'W', 'Y'][Math.floor(Math.random() * 4)],
            runFlat: Math.random() > 0.7,
            isHot: Math.random() > 0.7
        });
    }
    return tires;
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Tab navigation
    document.getElementById('carsTabLink').addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('cars');
    });
    
    document.getElementById('tiresTabLink').addEventListener('click', function(e) {
        e.preventDefault();
        switchTab('tires');
    });
    
    // Delete confirmation
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        if (deleteCallback) {
            deleteCallback();
            deleteCallback = null;
        }
        deleteModal.hide();
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('show');
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update navigation
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(tab + 'TabLink').classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tab + 'Section').classList.add('active');
    
    // Render appropriate content
    if (tab === 'cars') {
        renderCars();
    } else {
        renderTires();
    }
}

// ========================================
// Rendering Functions
// ========================================

function updateCounts() {
    document.getElementById('carsCount').textContent = carsData.length;
    document.getElementById('tiresCount').textContent = tiresData.length;
}

function renderCars() {
    const container = document.getElementById('carsContainer');
    
    if (carsData.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h3>No Cars Available</h3>
                    <p>Start by adding your first car listing</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = carsData.map(car => `
        <div class="col-md-6 col-lg-4">
            <div class="item-card">
                ${car.isHot ? '<span class="hot-badge"><i class="fas fa-fire me-1"></i>Hot Deal</span>' : ''}
                <div class="item-card-header">
                    <div>
                        <h3 class="item-card-title">${car.brand} ${car.model}</h3>
                        <p class="item-card-subtitle">Year ${car.year}</p>
                    </div>
                </div>
                <div class="item-card-body">
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-palette"></i>Color
                        </span>
                        <span class="item-detail-value">${car.color}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-cog"></i>Transmission
                        </span>
                        <span class="item-detail-value">${car.transmission}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-gas-pump"></i>Fuel Type
                        </span>
                        <span class="item-detail-value">${car.fuelType}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-tachometer-alt"></i>Kilometers
                        </span>
                        <span class="item-detail-value">${car.kilometers.toLocaleString()} km</span>
                    </div>
                </div>
                <div class="item-price">$${car.price.toLocaleString()}</div>
                <div class="item-card-footer">
                    <button class="btn-action btn-view" onclick="viewCarDetails(${car.id})" 
                            data-bs-toggle="tooltip" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editCar(${car.id})" 
                            data-bs-toggle="tooltip" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteCar(${car.id})" 
                            data-bs-toggle="tooltip" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Reinitialize tooltips
    initializeTooltips();
}

function renderTires() {
    const container = document.getElementById('tiresContainer');
    
    if (tiresData.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-ring"></i>
                    <h3>No Tires Available</h3>
                    <p>Start by adding your first tire listing</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tiresData.map(tire => `
        <div class="col-md-6 col-lg-4">
            <div class="item-card">
                ${tire.isHot ? '<span class="hot-badge"><i class="fas fa-fire me-1"></i>Hot Deal</span>' : ''}
                <div class="item-card-header">
                    <div>
                        <h3 class="item-card-title">${tire.brand}</h3>
                        <p class="item-card-subtitle">${tire.width}/${tire.height} R${tire.wheel}</p>
                    </div>
                </div>
                <div class="item-card-body">
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-snowflake"></i>Season
                        </span>
                        <span class="item-detail-value">${tire.season}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-weight-hanging"></i>Load Index
                        </span>
                        <span class="item-detail-value">${tire.loadIndex}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-tachometer-alt"></i>Speed Rating
                        </span>
                        <span class="item-detail-value">${tire.speedRating}</span>
                    </div>
                    <div class="item-detail">
                        <span class="item-detail-label">
                            <i class="fas fa-shield-alt"></i>Run Flat
                        </span>
                        <span class="item-detail-value">${tire.runFlat ? 'Yes' : 'No'}</span>
                    </div>
                </div>
                <div class="item-price">$${tire.price.toLocaleString()}</div>
                <div class="item-card-footer">
                    <button class="btn-action btn-view" onclick="viewTireDetails(${tire.id})" 
                            data-bs-toggle="tooltip" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editTire(${tire.id})" 
                            data-bs-toggle="tooltip" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteTire(${tire.id})" 
                            data-bs-toggle="tooltip" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Reinitialize tooltips
    initializeTooltips();
}

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ========================================
// Car Operations
// ========================================

function viewCarDetails(id) {
    const car = carsData.find(c => c.id === id);
    if (!car) return;
    
    const detailsHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-car"></i>Brand</div>
                <div class="detail-value">${car.brand}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-tag"></i>Model</div>
                <div class="detail-value">${car.model}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-calendar"></i>Year</div>
                <div class="detail-value">${car.year}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-palette"></i>Color</div>
                <div class="detail-value">${car.color}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-cog"></i>Transmission</div>
                <div class="detail-value">${car.transmission}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-gas-pump"></i>Fuel Type</div>
                <div class="detail-value">${car.fuelType}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-door-open"></i>Doors</div>
                <div class="detail-value">${car.doors}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-chair"></i>Seats</div>
                <div class="detail-value">${car.seats}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-tachometer-alt"></i>Kilometers</div>
                <div class="detail-value">${car.kilometers.toLocaleString()} km</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-fire"></i>Hot Deal</div>
                <div class="detail-value">${car.isHot ? 'Yes' : 'No'}</div>
            </div>
        </div>
        <div class="detail-price">$${car.price.toLocaleString()}</div>
    `;
    
    document.getElementById('viewDetailsBody').innerHTML = detailsHTML;
    document.getElementById('viewDetailsModalLabel').innerHTML = `
        <i class="fas fa-car me-2"></i>${car.brand} ${car.model} Details
    `;
    viewDetailsModal.show();
}

function openAddModal(type) {
    editingItem = null;
    
    if (type === 'car') {
        document.getElementById('carModalLabel').innerHTML = '<i class="fas fa-car me-2"></i>Add New Car';
        document.getElementById('carForm').reset();
        document.getElementById('carId').value = '';
        carModal.show();
    } else {
        document.getElementById('tireModalLabel').innerHTML = '<i class="fas fa-ring me-2"></i>Add New Tire';
        document.getElementById('tireForm').reset();
        document.getElementById('tireId').value = '';
        tireModal.show();
    }
}

function editCar(id) {
    const car = carsData.find(c => c.id === id);
    if (!car) return;
    
    editingItem = car;
    
    document.getElementById('carModalLabel').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Car';
    document.getElementById('carId').value = car.id;
    document.getElementById('carBrand').value = car.brand;
    document.getElementById('carModel').value = car.model;
    document.getElementById('carYear').value = car.year;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carKilometers').value = car.kilometers;
    document.getElementById('carColor').value = car.color;
    document.getElementById('carTransmission').value = car.transmission;
    document.getElementById('carFuelType').value = car.fuelType;
    document.getElementById('carDoors').value = car.doors;
    document.getElementById('carSeats').value = car.seats;
    document.getElementById('carIsHot').checked = car.isHot;
    
    carModal.show();
}

function confirmCarSave() {
    const form = document.getElementById('carForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const carData = {
        id: document.getElementById('carId').value ? parseInt(document.getElementById('carId').value) : Date.now(),
        brand: document.getElementById('carBrand').value,
        model: document.getElementById('carModel').value,
        year: parseInt(document.getElementById('carYear').value),
        price: parseInt(document.getElementById('carPrice').value),
        kilometers: parseInt(document.getElementById('carKilometers').value),
        color: document.getElementById('carColor').value,
        transmission: document.getElementById('carTransmission').value,
        fuelType: document.getElementById('carFuelType').value,
        doors: parseInt(document.getElementById('carDoors').value),
        seats: parseInt(document.getElementById('carSeats').value),
        isHot: document.getElementById('carIsHot').checked
    };
    
    if (editingItem) {
        // Update existing car
        const index = carsData.findIndex(c => c.id === carData.id);
        if (index !== -1) {
            carsData[index] = carData;
            showAlert('Car updated successfully!', 'success');
        }
    } else {
        // Add new car
        carsData.push(carData);
        showAlert('Car added successfully!', 'success');
    }
    
    saveCars();
    renderCars();
    carModal.hide();
    editingItem = null;
}

function deleteCar(id) {
    const car = carsData.find(c => c.id === id);
    if (!car) return;
    
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete ${car.brand} ${car.model} (${car.year})?`;
    
    deleteCallback = function() {
        carsData = carsData.filter(c => c.id !== id);
        saveCars();
        renderCars();
        showAlert('Car deleted successfully!', 'success');
    };
    
    deleteModal.show();
}

// ========================================
// Tire Operations
// ========================================

function viewTireDetails(id) {
    const tire = tiresData.find(t => t.id === id);
    if (!tire) return;
    
    const detailsHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-tag"></i>Brand</div>
                <div class="detail-value">${tire.brand}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-ruler-horizontal"></i>Width</div>
                <div class="detail-value">${tire.width} mm</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-ruler-vertical"></i>Height</div>
                <div class="detail-value">${tire.height}%</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-circle"></i>Wheel</div>
                <div class="detail-value">${tire.wheel}"</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-info-circle"></i>Full Size</div>
                <div class="detail-value">${tire.width}/${tire.height} R${tire.wheel}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-snowflake"></i>Season</div>
                <div class="detail-value">${tire.season}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-weight-hanging"></i>Load Index</div>
                <div class="detail-value">${tire.loadIndex}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-tachometer-alt"></i>Speed Rating</div>
                <div class="detail-value">${tire.speedRating}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-shield-alt"></i>Run Flat</div>
                <div class="detail-value">${tire.runFlat ? 'Yes' : 'No'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label"><i class="fas fa-fire"></i>Hot Deal</div>
                <div class="detail-value">${tire.isHot ? 'Yes' : 'No'}</div>
            </div>
        </div>
        <div class="detail-price">$${tire.price.toLocaleString()}</div>
    `;
    
    document.getElementById('viewDetailsBody').innerHTML = detailsHTML;
    document.getElementById('viewDetailsModalLabel').innerHTML = `
        <i class="fas fa-ring me-2"></i>${tire.brand} ${tire.width}/${tire.height} R${tire.wheel} Details
    `;
    viewDetailsModal.show();
}

function editTire(id) {
    const tire = tiresData.find(t => t.id === id);
    if (!tire) return;
    
    editingItem = tire;
    
    document.getElementById('tireModalLabel').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Tire';
    document.getElementById('tireId').value = tire.id;
    document.getElementById('tireBrand').value = tire.brand;
    document.getElementById('tireWidth').value = tire.width;
    document.getElementById('tireHeight').value = tire.height;
    document.getElementById('tireWheel').value = tire.wheel;
    document.getElementById('tirePrice').value = tire.price;
    document.getElementById('tireSeason').value = tire.season;
    document.getElementById('tireLoadIndex').value = tire.loadIndex;
    document.getElementById('tireSpeedRating').value = tire.speedRating;
    document.getElementById('tireRunFlat').checked = tire.runFlat;
    document.getElementById('tireIsHot').checked = tire.isHot;
    
    tireModal.show();
}

function confirmTireSave() {
    const form = document.getElementById('tireForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const tireData = {
        id: document.getElementById('tireId').value ? parseInt(document.getElementById('tireId').value) : Date.now(),
        brand: document.getElementById('tireBrand').value,
        width: document.getElementById('tireWidth').value,
        height: document.getElementById('tireHeight').value,
        wheel: document.getElementById('tireWheel').value,
        price: parseInt(document.getElementById('tirePrice').value),
        season: document.getElementById('tireSeason').value,
        loadIndex: parseInt(document.getElementById('tireLoadIndex').value),
        speedRating: document.getElementById('tireSpeedRating').value,
        runFlat: document.getElementById('tireRunFlat').checked,
        isHot: document.getElementById('tireIsHot').checked
    };
    
    if (editingItem) {
        // Update existing tire
        const index = tiresData.findIndex(t => t.id === tireData.id);
        if (index !== -1) {
            tiresData[index] = tireData;
            showAlert('Tire updated successfully!', 'success');
        }
    } else {
        // Add new tire
        tiresData.push(tireData);
        showAlert('Tire added successfully!', 'success');
    }
    
    saveTires();
    renderTires();
    tireModal.hide();
    editingItem = null;
}

function deleteTire(id) {
    const tire = tiresData.find(t => t.id === id);
    if (!tire) return;
    
    document.getElementById('deleteMessage').textContent = 
        `Are you sure you want to delete ${tire.brand} ${tire.width}/${tire.height} R${tire.wheel}?`;
    
    deleteCallback = function() {
        tiresData = tiresData.filter(t => t.id !== id);
        saveTires();
        renderTires();
        showAlert('Tire deleted successfully!', 'success');
    };
    
    deleteModal.show();
}

// ========================================
// Alert Notifications
// ========================================

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div class="alert custom-alert alert-${type} alert-dismissible fade show" role="alert" id="${alertId}">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alertElement);
            bsAlert.close();
        }
    }, 3000);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}
