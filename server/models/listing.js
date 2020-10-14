const mongoose = require('mongoose');
const { Schema } = mongoose;

const listingSchema = new Schema({
    address: { type: String, default: undefined },
    price: { type: Number, default: undefined },
    link: { type: String, default: undefined },
    DOM: { type: String, default: undefined },
    checked: { type: Boolean, default: false}
});

mongoose.model('listing', listingSchema);