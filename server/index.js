const express = require('express');
const supportedCities = require('./config/supportedCities');

const cities = supportedCities.supportedCities;
const city_keys = Object.keys(supportedCities.supportedCities);

app = express();



//prints all supported currency as home page
app.get(`/`, async(req, res) => {
    let support = [{
        supportedcities:[]
    }];

    for (city of city_keys){        
        if (cities[city]=== true){ 
            support[0].supportedcities.push({city});
        }
    }
    res.send(support);
});

require('./routes/sanantonio.js')(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT);