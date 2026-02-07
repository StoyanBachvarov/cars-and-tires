// ========================================
// Global Variables & Configuration
// ========================================

const ITEMS_PER_PAGE = 6;
let currentCarPage = 1;
let currentTirePage = 1;
let filteredCars = [];
let filteredTires = [];

// ========================================
// Data Generation
// ========================================

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

const tireBrands = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Dunlop'];
const tireWidths = ['195', '205', '215', '225', '235', '245', '255', '265'];
const tireHeights = ['45', '50', '55', '60', '65', '70'];
const tireWheels = ['15', '16', '17', '18', '19', '20'];

const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Green', 'Yellow'];
const transmissions = ['Automatic', 'Manual', 'CVT'];

function generateSampleCars() {
    const cars = [];
    for (let i = 0; i < 20; i++) {
        const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
        const models = carModels[brand];
        const model = models[Math.floor(Math.random() * models.length)];
        const year = 2015 + Math.floor(Math.random() * 10);
        const price = 15000 + Math.floor(Math.random() * 50000);
        const kilometers = 10000 + Math.floor(Math.random() * 150000);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
        const isHot = Math.random() > 0.7;
        
        cars.push({
            id: i + 1,
            brand,
            model,
            year,
            price,
            kilometers,
            color,
            transmission,
            fuelType: Math.random() > 0.5 ? 'Gasoline' : 'Diesel',
            doors: Math.random() > 0.5 ? 4 : 2,
            seats: Math.random() > 0.3 ? 5 : 7,
            isHot
        });
    }
    return cars;
}

function generateSampleTires() {
    const tires = [];
    for (let i = 0; i < 20; i++) {
        const brand = tireBrands[Math.floor(Math.random() * tireBrands.length)];
        const width = tireWidths[Math.floor(Math.random() * tireWidths.length)];
        const height = tireHeights[Math.floor(Math.random() * tireHeights.length)];
        const wheel = tireWheels[Math.floor(Math.random() * tireWheels.length)];
        const price = 80 + Math.floor(Math.random() * 250);
        const isHot = Math.random() > 0.7;
        
        tires.push({
            id: i + 1,
            brand,
            width,
            height,
            wheel,
            price,
            season: Math.random() > 0.7 ? 'Winter' : Math.random() > 0.5 ? 'Summer' : 'All-Season',
            loadIndex: 85 + Math.floor(Math.random() * 20),
            speedRating: ['H', 'V', 'W', 'Y'][Math.floor(Math.random() * 4)],
            runFlat: Math.random() > 0.7,
            isHot
        });
    }
    return tires;
}

// ========================================
// Local Storage Management
// ========================================

function initializeData() {
    if (!localStorage.getItem('cars')) {
        const cars = generateSampleCars();
        localStorage.setItem('cars', JSON.stringify(cars));
    }
    
    if (!localStorage.getItem('tires')) {
        const tires = generateSampleTires();
        localStorage.setItem('tires', JSON.stringify(tires));
    }
}

function getCars() {
    return JSON.parse(localStorage.getItem('cars')) || [];
}

function getTires() {
    return JSON.parse(localStorage.getItem('tires')) || [];
}

// ========================================
// Navigation & Breadcrumbs
// ========================================

function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            if (section) {
                // Special handling for Cars and Tires - show tabs
                if (section === 'cars' || section === 'tires') {
                    showTab(section);
                } else {
                    scrollToSection(section);
                }
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateBreadcrumb(tab) {
    const breadcrumb = document.querySelector('.breadcrumb');
    breadcrumb.innerHTML = `
        <li class="breadcrumb-item"><a href="#home" onclick="scrollToSection('home')">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page">${tab.charAt(0).toUpperCase() + tab.slice(1)}</li>
    `;
}

function showTab(tabName) {
    const tab = document.getElementById(`${tabName}-tab`);
    if (!tab) {
        console.error(`Tab ${tabName}-tab not found`);
        return;
    }
    
    // Update breadcrumb
    updateBreadcrumb(tabName);
    
    // Show the tab using Bootstrap's Tab API
    const tabTrigger = new bootstrap.Tab(tab);
    tabTrigger.show();
    
    // Wait for tab animation to complete, then scroll
    setTimeout(() => {
        const tabsSection = document.querySelector('.tabs-section');
        if (tabsSection) {
            tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 200);
}

// ========================================
// Carousel
// ========================================

function populateCarousel(type) {
    const items = type === 'cars' ? getCars().filter(car => car.isHot) : getTires().filter(tire => tire.isHot);
    const carouselInner = document.getElementById(`hot${type === 'cars' ? 'Cars' : 'Tires'}Inner`);
    const carouselIndicators = document.getElementById(`hot${type === 'cars' ? 'Cars' : 'Tires'}Indicators`);
    
    if (items.length === 0) {
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <div class="carousel-card">
                    <i class="fas fa-${type === 'cars' ? 'car' : 'ring'}"></i>
                    <h3>No Hot ${type === 'cars' ? 'Cars' : 'Tires'} Available</h3>
                </div>
            </div>
        `;
        return;
    }
    
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';
    
    items.forEach((item, index) => {
        // Carousel indicators
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', `#hot${type === 'cars' ? 'Cars' : 'Tires'}Carousel`);
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        carouselIndicators.appendChild(indicator);
        
        // Carousel items
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) carouselItem.classList.add('active');
        
        if (type === 'cars') {
            carouselItem.innerHTML = `
                <div class="carousel-card">
                    <i class="fas fa-car"></i>
                    <h3>${item.brand} ${item.model}</h3>
                    <p>Year: ${item.year} | ${item.kilometers.toLocaleString()} km</p>
                    <h4>$${item.price.toLocaleString()}</h4>
                    <div>
                        <span class="badge bg-danger"><i class="fas fa-fire me-1"></i>Hot Deal</span>
                        <span class="badge bg-light text-dark">${item.transmission}</span>
                    </div>
                </div>
            `;
        } else {
            carouselItem.innerHTML = `
                <div class="carousel-card">
                    <i class="fas fa-ring"></i>
                    <h3>${item.brand}</h3>
                    <p>${item.width}/${item.height} R${item.wheel}</p>
                    <h4>$${item.price.toLocaleString()} per tire</h4>
                    <div>
                        <span class="badge bg-danger"><i class="fas fa-fire me-1"></i>Hot Deal</span>
                        <span class="badge bg-light text-dark">${item.season}</span>
                    </div>
                </div>
            `;
        }
        
        carouselInner.appendChild(carouselItem);
    });
}

// ========================================
// Filter Dropdowns
// ========================================

function populateCarFilters() {
    const cars = getCars();
    
    // Brands
    const brands = [...new Set(cars.map(car => car.brand))].sort();
    const brandSelect = document.getElementById('carBrand');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
    
    // Years
    const years = [...new Set(cars.map(car => car.year))].sort((a, b) => b - a);
    const yearSelect = document.getElementById('carYear');
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    
    // Brand change event to update models
    brandSelect.addEventListener('change', function() {
        const selectedBrand = this.value;
        const modelSelect = document.getElementById('carModel');
        modelSelect.innerHTML = '<option value="">All Models</option>';
        
        if (selectedBrand) {
            const models = [...new Set(cars.filter(car => car.brand === selectedBrand).map(car => car.model))].sort();
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    });
}

function populateTireFilters() {
    const tires = getTires();
    
    // Brands
    const brands = [...new Set(tires.map(tire => tire.brand))].sort();
    const brandSelect = document.getElementById('tireBrand');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
    
    // Widths
    const widths = [...new Set(tires.map(tire => tire.width))].sort();
    const widthSelect = document.getElementById('tireWidth');
    widths.forEach(width => {
        const option = document.createElement('option');
        option.value = width;
        option.textContent = width;
        widthSelect.appendChild(option);
    });
    
    // Heights
    const heights = [...new Set(tires.map(tire => tire.height))].sort();
    const heightSelect = document.getElementById('tireHeight');
    heights.forEach(height => {
        const option = document.createElement('option');
        option.value = height;
        option.textContent = height;
        heightSelect.appendChild(option);
    });
    
    // Wheels
    const wheels = [...new Set(tires.map(tire => tire.wheel))].sort();
    const wheelSelect = document.getElementById('tireWheel');
    wheels.forEach(wheel => {
        const option = document.createElement('option');
        option.value = wheel;
        option.textContent = wheel;
        wheelSelect.appendChild(option);
    });
}

// ========================================
// Search Functionality
// ========================================

function searchCars(e) {
    e.preventDefault();
    
    const brand = document.getElementById('carBrand').value;
    const model = document.getElementById('carModel').value;
    const year = document.getElementById('carYear').value;
    const maxPrice = document.getElementById('carMaxPrice').value;
    const maxKm = document.getElementById('carMaxKm').value;
    
    let cars = getCars();
    
    if (brand) cars = cars.filter(car => car.brand === brand);
    if (model) cars = cars.filter(car => car.model === model);
    if (year) cars = cars.filter(car => car.year == year);
    if (maxPrice) cars = cars.filter(car => car.price <= parseInt(maxPrice));
    if (maxKm) cars = cars.filter(car => car.kilometers <= parseInt(maxKm));
    
    filteredCars = cars;
    currentCarPage = 1;
    displayCarResults();
}

function searchTires(e) {
    e.preventDefault();
    
    const brand = document.getElementById('tireBrand').value;
    const width = document.getElementById('tireWidth').value;
    const height = document.getElementById('tireHeight').value;
    const wheel = document.getElementById('tireWheel').value;
    
    let tires = getTires();
    
    if (brand) tires = tires.filter(tire => tire.brand === brand);
    if (width) tires = tires.filter(tire => tire.width === width);
    if (height) tires = tires.filter(tire => tire.height === height);
    if (wheel) tires = tires.filter(tire => tire.wheel === wheel);
    
    filteredTires = tires;
    currentTirePage = 1;
    displayTireResults();
}

function resetCarSearch() {
    document.getElementById('carSearchForm').reset();
    document.getElementById('carModel').innerHTML = '<option value="">All Models</option>';
    filteredCars = getCars();
    currentCarPage = 1;
    displayCarResults();
}

function resetTireSearch() {
    document.getElementById('tireSearchForm').reset();
    filteredTires = getTires();
    currentTirePage = 1;
    displayTireResults();
}

// ========================================
// Display Results
// ========================================

function displayCarResults() {
    const resultsContainer = document.getElementById('carResults');
    const resultsCount = document.getElementById('carResultsCount');
    
    const startIndex = (currentCarPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCars = filteredCars.slice(startIndex, endIndex);
    
    resultsCount.textContent = `${filteredCars.length} result${filteredCars.length !== 1 ? 's' : ''}`;
    
    if (paginatedCars.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state col-12">
                <i class="fas fa-search"></i>
                <h3>No Results Found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        document.getElementById('carPagination').innerHTML = '';
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    paginatedCars.forEach((car, index) => {
        const card = createCarCard(car, startIndex + index);
        resultsContainer.appendChild(card);
    });
    
    createPagination('car', filteredCars.length);
}

function displayTireResults() {
    const resultsContainer = document.getElementById('tireResults');
    const resultsCount = document.getElementById('tireResultsCount');
    
    const startIndex = (currentTirePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTires = filteredTires.slice(startIndex, endIndex);
    
    resultsCount.textContent = `${filteredTires.length} result${filteredTires.length !== 1 ? 's' : ''}`;
    
    if (paginatedTires.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state col-12">
                <i class="fas fa-search"></i>
                <h3>No Results Found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        document.getElementById('tirePagination').innerHTML = '';
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    paginatedTires.forEach((tire, index) => {
        const card = createTireCard(tire, startIndex + index);
        resultsContainer.appendChild(card);
    });
    
    createPagination('tire', filteredTires.length);
}

// ========================================
// Create Cards
// ========================================

function createCarCard(car, index) {
    const card = document.createElement('div');
    card.classList.add('result-card');
    
    card.innerHTML = `
        <div class="card-image">
            <i class="fas fa-car"></i>
        </div>
        <div class="card-body-custom">
            <h5 class="card-title-custom">${car.brand} ${car.model}</h5>
            <div class="card-details">
                <span class="detail-badge"><i class="fas fa-calendar me-1"></i>${car.year}</span>
                <span class="detail-badge"><i class="fas fa-tachometer-alt me-1"></i>${car.kilometers.toLocaleString()} km</span>
                <span class="detail-badge"><i class="fas fa-cog me-1"></i>${car.transmission}</span>
            </div>
            <div class="card-price">$${car.price.toLocaleString()}</div>
            <div class="accordion" id="carAccordion${index}">
                <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#carDetails${index}">
                            <i class="fas fa-info-circle me-2"></i>View Details
                        </button>
                    </h2>
                    <div id="carDetails${index}" class="accordion-collapse collapse" 
                         data-bs-parent="#carAccordion${index}">
                        <div class="accordion-body">
                            <div class="detail-row">
                                <span class="detail-label">Brand:</span>
                                <span class="detail-value">${car.brand}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Model:</span>
                                <span class="detail-value">${car.model}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Year:</span>
                                <span class="detail-value">${car.year}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Price:</span>
                                <span class="detail-value">$${car.price.toLocaleString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Kilometers:</span>
                                <span class="detail-value">${car.kilometers.toLocaleString()} km</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Color:</span>
                                <span class="detail-value">${car.color}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Transmission:</span>
                                <span class="detail-value">${car.transmission}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Fuel Type:</span>
                                <span class="detail-value">${car.fuelType}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Doors:</span>
                                <span class="detail-value">${car.doors}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Seats:</span>
                                <span class="detail-value">${car.seats}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function createTireCard(tire, index) {
    const card = document.createElement('div');
    card.classList.add('result-card');
    
    card.innerHTML = `
        <div class="card-image">
            <i class="fas fa-ring"></i>
        </div>
        <div class="card-body-custom">
            <h5 class="card-title-custom">${tire.brand}</h5>
            <div class="card-details">
                <span class="detail-badge">${tire.width}/${tire.height} R${tire.wheel}</span>
                <span class="detail-badge"><i class="fas fa-snowflake me-1"></i>${tire.season}</span>
                <span class="detail-badge">${tire.speedRating}</span>
            </div>
            <div class="card-price">$${tire.price.toLocaleString()}</div>
            <div class="accordion" id="tireAccordion${index}">
                <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#tireDetails${index}">
                            <i class="fas fa-info-circle me-2"></i>View Details
                        </button>
                    </h2>
                    <div id="tireDetails${index}" class="accordion-collapse collapse" 
                         data-bs-parent="#tireAccordion${index}">
                        <div class="accordion-body">
                            <div class="detail-row">
                                <span class="detail-label">Brand:</span>
                                <span class="detail-value">${tire.brand}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Size:</span>
                                <span class="detail-value">${tire.width}/${tire.height} R${tire.wheel}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Width:</span>
                                <span class="detail-value">${tire.width} mm</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Height Ratio:</span>
                                <span class="detail-value">${tire.height}%</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Wheel Size:</span>
                                <span class="detail-value">${tire.wheel} inches</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Price:</span>
                                <span class="detail-value">$${tire.price.toLocaleString()} per tire</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Season:</span>
                                <span class="detail-value">${tire.season}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Load Index:</span>
                                <span class="detail-value">${tire.loadIndex}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Speed Rating:</span>
                                <span class="detail-value">${tire.speedRating}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Run Flat:</span>
                                <span class="detail-value">${tire.runFlat ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// ========================================
// Pagination
// ========================================

function createPagination(type, totalItems) {
    const paginationContainer = document.getElementById(`${type}Pagination`);
    const currentPage = type === 'car' ? currentCarPage : currentTirePage;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('${type}', ${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage('${type}', ${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('${type}', ${currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(type, page) {
    if (type === 'car') {
        currentCarPage = page;
        displayCarResults();
    } else {
        currentTirePage = page;
        displayTireResults();
    }
    
    // Scroll to results
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize data in localStorage
    initializeData();
    
    // Set up navigation
    updateNavigation();
    
    // Populate carousels
    populateCarousel('cars');
    populateCarousel('tires');
    
    // Populate filters
    populateCarFilters();
    populateTireFilters();
    
    // Initialize with all cars and tires
    filteredCars = getCars();
    filteredTires = getTires();
    
    // Display initial results
    displayCarResults();
    displayTireResults();
    
    // Set up search forms
    document.getElementById('carSearchForm').addEventListener('submit', searchCars);
    document.getElementById('tireSearchForm').addEventListener('submit', searchTires);
    
    // Tab change event for breadcrumbs
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function(e) {
            const target = e.target.getAttribute('data-bs-target');
            if (target === '#cars-content') {
                updateBreadcrumb('cars');
            } else if (target === '#tires-content') {
                updateBreadcrumb('tires');
            }
        });
    });
    
    // Hero Browse buttons
    const browseCarsBtn = document.getElementById('browseCarsBtn');
    const browseTiresBtn = document.getElementById('browseTiresBtn');
    
    if (browseCarsBtn) {
        browseCarsBtn.addEventListener('click', function() {
            showTab('cars');
        });
    }
    
    if (browseTiresBtn) {
        browseTiresBtn.addEventListener('click', function() {
            showTab('tires');
        });
    }
    
    // Contact form submit
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.footer-section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
    
    console.log('Cars and Tires Marketplace initialized successfully!');
});
