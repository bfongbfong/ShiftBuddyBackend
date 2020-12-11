const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/ShiftTypes');
require('../enums/ShiftLengths');
require('../enums/ShiftStatuses');

const ShiftSchema = mongoose.Schema({
    // might not need this if mongo provides its own id
    // id: { 
    //     type: String, 
    //     required: true 
    // },
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
    openForTrade: { // if this is true, anyone in the unit can see. if not, it is private.
        type: Boolean,
        default: false
    },
    status: { // this should be determined if openForTrade becomes true
        type: String, 
        enum: ShiftStatuses, 
        default: 'none'
    },
    date: { 
        type: Date, 
        required: true 
    },
    group: { 
        type: Schema.Types.ObjectId, 
        ref: "Group" 
    }
});

module.exports = mongoose.model('Shift', ShiftSchema);