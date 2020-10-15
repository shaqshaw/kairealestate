const mongoose = require('mongoose');
const { Schema } = mongoose;

const listingSchema = new Schema({
    address: { type: String, default: undefined },
    price: { type: Number, default: 0 },
    link: { type: String, default: undefined },
    DOM: { type: String, default: 0 },
    checked: { type: Boolean, default: false},
    deal: { type: Boolean, default: false},
});

mongoose.model('listing', listingSchema);