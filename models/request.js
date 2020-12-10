const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/ShiftLengths');
require('../enums/ShiftTypes');
require('../enums/ShiftStatuses');

const RequestSchema = mongoose.Schema({
    posterId: {
        type: String,
        required: true
    },
    posterOriginalDate: {
        type: Date,
        required: true
    },
    requesterOriginalDate: {
        type: Date,
        required: true
    },
    shiftLength: {
        type: String,
        enum: ShiftLengths,
        required: true
    },
    type: {
        type: String,
        enum: ShiftTypes,
        required: true
    },
    offersCount: Number,
    offers: [
        {
            userID: String,
            proposedDates: [
                {
                    type: Date
                }
            ]
        }
    ],
    status: {
        type: String,
        enum: ShiftStatuses,
        required: true
    }
});

module.exports = mongoose.model('Request', RequestSchema);