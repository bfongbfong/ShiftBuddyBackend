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
    posterOriginalShift: {
        type: Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    requestOriginalShift: {
        type: Schema.Types.ObjectId,
        ref: 'Shift',
        required: true
    },
    requesterFinalShift: { // check this date. if it exists, then the date was changed, if not, then check the original date
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
        enum: ShiftStatuses,
        required: true
    }
});

RequestSchema.virtual('offersCount').
  get(function() { return this.proposedDates.length });

module.exports = mongoose.model('Request', RequestSchema);