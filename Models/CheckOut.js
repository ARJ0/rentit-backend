import mongoose from 'mongoose';

const CheckOut = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    isCheckOut: {
      type: Boolean,
      default: false,
    },
    personName: {
        type: String,
        required: true,
    },
    personNumber: {
        type: Number,
        required: true,
        max: 9999999999,
        min: 1000000000
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50
  },
  }],
});

export default mongoose.model('CheckOut', CheckOut);