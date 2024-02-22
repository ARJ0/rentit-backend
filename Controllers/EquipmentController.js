import Equipment from "../Models/Equipment.js";

export const uploadEquipment = {
  validator: async (req, res, next) => {
      if (
          !req.body.title ||
          !req.body.description ||
          !req.body.age ||
          !req.body.rent ||
          !req.body.timeperiod ||
          !req.body.category ||
          !req.body.image ||
          !req.body.location
      ) {
          return res.status(400).send("Please Fill all the Fields");
      }
      if (req.body.title.length < 3) {
          return res.status(400).send("Title shoud be more than 3 characters");
      }
      if (req.body.description.length < 10) {
          return res
              .status(400)
              .send("Description shoud be more than 10 characters");
      }
      if (req.body.location.length < 2 || req.body.location.length > 20) {
          return res.status(400).send("Invalid City Location");
      }
      if (!req.body.currUserId || req.body.currUserId?.length === 0) {
          return res.status(400).send("UserId is required");
      }
      next();
  },
  controller: async (req, res, next) => {
      try {
          const newEquipment = await Equipment.create({
              title: req.body.title,
              description: req.body.description,
              age: req.body.age,
              rent: req.body.rent,
              timeperiod: req.body.timeperiod,
              category: req.body.category,
              compnyId: req.body.currUserId,
              image: req.body.image,
              location: req.body.location,
          });
          return res.status(200).send({
              message: "Equipment uploaded successful",
              ...newEquipment._doc,
          });
      } catch (e) {
          console.log(e);
          return res.status(500).send("Equipment upload Failed");
      }
  },
};

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