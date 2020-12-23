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
    shiftLength: { // shiftlength is here but not type because the length must be the same between traded 2, whereas type doesn't
        type: String,
        enum: ShiftLengths,
        required: true
    }, 
    offers: [
        {
            proposer: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            proposedShift:  {
                type: Schema.Types.ObjectId,
                ref: 'Shift'
            },
            status: {
                type: String,
                enum: ShiftTradeStatuses,
                default: 'requested'
            }
        }
    ],
    status: {
        type: String,
        enum: ShiftTradeStatuses,
        default: 'none'
    }
});

RequestSchema.virtual('offersCount').
  get(function() { return this.proposedShifts.length });

module.exports = mongoose.model('Request', RequestSchema);