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
                companyId: req.body.currUserId,
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
// Get and Search equipment (For company)
export const getEquipmentByCompanyIdAndSearch = {
  validator: async (req, res, next) => {
    try {
      const { userId } = req.query;

      if (!userId || userId.length === 0) {
        return res.status(400).send("UserId is required");
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  },
  controller: async (req, res) => {
    try {
      const { userId } = req.query;
      const keyword = req.query.keyword || "";
      const category = req.query.category || null;

      const sortBy = req.query.sortBy || "title"; // Default sorting by title
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default ascending order

      const categoryArr = category ? JSON.parse(category) : "";

      const queryForSearch = categoryArr.length > 0
        ? {
            $and: [
              {
                $or: [
                  { title: { $regex: keyword, $options: "i" } },
                  { description: { $regex: keyword, $options: "i" } },
                ],
              },
              { category: { $in: categoryArr } },
            ],
          }
        : {
            $or: [
              { title: { $regex: keyword, $options: "i" } },
              { description: { $regex: keyword, $options: "i" } },
            ],
          };

      // Sorting options
      let sortOptions = {};
      if (sortBy === "title" || sortBy === "category" || sortBy === "rent") {
          sortOptions[sortBy] = sortOrder; // Set sorting field and order
      }

      // Fetch equipment based on company ID and search criteria
      const result = await Equipment.find({
        $and: [
          { companyId: userId },
          queryForSearch,
        ]
      }).sort(sortOptions);

      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  },
};

// Get and Search equipment (For all)
export const getAllAndSearchEquipment = {
  controller: async (req, res, next) => {
    try {
      const keyword = req.query.keyword || "";
      const category = req.query.category || null;

      const sortBy = req.query.sortBy || "title"; // Default sorting by title
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default ascending order
  
      const categoryArr = category ? JSON.parse(category) : "";
  
      const queryForSearch = categoryArr.length > 0
        ? {
          $and: [
            {
              $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
              ],
            },
            { category: { $in: categoryArr} },
          ],
        }
        : {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        };

      // Sorting options
      let sortOptions = {};
      if (sortBy === "title" || sortBy === "category" || sortBy === "rent") {
          sortOptions[sortBy] = sortOrder; // Set sorting field and order
      }
  
      // Fetch all equipment or search based on the provided keyword and category
      const result = await Equipment.find({...queryForSearch, isDeleted: false}).sort(sortOptions);
  
      res.status(200).send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).send("Internal server error");
    }
  },
};

  export const editEquipment = {
    validator: async (req, res, next) => {
      try {
        const { title, description, age, rent, timeperiod, category, location } = req.body;
  
        const isMissingFields = !title || !description || !age || !rent || !timeperiod || !category || !location;
        if (isMissingFields) {
          return res.status(400).send("Please fill all the fields");
        }
  
        if (title.length < 3 || description.length < 10) {
          return res.status(400).send("Title should be more than 3 characters, and description should be more than 10 characters");
        }
  
        if (location.length < 2 || location.length > 20) {
          return res.status(400).send("Invalid City Location");
        }
  
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    },
    controller: async (req, res) => {
      try {
        const { title, description, age, rent, timeperiod, category, location, equipmentId, image } = req.body;
    
        const updatedEquipment = await Equipment.findByIdAndUpdate(
          equipmentId,
          { title, description, age, rent, timeperiod, category, location, image },
          { new: false }
        );
    
        if (!updatedEquipment) {
          return res.status(404).send("Equipment not found");
        }
    
        return res.status(200).json({
          message: "Equipment updated successfully",
          equipment: updatedEquipment,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    },
  };

// Delete Equipment 
  export const deleteEquipment = {
    validator: async (req, res, next) => {
      try {
        const { equipmentId, actions } = req.body;
        if (!equipmentId) {
          return res.status(400).send("Equipment Id is required");
        }
  
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    },
    controller: async (req, res) => {
      try {
        const { equipmentId, actions } = req.body;
    
        const updatedEquipment = await Equipment.findByIdAndUpdate(
          equipmentId,
          { isDeleted: actions },
          { new: true }
        );
    
        if (!updatedEquipment) {
          return res.status(404).send("Equipment not found");
        }
    
        return res.status(200).json({
          message: "Equipment delete successfully",
          equipment: updatedEquipment,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
      }
    },
  };