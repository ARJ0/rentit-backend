import Equipment from "../Models/Equipment.js";

export const getEquipmentByCompnyId = {
    validator: async (req, res, next) => {
        if (!req.body.userId || req.body.userId?.length === 0) {
            return res.status(400).send("UserId is required");
        }
        next();
    },
    controller: async (req, res, next) => {
      try {
        const allProducts = await Equipment.find({compnyId: req.body.userId});
  
        res.status(200).send(allProducts);
      } catch (e) {
        return res.status(400).send("Internal server error");
      }
    },
  };

  export const getAllEquipment = {
    controller: async (req, res, next) => {
      try {
        const allProducts = await Equipment.find();
  
        res.status(200).send(allProducts);
      } catch (e) {
        return res.status(400).send("Internal server error");
      }
    },
  };