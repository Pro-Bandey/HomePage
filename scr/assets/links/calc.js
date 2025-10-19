let currentInput = ''
let previousInput = ''
let operator = ''
let shouldResetDisplay = false

let currentPage = 'calculator'

let isDropdownOpen = false

let currencyRates = {};  // Will store all exchange rates
let lastUpdated = '';    // Will store the date

const equationDisplay = document.getElementById('equation')
const resultDisplay = document.getElementById('result')

const menuBtns = [
    document.getElementById('menu-btn-calculator'),
    document.getElementById('menu-btn-currency'),
    document.getElementById('menu-btn-length'),
    document.getElementById('menu-btn-mass'),
    document.getElementById('menu-btn-temperature'),
    document.getElementById('menu-btn-volume'),
    document.getElementById('menu-btn-area'),
    document.getElementById('menu-btn-speed'),
    document.getElementById('menu-btn-time'),
    document.getElementById('menu-btn-age')

]


const massFormulas = {
    // Convert TO kilograms (base unit)
    toBase: {
        kilograms: (value) => value,
        grams: (value) => value / 1000,
        milligrams: (value) => value / 1000000,
        pounds: (value) => value * 0.453592,
        ounces: (value) => value * 0.0283495,
        tons: (value) => value * 1000
    },
    // Convert FROM kilograms to other units
    fromBase: {
        kilograms: (value) => value,
        grams: (value) => value * 1000,
        milligrams: (value) => value * 1000000,
        pounds: (value) => value * 2.20462,
        ounces: (value) => value * 35.274,
        tons: (value) => value / 1000
    }
};

const lengthFormulas = {
    // Convert TO meters (base unit)
    toBase: {
        meters: (value) => value,
        kilometers: (value) => value * 1000,
        centimeters: (value) => value / 100,
        millimeters: (value) => value / 1000,
        miles: (value) => value * 1609.344,
        yards: (value) => value * 0.9144,
        feet: (value) => value * 0.3048,
        inches: (value) => value * 0.0254
    },
    // Convert FROM meters to other units
    fromBase: {
        meters: (value) => value,
        kilometers: (value) => value / 1000,
        centimeters: (value) => value * 100,
        millimeters: (value) => value * 1000,
        miles: (value) => value / 1609.344,
        yards: (value) => value / 0.9144,
        feet: (value) => value / 0.3048,
        inches: (value) => value / 0.0254
    }
};

const temperatureFormulas = {
    celsius: {
        celsius: (c) => c,
        fahrenheit: (c) => (c * 9/5) + 32,
        kelvin: (c) => c + 273.15
    },
    fahrenheit: {
        celsius: (f) => (f - 32) * 5/9,
        fahrenheit: (f) => f,
        kelvin: (f) => (f - 32) * 5/9 + 273.15
    },
    kelvin: {
        celsius: (k) => k - 273.15,
        fahrenheit: (k) => (k - 273.15) * 9/5 + 32,
        kelvin: (k) => k
    }
};

const volumeFormulas = {
    // Convert TO liters (base unit)
    toBase: {
        liters: (value) => value,
        milliliters: (value) => value / 1000,
        gallons: (value) => value * 3.78541,
        quarts: (value) => value * 0.946353,
        pints: (value) => value * 0.473176,
        cups: (value) => value * 0.236588,
        fluidOunces: (value) => value * 0.0295735,
        tablespoons: (value) => value * 0.0147868,
        teaspoons: (value) => value * 0.00492892
    },
    // Convert FROM liters to other units
    fromBase: {
        liters: (value) => value,
        milliliters: (value) => value * 1000,
        gallons: (value) => value / 3.78541,
        quarts: (value) => value / 0.946353,
        pints: (value) => value / 0.473176,
        cups: (value) => value / 0.236588,
        fluidOunces: (value) => value / 0.0295735,
        tablespoons: (value) => value / 0.0147868,
        teaspoons: (value) => value / 0.00492892
    }
};

