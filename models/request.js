const mongoose = require('mongoose');
const { Schema } = mongoose;
require('../enums/ShiftLengths');
require('../enums/ShiftTypes');
require('../enums/ShiftTradeStatuses');

const RequestSchema = mongoose.Schema({
    poster: {
        type: String,
        required: true
    },
    posterOriginalShift: {
        type: Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    requesterAcceptedShift: { 
        type: Schema.Types.ObjectId,
        ref: 'Shift'
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
        enum: ShiftTradeStatuses,
        required: true
    }
});

RequestSchema.virtual('offersCount').
  get(function() { return this.proposedDates.length });

module.exports = mongoose.model('Request', RequestSchema);