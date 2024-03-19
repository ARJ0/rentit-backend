import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
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
    isDeleted: {
      type: Boolean,
      default: false,
    }
  }],
});

export default mongoose.model('Cart', CartSchema);