const areaFormulas = {
    // Convert TO square meters (base unit)
    toBase: {
        squareMeters: (value) => value,
        squareKilometers: (value) => value * 1000000,
        squareCentimeters: (value) => value / 10000,
        squareFeet: (value) => value * 0.092903,
        squareYards: (value) => value * 0.836127,
        squareMiles: (value) => value * 2589988.11,
        acres: (value) => value * 4046.86,
        hectares: (value) => value * 10000
    },
    // Convert FROM square meters to other units
    fromBase: {
        squareMeters: (value) => value,
        squareKilometers: (value) => value / 1000000,
        squareCentimeters: (value) => value * 10000,
        squareFeet: (value) => value / 0.092903,
        squareYards: (value) => value / 0.836127,
        squareMiles: (value) => value / 2589988.11,
        acres: (value) => value / 4046.86,
        hectares: (value) => value / 10000
    }
};

const speedFormulas = {
    // Convert TO meters per second (base unit)
    toBase: {
        metersPerSecond: (value) => value,
        kilometersPerHour: (value) => value / 3.6,
        milesPerHour: (value) => value * 0.44704,
        feetPerSecond: (value) => value * 0.3048,
        knots: (value) => value * 0.514444,
        mach: (value) => value * 343  // Speed of sound at sea level
    },
    // Convert FROM meters per second to other units
    fromBase: {
        metersPerSecond: (value) => value,
        kilometersPerHour: (value) => value * 3.6,
        milesPerHour: (value) => value / 0.44704,
        feetPerSecond: (value) => value / 0.3048,
        knots: (value) => value / 0.514444,
        mach: (value) => value / 343
    }
};

const timeFormulas = {
    // Convert TO seconds (base unit)
    toBase: {
        seconds: (value) => value,
        minutes: (value) => value * 60,
        hours: (value) => value * 3600,
        days: (value) => value * 86400,
        weeks: (value) => value * 604800,
        months: (value) => value * 2592000,  // Approximation: 30 days
        years: (value) => value * 31557600,  // 365.25 days (accounting for leap years)
        milliseconds: (value) => value / 1000
    },
    // Convert FROM seconds to other units
    fromBase: {
        seconds: (value) => value,
        minutes: (value) => value / 60,
        hours: (value) => value / 3600,
        days: (value) => value / 86400,
        weeks: (value) => value / 604800,
        months: (value) => value / 2592000,
        years: (value) => value / 31557600,
        milliseconds: (value) => value * 1000
    }
};


const currencyInput = document.getElementById('currency-input');
const currencyFromUnit = document.getElementById('currency-from-unit');
const currencyToUnit = document.getElementById('currency-to-unit');
const currencyOutput = document.getElementById('currency-output');
const currencySwapBtn = document.getElementById('currency-swap-btn');
const loadingIndicator = document.getElementById('loading-indicator');
const converterSection = document.getElementById('converter-section');
const lastUpdatedElement = document.getElementById('last-updated');

const massInput = document.getElementById('mass-input');
const massFromUnit = document.getElementById('mass-from-unit');
const massToUnit = document.getElementById('mass-to-unit');
const massOutput = document.getElementById('mass-output');
const massSwapBtn = document.getElementById('mass-swap-btn');

const lengthInput = document.getElementById('length-input');
const lengthFromUnit = document.getElementById('length-from-unit');
const lengthToUnit = document.getElementById('length-to-unit');
const lengthOutput = document.getElementById('length-output');
const lengthSwapBtn = document.getElementById('length-swap-btn');

const temperatureInput = document.getElementById('temperature-input');
const temperatureFromUnit = document.getElementById('temperature-from-unit');
const temperatureToUnit = document.getElementById('temperature-to-unit');
const temperatureOutput = document.getElementById('temperature-output');
const temperatureSwapBtn = document.getElementById('temperature-swap-btn');

const volumeInput = document.getElementById('volume-input');
const volumeFromUnit = document.getElementById('volume-from-unit');
const volumeToUnit = document.getElementById('volume-to-unit');
const volumeOutput = document.getElementById('volume-output');
const volumeSwapBtn = document.getElementById('volume-swap-btn');

const menuOverlay = document.getElementById('menu-overlay')
const menuSidebar = document.getElementById('menu-sidebar')
const closeMenuBtn = document.getElementById('close-menu-btn')

const areaInput = document.getElementById('area-input');
const areaFromUnit = document.getElementById('area-from-unit');
const areaToUnit = document.getElementById('area-to-unit');
const areaOutput = document.getElementById('area-output');
const areaSwapBtn = document.getElementById('area-swap-btn');

