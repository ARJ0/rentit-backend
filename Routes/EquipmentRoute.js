import { Router } from 'express';
import { getAllEquipment,uploadEquipment, getEquipmentByCompnyId } from '../Controllers/EquipmentController.js';

const router = Router();


router.post("/add", uploadEquipment.validator, uploadEquipment.controller);

router.post("/getEquipmentByCompnyId", getEquipmentByCompnyId.validator,  getEquipmentByCompnyId.controller);
router.get("/getAllEquipment", getAllEquipment.controller);



export default router;