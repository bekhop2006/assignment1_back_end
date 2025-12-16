document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bmiForm');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const weightError = document.getElementById('weightError');
    const heightError = document.getElementById('heightError');
    const resultDiv = document.getElementById('result');

    // Real-time validation
    weightInput.addEventListener('input', function() {
        validateInput(weightInput, weightError);
    });

    heightInput.addEventListener('input', function() {
        validateInput(heightInput, heightError);
    });

    function validateInput(input, errorElement) {
        const value = parseFloat(input.value);
        
        if (input.value === '') {
            errorElement.textContent = '';
            input.classList.remove('error');
            return true;
        }
        
        if (isNaN(value) || value <= 0) {
            errorElement.textContent = 'Please enter a positive number';
            input.classList.add('error');
            return false;
        }
        
        // Additional validation for height (should be reasonable, 50-250 cm)
        if (input.id === 'height' && (value < 50 || value > 250)) {
            errorElement.textContent = 'Please enter a height between 50 and 250 cm';
            input.classList.add('error');
            return false;
        }
        
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const weight = parseFloat(weightInput.value);
        const heightCm = parseFloat(heightInput.value);
        
        // Validate inputs
        const weightValid = validateInput(weightInput, weightError);
        const heightValid = validateInput(heightInput, heightError);
        
        if (!weightValid || !heightValid) {
            alert('Please enter valid positive numbers for weight and height.');
            return;
        }
        
        // Convert height from cm to meters
        const height = heightCm / 100;
        
        try {
            const response = await fetch('/calculate-bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `weight=${weight}&height=${height}`
            });
            
            const data = await response.json();
            
            if (response.ok) {
                displayResult(data);
            } else {
                alert(data.error || 'An error occurred while calculating BMI.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    });

    function displayResult(data) {
        resultDiv.className = `result ${data.color}`;
        resultDiv.innerHTML = `
            <div class="result-value">BMI: ${data.bmi}</div>
            <div class="result-category">${data.category}</div>
        `;
        resultDiv.classList.remove('hidden');
        
        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