const speedInput = document.getElementById('speed-input');
const speedFromUnit = document.getElementById('speed-from-unit');
const speedToUnit = document.getElementById('speed-to-unit');
const speedOutput = document.getElementById('speed-output');
const speedSwapBtn = document.getElementById('speed-swap-btn');

const timeInput = document.getElementById('time-input');
const timeFromUnit = document.getElementById('time-from-unit');
const timeToUnit = document.getElementById('time-to-unit');
const timeOutput = document.getElementById('time-output');
const timeSwapBtn = document.getElementById('time-swap-btn');

const dobInput = document.getElementById('dob-input');
const ageResult = document.getElementById('age-result');
const calcAgeBtn = document.getElementById('calc-age-btn');


const calculatorPage = document.getElementById('calculator-page')
const currencyPage = document.getElementById('currency-page')
const lengthPage = document.getElementById('length-page')
const massPage = document.getElementById('mass-page')
const temperaturePage = document.getElementById('temperature-page')
const volumePage = document.getElementById('volume-page')
const areaPage = document.getElementById('area-page')
const speedPage = document.getElementById('speed-page')
const timePage = document.getElementById('time-page')
const agePage = document.getElementById('age-page');


const calculatorMenuBtn = document.getElementById('calculator-menu-btn')
const currencyMenuBtn = document.getElementById('currency-menu-btn')
const lengthMenuBtn = document.getElementById('length-menu-btn')
const massMenuBtn = document.getElementById('mass-menu-btn')
const temperatureMenuBtn = document.getElementById('temperature-menu-btn')
const volumeMenuBtn = document.getElementById('volume-menu-btn')
const areaMenuBtn = document.getElementById('area-menu-btn')
const speedMenuBtn = document.getElementById('speed-menu-btn')
const timeMenuBtn = document.getElementById('time-menu-btn')
const ageMenuBtn = document.getElementById('age-menu-btn');

const measurementsDropdownBtn = document.getElementById('measurements-dropdown-btn')
const measurementsSubmenu = document.getElementById('measurements-submenu')
const measurementsArrow = document.getElementById('measurements-arrow')

menuBtns.forEach(btn => {
    if(btn){
        btn.addEventListener('click', openMenu)
    }
})

measurementsDropdownBtn.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent menu from closing
    toggleMeasurementsDropdown();
});

closeMenuBtn.addEventListener('click', function(){
    closeMenu()
})

menuOverlay.addEventListener('click', function(){
    closeMenu()
})

calculatorMenuBtn.addEventListener('click', () => showPage('calculator'))
currencyMenuBtn.addEventListener('click', () => showPage('currency'))
lengthMenuBtn.addEventListener('click', () => showPage('length'))
massMenuBtn.addEventListener('click', () => showPage('mass'))
temperatureMenuBtn.addEventListener('click', () => showPage('temperature'))
volumeMenuBtn.addEventListener('click', () => showPage('volume'))
areaMenuBtn.addEventListener('click', () => showPage('area'))
speedMenuBtn.addEventListener('click', () => showPage('speed'))
timeMenuBtn.addEventListener('click', () => showPage('time'))
ageMenuBtn.addEventListener('click', () => showPage('age'));

// For currency
currencyFromUnit.addEventListener('change', function() {
    convertCurrency();
    savePreferences(); 
});
currencyToUnit.addEventListener('change', function() {
    convertCurrency();
    savePreferences(); 
});
currencyInput.addEventListener('input', function() {
    convertCurrency();
    savePreferences(); 
});
currencySwapBtn.addEventListener('click', swapCurrencyUnits);

// For mass
massFromUnit.addEventListener('change', function() {
    convertMass();
    savePreferences();
});
massToUnit.addEventListener('change', function() {
    convertMass();
    savePreferences(); 
});
massInput.addEventListener('input', convertMass);
massSwapBtn.addEventListener('click', swapMassUnits);

// For length
lengthFromUnit.addEventListener('change', function() {
    convertLength();
    savePreferences(); 
});
lengthToUnit.addEventListener('change', function() {
    convertLength();
    savePreferences(); 
});
lengthInput.addEventListener('input', convertLength);
lengthSwapBtn.addEventListener('click', swapLengthUnits);

