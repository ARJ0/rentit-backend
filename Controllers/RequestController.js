import Equipment from "../Models/Equipment.js";
import Request from "../Models/Request.js";
import moment from "moment";
import User from "../Models/User.js";


export const createRequest = {
  validator: async (req, res, next) => {
    try {
      const { equipmentId, companyId, renterId, startDate, endDate, licenseNumber } = req.body;

      const isMissingFields = !equipmentId || !companyId || !renterId || !startDate || !endDate || !licenseNumber;
      if (isMissingFields) {
        const missingFields = [];

        if (!equipmentId) missingFields.push("Equipment ID");
        if (!companyId) missingFields.push("Company ID");
        if (!renterId) missingFields.push("Renter ID");
        if (!startDate) missingFields.push("Start Date");
        if (!endDate) missingFields.push("End Date");
        if (!licenseNumber) missingFields.push("License Number");
    
        const errorMessage = `Please fill the: ${missingFields.join(", ")}`;
        return res.status(400).send(errorMessage);
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  },
  controller: async (req, res) => {
    try {
      const { equipmentId, companyId, renterId, startDate, endDate, licenseNumber } = req.body;

      // Check if the equipment exists
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }

      // Calculate total rent based on time period
      const totalRent = calculateRent(startDate, endDate, equipment.rent);

      // Create a new request
      const request = new Request({
        equipmentId,
        companyId,
        renterId,
        startDate,
        endDate,
        totalRent,
        licenseNumber
      });

      await request.save();

      return res.status(201).json({
        message: 'Request sent successfully',
        request,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export const getUserRequests = {
  validator: async (req, res, next) => {
    try {
      const { companyId } = req.query;

      if (!companyId) {
        return res.status(400).send("Company ID is required");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  controller: async (req, res) => {
    try {
      const { companyId } = req.query;

      // Use Mongoose queries to find requests, and populate renter and equipment info
      const requests = await Request.find({ companyId })
        .populate({
          path: 'renterId',
          model: User,
          select: 'fname lname  email mobile address city state postal_code',
        })
        .populate({
          path: 'equipmentId',
          model: Equipment,
          select: 'title image category rent',
        })
        .exec();

      res.status(200).send(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export const getUserOwnedRequests = {
  validator: async (req, res, next) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).send("User ID is required");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  controller: async (req, res) => {
    try {
      const { id } = req.query;

      // Use Mongoose queries to find requests, and populate company and equipment info
      const requests = await Request.find({ renterId: id, isCheckOut: false })
        .populate({
          path: 'companyId',
          model: User,
          select: 'company_name email mobile address city state postal_code',
        })
        .populate({
          path: 'equipmentId',
          model: Equipment,
          select: 'title image category rent description',
        })
        .exec();

      res.status(200).send(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};


export const manageRequestStatus = {
  validator: async (req, res, next) => {
    try {
      const { action, requestId } = req.body;

      if (!action || !['pending', 'approved', 'rejected'].includes(action)) {
        return res.status(400).send("Invalid action provided");
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
  },
  controller: async (req, res) => {
    try {
      const { action, requestId } = req.body;

      const validActions = ['pending', 'approved', 'rejected'];
      if (!validActions.includes(action)) {
        return res.status(400).json({ message: 'Invalid action provided' });
      }

      // Find and update the request status based on the action
      const request = await Request.findByIdAndUpdate(requestId, { status: action }, { new: true });

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      // Update Equipment model based on the action
      const equipmentId = request.equipmentId;

      if (action === 'approved') {
        // Set equipment as rented and update the unavailableUntil date
        await Equipment.findByIdAndUpdate(equipmentId, { isRented: true, unavailableUntil: request.endDate });
      } else if (action === 'rejected') {
        // Set equipment as available
        await Equipment.findByIdAndUpdate(equipmentId, { isRented: false, unavailableUntil: null });
      }
      return res.json(request);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export const getAllUserRequest = {
  validator: async (req, res, next) => {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).send("User ID is required");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  controller: async (req, res) => {
    try {
      const { id } = req.query;

      // Use Mongoose queries to find requests, and populate company and equipment info
      const requests = await Request.find({ renterId: id, isCheckOut: true })
        .populate({
          path: 'companyId',
          model: User,
          select: 'company_name email mobile address city state postal_code',
        })
        .populate({
          path: 'equipmentId',
          model: Equipment,
          select: 'title image category rent description',
        })
        .exec();

      res.status(200).send(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};



const calculateRent = (startDate, endDate, rentPerUnit, unitType, minRent) => {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  // Calculate the total duration in days
  const days = endMoment.diff(startMoment, 'days') + 1;

  // Determine the number of units based on the unit type (per day, per month, per year)
  // let units;
  // switch (unitType) {
  //     case 'perDay':
  //         units = days;
  //         break;
  //     case 'perMonth':
  //         units = Math.ceil(days / 30); // Assuming a month has 30 days
  //         break;
  //     case 'perYear':
  //         units = Math.ceil(days / 365); // Assuming a year has 365 days
  //         break;
  //     default:
  //         throw new Error('Invalid unit type');
  // }

  // Calculate the rent based on the number of units
  const totalRent = days * rentPerUnit;

  // Apply the minimum rent
  return Math.max(totalRent);
};
