import { Router } from 'express';
import { CheckOutEquipment } from '../Controllers/CheckOutController.js';

const router = Router();

// Check Out Equipment
router.post('/check-out-equipment', CheckOutEquipment);




export default router;