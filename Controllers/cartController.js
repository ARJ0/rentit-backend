
import Equipment from "../Models/Equipment.js";
import CartSchema from "../Models/CartSchema.js";
import Request from "../Models/Request.js";


export const addToCart = async (req, res) => {
  try {
    const { equipmentId, userId } = req.body;

    // Check if the equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Use upsert to either update the existing cart or create a new one
    const cart = await CartSchema.findOneAndUpdate(
      { user: userId },
      {
        $addToSet: { // Using $addToSet to avoid adding duplicates
          items: { equipment: equipmentId },
        },
      },
      { upsert: true, new: true }
    );
    console.log("🚀 ~ addToCart ~ cart:", cart)

    res.status(200).json({ message: 'Equipment added to cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get the user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    const cart = await CartSchema.findOne({ user: userId, 'items.isDeleted': false  }).populate('items.equipment');

    if (!cart) {
      return res.status(200).json([]);
    }
    const equipmentArray = cart.items.map(item => {
      if (!item.isDeleted) {
        return item.equipment
      }
    }).filter(a=>a);
    res.status(200).json(equipmentArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, equipmentId } = req.body;

    // Update the user's cart to remove the specified equipment
    const cart = await CartSchema.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          items: { equipment: equipmentId },
        },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the user' });
    }

    // Remove the corresponding request from the Request model
    await Request.findOneAndDelete({ renterId: userId, equipmentId, status: {$in: ["pending"]}});

    res.status(200).json({ message: 'Equipment removed from the cart successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
