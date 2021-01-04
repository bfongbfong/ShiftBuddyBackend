const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/ShiftTypes');
require('../enums/ShiftLengths');
require('../enums/ShiftTradeStatuses');

const ShiftSchema = mongoose.Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
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
    openForTrade: { // if this is true, anyone in the unit can see. if not, it is private.
        type: Boolean,
        default: false
    },
    status: { // this should be determined if openForTrade becomes true
        // if pending, UI should look diff
        type: String, 
        enum: ShiftTradeStatuses, 
        default: 'none'
    },
    date: { 
        type: Date, 
        required: true 
    },
    group: { 
        type: Schema.Types.ObjectId, 
        ref: "Group" 
    },
    wasTraded: { // set to true if user traded this shift away.
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Shift', ShiftSchema);