// For temperature
temperatureFromUnit.addEventListener('change', function() {
    convertTemperature();
    savePreferences(); 
});
temperatureToUnit.addEventListener('change', function() {
    convertTemperature();
    savePreferences(); 
});
temperatureInput.addEventListener('input', convertTemperature);
temperatureSwapBtn.addEventListener('click', swapTemperatureUnits);

// For volume
volumeFromUnit.addEventListener('change', function() {
    convertVolume();
    savePreferences(); 
});
volumeToUnit.addEventListener('change', function() {
    convertVolume();
    savePreferences(); 
});
volumeInput.addEventListener('input', convertVolume);
volumeSwapBtn.addEventListener('click', swapVolumeUnits);

// For area
areaFromUnit.addEventListener('change', function() {
    convertArea();
    savePreferences(); 
});
areaToUnit.addEventListener('change', function() {
    convertArea();
    savePreferences(); 
});
areaInput.addEventListener('input', convertArea);
areaSwapBtn.addEventListener('click', swapAreaUnits);

// For speed
speedFromUnit.addEventListener('change', function() {
    convertSpeed();
    savePreferences(); 
});
speedToUnit.addEventListener('change', function() {
    convertSpeed();
    savePreferences();
});
speedInput.addEventListener('input', convertSpeed);
speedSwapBtn.addEventListener('click', swapSpeedUnits);

// For time
timeFromUnit.addEventListener('change', function() {
    convertTime();
    savePreferences(); 
});
timeToUnit.addEventListener('change', function() {
    convertTime();
    savePreferences();
});
timeInput.addEventListener('input', convertTime);
timeSwapBtn.addEventListener('click', swapTimeUnits);

document.getElementById('1-btn').addEventListener('click', () => inputNumber('1'))
document.getElementById('2-btn').addEventListener('click', () => inputNumber('2'))
document.getElementById('3-btn').addEventListener('click', () => inputNumber('3'))
document.getElementById('4-btn').addEventListener('click', () => inputNumber('4'))
document.getElementById('5-btn').addEventListener('click', () => inputNumber('5'))
document.getElementById('6-btn').addEventListener('click', () => inputNumber('6'))
document.getElementById('7-btn').addEventListener('click', () => inputNumber('7'))
document.getElementById('8-btn').addEventListener('click', () => inputNumber('8'))
document.getElementById('9-btn').addEventListener('click', () => inputNumber('9'))
document.getElementById('0-btn').addEventListener('click', () => inputNumber('0'))
document.getElementById('dot-btn').addEventListener('click', () => inputNumber('.'))

document.getElementById('plus-btn').addEventListener('click', () => inputOperator('+'))
document.getElementById('minus-btn').addEventListener('click', () => inputOperator('-'))
document.getElementById('mult-btn').addEventListener('click', () => inputOperator('×'))
document.getElementById('divide-btn').addEventListener('click', () => inputOperator('÷'))

document.getElementById('ac-btn').addEventListener('click', clearCalculator)
document.getElementById('equal-btn').addEventListener('click', calculate)
document.getElementById('backspace-btn').addEventListener('click', backspace)



function updateDisplay(){

    resultDisplay.textContent = currentInput || '0'

    if(previousInput && operator){
        equationDisplay.textContent = previousInput + ' ' + operator
    } else{
        equationDisplay.textContent = ''
    }
}

function inputNumber(number){

    if(shouldResetDisplay){
        currentInput = ''
        shouldResetDisplay = false
    }

    currentInput += number

    updateDisplay()
}

function inputOperator(nextOperator){

    if(previousInput && currentInput && operator){
        calculate()
    }

    previousInput = currentInput

    operator = nextOperator

    currentInput = ''

    updateDisplay()
}

function calculate(){

    const prev = parseFloat(previousInput)
    const current = parseFloat(currentInput)

    if(isNaN(prev) || isNaN(current)) return

    let result

    switch(operator){
        case '+':
            result = prev + current
            break
        case '-':
            result = prev - current
            break
        case '×':
            result = prev * current
            break
        case '÷':
            result = current !== 0 ? prev / current : 0
            break
        default:
            return
    }

    result = Math.round(result * 100000) / 100000;

    equationDisplay.textContent = previousInput + ' ' + operator + ' ' + currentInput + ' ='
    resultDisplay.textContent = result

    currentInput = result.toString()
    previousInput = ''
    operator = ''
    shouldResetDisplay = true
}

