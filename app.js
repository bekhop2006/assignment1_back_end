const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// BMI Calculator function
function calculateBMI(weight, height) {
    const bmi = weight / (height * height);
    let category;
    let color;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'blue';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
        color = 'green';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
        color = 'yellow';
    } else {
        category = 'Obese';
        color = 'red';
    }
    
    return { bmi: bmi.toFixed(2), category, color };
}

// GET route - serve HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/json', (req, res) => {
    res.json({
        "text": "Hello, Zaynidin",
        "numbers": [1, 2, 3, 4, 5]
    });
});

app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    res.send(`Hello, ${username}`);
});

app.get('/letters', (req, res) => {
    const input = req.query.input || '';

    const response = {
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join('')
    };

    res.json(response);
});

let users = [
    { id: 1, name: 'Zaynidin Tursynaliev', age: 20, email: 'zaynidin@gmail.com' },
    { id: 1, name: 'Tanibergen Beknur', age: 19, email: 'zaynidin@gmail.com' }
];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };
    users.push(newUser);
    res.send('User created');
});

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).send('User not found');
    }
    
    users[userIndex] = {
        ...users[userIndex],
        ...req.body,
        id: id
    };
    
    res.json({ message: 'User updated', user: users[userIndex] });
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).send('User not found');
    }
    
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted' });
});

// POST route - calculate BMI
app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    
    // Validation
    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.status(400).json({ 
            error: 'Invalid input. Weight and height must be positive numbers.' 
        });
    }
    
    // Calculate BMI
    const result = calculateBMI(weight, height);
    
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});