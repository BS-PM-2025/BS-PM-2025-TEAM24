const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const eventsSchema = new Schema({
    callType: { type: String, required: true },
    city:{ type: String, required: true },
    street:{ type: String, required: true },
    houseNumber:{ type: Number , default:0},    
    date: { type: Date, default: Date.now },
    description: { type: String },
    costumerdetails:[{ type: String,required: true }],
    callID: { type: String, required: true, default: uuidv4 },
    status:{ type: String , required: true, default:'Open'},    
}, { collection: 'events' });



const Events = model('event', eventsSchema);
module.exports = Events;