function clearCalculator(){
    currentInput = ''
    previousInput = ''
    operator = ''
    shouldResetDisplay = false

    equationDisplay.textContent = ''
    resultDisplay.textContent = '0'
}

function backspace(){

    if(currentInput.length > 0){

        currentInput = currentInput.slice(0, -1)

        updateDisplay()

        if(currentInput === ''){
            resultDisplay.textContent = '0'
        }
    }
}

function openMenu(){

    menuOverlay.classList.remove('opacity-0' , 'invisible')
    menuOverlay.classList.add('opacity-100' , 'visible')

    menuSidebar.classList.remove('-translate-x-full')
    menuSidebar.classList.add('translate-x-0')
}

function closeMenu(){
    
    menuOverlay.classList.remove('opacity-100', 'visible')
    menuOverlay.classList.add('opacity-0', 'invisible')

    menuSidebar.classList.remove('translate-x-0')
    menuSidebar.classList.add('-translate-x-full')
}

function showPage(pageToShow) {
    // Hide all pages
    calculatorPage.classList.add('hidden');
    currencyPage.classList.add('hidden');
    lengthPage.classList.add('hidden');
    massPage.classList.add('hidden');
    temperaturePage.classList.add('hidden');
    volumePage.classList.add('hidden');
    areaPage.classList.add('hidden');
    speedPage.classList.add('hidden');
    timePage.classList.add('hidden');
    agePage.classList.add('hidden');
    
    // Show the requested page
    switch(pageToShow) {
        case 'calculator':
            calculatorPage.classList.remove('hidden');
            currentPage = 'calculator';
            break;
        case 'currency':
            currencyPage.classList.remove('hidden');
            currentPage = 'currency';
            break;
        case 'length':
            lengthPage.classList.remove('hidden');
            currentPage = 'length';
            break;
        case 'mass':
            massPage.classList.remove('hidden');
            currentPage = 'mass';
            break;
        case 'temperature':
            temperaturePage.classList.remove('hidden');
            currentPage = 'temperature';
            break;
        case 'volume':
            volumePage.classList.remove('hidden');
            currentPage = 'volume';
            break;
        case 'area':
            areaPage.classList.remove('hidden');
            currentPage = 'area';
            break;
        case 'speed':
            speedPage.classList.remove('hidden');
            currentPage = 'speed';
            break;
        case 'time':
            timePage.classList.remove('hidden');
            currentPage = 'time';
            break;
        case 'age':
            agePage.classList.remove('hidden');
            currentPage = 'age';
            break;
        default:
            calculatorPage.classList.remove('hidden');
            currentPage = 'calculator';
    }
    
    closeMenu();
}

function toggleMeasurementsDropdown() {
    
    if (isDropdownOpen) {
        // Close dropdown
         measurementsSubmenu.style.display = 'none'
        measurementsArrow.style.transform = 'rotate(0deg)'
        measurementsArrow.textContent = '▷'
        isDropdownOpen = false
    } else {
        // Open dropdown
         measurementsSubmenu.style.display = 'flex'
        measurementsArrow.style.transform = 'rotate(0deg)'
        measurementsArrow.textContent = '▼'
        isDropdownOpen = true
    }
}

function convertMass() {
    // Get input value
    const inputValue = parseFloat(massInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        massOutput.textContent = '0';
        return;
    }
    
    // Get selected units
    const fromUnit = massFromUnit.value;
    const toUnit = massToUnit.value;
    
    // Convert to base unit (kilograms) first
    const inKilograms = massFormulas.toBase[fromUnit](inputValue);
    
    // Then convert from base unit to target unit
    const result = massFormulas.fromBase[toUnit](inKilograms);
    
    // Display result with appropriate decimal places
    if (result > 1000) {
        massOutput.textContent = result.toLocaleString('en-US', {maximumFractionDigits: 2});
    } else if (result > 1) {
        massOutput.textContent = result.toFixed(2);
    } else {
        massOutput.textContent = result.toFixed(4);
    }
    
}

function swapMassUnits() {
    // Get current values
    const tempFrom = massFromUnit.value;
    const tempTo = massToUnit.value;
    
    // Swap them
    massFromUnit.value = tempTo;
    massToUnit.value = tempFrom;
    
    // Recalculate
    convertMass();
}

