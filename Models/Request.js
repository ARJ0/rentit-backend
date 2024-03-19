import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema(
    {
        equipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        renterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        totalRent: {
            type: Number,
        },
        licenseNumber: {
            type: String,
            required: true,
        },
        isCheckOut: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Request = mongoose.model('Request', RequestSchema);

export default Request;
