module.exports= (app) =>{
    const keys = require('../config/keys.js');

    app.get(`/sanantonio`, async(req, res) => {
        
        //connect to mongodb
        const mongoose = require('mongoose');
        require('../models/listing.js');
        const Listing = mongoose.model('listing');
        mongoose.connect(keys.MONGO_URI);

        //fetch from mongodb and disconnect
        Listing.find({},function (err, trades) {
            res.send(trades);
            mongoose.disconnect();
        });

    });

};