function convertLength() {
    // Get input value
    const inputValue = parseFloat(lengthInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        lengthOutput.textContent = '0';
        return;
    }
    
    // Get selected units
    const fromUnit = lengthFromUnit.value;
    const toUnit = lengthToUnit.value;
    
    // Convert to base unit (meters) first
    const inMeters = lengthFormulas.toBase[fromUnit](inputValue);
    
    // Then convert from base unit to target unit
    const result = lengthFormulas.fromBase[toUnit](inMeters);
    
    // Display result with appropriate decimal places
    if (result > 1000) {
        lengthOutput.textContent = result.toLocaleString('en-US', {maximumFractionDigits: 2});
    } else if (result > 1) {
        lengthOutput.textContent = result.toFixed(2);
    } else {
        lengthOutput.textContent = result.toFixed(4);
    }
}

function swapLengthUnits() {
    // Get current values
    const tempFrom = lengthFromUnit.value;
    const tempTo = lengthToUnit.value;
    
    // Swap them
    lengthFromUnit.value = tempTo;
    lengthToUnit.value = tempFrom;
    
    // Recalculate
    convertLength();
}

function convertTemperature() {
    // Get input value
    const inputValue = parseFloat(temperatureInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        temperatureOutput.textContent = '0.00';
        return;
    }
    
    // Get selected units
    const fromUnit = temperatureFromUnit.value;
    const toUnit = temperatureToUnit.value;
    
    // Get the correct formula and convert
    const formula = temperatureFormulas[fromUnit][toUnit];
    const result = formula(inputValue);
    
    // Display result with 2 decimal places
    temperatureOutput.textContent = result.toFixed(2);
    
}

function swapTemperatureUnits() {
    // Get current values
    const tempFrom = temperatureFromUnit.value;
    const tempTo = temperatureToUnit.value;
    
    // Swap them
    temperatureFromUnit.value = tempTo;
    temperatureToUnit.value = tempFrom;
    
    // Recalculate
    convertTemperature();
}
function convertVolume() {
    // Get input value
    const inputValue = parseFloat(volumeInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        volumeOutput.textContent = '0';
        return;
    }
    
    // Get selected units
    const fromUnit = volumeFromUnit.value;
    const toUnit = volumeToUnit.value;
    
    // Convert to base unit (liters) first
    const inLiters = volumeFormulas.toBase[fromUnit](inputValue);
    
    // Then convert from base unit to target unit
    const result = volumeFormulas.fromBase[toUnit](inLiters);
    
    // Display result with appropriate decimal places
    if (result > 1000) {
        volumeOutput.textContent = result.toLocaleString('en-US', {maximumFractionDigits: 2});
    } else if (result > 1) {
        volumeOutput.textContent = result.toFixed(2);
    } else {
        volumeOutput.textContent = result.toFixed(4);
    }
    
}
function swapVolumeUnits() {
    // Get current values
    const tempFrom = volumeFromUnit.value;
    const tempTo = volumeToUnit.value;
    
    // Swap them
    volumeFromUnit.value = tempTo;
    volumeToUnit.value = tempFrom;
    
    // Recalculate
    convertVolume();
}
function convertArea() {
    // Get input value
    const inputValue = parseFloat(areaInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        areaOutput.textContent = '0';
        return;
    }
    
    // Get selected units
    const fromUnit = areaFromUnit.value;
    const toUnit = areaToUnit.value;
    
    // Convert to base unit (square meters) first
    const inSquareMeters = areaFormulas.toBase[fromUnit](inputValue);
    
    // Then convert from base unit to target unit
    const result = areaFormulas.fromBase[toUnit](inSquareMeters);
    
    // Display result with appropriate decimal places
    if (result > 1000) {
        areaOutput.textContent = result.toLocaleString('en-US', {maximumFractionDigits: 2});
    } else if (result > 1) {
        areaOutput.textContent = result.toFixed(2);
    } else {
        areaOutput.textContent = result.toFixed(4);
    }
     
}

function swapAreaUnits() {
    // Get current values
    const tempFrom = areaFromUnit.value;
    const tempTo = areaToUnit.value;
    
    // Swap them
    areaFromUnit.value = tempTo;
    areaToUnit.value = tempFrom;
    
    // Recalculate
    convertArea();
}
function convertSpeed() {
    // Get input value
    const inputValue = parseFloat(speedInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        speedOutput.textContent = '0';
        return;
    }
    
    // Get selected units
    const fromUnit = speedFromUnit.value;
    const toUnit = speedToUnit.value;
    
    // Convert to base unit (meters per second) first
    const inMetersPerSecond = speedFormulas.toBase[fromUnit](inputValue);
    
    // Then convert from base unit to target unit
    const result = speedFormulas.fromBase[toUnit](inMetersPerSecond);
    
    // Display result with appropriate decimal places
    if (result > 1000) {
        speedOutput.textContent = result.toLocaleString('en-US', {maximumFractionDigits: 2});
    } else if (result > 1) {
        speedOutput.textContent = result.toFixed(2);
    } else {
        speedOutput.textContent = result.toFixed(4);
    }
    
}
function swapSpeedUnits() {
    // Get current values
    const tempFrom = speedFromUnit.value;
    const tempTo = speedToUnit.value;
    
    // Swap them
    speedFromUnit.value = tempTo;
    speedToUnit.value = tempFrom;
    
    // Recalculate
    convertSpeed();
}

function convertTime() {
    // Get input value
    const inputValue = parseFloat(timeInput.value);
    
    // Check if input is valid
    if (isNaN(inputValue) || inputValue === '') {
        timeOutput.textContent = '0';
        return;
    }
    
    // Get selected units
    const fromUnit = timeFromUnit.value;
    const toUnit = timeToUnit.value;
    
    // Convert to base unit (seconds) first
    const inSeconds = timeFormulas.toBase[fromUnit](inputValue);
    
    // Then convert from base unit to target unit
    const result = timeFormulas.fromBase[toUnit](inSeconds);
    
    // Display result with appropriate decimal places
    if (result > 1000) {
        timeOutput.textContent = result.toLocaleString('en-US', {maximumFractionDigits: 2});
    } else if (result > 1) {
        timeOutput.textContent = result.toFixed(2);
    } else {
        timeOutput.textContent = result.toFixed(4);
    }
    
}
function swapTimeUnits() {
    // Get current values
    const tempFrom = timeFromUnit.value;
    const tempTo = timeToUnit.value;
    
    // Swap them
    timeFromUnit.value = tempTo;
    timeToUnit.value = tempFrom;
    
    // Recalculate
    convertTime();
}

function calculateAge() {
    const dobValue = dobInput.value;
    if (!dobValue) {
        ageResult.textContent = "Please select your date of birth.";
        return;
    }

    const birthDate = new Date(dobValue);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    ageResult.textContent = `${years} years, ${months} months, ${days} days`;
}
calcAgeBtn.addEventListener('click', calculateAge);


function convertCurrency() {
    const inputValue = parseFloat(currencyInput.value);
    
    if (isNaN(inputValue) || inputValue === '') {
        currencyOutput.textContent = '0.00';
        return;
    }
    
    const fromCurrency = currencyFromUnit.value;
    const toCurrency = currencyToUnit.value;
    
    // Check if we have rates loaded
    if (Object.keys(currencyRates).length === 0) {
        currencyOutput.textContent = 'Loading...';
        return;
    }
    
    // Convert using API rates (through USD as base)
    const inUSD = inputValue / currencyRates[fromCurrency];
    const result = inUSD * currencyRates[toCurrency];
    
    currencyOutput.textContent = result.toFixed(2);
    
}

function swapCurrencyUnits() {
    const tempFrom = currencyFromUnit.value;
    const tempTo = currencyToUnit.value;
    currencyFromUnit.value = tempTo;
    currencyToUnit.value = tempFrom;
    convertCurrency();
}

async function fetchExchangeRates() {
    try {
        const apiKey = 'df6815c6703843997dab033e';
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch rates');
        }
        
        const data = await response.json();
        
        currencyRates = data.conversion_rates;  
        lastUpdated = data.time_last_update_utc;
        
        console.log('Rates stored!', currencyRates);
        
        populateCurrencyDropdowns();
        lastUpdatedElement.textContent = new Date(lastUpdated).toLocaleDateString();
        
        loadingIndicator.style.display = 'none';
        converterSection.classList.remove('hidden');
        converterSection.classList.add('flex');
        
        convertCurrency();
        
        console.log('API integration successful!');
        
    } catch (error) {
        console.error('Error:', error);
        loadingIndicator.innerHTML = '<p class="text-red-500 text-center">Failed to load rates. Please refresh.</p>';
    }
}
function populateCurrencyDropdowns() {
    
    
    // Get all currency codes from the API data
    const currencies = Object.keys(currencyRates);
    
    // Sort alphabetically
    currencies.sort();
    
    // Clear existing options (remove hardcoded ones)
    currencyFromUnit.innerHTML = '';
    currencyToUnit.innerHTML = '';
    
    // Add each currency as an option
    currencies.forEach(currency => {
        // Create option for "From" dropdown
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        currencyFromUnit.appendChild(optionFrom);
        
        // Create option for "To" dropdown
        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        currencyToUnit.appendChild(optionTo);
    });
    
    // Set default selections
    currencyFromUnit.value = 'USD';
    currencyToUnit.value = 'PKR';
    
    
}

// Save user preferences to localStorage
function savePreferences() {
    const preferences = {
        lastCurrencyFrom: currencyFromUnit.value,
        lastCurrencyTo: currencyToUnit.value,
        lastCurrencyAmount: currencyInput.value,
        lastLengthFrom: lengthFromUnit.value,
        lastLengthTo: lengthToUnit.value,
        lastMassFrom: massFromUnit.value,
        lastMassTo: massToUnit.value,
        lastTemperatureFrom: temperatureFromUnit.value,
        lastTemperatureTo: temperatureToUnit.value,
        lastVolumeFrom: volumeFromUnit.value,
        lastVolumeTo: volumeToUnit.value,
        lastAreaFrom: areaFromUnit.value,
        lastAreaTo: areaToUnit.value,
        lastSpeedFrom: speedFromUnit.value,
        lastSpeedTo: speedToUnit.value,
        lastTimeFrom: timeFromUnit.value,
        lastTimeTo: timeToUnit.value
    };
    
    chrome.storage.local.set({ userPreferences: preferences });
}

// Load user preferences from localStorage
function loadPreferences() {
    chrome.storage.local.get(['userPreferences'], function(result) {
        if (result.userPreferences) {
            const prefs = result.userPreferences;
            
            // Restore currency selections
            if (prefs.lastCurrencyFrom) currencyFromUnit.value = prefs.lastCurrencyFrom;
            if (prefs.lastCurrencyTo) currencyToUnit.value = prefs.lastCurrencyTo;
            if (prefs.lastCurrencyAmount) currencyInput.value = prefs.lastCurrencyAmount;
            
            // Restore length selections
            if (prefs.lastLengthFrom) lengthFromUnit.value = prefs.lastLengthFrom;
            if (prefs.lastLengthTo) lengthToUnit.value = prefs.lastLengthTo;
            
            // Restore mass selections
            if (prefs.lastMassFrom) massFromUnit.value = prefs.lastMassFrom;
            if (prefs.lastMassTo) massToUnit.value = prefs.lastMassTo;
            
            // Restore temperature selections
            if (prefs.lastTemperatureFrom) temperatureFromUnit.value = prefs.lastTemperatureFrom;
            if (prefs.lastTemperatureTo) temperatureToUnit.value = prefs.lastTemperatureTo;
            
            // Restore volume selections
            if (prefs.lastVolumeFrom) volumeFromUnit.value = prefs.lastVolumeFrom;
            if (prefs.lastVolumeTo) volumeToUnit.value = prefs.lastVolumeTo;
            
            // Restore area selections
            if (prefs.lastAreaFrom) areaFromUnit.value = prefs.lastAreaFrom;
            if (prefs.lastAreaTo) areaToUnit.value = prefs.lastAreaTo;
            
            // Restore speed selections
            if (prefs.lastSpeedFrom) speedFromUnit.value = prefs.lastSpeedFrom;
            if (prefs.lastSpeedTo) speedToUnit.value = prefs.lastSpeedTo;
            
            // Restore time selections
            if (prefs.lastTimeFrom) timeFromUnit.value = prefs.lastTimeFrom;
            if (prefs.lastTimeTo) timeToUnit.value = prefs.lastTimeTo;
        }
    });
}

fetchExchangeRates();
loadPreferences();