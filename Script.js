// Calculator Logic
let calcDisplay = document.getElementById('calc-display');
let buttons = document.querySelectorAll('.btn');

let currentInput = '';
let previousInput = '';
let operator = null;
let memory = 0;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        handleCalculator(value);
    });
});

function handleCalculator(value) {
    if (value === 'AC') {
        currentInput = '';
        previousInput = '';
        operator = null;
        memory = 0;
        calcDisplay.textContent = '0';
    } else if (value === 'DEL') {
        currentInput = currentInput.slice(0, -1);
        calcDisplay.textContent = currentInput || '0';
    } else if (['+', '-', '*', '/', '%'].includes(value)) {
        if (currentInput !== '') {
            if (previousInput !== '') calculate();
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else if (value === '=') {
        calculate();
        operator = null;
    } else if (value === 'sqrt') {
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === '^') {
        currentInput = Math.pow(parseFloat(previousInput), parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'sin') {
        currentInput = Math.sin(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'cos') {
        currentInput = Math.cos(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'tan') {
        currentInput = Math.tan(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'log') {
        currentInput = Math.log10(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'ln') {
        currentInput = Math.log(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === '!') {
        currentInput = factorial(parseFloat(currentInput)).toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'MC') {
        memory = 0;
    } else if (value === 'MR') {
        currentInput = memory.toString();
        calcDisplay.textContent = currentInput;
    } else if (value === 'M+') {
        memory += parseFloat(currentInput);
    } else if (value === 'M-') {
        memory -= parseFloat(currentInput);
    } else {
        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
        calcDisplay.textContent = currentInput;
    }
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = prev / current; break;
        case '%': result = (prev * current) / 100; break;
        default: return;
    }

    currentInput = result.toString();
    previousInput = '';
    calcDisplay.textContent = currentInput;
}

function factorial(num) {
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}

// Currency Converter Logic
const API_KEY = 'YOUR_EXCHANGE_RATE_API_KEY'; // Replace with your API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let exchangeRates = {};

fetch(BASE_URL)
    .then(response => response.json())
    .then(data => {
        exchangeRates = data.conversion_rates;
    })
    .catch(error => console.error('Error fetching exchange rates:', error));

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        alert('Invalid currency selected.');
        return;
    }

    const convertedAmount = (amount * exchangeRates[toCurrency]) / exchangeRates[fromCurrency];
    document.getElementById('converted-amount').textContent = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// Loan Calculator Logic
function updateLoanTermValue() {
    document.getElementById('loan-term-value').textContent = `${document.getElementById('loan-term-slider').value} months`;
}

function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value);
    const loanTerm = parseInt(document.getElementById('loan-term-slider').value);
    const prepayment = parseFloat(document.getElementById('prepayment').value) || 0;

    if (!loanAmount || !interestRate || !loanTerm) {
        alert('Please fill in all fields.');
        return;
    }

    const monthlyInterest = (interestRate / 100) / 12;
    const totalPayments = loanTerm;
    const monthlyPayment = (loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalPayments));
    const totalPayment = monthlyPayment * totalPayments;
    const totalInterest = totalPayment - loanAmount;

    // Apply prepayment
    const adjustedLoanAmount = loanAmount - prepayment;
    const adjustedMonthlyPayment = (adjustedLoanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalPayments));
    const adjustedTotalPayment = adjustedMonthlyPayment * totalPayments;
    const adjustedTotalInterest = adjustedTotalPayment - adjustedLoanAmount;

    // Update Results
    document.getElementById('monthly-payment-inr').textContent = `₹${adjustedMonthlyPayment.toFixed(2)}`;
    document.getElementById('total-interest-inr').textContent = `₹${adjustedTotalInterest.toFixed(2)}`;
    document.getElementById('total-payment-inr').textContent = `₹${adjustedTotalPayment.toFixed(2)}`;

    const usdRate = 83;
    document.getElementById('monthly-payment-usd').textContent = `$${(adjustedMonthlyPayment / usdRate).toFixed(2)}`;
    document.getElementById('total-payment-usd').textContent = `$${(adjustedTotalPayment / usdRate).toFixed(2)}`;

    // Update Progress Bar
    const progressPercentage = (loanTerm / 360) * 100; // Assuming max term is 360 months
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;

    // Render Pie Chart
    renderLoanChart(adjustedLoanAmount, adjustedTotalInterest);
}

function renderLoanChart(principal, interest) {
    const ctx = document.getElementById('loan-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                label: 'Loan Breakdown',
                data: [principal, interest],
                backgroundColor: ['#ff9500', '#34c759']
            }]