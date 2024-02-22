import { Router } from 'express';
import { getAllEquipment, getEquipmentByCompnyId } from '../Controllers/EquipmentController.js';

const router = Router();



router.post("/getEquipmentByCompnyId", getEquipmentByCompnyId.validator,  getEquipmentByCompnyId.controller);
router.get("/getAllEquipment", getAllEquipment.controller);



export default router;