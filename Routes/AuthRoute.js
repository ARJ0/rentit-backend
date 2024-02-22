import { Router } from 'express';
import { login, register} from '../Controllers/AuthController.js';

const router = Router();

router.post("/register", register.validator, register.controller);
 
router.post("/login", login.validator, login.controller);



export default router;