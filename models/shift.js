const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/ShiftTypes');
require('../enums/ShiftLengths');
require('../enums/ShiftStatuses');

const ShiftSchema = mongoose.Schema({
    id: { 
        type: String, 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
    type: { 
        type: String, 
        enum: ShiftTypes, 
        required: true 
    },
    length: { 
        type: String, 
        enum: ShiftLengths, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ShiftStatuses, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    unit: { 
        type: Schema.Types.ObjectId, 
        ref: "Unit" 
    }
});

module.exports = mongoose.model('Shift', ShiftSchema);