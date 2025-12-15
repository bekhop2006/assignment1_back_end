const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello, Zaynidin');
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});