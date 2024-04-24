require('dotenv').config();
const express = require('express');
const request = require('request');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/weather', (req, res) => {
    const apiKey = process.env.WEATHER_API_KEY; // Access API key from environment variable
    const city = req.query.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const weatherInfo = `
                <p><strong>Location:</strong> ${data.name}</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;
            res.send(weatherInfo);
        } else {
            res.send('Error getting weather data');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
