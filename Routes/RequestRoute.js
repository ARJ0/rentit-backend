import { Router } from 'express';
import { editEquipment, getAllAndSearchEquipment, getEquipmentByCompanyIdAndSearch, uploadEquipment, deleteEquipment } from '../Controllers/EquipmentController.js';

const router = Router();


router.post("/add", uploadEquipment.validator, uploadEquipment.controller);
router.put('/edit-equipment', editEquipment.validator, editEquipment.controller);
router.put('/delete-equipment', deleteEquipment.validator, deleteEquipment.controller);
router.get('/getAllAndSearchEquipment', getAllAndSearchEquipment.controller)
router.get('/getEquipmentByCompanyIdAndSearch', getEquipmentByCompanyIdAndSearch.validator, getEquipmentByCompanyIdAndSearch.controller)



export default router;