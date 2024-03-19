import CartSchema from "../Models/CartSchema.js";
import CheckOut from "../Models/CheckOut.js";
import Equipment from "../Models/Equipment.js";
import Request from "../Models/Request.js";

export const CheckOutEquipment = async (req, res) => {
    try {
      const { equipmentId, userId, isCheckOut, personName, personNumber, email } = req.body;
  
      // Check if the equipment exists
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      // Use upsert to either update the existing Check Out or create a new one
      const cart = await CheckOut.findOneAndUpdate(
        { user: userId },
        {
          $addToSet: { // Using $addToSet to avoid adding duplicates
            items: { equipment: equipmentId, isCheckOut, personName, personNumber, email },
          },
        },
        { upsert: true, new: true }
      );

      if (cart) {
        await Request.findOneAndUpdate(
            { renterId: userId, equipmentId: equipmentId },
            { $set: { isCheckOut: true } }
        );
        await CartSchema.findOneAndUpdate(
            { user: userId, 'items.equipment': equipmentId },
            { $set: { 'items.$.isDeleted': true } }
        );
      }
  
      res.status(200).json({ message: 'Equipment Check Out successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };